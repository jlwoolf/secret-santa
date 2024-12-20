import type { PairingSchema } from '$lib/server/db/schema';
import type { RequestHandler, RequestEvent } from './$types';
import { error, json } from '@sveltejs/kit';

export const GET = (async ({ request, params, fetch }: RequestEvent) => {
	const { id } = params;
	const response = await fetch('/admin/pair', {
		method: 'POST'
	});

	if (response.type === 'error') return error(404, { message: 'Config not defined' });

	const { pairings }: { pairings: PairingSchema[] } = await response.json();
	if (pairings.length === 0) return error(404, { message: 'No pairings exist' });

	const pair = pairings.find((pairing) => pairing.giver === Number(id));
	if (!pair) return error(404, { message: `Could not find pair for id ${id}` });

	return json(pair);
}) satisfies RequestHandler;
