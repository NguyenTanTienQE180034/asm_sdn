import NextAuth, {
    NextAuthOptions,
    Session,
    User as NextAuthUser,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "../lib/db";
import { default as User } from "../models/User";

interface Credentials {
    email: string;
    password: string;
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(
                credentials: Record<"email" | "password", string> | undefined
            ) {
                await connectDB();
                const user = await User.findOne({ email: credentials?.email });
                if (!user) throw new Error("No user found");
                const isValid = await bcrypt.compare(
                    credentials?.password || "",
                    user.password
                );
                if (!isValid) throw new Error("Invalid password");
                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                };
            },
        }),
    ],
    callbacks: {
        async session({ session, token }: { session: Session; token: any }) {
            if (session.user && token.id) {
                (session.user as any).id = token.id;
            }
            return session;
        },
        async jwt({ token, user }: { token: any; user?: NextAuthUser }) {
            if (user) {
                token.id = (user as any).id;
            }
            return token;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
