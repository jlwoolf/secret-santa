import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const result = await fetch('/admin/fetch', {
		method: 'POST'
	});
	return await result.json();
};
