import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { InactiveAccountError, InvalidEmailPasswordError } from "./utils/errors"
import { login } from "./hooks/apiHooks"
import { IUser } from "./types/next-auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        const res = await login({
          username: credentials.username,
          password: credentials.password
        })

        if (res?.statusCode === 201 || res?.status === 201 || res?.user) {
          // return user object with their profile data

          return {
            id: res.data?.user?.id,
            name: res.data?.user?.name,
            email: res.data?.user?.email,
            access_token: res.data?.access_token,
          };
        } else if (+res.statusCode === 401) {
          throw new InvalidEmailPasswordError()
        } else if (+res.statusCode === 400) {
          throw new InactiveAccountError()
        } else {
          throw new Error("Internal server error")
        }

      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.user = (user as IUser);
      }
      return token
    },
    session({ session, token }) {
      (session.user as IUser) = token.user;
      return session
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, 
      //otherwise redirect to login page
      return !!auth
    },
  },
})