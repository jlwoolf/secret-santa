import type { RequestHandler, RequestEvent } from './$types';
import { error, json } from '@sveltejs/kit';
import { db, schema } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { getConfig } from '$lib/utils';

export const POST = (async ({ request }: RequestEvent) => {
	const { signup, event } = await request.json();
	const year = new Date().getFullYear();
	const config = await getConfig();

	const update: { signupDeadline?: Date; eventDate?: Date } = {};
	if (signup !== undefined) update.signupDeadline = signup === null ? signup : new Date(signup);
	if (event !== undefined) update.eventDate = event === null ? event : new Date(event);

	if (signup === undefined && event === undefined) return json({ config });

	const configs = await db
		.update(schema.config)
		.set(update)
		.where(eq(schema.config.year, year))
		.returning();

	if (configs.length !== 1) return error(500, { message: 'Error updating dates' });

	return json({ config: configs[0] });
}) satisfies RequestHandler;
