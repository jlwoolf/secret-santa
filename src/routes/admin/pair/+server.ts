import { db, schema } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { RequestHandler, RequestEvent } from './$types';
import { error, json } from '@sveltejs/kit';
import { createPairings, getAllPairings, getAllUsers, getConfig, deletePairings } from '$lib/utils';

export const POST = (async ({ request, locals }: RequestEvent) => {
	const config = await getConfig();
	if (!config) return error(404, { message: 'Config not defined.' });

	let users = await getAllUsers();
	let pairings = await getAllPairings();

	if (users.length < 2) return error(500, { message: 'Not enough users' });

	if (pairings.length === 0) {
		if (!config.signupDeadline || config.signupDeadline > new Date()) {
			return json({ pairings });
		} else {
			pairings = await createPairings();
		}
	} else if (pairings.length != users.length) {
		await deletePairings();
		pairings = await createPairings();
	}

	return json({ pairings });
}) satisfies RequestHandler;
