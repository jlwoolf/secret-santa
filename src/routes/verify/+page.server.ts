import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, cookies, locals }) => {
		const data = await request.formData();
		const code = data.get('code');

		if (!code) {
			return fail(400, { missing: true });
		}

		if (code !== locals.config?.code) {
			return fail(400, { invalid: true });
		}

		cookies.set('secret-santa-session-key', locals.config.sessionKey, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 30
		});
		return;
	}
};
