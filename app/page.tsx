import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GraduationCap, BookOpen, Users, Award } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple Header */}
      <div className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <GraduationCap className="h-6 w-6" />
            Kingdom Way Academy
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/sign-in">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-3xl text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Kingdom Way Academy
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Transform your learning journey with expert-led courses
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-4 my-8">
            <div className="border rounded-lg p-4">
              <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-semibold mb-1">Quality Content</h3>
              <p className="text-sm text-muted-foreground">
                Expert-crafted courses
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <Users className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="font-semibold mb-1">Learn Together</h3>
              <p className="text-sm text-muted-foreground">
                Join our community
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <Award className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-semibold mb-1">Track Progress</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your growth
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse">
              <Button size="lg" className="w-full sm:w-auto">
                Browse Courses
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2024 Kingdom Way Academy. Built with Next.js & Prisma.
        </div>
      </div>
    </div>
  );
}