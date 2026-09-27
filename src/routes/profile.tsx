import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import LiveBackground from "@/components/LiveBackground";
import SiteNav from "@/components/SiteNav";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Your Profile — Waste2Wonder" },
      { name: "description", content: "Your Waste2Wonder profile, projects, badges and environmental impact." },
    ],
  }),
});

function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // brief tick so localStorage-hydrated user has time to populate
    const t = setTimeout(() => {
      if (!user) router.navigate({ to: "/login" });
    }, 200);
    return () => clearTimeout(t);
  }, [user, router]);

  if (!user) {
    return (
      <div className="relative min-h-screen">
        <LiveBackground />
        <SiteNav />
        <div className="grid min-h-screen place-items-center px-6 text-center">
          <div className="rounded-2xl brutal-border brutal-shadow-lg bg-card p-6">
            <div className="font-display text-2xl">Please log in</div>
            <p className="mt-1 text-sm text-foreground/70">You need to log in to view your profile.</p>
            <Link
              to="/login"
              className="mt-4 inline-block rounded-xl brutal-border brutal-shadow-sm bg-brand-coral px-4 py-2 text-sm font-bold"
            >
              Go to Log In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const joined = new Date(user.joinedAt).toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric",
  });

  return (
    <div className="relative min-h-screen text-foreground">
      <LiveBackground />
      <SiteNav />
      <main className="mx-auto max-w-6xl px-6 pt-32 pb-16">
        {/* Header card */}
        <section className="rounded-3xl brutal-border brutal-shadow-lg bg-card p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-center">
            <div className="grid h-24 w-24 place-items-center rounded-2xl brutal-border brutal-shadow bg-brand-mint">
              <span className="font-display text-4xl leading-none">
                {user.name.slice(0, 1).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-foreground/60">Maker</div>
              <h1 className="mt-1 font-display text-3xl md:text-4xl leading-none">{user.name}</h1>
              <div className="mt-1 text-sm font-medium text-foreground/70">{user.email}</div>
              <p className="mt-3 max-w-xl text-sm font-medium">{user.bio}</p>
              <div className="mt-2 text-[11px] font-bold uppercase tracking-widest text-foreground/60">
                Joined {joined}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 md:justify-end">
              <Link
                to="/"
                className="rounded-xl brutal-border brutal-shadow-sm bg-brand-mustard px-4 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5"
              >
                New Scan
              </Link>
              <button
                onClick={() => { logout(); router.navigate({ to: "/" }); }}
                className="rounded-xl brutal-border brutal-shadow-sm bg-brand-coral px-4 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5"
              >
                Log Out
              </button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            { k: user.stats.projects, v: "Projects made", bg: "bg-brand-mint" },
            { k: `${user.stats.wasteKg} kg`, v: "Waste diverted", bg: "bg-brand-mustard" },
            { k: user.stats.votes, v: "Votes given", bg: "bg-brand-pink" },
            { k: "Bronze", v: "Impact tier", bg: "bg-brand-coral" },
          ].map((s) => (
            <div key={s.v} className={`rounded-2xl brutal-border brutal-shadow ${s.bg} p-5`}>
              <div className="font-display text-3xl leading-none">{s.k}</div>
              <div className="mt-2 text-[11px] font-bold uppercase tracking-widest">{s.v}</div>
            </div>
          ))}
        </section>

        {/* Projects + Badges */}
        <section className="mt-6 grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl brutal-border brutal-shadow-lg bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Your Projects</h2>
              <Link to="/" className="text-xs font-bold uppercase tracking-widest hover:underline">
                Start One
              </Link>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-2xl brutal-border bg-brand-lilac/50 p-4">
                  <div className="h-24 rounded-lg brutal-border bg-card/70" />
                  <div className="mt-3 font-display text-lg leading-none">Project #{i}</div>
                  <div className="mt-1 text-[11px] font-bold uppercase tracking-widest text-foreground/60">
                    Draft · not published
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl brutal-border brutal-shadow-lg bg-card p-6">
            <h2 className="font-display text-2xl">Badges</h2>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {["First Scan", "Plastic Slayer", "Community Voter", "Weekly Winner", "10 kg Saved", "Cardboard Guru"].map((b, i) => (
                <div
                  key={b}
                  className={`aspect-square rounded-2xl brutal-border p-2 text-center ${
                    ["bg-brand-mint", "bg-brand-mustard", "bg-brand-pink", "bg-brand-coral", "bg-brand-lilac", "bg-card"][i % 6]
                  }`}
                >
                  <div className="mx-auto mt-2 grid h-10 w-10 place-items-center rounded-full brutal-border bg-card">
                    <span className="font-display text-sm">{b.slice(0, 1)}</span>
                  </div>
                  <div className="mt-2 text-[10px] font-bold uppercase tracking-widest leading-tight">{b}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}