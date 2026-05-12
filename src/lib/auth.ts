import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import { getPrisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  // Only initialize the adapter at runtime when the database is available.
  // This prevents build-time static analysis crashes in environments like CI/CD.
  adapter: (process.env.DATABASE_URL && process.env.DATABASE_URL !== "undefined") 
    ? PrismaAdapter(getPrisma() as any) 
    : undefined,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "mock",
      clientSecret: process.env.GITHUB_SECRET || "mock",
      authorization: { params: { scope: "read:user user:email repo" } },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
