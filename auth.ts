import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";

const adminEmail = process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase();

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID ?? "",
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? "",
    }),
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session, user }) {
      const email = (session.user?.email ?? user?.email ?? "").trim().toLowerCase();

      if (session.user) {
        if (adminEmail && email === adminEmail) {
          session.user.role = "admin";
        }
      }

      return session;
    },
  },
});