import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="container py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-extrabold tracking-tight">Kingdom Way Academy</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Faith-centered leadership and life-skills education.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link className="hover:text-foreground" href="/pricing">Pricing</Link>
            <Link className="hover:text-foreground" href="/signin">Sign in</Link>
            <Link className="hover:text-foreground" href="/dashboard">Dashboard</Link>
          </div>
        </div>

        <div className="mt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Kingdom Way Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
