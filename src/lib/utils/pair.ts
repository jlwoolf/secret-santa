import { db, schema } from '$lib/server/db';
import type { UserSchema } from '$lib/server/db/schema';
import ss from 'secret-santa-generator';
import { getAllUsers } from './db';
import { eq } from 'drizzle-orm';

const pairUsers = (users: UserSchema[]) => {
	const ids = users.map((user) => user.id);
	return ss.buildSecretSantaTable(ids);
};

const insertPairings = async (year: number, pairings: Record<number, number>) => {
	const values = Object.entries(pairings).map(([giver, receiver]) => ({
		giver: Number(giver),
		receiver,
		year
	}));

	return await db.insert(schema.pairings).values(values).returning();
};

export const createPairings = async (year?: number) => {
	year ??= new Date('2024-12-25').getFullYear();
	const users = await getAllUsers(year);
	const pairings = pairUsers(users);
	return await insertPairings(year, pairings);
};

export const deletePairings = async (year?: number) => {
	year ??= new Date('2024-12-25').getFullYear();
	return await db.delete(schema.pairings).where(eq(schema.pairings.year, year)).returning();
};
