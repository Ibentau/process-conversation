import type {events} from "@prisma/client";
import db from "../../lib/prisma";
import type {PageServerLoad} from "./$types";

export const load = (async ({params}) => {
    const userEvents: events[] = await db.events.findMany({
        where: {
            type_name: 'user',
            processed_event: {
                is: null
            }
        }
    });

    const predictions = userEvents.map((event) => JSON.parse(event.data ?? "{}").parse_data?.intent_ranking[0].confidence as number);
    const bins = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
    const histogram = new Array(bins.length - 1).fill(0);
    for (const prediction of predictions) {
        for (let i = 0; i < bins.length - 1; i++) {
            if (prediction >= bins[i] && prediction < bins[i + 1]) {
                histogram[i]++;
                break;
            }
        }
    }
    return {
        userEvents,
        histogram,
        bins
    };
}) satisfies PageServerLoad;
