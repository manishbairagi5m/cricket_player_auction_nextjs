
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60
  },
  callbacks: {
    async jwt({ token, user }) {
      token = {...token , ...user}
      return token;
    },
    async session({ session, token }) {
      session.user = {...token};
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(creadentials) {
        return {...creadentials};
      },
    }),
  ],
});
