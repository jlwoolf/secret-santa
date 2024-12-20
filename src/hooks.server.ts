import { db, schema } from '$lib/server/db';
import { generators } from '$lib/utils';
import { redirect, type Handle, type ServerInit } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

const getConfig = async () => {
	const year = new Date().getFullYear();
	let configs = await db.select().from(schema.config).where(eq(schema.config.year, year)).limit(1);

	if (configs.length === 0)
		configs = await db
			.insert(schema.config)
			.values({
				year,
				code: generators.code(),
				sessionKey: generators.sessionKey()
			})
			.returning();

	return configs[0];
};

export const init: ServerInit = async () => {
	console.log((await getConfig()).code);
};

export const handle: Handle = async ({ event, resolve }) => {
	const config = await getConfig();
	const year = new Date().getFullYear();
	event.locals.year = year;

	event.locals.config = config;
	const sessionKey = event.cookies.get('secret-santa-session-key');
	const userSessionKey = event.cookies.get('secret-santa-user-session-key');

	if (event.url.pathname.startsWith('/admin')) {
		const response = await resolve(event);
		return response;
	}

	if (config.sessionKey !== sessionKey) {
		if (!event.url.pathname.startsWith('/verify')) throw redirect(301, '/verify');
	} else if (!userSessionKey) {
		if (!event.url.pathname.startsWith('/enter')) throw redirect(301, '/enter');
		const users = await db
			.select({ id: schema.user.id })
			.from(schema.user)
			.where(eq(schema.user.year, year));
		if (!event.url.pathname.startsWith('/enter/signup') && users.length === 0)
			throw redirect(301, '/enter/signup');
	} else {
		const users = await db
			.select()
			.from(schema.user)
			.where(eq(schema.user.sessionKey, userSessionKey))
			.limit(1);

		if (users.length === 0) {
			event.cookies.delete('secret-santa-user-session-key', {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 30
			});
			throw redirect(301, '/enter/signup');
		}

		const user = users[0];
		event.locals.user = user;

		if (event.url.pathname !== '/') throw redirect(301, '/');
	}

	const response = await resolve(event);
	return response;
};
