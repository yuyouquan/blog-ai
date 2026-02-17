import NextAuth from "next-auth";

const handler = NextAuth({
  providers: [
    {
      id: "credentials",
      name: "credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        return {
          id: "1",
          email: credentials.email as string,
          name: credentials.email as string,
        };
      },
    },
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
});

export { handler as GET, handler as POST };
