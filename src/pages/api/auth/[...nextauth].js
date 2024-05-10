
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?._id) {
        token._id = user._id;
      }
      if (user?.userType) {
        token.userType = user.userType;
      }
      if (user?.accessToken) {
        token.accessToken = user.accessToken;
      }

      return token;
    },
    async session({ session, token }) {
      if (token?._id) {
        session.user._id = token._id;
      }
      if (token?.userType) {
        session.user.userType = token.userType;
      }
      if (token?.accessToken) {
        session.accessToken = token.accessToken;
      }

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
