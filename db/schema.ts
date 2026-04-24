import { mysqlTable, serial, varchar, int, text, timestamp, primaryKey } from "drizzle-orm/mysql-core";
import { InferSelectModel } from "drizzle-orm";

// 1. PRODUCTS (Hapus .primaryKey() karena serial sudah otomatis PK di MySQL)
export const products = mysqlTable("products", {
  id: serial("id"), 
  name: varchar("name", { length: 255 }).notNull(),
  price: int("price").notNull(),
  description: text("description"),
  sourceUrl: varchar("source_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export type SelectProduct = InferSelectModel<typeof products>;

// 2. MESSAGES (Sama, hapus .primaryKey() di serial)
export const messages = mysqlTable("messages", {
  id: serial("id"),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type SelectMessage = InferSelectModel<typeof messages>;

// 3. USERS (Ubah nama tabel jadi "user" biar pas sama Auth.js)
export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: varchar("image", { length: 500 }),
});

// 4. ACCOUNTS (Ubah nama tabel jadi "account")
export const accounts = mysqlTable("account", {
  userId: varchar("userId", { length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 255 }).notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: int("expires_at"),
  token_type: varchar("token_type", { length: 255 }),
  scope: varchar("scope", { length: 255 }),
  id_token: text("id_token"),
  session_state: varchar("session_state", { length: 255 }),
}, (account) => [
  primaryKey({ columns: [account.provider, account.providerAccountId] }),
]);

// 5. SESSIONS (Ubah nama tabel jadi "session")
export const sessions = mysqlTable("session", {
  sessionToken: varchar("sessionToken", { length: 255 }).primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// 6. VERIFICATION TOKENS (Ubah nama tabel jadi "verificationToken")
export const verificationTokens = mysqlTable("verificationToken", {
  identifier: varchar("identifier", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
}, (verificationToken) => [
  primaryKey({ columns: [verificationToken.identifier, verificationToken.token] }),
]);