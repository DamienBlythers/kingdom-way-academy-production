import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { resend } from "./resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 6,
    maxPasswordLength: 128,
    sendResetPassword: async ({ user, url }) => {
      try {
        await resend.emails.send({
          from: "Kingdom Way Academy <onboarding@resend.dev>",
          to: user.email,
          subject: "Reset Your Password - Kingdom Way Academy",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #333;">Reset Your Password</h1>
              <p>Click the button below to reset your password:</p>
              <div style="margin: 30px 0;">
                <a href="${url}" 
                   style="display: inline-block; padding: 12px 30px; background: #0070f3; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Reset Password
                </a>
              </div>
              <p style="color: #666; font-size: 14px;">Or copy this link: ${url}</p>
              <p style="color: #999; font-size: 12px;">
                If you didn't request this, ignore this email. Link expires in 1 hour.
              </p>
            </div>
          `,
        });
        console.log(`✅ Password reset email sent to ${user.email}`);
      } catch (error) {
        console.error("❌ Failed to send password reset email:", error);
        throw new Error("Failed to send reset email");
      }
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  advanced: {
    database: {
      generateId: "uuid",
    },
  },
  databaseHooks: {
    account: {
      create: {
        before: async (account: any) => {
          // Fix providerId to use accountId (email) for credential accounts
          if (account.providerId === "credential") {
            return {
              data: {
                ...account,
                providerId: account.accountId,
              },
            };
          }
          return { data: account };
        },
      },
    },
  },
});
