import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import LiveBackground from "@/components/LiveBackground";
import SiteNav from "@/components/SiteNav";
import { useFrontendState } from "@/lib/frontend-state";

export const Route = createFileRoute("/create")({
  component: CreatePage,
  head: () => ({
    meta: [
      { title: "Image Analysis — Waste2Wonder" },
      {
        name: "description",
        content:
          "Upload waste images, view mock detection, and explore matching in-app and YouTube references.",
      },
    ],
  }),
});

function CreatePage() {
  const { references, likeReference } = useFrontendState();
  const [files, setFiles] = useState<File[]>([]);
  const [materialGuess, setMaterialGuess] = useState("");
  const [craftGuess, setCraftGuess] = useState("");
  const previewImages = useMemo(
    () =>
      files.map((file) => ({
        key: `${file.name}-${file.lastModified}`,
        src: URL.createObjectURL(file),
      })),
    [files],
  );

  useEffect(() => {
    return () => {
      previewImages.forEach((image) => URL.revokeObjectURL(image.src));
    };
  }, [previewImages]);

  const matches = useMemo(() => {
    if (!materialGuess.trim()) return references.slice(0, 4);
    return references.filter((ref) =>
      ref.material.toLowerCase().includes(materialGuess.toLowerCase()),
    );
  }, [materialGuess, references]);

  const hasNoMatch = materialGuess.trim().length > 0 && matches.length === 0;

  function onUpload(fileList: FileList | null) {
    if (!fileList) return;
    setFiles(Array.from(fileList).slice(0, 4));
  }

  return (
    <div className="relative min-h-screen text-foreground">
      <LiveBackground />
      <SiteNav />
      <main className="mx-auto max-w-6xl px-6 pt-32 pb-16">
        <section className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          <div className="rounded-3xl brutal-border brutal-shadow-lg bg-card p-6">
            <span className="inline-block rounded-full brutal-border bg-brand-pink px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
              Image Analysis / Create
            </span>
            <h1 className="mt-3 text-4xl md:text-5xl">
              Upload an item to generate build references.
            </h1>
            <p className="mt-2 text-sm font-medium text-foreground/75">
              Demo/Mock mode: detection and search are frontend seeded outputs only.
            </p>

            <label className="mt-5 block cursor-pointer rounded-2xl border-[3px] border-dashed border-brand-ink bg-brand-mint/40 p-6 text-center">
              <div className="font-display text-2xl">Drop or click to upload</div>
              <p className="mt-2 text-sm font-medium text-foreground/70">
                Up to 4 images · preview enabled
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => onUpload(e.target.files)}
              />
            </label>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input
                value={materialGuess}
                onChange={(e) => setMaterialGuess(e.target.value)}
                placeholder="Detected object/material (e.g., plastic bottle)"
                className="rounded-xl brutal-border bg-background px-3 py-2 text-sm"
              />
              <input
                value={craftGuess}
                onChange={(e) => setCraftGuess(e.target.value)}
                placeholder="Craft intent (e.g., planter, decor, storage)"
                className="rounded-xl brutal-border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {previewImages.length === 0 ? (
                <div className="col-span-full rounded-2xl brutal-border bg-brand-lilac/40 p-4 text-sm font-medium">
                  Upload an image to preview and run demo analysis.
                </div>
              ) : (
                previewImages.map((image) => (
                  <div
                    key={image.key}
                    role="img"
                    aria-label="Uploaded preview"
                    className="h-36 w-full rounded-xl brutal-border bg-cover bg-center"
                    style={{ backgroundImage: `url('${sanitizeImageSrc(image.src)}')` }}
                  />
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl brutal-border brutal-shadow-lg bg-brand-mustard p-6">
            <h2 className="font-display text-2xl">Detection Output</h2>
            <div className="mt-4 space-y-3 text-sm font-semibold">
              <p>Object: {materialGuess || "Plastic bottle (mock)"}</p>
              <p>Suggested craft: {craftGuess || "Self-watering planter (mock)"}</p>
              <p>Condition: Reusable after cleaning (mock).</p>
              <p>Confidence: 92% (demo).</p>
            </div>
            <div className="mt-5 rounded-2xl brutal-border bg-card p-4 text-sm font-medium">
              No backend AI call is made here. This is frontend-only mock behavior.
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-3xl">Matching References</h2>
            <span className="rounded-lg brutal-border bg-card px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
              In-app + YouTube demo
            </span>
          </div>

          {hasNoMatch ? (
            <div className="rounded-3xl brutal-border brutal-shadow-lg bg-card p-6">
              <h3 className="font-display text-2xl">No direct match found</h3>
              <p className="mt-2 text-sm font-medium text-foreground/75">
                Demo AI guidance generated from your input: clean object, sketch a simple frame,
                test fit, then finish with protective coating.
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl brutal-border bg-brand-mint/60 p-4">
                  <div className="text-[11px] font-bold uppercase tracking-widest">
                    In-progress placeholder
                  </div>
                  <div className="mt-2 h-32 rounded-xl brutal-border bg-card" />
                </div>
                <div className="rounded-2xl brutal-border bg-brand-pink/60 p-4">
                  <div className="text-[11px] font-bold uppercase tracking-widest">
                    Final result placeholder
                  </div>
                  <div className="mt-2 h-32 rounded-xl brutal-border bg-card" />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {matches.map((ref) => (
                <article
                  key={ref.id}
                  className="rounded-3xl brutal-border brutal-shadow-lg bg-card overflow-hidden"
                >
                  <img src={ref.image} alt={ref.title} className="h-44 w-full object-cover" />
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display text-xl leading-none">{ref.title}</h3>
                      <span className="rounded-md brutal-border bg-brand-mint px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                        {ref.source === "youtube" ? "YouTube" : "In-app"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-foreground/75 line-clamp-2">
                      {ref.summary}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => likeReference(ref.id)}
                        className="rounded-xl brutal-border brutal-shadow-sm bg-card px-3 py-2 text-xs font-bold"
                      >
                        Likes {ref.engagement.likes}
                      </button>
                      <Link
                        to="/reference/$id"
                        params={{ id: ref.id }}
                        className="rounded-xl brutal-border brutal-shadow-sm bg-brand-coral px-3 py-2 text-xs font-bold"
                      >
                        View Detail
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function sanitizeImageSrc(src: string) {
  if (src.startsWith("data:image/")) return src;
  try {
    const base =
      typeof window !== "undefined" ? window.location.origin : "https://waste2wonder.local";
    const parsed = new URL(src, base);
    if (["http:", "https:", "blob:"].includes(parsed.protocol)) return src;
  } catch {
    return "";
  }
  return "";
}
