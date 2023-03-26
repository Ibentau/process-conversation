import type {Actions, PageServerLoad} from './$types';
import db from "../lib/prisma";
import type {events} from "@prisma/client";

export const load = (async ({params}) => {
    const userEvents: events[] = await db.events.findMany({
        where: {
            type_name: "user",
            processed_event: {
                is: null
            }
        },
        include: {
            processed_event: true
        }
    });
    return {
        userEvents
    };
}) satisfies PageServerLoad;

export const actions = {
    default: async (event) => {
        // TODO log the user in
    }
} satisfies Actions;
