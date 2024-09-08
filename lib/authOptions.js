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
    signIn: async ({ user, account }) => {
      if (account?.provider === "google") {
        try {
          const { email, name, image } = user;
          await connectToDatabase();
          
          const existingUser = await User.findOne({ email });
          
          if (!existingUser) {
            await User.create({
              email,
              name,
              image,
              googleId: user.id
            });
          }
          
          return true;
        } catch (error) {
          console.error("Error during sign-in:", error);
          return false;
        }
      }
      return false;
    },
    signOut: async () => {
      try {
        // Perform any cleanup or additional logic here if needed
        return true;
      } catch (error) {
        console.error("Error during sign-out:", error);
        return false;
      }
    }
  },
  // Add these options to ensure proper session handling
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};