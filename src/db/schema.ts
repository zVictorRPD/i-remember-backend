// src/db/schema.ts
import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Tabela de Usuários
export const usersTable = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Tabela de Eventos
export const eventsTable = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  date: text("date").notNull(),
  description: text("description"),
  time: text("time"),
  location: text("location"),
  facebook: text("facebook"),
  instagram: text("instagram"),
  twitter: text("twitter"),
  email: text("email"),
  whatsApp: text("whatsApp"),
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});

// Relações: Um usuário pode ter muitos eventos
export const usersRelations = relations(usersTable, ({ many }) => ({
  events: many(eventsTable),
}));

// Relação inversa: Um evento pertence a um usuário
export const eventsRelations = relations(eventsTable, ({ one }) => ({
  author: one(usersTable, {
    fields: [eventsTable.userId],
    references: [usersTable.id],
  }),
}));
