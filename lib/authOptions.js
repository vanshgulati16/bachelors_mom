import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "./utils";
import { User } from "../modals/useModal";

export const authOptions = {
  // Google auth provider
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const { email, name, image } = user;
          await connectToDatabase();
          
          let dbUser = await User.findOne({ email });
          
          if (!dbUser) {
            dbUser = await User.create({
              email,
              name,
              image,
              googleId: user.id
            });
          }
          
          user.id = dbUser._id.toString();
          return true;
        } catch (error) {
          console.error("Error during sign-in:", error);
          return false;
        }
      }
      return false;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  },
  // Add these options to ensure proper session handling
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};