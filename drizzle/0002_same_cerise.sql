DO $$ BEGIN
 CREATE TYPE "userPermissions" AS ENUM('ADMIN', 'BASIC');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" text NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "emailIndex" ON "user" ("email");