import { db, schema } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { PairingSchema } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals, fetch }) => {
	const config = locals.config;

	const getPair = async (id?: number) => {
		if (id === undefined) return;
		const response = await fetch(`/admin/pair/${id}`);
		if (response.type === 'error') return undefined;

		const pair: PairingSchema = await response.json();

		const givers = await db.select().from(schema.user).where(eq(schema.user.id, pair.giver));
		const receivers = await db.select().from(schema.user).where(eq(schema.user.id, pair.receiver));

		return {
			...pair,
			giver: givers[0],
			receiver: receivers[0]
		};
	};

	if (config.signupDeadline && config.eventDate) {
		if (config.eventDate < config.signupDeadline) {
			if (config.eventDate > new Date())
				return { mode: 'buy', date: config.eventDate, pair: await getPair(locals.user?.id) };
			else return { message: 'Secret Santa date has passed.' };
		} else {
			if (config.signupDeadline > new Date())
				return { mode: 'signup', date: config.signupDeadline };
			else if (config.eventDate > new Date())
				return { mode: 'buy', date: config.eventDate, pair: await getPair(locals.user?.id) };
			else return { message: 'Signup date has passed.' };
		}
	} else if (config.signupDeadline && !config.eventDate) {
		if (config.signupDeadline > new Date()) return { mode: 'signup', date: config.signupDeadline };
		else return { message: 'Signup date has passed.' };
	} else if (config.eventDate && !config.signupDeadline) {
		if (config.eventDate > new Date())
			return { mode: 'buy', date: config.eventDate, pair: await getPair(locals.user?.id) };
		else return { message: 'Secret Santa date has passed.' };
	} else {
		return { message: 'No event date or signup date has been configured.' };
	}
};
