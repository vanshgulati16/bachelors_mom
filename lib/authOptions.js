import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  // google auth
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    })
  ]
};