import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import LiveBackground from "@/components/LiveBackground";
import SiteNav from "@/components/SiteNav";
import { useFrontendState } from "@/lib/frontend-state";

export const Route = createFileRoute("/contest")({
  component: ContestPage,
  head: () => ({
    meta: [
      { title: "Contest — Waste2Wonder" },
      { name: "description", content: "Weekly contest with fair exposure and Try It flow." },
    ],
  }),
});

function ContestPage() {
  const { contest, references, likeReference, bumpReferenceMetric, registerImplementation } =
    useFrontendState();
  const [message, setMessage] = useState("");

  const entries = useMemo(() => references.slice(0, 6), [references]);

  function tryIt(referenceId: string, title: string, image: string) {
    registerImplementation({
      referenceId,
      title: `Contest Try It: ${title}`,
      finalImage: image,
      progressImages: [],
      fromContest: true,
    });
    setMessage(`Added "${title}" to your Implemented Work from contest Try It.`);
  }

  return (
    <div className="relative min-h-screen text-foreground">
      <LiveBackground />
      <SiteNav />
      <main className="mx-auto max-w-6xl px-6 pt-32 pb-16">
        <section className="rounded-3xl brutal-border brutal-shadow-lg bg-card p-6 md:p-8">
          <span className="inline-block rounded-full brutal-border bg-brand-mustard px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
            Contest
          </span>
          <h1 className="mt-3 text-4xl md:text-6xl">{contest.weekTitle}</h1>
          <p className="mt-3 text-lg font-medium text-foreground/80">
            Weekly limit: {contest.maxEntries} entries · current: {contest.currentEntries}. Exposure
            is balanced by rotating feed order and highlighting less-seen entries.
          </p>
          <Link
            to="/profile"
            className="mt-4 inline-block rounded-xl brutal-border brutal-shadow-sm bg-brand-coral px-4 py-2 text-sm font-bold"
          >
            View your Implemented Work
          </Link>
          {message ? <p className="mt-3 text-sm font-bold">{message}</p> : null}
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-3xl brutal-border brutal-shadow-lg bg-card overflow-hidden flex flex-col"
            >
              <img src={entry.image} alt={entry.title} className="h-44 w-full object-cover" />
              <div className="p-4 flex flex-col gap-3 flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl leading-none">{entry.title}</h2>
                  <span className="rounded-md brutal-border bg-brand-pink px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                    {entry.source === "youtube" ? "YouTube" : "In-app"}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground/75 line-clamp-2">
                  {entry.summary}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <button
                    onClick={() => likeReference(entry.id)}
                    className="rounded-lg brutal-border bg-card px-2 py-1"
                  >
                    Likes {entry.engagement.likes}
                  </button>
                  <button
                    onClick={() => bumpReferenceMetric(entry.id, "comments")}
                    className="rounded-lg brutal-border bg-card px-2 py-1"
                  >
                    Comments {entry.engagement.comments}
                  </button>
                  <button
                    onClick={() => bumpReferenceMetric(entry.id, "views")}
                    className="rounded-lg brutal-border bg-card px-2 py-1"
                  >
                    Views {entry.engagement.views}
                  </button>
                  <div className="rounded-lg brutal-border bg-brand-mint px-2 py-1 text-center">
                    Try Its {entry.engagement.implementations}
                  </div>
                </div>
                <div className="mt-auto flex flex-wrap gap-2">
                  <button
                    onClick={() => tryIt(entry.id, entry.title, entry.image)}
                    className="rounded-xl brutal-border brutal-shadow-sm bg-brand-coral px-3 py-2 text-xs font-bold"
                  >
                    Try It
                  </button>
                  <Link
                    to="/reference/$id"
                    params={{ id: entry.id }}
                    className="rounded-xl brutal-border brutal-shadow-sm bg-brand-mustard px-3 py-2 text-xs font-bold"
                  >
                    Open Detail
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
