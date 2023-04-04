import db from '$lib/prisma';
import {error} from '@sveltejs/kit';
import type {RequestHandler} from './$types';
import {Octokit} from '@octokit/core';
import yaml from 'js-yaml';
import AdmZip from 'adm-zip';
import type {EventData} from '../../../lib/types';

const GITHUB_REPO_OWNER = 'Ibentau';
const GITHUB_REPO_NAME = 'rasa-backend';
const GITHUB_FOLDER_NAME = 'data';

const octokit = new Octokit();

interface YamlFile {
    path: string;
    content: any;
}

export const GET = (async ({}) => {
    try {
        const processedEvents = await db.processed_event.findMany({
            where: {
                was_correctly_predicted: false
            },
            select: {
                event_id: true,
                real_intent: true,
                events: true
            }
        });
        const processedEventsWithSentence = processedEvents.map((event) => {
            const eventData = JSON.parse(event.events.data ?? '{}') as EventData;
            return {
                event_id: event.event_id,
                real_intent: event.real_intent,
                sentence: eventData.text
            };
        });

        const buffer = await updateYmlFilesAndZip(processedEventsWithSentence);

        return new Response(buffer, {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': 'attachment; filename="data.zip"'
            }
        });
    } catch (e) {
        throw error(500, JSON.stringify(e));
    }
}) satisfies RequestHandler;

type ProcessedEvent = {
    event_id: number;
    real_intent: string;
    sentence: string;
};

async function updateYmlFilesAndZip(processedEvents: ProcessedEvent[]) {
    const zip = new AdmZip();

    const yamlFiles: YamlFile[] = [];
    const folderContent = await getFolderContent(GITHUB_FOLDER_NAME);

    // @ts-ignore
    for (const item of folderContent) {
        if (item.type === 'dir') {
            const subFolderContent = await getFolderContent(item.path);
            for (const subItem of subFolderContent) {
                if (subItem.name === 'nlu.yml') {
                    const fileContent = await getFileContent(subItem.path);
                    console.log('fileContent', fileContent);
                    // yamlFiles.push({path: subItem.path, content: yaml.load(fileContent)});
                }
            }
        }
    }

    for (const event of processedEvents) {
        const targetFolder = `data/${event.real_intent}`;
        const targetFile = `${targetFolder}/nlu.yml`;

        const yamlFileIndex = yamlFiles.findIndex((file) => file.path === targetFile);
        if (yamlFileIndex !== -1) {
            const file = yamlFiles[yamlFileIndex];
            const exampleLines = file.content.nlu[0].examples.split('\n');
            const sentenceLine = `- ${event.sentence}`;

            if (!exampleLines.includes(sentenceLine)) {
                exampleLines.splice(1, 0, sentenceLine);
                file.content.nlu[0].examples = exampleLines.join('\n');
                const updatedContent = yaml.dump(file.content);
                zip.addFile(targetFile, Buffer.from(updatedContent, 'utf-8'));
            }
        }
    }

    return await zip.toBufferPromise();
}

async function getFolderContent(path: string) {
    const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: GITHUB_REPO_OWNER,
        repo: GITHUB_REPO_NAME,
        path: path
    });
    return response.data;
}

async function getFileContent(path: string) {
    const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: GITHUB_REPO_OWNER,
        repo: GITHUB_REPO_NAME,
        path: path
    });

    // @ts-ignore
    const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
    return content;
}
