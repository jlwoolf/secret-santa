import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db, schema, user } from '$lib/server/db';
import { generators } from '$lib/utils';

import type { PageServerLoad } from './$types';
import { count, eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	const year = new Date('2024-12-25').getFullYear();
	const userCount = await db
		.select({ count: count() })
		.from(schema.user)
		.where(eq(schema.user.year, year));
	return {
		count: userCount[0].count
	};
};

export const actions: Actions = {
	submit: async ({ request, cookies, locals }) => {
		const data = await request.formData();
		const name = data.get('name');
		const pin = data.get('pin');

		const error: { name?: string; pin?: string } = {};

		if (!name) {
			error.name = 'Please input a name.';
		}

		if (!pin) {
			error.pin = 'Please input a pin.';
		} else if (!pin.toString().match(/[0-9]*/)) {
			error.pin = 'Pin must be digits only.';
		} else if (pin.toString().length < 4) {
			error.pin = 'Pin must be at least 4 digits.';
		}

		if (!name || !pin || error.name || error.pin) {
			return fail(400, error);
		}

		const year = new Date('2024-12-25').getFullYear();

		const users = await db
			.insert(schema.user)
			.values({
				name: name.toString(),
				pin: pin.toString(),
				year,
				sessionKey: generators.sessionKey()
			})
			.returning();

		const user = users[0];
		locals.user = user;

		cookies.set('secret-santa-user-session-key', user.sessionKey, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 30
		});
		return;
	},
	back: async () => {
		throw redirect(301, '/enter');
	}
};
