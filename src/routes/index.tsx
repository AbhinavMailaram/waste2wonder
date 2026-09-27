import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import LiveBackground from "@/components/LiveBackground";
import SiteNav from "@/components/SiteNav";
import { useFrontendState, type ReferenceItem } from "@/lib/frontend-state";

export const Route = createFileRoute("/")({
  component: DiscoverPage,
  head: () => ({
    meta: [
      { title: "Discover — Waste2Wonder" },
      {
        name: "description",
        content: "Discover upcycling references, curated ideas, and start image analysis.",
      },
    ],
  }),
});

function DiscoverPage() {
  const { references, likeReference } = useFrontendState();
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<"all" | "in-app" | "youtube">("all");
  const [sortBy, setSortBy] = useState<"popular" | "new" | "easy">("popular");
  const [selected, setSelected] = useState<ReferenceItem | null>(null);

  const results = useMemo(() => {
    const filtered = references.filter((ref) => {
      if (source !== "all" && ref.source !== source) return false;
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return [ref.title, ref.material, ref.summary].join(" ").toLowerCase().includes(q);
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "popular") return b.engagement.likes - a.engagement.likes;
      if (sortBy === "easy") {
        const order = { Easy: 0, Medium: 1, Hard: 2 };
        return order[a.difficulty] - order[b.difficulty];
      }
      return b.engagement.views - a.engagement.views;
    });
  }, [references, query, source, sortBy]);

  return (
    <div className="relative min-h-screen text-foreground">
      <LiveBackground />
      <SiteNav />
      <main className="mx-auto max-w-6xl px-6 pt-32 pb-16">
        <section className="rounded-3xl brutal-border brutal-shadow-lg bg-card p-6 md:p-8">
          <span className="inline-block rounded-full brutal-border bg-brand-mint px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
            Discover
          </span>
          <h1 className="mt-3 text-4xl md:text-6xl">Find your next waste-to-wonder build.</h1>
          <p className="mt-3 max-w-2xl text-lg font-medium text-foreground/80">
            Start with image analysis, explore reference results, and use curated cards from in-app
            posts and YouTube demo references.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/create"
              className="rounded-2xl brutal-border brutal-shadow bg-brand-coral px-5 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5"
            >
              Start Image Analysis
            </Link>
            <Link
              to="/contest"
              className="rounded-2xl brutal-border brutal-shadow-sm bg-brand-mustard px-5 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5"
            >
              Weekly Contest
            </Link>
            <span className="rounded-2xl brutal-border bg-brand-pink px-4 py-3 text-[11px] font-bold uppercase tracking-widest">
              Demo/Mock search behavior
            </span>
          </div>
        </section>

        <section className="mt-8 rounded-3xl brutal-border brutal-shadow-lg bg-card p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by craft, material, or style"
              className="rounded-xl brutal-border bg-background px-3 py-2 text-sm font-medium md:col-span-2"
            />
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as "all" | "in-app" | "youtube")}
              className="rounded-xl brutal-border bg-background px-3 py-2 text-sm font-medium"
            >
              <option value="all">All references</option>
              <option value="in-app">In-app posts</option>
              <option value="youtube">YouTube references</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "popular" | "new" | "easy")}
              className="rounded-xl brutal-border bg-background px-3 py-2 text-sm font-medium"
            >
              <option value="popular">Sort: Most liked</option>
              <option value="new">Sort: Most viewed</option>
              <option value="easy">Sort: Easy first</option>
            </select>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((ref) => (
              <article
                key={ref.id}
                className="rounded-3xl brutal-border brutal-shadow-lg bg-card overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={ref.image} alt={ref.title} className="h-full w-full object-cover" />
                  <span className="absolute left-3 top-3 rounded-lg brutal-border bg-card px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                    {ref.source === "youtube" ? "YouTube Reference" : "In-App Post"}
                  </span>
                </div>
                <div className="p-4 flex flex-1 flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-display text-xl leading-none">{ref.title}</h2>
                    <span className="rounded-md brutal-border bg-brand-mint px-2 py-1 text-[10px] font-bold">
                      {ref.difficulty}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground/80 line-clamp-2">
                    {ref.summary}
                  </p>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-foreground/60">
                    {ref.material} · {ref.time} · {ref.cost}
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2">
                    <button
                      onClick={() => likeReference(ref.id)}
                      className="rounded-xl brutal-border brutal-shadow-sm bg-card px-3 py-2 text-xs font-bold"
                    >
                      Likes {ref.engagement.likes}
                    </button>
                    <button
                      onClick={() => setSelected(ref)}
                      className="rounded-xl brutal-border brutal-shadow-sm bg-brand-mustard px-3 py-2 text-xs font-bold"
                    >
                      Quick View
                    </button>
                    <Link
                      to="/reference/$id"
                      params={{ id: ref.id }}
                      className="rounded-xl brutal-border brutal-shadow-sm bg-brand-coral px-3 py-2 text-xs font-bold"
                    >
                      Open Detail
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Beginner Friendly",
              text: "Easy projects under 30 minutes with household materials.",
              bg: "bg-brand-mint",
            },
            {
              title: "High Impact",
              text: "Crafts that divert more waste and maximize reuse.",
              bg: "bg-brand-mustard",
            },
            {
              title: "Trend Picks",
              text: "Curated picks from popular implementations this week.",
              bg: "bg-brand-pink",
            },
          ].map((card) => (
            <div
              key={card.title}
              className={`rounded-2xl brutal-border brutal-shadow ${card.bg} p-5`}
            >
              <h3 className="font-display text-2xl leading-none">{card.title}</h3>
              <p className="mt-2 text-sm font-medium">{card.text}</p>
            </div>
          ))}
        </section>
      </main>

      {selected ? (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-brand-ink/45 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-xl rounded-3xl brutal-border brutal-shadow-lg bg-card p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-2xl">{selected.title}</h2>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg brutal-border bg-brand-coral px-3 py-1 text-xs font-bold"
              >
                Close
              </button>
            </div>
            <p className="mt-3 text-sm font-medium">{selected.summary}</p>
            <div className="mt-4 grid gap-2 text-[11px] font-bold uppercase tracking-widest text-foreground/70 sm:grid-cols-2">
              <span>
                {selected.source === "youtube" ? "YouTube reference" : "In-app reference"}
              </span>
              <span>
                {selected.material} · {selected.time} · {selected.cost}
              </span>
            </div>
            <Link
              to="/reference/$id"
              params={{ id: selected.id }}
              className="mt-4 inline-block rounded-xl brutal-border brutal-shadow-sm bg-brand-mustard px-4 py-2 text-sm font-bold"
              onClick={() => setSelected(null)}
            >
              Go to full details
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
