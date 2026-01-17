import { SiteHeader } from "@/components/shell/site-header";
import { SiteFooter } from "@/components/shell/site-footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(30,58,143,0.10),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(212,175,55,0.10),transparent_55%)]">
      <SiteHeader />
      <main className="container py-10">{children}</main>
      <SiteFooter />
    </div>
  );
}
