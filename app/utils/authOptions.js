import GoogleProvider from "next-auth/providers/google";
import connectDB from "../config/database";
import User from "../models/User";
User;
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    //   Invoked on successful signIn
    async signIn({ profile }) {
      // connect to db
      await connectDB();
      // check if user exist
      const userExist = await User.findOne({ email: profile.email });
      // if not,create user
      if (!userExist) {
        // Tuncate uername if too long
        const userName = profile.name.slice(0, 20);
        User.create({
          email: profile.email,
          userName,
          image: profile.picture,
        });
      }
      // Return true to allow sign in
      return true;
    },
    //   Session callback function that modifies the session object
    async session({ session }) {
      //   Get user from db
      const user = await User.findOne({ email: session.user.email });
      //   Asssign user id from the session
      session.user.id = user._id.toString();
      //   Return session
      return session;
    },
  },
};
