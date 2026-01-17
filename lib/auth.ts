import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: "",
      from: env.RESEND_FROM_EMAIL,
      sendVerificationRequest: async ({ identifier: email, url }) => {
        await resend.emails.send({
          from: env.RESEND_FROM_EMAIL,
          to: email,
          subject: "Sign in to Kingdom Way Academy",
          html: `
            <!DOCTYPE html>
            <html>
              <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #1e3a8f; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; font-size: 24px;">Kingdom Way Academy</h1>
                </div>
                <div style="background: #f8fafc; padding: 40px; border-radius: 0 0 8px 8px;">
                  <h2 style="color: #1e3a8f; margin-top: 0;">Sign in to your account</h2>
                  <p style="color: #64748b; font-size: 16px; line-height: 24px;">
                    Click the button below to sign in to your Kingdom Way Academy account.
                  </p>
                  <a href="${url}" 
                     style="display: inline-block; background: #d4af37; color: #1e3a8f; 
                            padding: 12px 32px; text-decoration: none; border-radius: 6px; 
                            font-weight: 600; margin: 20px 0;">
                    Sign In
                  </a>
                  <p style="color: #94a3b8; font-size: 14px; margin-top: 30px;">
                    If you didn't request this email, you can safely ignore it.
                  </p>
                </div>
              </body>
            </html>
          `,
        });
      },
    }),
  ],

  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "LEARNER" | "INSTRUCTOR" | "ADMIN";
      }
      return session;
    },
  },

  events: {
    async createUser({ user }) {
      // Send welcome email
      await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: user.email!,
        subject: "Welcome to Kingdom Way Academy! 🎓",
        html: `
          <h1>Welcome to Kingdom Way Academy!</h1>
          <p>We're thrilled to have you join our faith-centered learning community.</p>
          <p>Get started by exploring our courses and beginning your journey of growth.</p>
        `,
      });
    },
  },

  debug: env.NODE_ENV === "development",
};
