import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    // Google is optional. Only enable if both env vars exist.
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),

    EmailProvider({
      /**
       * IMPORTANT:
       * Auth.js validates that `server` is configured.
       * Use a real SMTP URL here (even if you send via Resend below).
       */
      server: env.EMAIL_SERVER,
      from: env.RESEND_FROM_EMAIL,

      /**
       * We'll send using Resend API (premium deliverability),
       * but keep EmailProvider valid with server config.
       */
      sendVerificationRequest: async ({ identifier: email, url }) => {
        // Production email via Resend
        await resend.emails.send({
          from: env.RESEND_FROM_EMAIL,
          to: email,
          subject: "Sign in to Kingdom Way Academy",
          html: `
            <div style="font-family: Inter, Arial, sans-serif; padding: 24px;">
              <h2 style="margin: 0 0 12px; color: #1e3a8f;">Kingdom Way Academy</h2>
              <p style="margin: 0 0 16px; color: #334155;">Click below to sign in:</p>
              <p style="margin: 0 0 24px;">
                <a href="${url}" style="background:#d4af37;color:#1e3a8f;padding:10px 16px;border-radius:12px;text-decoration:none;font-weight:800;">
                  Sign in
                </a>
              </p>
              <p style="margin:0;color:#64748b;font-size:12px;">
                If you didn’t request this email, you can safely ignore it.
              </p>
            </div>
          `,
        });

        // Also log link in dev for convenience
        if (env.NODE_ENV === "development") {
          console.log("\n=== MAGIC LINK (DEV) ===");
          console.log(email);
          console.log(url);
          console.log("========================\n");
        }
      },
    }),
  ],

  pages: {
    signIn: "/signin",
    verifyRequest: "/verify",
    error: "/auth-error",
  },

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // @ts-expect-error
        token.id = user.id;
        // @ts-expect-error
        token.role = (user as any).role ?? "LEARNER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-expect-error
        session.user.id = token.id as string;
        // @ts-expect-error
        session.user.role = (token.role as string) ?? "LEARNER";
      }
      return session;
    },
  },

  debug: env.NODE_ENV === "development",
};
