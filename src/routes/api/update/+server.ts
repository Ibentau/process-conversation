import type {RequestHandler} from './$types';
import db from '../../../lib/prisma';
import {json} from '@sveltejs/kit';

export const POST = (async ({ request }) => {
	const {id, intent, was_correctly_predicted} = await request.json();
	try {
		await db.processed_event.create({
			data: {
				event_id: id,
				real_intent: intent,
				was_correctly_predicted: was_correctly_predicted
			}
		});
		return json({
			success: true
		});
	} catch (e) {
		return json({
			success: false
		});
	}
}) satisfies RequestHandler;

export const DELETE = (async ({ request }) => {
	const { id } = await request.json();
	try {
		await db.events.delete({
			where: {
				id: id
			}
		});
		return json({
			success: true
		});
	} catch (e) {
		return json({
			success: false
		});
	}
}) satisfies RequestHandler;
