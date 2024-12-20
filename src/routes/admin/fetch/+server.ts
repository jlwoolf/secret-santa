import type { RequestHandler, RequestEvent } from './$types';
import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getAllUsers, getConfig } from '$lib/utils';
import crypto from 'node:crypto';

const createHash = (password: string) => {
	try {
		return crypto.createHash('md5').update(password).digest('base64url');
	} catch (error) {
		console.log(error);
		return false;
	}
};

const verifyHash = async (digest: string, password: string) => {
	try {
		return digest === crypto.createHash('md5').update(password).digest('base64url');
	} catch (error) {
		console.log(error);
		return false;
	}
};

const getData = async (request: Request) => {
	try {
		return await request.json();
	} catch (error) {
		return {};
	}
};

export const POST = (async ({ request, cookies }: RequestEvent) => {
	const data = await getData(request);

	if (!env.ADMIN_PASSWORD) {
		return error(500, { message: 'No password defined in environment' });
	}

	const cookieHash = cookies.get('admin-password-hash');
	const verified = cookieHash ? await verifyHash(cookieHash, env.ADMIN_PASSWORD) : false;

	if (!verified) {
		if (!data.value) {
			return error(400, { message: 'No password provided' });
		}
		if (env.ADMIN_PASSWORD !== data.value) {
			return error(400, { message: 'Invalid admin password' });
		}
	}

	if (!cookieHash || !verified) {
		const hash = await createHash(env.ADMIN_PASSWORD);
		if (hash) {
			cookies.set('admin-password-hash', hash, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 30
			});
		}
	}

	const users = await getAllUsers();
	const config = await getConfig();
	return json({
		users,
		config
	});
}) satisfies RequestHandler;
