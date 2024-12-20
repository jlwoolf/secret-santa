import { db, schema } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { RequestHandler, RequestEvent } from './$types';
import { error, json } from '@sveltejs/kit';

export const DELETE = (async ({ request }: RequestEvent) => {
	const { id } = await request.json();

	try {
		await db.delete(schema.user).where(eq(schema.user.id, id));
		return json({ message: 'DELETE' });
	} catch (e) {
		return error(500, { message: `${e}` });
	}
}) satisfies RequestHandler;
