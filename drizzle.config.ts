import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";
dotenv.config();

export default {
  schema: "./src/db/schema.ts", // Onde seus schemas serão definidos
  out: "./drizzle", // Onde as migrações serão salvas
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!, // URL do banco de dados
    authToken: process.env.TURSO_AUTH_TOKEN!, // Token de autenticação
  },
} satisfies Config;
