import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';

export const config = sqliteTable('config', {
	year: integer('year').primaryKey(),
	code: text('code').notNull(),
	sessionKey: text('sessionKey').notNull(),
	signupDeadline: integer('signupDeadline', { mode: 'timestamp' }),
	eventDate: integer('eventDate', { mode: 'timestamp' })
});

export const user = sqliteTable('user', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	pin: text('pin').notNull(),
	year: integer('year').references(() => config.year),
	sessionKey: text('sessionKey').notNull()
});

export const pairings = sqliteTable(
	'pairings',
	{
		year: integer('year')
			.references(() => config.year)
			.notNull(),
		giver: integer('giver')
			.references(() => user.id)
			.notNull(),
		receiver: integer('receiver')
			.references(() => user.id)
			.notNull()
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.year, table.giver, table.receiver] })
		};
	}
);

export type ConfigSchema = typeof config.$inferSelect;
export type UserSchema = typeof user.$inferSelect;
export type PairingSchema = typeof pairings.$inferSelect;

export default {
	config,
	user,
	pairings
};
