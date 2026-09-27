import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import LiveBackground from "@/components/LiveBackground";
import SiteNav from "@/components/SiteNav";
import { useFrontendState } from "@/lib/frontend-state";

export const Route = createFileRoute("/reference/$id")({
  component: ReferenceDetailPage,
  head: () => ({
    meta: [
      { title: "Reference Detail — Waste2Wonder" },
      {
        name: "description",
        content:
          "Detailed craft reference with steps, materials, precautions, and implementation upload.",
      },
    ],
  }),
});

function ReferenceDetailPage() {
  const { id } = Route.useParams();
  const { references, bumpReferenceMetric, registerImplementation } = useFrontendState();
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [progressImages, setProgressImages] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  const ref = useMemo(() => references.find((item) => item.id === id) ?? null, [references, id]);

  useEffect(() => {
    if (ref) bumpReferenceMetric(ref.id, "views");
  }, [ref, bumpReferenceMetric]);

  if (!ref) {
    return (
      <div className="relative min-h-screen text-foreground">
        <LiveBackground />
        <SiteNav />
        <main className="mx-auto max-w-4xl px-6 pt-32 pb-16">
          <div className="rounded-3xl brutal-border brutal-shadow-lg bg-card p-6 text-center">
            <h1 className="font-display text-3xl">Reference not found</h1>
            <Link
              to="/"
              className="mt-4 inline-block rounded-xl brutal-border brutal-shadow-sm bg-brand-coral px-4 py-2 text-sm font-bold"
            >
              Back to Discover
            </Link>
          </div>
        </main>
      </div>
    );
  }

  function submitImplementation() {
    if (!finalImage) return;
    registerImplementation({
      referenceId: ref.id,
      title: `Implemented: ${ref.title}`,
      finalImage,
      progressImages,
    });
    setSaved(true);
  }

  return (
    <div className="relative min-h-screen text-foreground">
      <LiveBackground />
      <SiteNav />
      <main className="mx-auto max-w-6xl px-6 pt-32 pb-16">
        <nav className="text-xs font-bold uppercase tracking-widest text-foreground/60">
          <Link to="/" className="hover:underline">
            Discover
          </Link>
          <span className="mx-2">/</span>
          <span>{ref.title}</span>
        </nav>

        <section className="mt-6 grid gap-8 md:grid-cols-[1.1fr_1fr]">
          <div className="relative overflow-hidden rounded-3xl brutal-border brutal-shadow-lg bg-brand-mint">
            <img
              src={ref.image}
              alt={ref.title}
              className="h-full max-h-[520px] w-full object-cover"
            />
            <span className="absolute left-3 top-3 rounded-lg brutal-border bg-card px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
              {ref.source === "youtube" ? "YouTube reference" : "In-app post"}
            </span>
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl">{ref.title}</h1>
            <p className="mt-3 text-lg font-medium text-foreground/80">{ref.summary}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { k: ref.time, v: "Time" },
                { k: ref.cost, v: "Cost" },
                { k: ref.difficulty, v: "Difficulty" },
                { k: ref.engagement.likes, v: "Likes" },
                { k: ref.engagement.comments, v: "Comments" },
                { k: ref.engagement.implementations, v: "Implementations" },
              ].map((stat) => (
                <div
                  key={stat.v}
                  className="rounded-xl brutal-border brutal-shadow-sm bg-card p-3 text-center"
                >
                  <div className="font-display text-xl leading-none">{stat.k}</div>
                  <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                    {stat.v}
                  </div>
                </div>
              ))}
            </div>
            {ref.source === "youtube" ? (
              <div className="mt-5 rounded-2xl brutal-border bg-brand-pink/60 p-4 text-sm font-medium">
                YouTube metadata and steps shown here are generated frontend mock output (no
                external API call).
                <div className="mt-2 text-xs font-bold uppercase tracking-widest">
                  {ref.youtubeUrl}
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl brutal-border bg-brand-mint/60 p-4 text-sm font-medium">
                In-app post data shown as-is from existing seeded content.
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl brutal-border brutal-shadow-lg bg-card p-6">
            <h2 className="font-display text-2xl">Materials</h2>
            <ul className="mt-3 space-y-2 text-sm font-medium">
              {ref.materials.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-coral" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl brutal-border brutal-shadow-lg bg-card p-6 md:col-span-2">
            <h2 className="font-display text-2xl">Step-by-step</h2>
            <ol className="mt-3 space-y-3">
              {ref.steps.map((step, idx) => (
                <li
                  key={step}
                  className="flex items-start gap-3 rounded-xl brutal-border bg-brand-lilac/30 p-3"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md brutal-border bg-card font-display text-xs">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-semibold">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mt-8 rounded-3xl brutal-border brutal-shadow-lg bg-brand-mustard p-6">
          <h2 className="font-display text-2xl">Precautions</h2>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {ref.precautions.map((item) => (
              <li
                key={item}
                className="rounded-xl brutal-border bg-card px-3 py-2 text-sm font-semibold"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-3xl brutal-border brutal-shadow-lg bg-card p-6">
          <h2 className="font-display text-2xl">Upload your final result</h2>
          <p className="mt-2 text-sm font-medium text-foreground/75">
            Your uploaded implementation is kept in frontend state and appears in Profile →
            Implemented Work.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="rounded-2xl border-[3px] border-dashed border-brand-ink bg-brand-mint/40 p-4 text-center text-sm font-semibold cursor-pointer">
              Final image
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const previewUrl = URL.createObjectURL(file);
                  if (previewUrl.startsWith("blob:")) setFinalImage(previewUrl);
                }}
              />
            </label>
            <label className="rounded-2xl border-[3px] border-dashed border-brand-ink bg-brand-pink/40 p-4 text-center text-sm font-semibold cursor-pointer">
              In-progress images
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  setProgressImages(
                    files
                      .map((file) => URL.createObjectURL(file))
                      .filter((src) => src.startsWith("blob:")),
                  );
                }}
              />
            </label>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {finalImage ? (
              <img
                src={finalImage}
                alt="Final upload"
                className="h-28 w-full rounded-xl brutal-border object-cover"
              />
            ) : null}
            {progressImages.map((src) => (
              <img
                key={src}
                src={src}
                alt="Progress upload"
                className="h-28 w-full rounded-xl brutal-border object-cover"
              />
            ))}
          </div>
          <button
            onClick={submitImplementation}
            disabled={!finalImage}
            className="mt-4 rounded-xl brutal-border brutal-shadow-sm bg-brand-coral px-4 py-2 text-sm font-bold disabled:opacity-50"
          >
            Save Implementation
          </button>
          {saved ? (
            <p className="mt-3 text-sm font-bold">Saved to your profile implemented work.</p>
          ) : null}
        </section>
      </main>
    </div>
  );
}
