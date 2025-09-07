import { sqliteTable, AnySQLiteColumn, foreignKey, integer, text, uniqueIndex } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const events = sqliteTable("events", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	category: text().notNull(),
	date: text().notNull(),
	description: text(),
	time: text(),
	location: text(),
	facebook: text(),
	instagram: text(),
	twitter: text(),
	email: text(),
	whatsApp: text(),
	createdAt: text().notNull(),
	userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
});

export const users = sqliteTable("users", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	email: text().notNull(),
	password: text().notNull(),
	createdAt: text().notNull(),
},
(table) => [
	uniqueIndex("users_email_unique").on(table.email),
]);

