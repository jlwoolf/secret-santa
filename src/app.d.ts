// See https://svelte.dev/docs/kit/types#app.d.ts

import type { config, user } from '$lib/server/db';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			config: typeof config.$inferSelect;
			user?: typeof user.$inferSelect;
			year: number;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
