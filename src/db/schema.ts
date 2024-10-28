import { pgTable, uuid, text, varchar, integer, pgEnum, uniqueIndex } from "drizzle-orm/pg-core";

export const userPermissions = pgEnum("userPermissions", ['ADMIN', 'BASIC'])

export const User = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull(),
  age: integer("age").notNull(),
  first_name: text("first_name"),
  second_name: text("second_name"),
  phone: varchar("phone", { length: 256 }),
}, table => {
  return{
    emailIndex: uniqueIndex("emailIndex").on(table.email),
    nameIndex: uniqueIndex("uniqueNameAndAge").on(table.name)
  }
});
