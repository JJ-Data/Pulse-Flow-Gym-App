import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "MEMBER" | "ADMIN" | "TRAINER"; // ← ADD "TRAINER"
    } & DefaultSession["user"];
  }

  interface User {
    role: "MEMBER" | "ADMIN" | "TRAINER"; // ← ADD "TRAINER"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "MEMBER" | "ADMIN" | "TRAINER"; // ← ADD "TRAINER"
  }
}
