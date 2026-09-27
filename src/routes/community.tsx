import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import LiveBackground from "@/components/LiveBackground";
import SiteNav from "@/components/SiteNav";
import { PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/community")({
  component: CommunityPage,
  head: () => ({
    meta: [
      { title: "Community — Waste2Wonder" },
      { name: "description", content: "Vote on projects, join weekly contests, and share your upcycling wins." },
    ],
  }),
});

function CommunityPage() {
  const [votes, setVotes] = useState<Record<string, number>>(() =>
    Object.fromEntries(PRODUCTS.map((p) => [p.id, p.votes])),
  );
  const [voted, setVoted] = useState<Record<string, boolean>>({});

  function toggleVote(id: string) {
    setVoted((v) => {
      const isNow = !v[id];
      setVotes((s) => ({ ...s, [id]: (s[id] ?? 0) + (isNow ? 1 : -1) }));
      return { ...v, [id]: isNow };
    });
  }

  return (
    <div className="relative min-h-screen text-foreground">
      <LiveBackground />
      <SiteNav />
      <main className="mx-auto max-w-6xl px-6 pt-32 pb-16">
        <header className="max-w-2xl">
          <span className="inline-block rounded-full brutal-border bg-brand-mint px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
            Community
          </span>
          <h1 className="mt-3 text-4xl md:text-6xl">Vote for this week's best upcycles.</h1>
          <p className="mt-3 text-lg font-medium text-foreground/80">
            Every upvote helps a maker win the weekly contest and unlocks free tool credits.
          </p>
        </header>

        {/* Contest strip */}
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { t: "Weekly Contest", v: "Best Bottle Rebuild", c: "bg-brand-mustard" },
            { t: "This Month", v: "Cardboard Craftsmanship", c: "bg-brand-mint" },
            { t: "All-Time Legend", v: "Denim Reborn Tote", c: "bg-brand-pink" },
          ].map((b) => (
            <div key={b.v} className={`rounded-2xl brutal-border brutal-shadow ${b.c} p-5`}>
              <div className="text-[11px] font-bold uppercase tracking-widest">{b.t}</div>
              <div className="mt-1 font-display text-2xl leading-none">{b.v}</div>
            </div>
          ))}
        </section>

        {/* Feed */}
        <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <article key={p.id} className="rounded-3xl brutal-border brutal-shadow-lg bg-card overflow-hidden flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
                <span className="absolute left-3 top-3 rounded-lg brutal-border bg-card px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                  {p.material}
                </span>
              </div>
              <div className="p-4 flex flex-col gap-3 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl leading-none">{p.title}</h3>
                  <span className="rounded-md brutal-border bg-brand-mint px-2 py-1 text-[10px] font-bold">
                    {p.difficulty}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground/75 line-clamp-2">{p.summary}</p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-foreground/60">
                    {p.time} · {p.cost}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleVote(p.id)}
                      aria-pressed={!!voted[p.id]}
                      className={`rounded-xl brutal-border brutal-shadow-sm px-3 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                        voted[p.id] ? "bg-brand-coral" : "bg-card"
                      }`}
                    >
                      {voted[p.id] ? "Voted" : "Upvote"} · {votes[p.id]}
                    </button>
                    <Link
                      to="/product/$id"
                      params={{ id: p.id }}
                      className="rounded-xl brutal-border brutal-shadow-sm bg-brand-mustard px-3 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}