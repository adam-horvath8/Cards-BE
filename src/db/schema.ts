import {
  pgTable,
  uuid,
  text,
  varchar,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const userPermissions = pgEnum("userPermissions", ["ADMIN", "BASIC"]);

export const User = pgTable(
  "user",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 256 }).notNull(),
    password: text("password").notNull(),
  },
  (table) => {
    return {
      emailIndex: uniqueIndex("emailIndex").on(table.email),
    };
  }
);
