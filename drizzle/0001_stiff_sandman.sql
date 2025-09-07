DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `events` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;