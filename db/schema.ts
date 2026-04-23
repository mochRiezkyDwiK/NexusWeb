import { mysqlTable, serial, varchar, int, text, timestamp } from "drizzle-orm/mysql-core";
import { InferSelectModel } from "drizzle-orm";

export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  price: int("price").notNull(),
  description: text("description"),
  sourceUrl: varchar("source_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export type SelectProduct = InferSelectModel<typeof products>;