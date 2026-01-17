import Link from "next/link";
import { SiteShell } from "@/components/shell/site-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <SiteShell>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-brand-gold" />
            Premium faith-centered learning platform
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Build leadership, purpose, and discipline —
            <span className="text-brand-navy"> the Kingdom way.</span>
          </h1>

          <p className="text-lg text-muted-foreground">
            Courses, cohorts, and mentorship designed to help you grow in faith and lead with
            clarity. Track progress, earn certificates, and learn with community.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="bg-brand-navy hover:bg-brand-navy/90 text-white">
              <Link href="/pricing">View pricing</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/signin">Sign in</Link>
            </Button>
          </div>

          <div className="flex gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Progress tracking
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Certificates
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Community-ready
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <Card className="p-6 shadow-soft">
            <div className="text-sm text-muted-foreground">Featured course</div>
            <div className="mt-1 text-xl font-bold">Biblical Leadership Foundations</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Learn timeless leadership principles from Scripture with practical application.
            </p>
            <div className="mt-4 flex gap-2">
              <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                3 modules
              </span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                9 lessons
              </span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                Quiz + certificate
              </span>
            </div>
          </Card>

          <Card className="p-6 shadow-soft">
            <div className="text-sm text-muted-foreground">Your journey</div>
            <div className="mt-1 text-xl font-bold">From learning → living</div>
            <p className="mt-2 text-sm text-muted-foreground">
              We emphasize reflection, practice, and accountability — not just videos.
            </p>
          </Card>
        </div>
      </div>
    </SiteShell>
  );
}
