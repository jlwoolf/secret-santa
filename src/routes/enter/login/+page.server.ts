import { db, schema } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	return {
		users: await getAllUsers()
	};
};

import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { getAllUsers } from '$lib/utils';

export const actions: Actions = {
	submit: async ({ request, cookies, locals }) => {
		const data = await request.formData();
		const name = data.get('name');
		const pin = data.get('pin');

		const errors: { name?: string; pin?: string } = {};

		if (name === null) {
			errors.name = 'Please select a name.';
		}

		if (!pin) {
			errors.pin = 'Please input a pin.';
		}

		if (!name || !pin) {
			return fail(400, errors);
		}

		const id = Number(name.toString());
		const users = await db.select().from(schema.user).where(eq(schema.user.id, id)).limit(1);

		const user = users[0];

		if (pin.toString() !== user.pin) {
			return fail(400, { pin: 'Invalid pin.' });
		}

		cookies.set('secret-santa-user-session-key', user.sessionKey, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 30
		});
	},
	back: async () => {
		throw redirect(301, '/enter');
	}
};
