import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // MOCK AUTHENTICATION since Prisma is not connected yet
        if (credentials.email === "admin@example.com" && credentials.password === "password") {
          return { id: "1", email: "admin@example.com", name: "Admin User", role: "ADMIN" };
        }

        if (credentials.email === "user@example.com" && credentials.password === "password") {
          return { id: "2", email: "user@example.com", name: "Test User", role: "CUSTOMER" };
        }

        return null;
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
};
