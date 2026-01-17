import { Metadata } from "next";
import { SignInForm } from "@/components/auth/signin-form";

export const metadata: Metadata = {
  title: "Sign In | Kingdom Way Academy",
  description: "Sign in to your Kingdom Way Academy account",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1e3a8f] to-[#1e3a8f]/90 px-8 py-10 text-center">
            <div className="w-16 h-16 bg-[#d4af37] rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#1e3a8f]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-blue-100 text-sm">Sign in to continue your learning journey</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <SignInForm />
          </div>

          {/* Footer */}
          <div className="px-8 pb-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/auth/signup" className="text-[#1e3a8f] font-semibold hover:text-[#d4af37] transition-colors">
              Sign up
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          By continuing, you agree to our{" "}
          <a href="/terms" className="underline hover:text-[#1e3a8f]">Terms of Service</a>
          {" "}and{" "}
          <a href="/privacy" className="underline hover:text-[#1e3a8f]">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}