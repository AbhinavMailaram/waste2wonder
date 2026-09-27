import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import LiveBackground from "@/components/LiveBackground";
import SiteNav from "@/components/SiteNav";
import { useAuth } from "@/lib/auth";
import { useFrontendState } from "@/lib/frontend-state";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Profile — Waste2Wonder" },
      {
        name: "description",
        content:
          "Implemented work, created posts, badges, contest wins, engagement and environmental impact.",
      },
    ],
  }),
});

function ProfilePage() {
  const { user, logout } = useAuth();
  const { references, implementedWorks, createdPosts } = useFrontendState();
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      if (!user) router.navigate({ to: "/login" });
    }, 200);
    return () => clearTimeout(t);
  }, [user, router]);

  const referenceMap = useMemo(() => new Map(references.map((ref) => [ref.id, ref])), [references]);
  const impactKg = useMemo(
    () =>
      implementedWorks.reduce(
        (sum, work) => sum + (referenceMap.get(work.referenceId)?.material ? 0.6 : 0.2),
        0,
      ),
    [implementedWorks, referenceMap],
  );

  if (!user) {
    return (
      <div className="relative min-h-screen">
        <LiveBackground />
        <SiteNav />
        <div className="grid min-h-screen place-items-center px-6 text-center">
          <div className="rounded-2xl brutal-border brutal-shadow-lg bg-card p-6">
            <div className="font-display text-2xl">Please log in</div>
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
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="relative min-h-screen text-foreground">
      <LiveBackground />
      <SiteNav />
      <main className="mx-auto max-w-6xl px-6 pt-32 pb-16">
        <section className="rounded-3xl brutal-border brutal-shadow-lg bg-card p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-center">
            <div className="grid h-24 w-24 place-items-center rounded-2xl brutal-border brutal-shadow bg-brand-mint">
              <span className="font-display text-4xl leading-none">
                {user.name.slice(0, 1).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-foreground/60">
                Creator profile
              </div>
              <h1 className="mt-1 font-display text-3xl md:text-4xl leading-none">{user.name}</h1>
              <div className="mt-1 text-sm font-medium text-foreground/70">
                {user.email} · Joined {joined}
              </div>
              <p className="mt-3 max-w-xl text-sm font-medium">{user.bio}</p>
            </div>
            <div className="flex flex-wrap gap-2 md:justify-end">
              <Link
                to="/create-post"
                className="rounded-xl brutal-border brutal-shadow-sm bg-brand-mustard px-4 py-2 text-sm font-bold"
              >
                Create Your Own Post
              </Link>
              <button
                onClick={() => {
                  logout();
                  router.navigate({ to: "/" });
                }}
                className="rounded-xl brutal-border brutal-shadow-sm bg-brand-coral px-4 py-2 text-sm font-bold"
              >
                Log Out
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            { k: implementedWorks.length, v: "Implemented work", bg: "bg-brand-mint" },
            { k: createdPosts.length, v: "Created posts", bg: "bg-brand-mustard" },
            { k: `${impactKg.toFixed(1)} kg`, v: "Waste diverted", bg: "bg-brand-pink" },
            { k: "4", v: "Contest wins", bg: "bg-brand-coral" },
          ].map((s) => (
            <div key={s.v} className={`rounded-2xl brutal-border brutal-shadow ${s.bg} p-5`}>
              <div className="font-display text-3xl leading-none">{s.k}</div>
              <div className="mt-2 text-[11px] font-bold uppercase tracking-widest">{s.v}</div>
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="rounded-3xl brutal-border brutal-shadow-lg bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Implemented Work</h2>
              <Link
                to="/create"
                className="text-xs font-bold uppercase tracking-widest hover:underline"
              >
                Try another build
              </Link>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {implementedWorks.map((work) => {
                const source = referenceMap.get(work.referenceId);
                return (
                  <article
                    key={work.id}
                    className="rounded-2xl brutal-border bg-brand-lilac/40 p-4"
                  >
                    <img
                      src={work.finalImage}
                      alt={work.title}
                      className="h-28 w-full rounded-xl brutal-border object-cover"
                    />
                    <div className="mt-2 font-display text-lg leading-none">{work.title}</div>
                    <div className="mt-1 text-[11px] font-bold uppercase tracking-widest text-foreground/70">
                      Linked to: {source?.title ?? "Unknown reference"}
                    </div>
                    <div className="mt-1 text-[11px] font-bold uppercase tracking-widest text-foreground/60">
                      {work.fromContest ? "Contest Try It" : "Reference implementation"}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl brutal-border brutal-shadow-lg bg-card p-6">
            <h2 className="font-display text-2xl">Achievements & Metrics</h2>
            <div className="mt-4 space-y-3 text-sm font-semibold">
              <div className="rounded-xl brutal-border bg-brand-mint/60 p-3">
                Badges: First Scan, Circular Maker, Weekly Winner, Safety Pro
              </div>
              <div className="rounded-xl brutal-border bg-brand-mustard/60 p-3">
                Followers/Following: 142 / 89
              </div>
              <div className="rounded-xl brutal-border bg-brand-pink/60 p-3">
                Creator engagement: 680 likes · 122 comments · 4.2k views
              </div>
              <div className="rounded-xl brutal-border bg-brand-coral/60 p-3">
                Environmental impact score: 91/100
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl brutal-border brutal-shadow-lg bg-card p-6">
          <h2 className="font-display text-2xl">Create Your Own Post</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {createdPosts.map((post) => (
              <article key={post.id} className="rounded-2xl brutal-border bg-brand-mint/30 p-4">
                <img
                  src={post.afterImage}
                  alt={post.title}
                  className="h-28 w-full rounded-xl brutal-border object-cover"
                />
                <div className="mt-2 font-display text-lg leading-none">{post.title}</div>
                <div className="mt-1 text-[11px] font-bold uppercase tracking-widest text-foreground/70">
                  {post.time} · {post.cost} · {post.difficulty}
                </div>
                <div className="mt-2 text-xs font-semibold">{post.precautions}</div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
