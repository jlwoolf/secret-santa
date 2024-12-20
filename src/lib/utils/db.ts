import { db, schema } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export const getConfig = async (year?: number) => {
	year ??= new Date().getFullYear();
	const configs = await db.select().from(schema.config).where(eq(schema.config.year, year));

	if (configs.length !== 1) return undefined;

	return configs[0];
};

export const getAllUsers = async (year?: number) => {
	year ??= new Date().getFullYear();
	return await db.select().from(schema.user).where(eq(schema.user.year, year));
};

export const getAllPairings = async (year?: number) => {
	year ??= new Date().getFullYear();
	return await db.select().from(schema.pairings).where(eq(schema.pairings.year, year));
};
