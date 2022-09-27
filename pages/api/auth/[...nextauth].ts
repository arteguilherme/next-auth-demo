import { PrismaAdapter } from "@next-auth/prisma-adapter"
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

import prisma from "../../../lib/prisma"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          userName: profile.login,
          email: profile.email,
          image: profile.avatar_url,
        }
      },

    }),
    // ...add more providers here
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
    callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true

      if (isAllowedToSignIn) {
        return true
      } else {
        // Return false to display a default error message
        return false
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }

    },
    session: ({ session, user, token }) => ({
      ...session,
      use: {
        ...session.user,
        id: user.id,
        userName: user.userName
      }
    }),
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token
    }
}
}

export default NextAuth(authOptions)