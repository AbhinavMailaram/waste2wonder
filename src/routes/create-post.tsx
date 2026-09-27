import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import LiveBackground from "@/components/LiveBackground";
import SiteNav from "@/components/SiteNav";
import { useFrontendState } from "@/lib/frontend-state";

export const Route = createFileRoute("/create-post")({
  component: CreatePostPage,
  head: () => ({
    meta: [
      { title: "Create Post — Waste2Wonder" },
      {
        name: "description",
        content:
          "Create post flow with before/after/process images and frontend-generated guidance.",
      },
    ],
  }),
});

function CreatePostPage() {
  const router = useRouter();
  const { createPost } = useFrontendState();
  const [title, setTitle] = useState("");
  const [materials, setMaterials] = useState("");
  const [cost, setCost] = useState("");
  const [time, setTime] = useState("");
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [processImages, setProcessImages] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  const difficulty =
    time.includes("60") || time.toLowerCase().includes("hour")
      ? "Hard"
      : time.trim()
        ? "Medium"
        : "Easy";
  const precautions = materials.trim()
    ? "Mock generated precaution: sanitize reused items, smooth rough edges, and wear gloves while cutting."
    : "Add materials to generate precautions.";

  function handleSubmit() {
    if (!title || !beforeImage || !afterImage) return;
    createPost({
      title,
      beforeImage,
      afterImage,
      processImages,
      materials,
      cost: cost || "$0",
      time: time || "30 min",
      difficulty,
      precautions,
    });
    setSaved(true);
    setTimeout(() => {
      router.navigate({ to: "/profile" });
    }, 600);
  }

  return (
    <div className="relative min-h-screen text-foreground">
      <LiveBackground />
      <SiteNav />
      <main className="mx-auto max-w-6xl px-6 pt-32 pb-16">
        <section className="rounded-3xl brutal-border brutal-shadow-lg bg-card p-6 md:p-8">
          <span className="inline-block rounded-full brutal-border bg-brand-coral px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
            Create Your Own Post
          </span>
          <h1 className="mt-3 text-4xl md:text-5xl">Share your upcycling journey</h1>
          <p className="mt-2 text-sm font-medium text-foreground/75">
            Frontend-only flow: generated difficulty/precautions below are demo mock outputs.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
              className="rounded-xl brutal-border bg-background px-3 py-2 text-sm"
            />
            <input
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              placeholder="Materials used"
              className="rounded-xl brutal-border bg-background px-3 py-2 text-sm"
            />
            <input
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="Cost (e.g., $4)"
              className="rounded-xl brutal-border bg-background px-3 py-2 text-sm"
            />
            <input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Time (e.g., 45 min)"
              className="rounded-xl brutal-border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <UploadTile label="Before image" onPick={(src) => setBeforeImage(src)} />
            <UploadTile label="After image" onPick={(src) => setAfterImage(src)} />
          </div>

          <div className="mt-5 rounded-2xl brutal-border bg-brand-lilac/30 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold">Process images</div>
              <label className="rounded-lg brutal-border bg-card px-3 py-1 text-xs font-bold cursor-pointer">
                Add images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(e) => {
                    const previews = Array.from(e.target.files ?? []).map((file) =>
                      URL.createObjectURL(file),
                    );
                    setProcessImages((prev) =>
                      [...prev, ...previews.filter((src) => src.startsWith("blob:"))].slice(0, 6),
                    );
                  }}
                />
              </label>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {processImages.map((src) => (
                <div key={src} className="relative">
                  <div
                    role="img"
                    aria-label="Process step"
                    className="h-24 w-full rounded-xl brutal-border bg-cover bg-center"
                    style={{ backgroundImage: `url('${sanitizeImageSrc(src)}')` }}
                  />
                  <button
                    onClick={() => setProcessImages((prev) => prev.filter((img) => img !== src))}
                    className="absolute right-1 top-1 rounded-md brutal-border bg-brand-coral px-1.5 py-0.5 text-[10px] font-bold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl brutal-border bg-brand-mint/50 p-4">
              <div className="text-[11px] font-bold uppercase tracking-widest">
                Generated difficulty (mock)
              </div>
              <div className="mt-2 font-display text-2xl">{difficulty}</div>
            </div>
            <div className="rounded-2xl brutal-border bg-brand-mustard/60 p-4">
              <div className="text-[11px] font-bold uppercase tracking-widest">
                Generated precautions (mock)
              </div>
              <div className="mt-2 text-sm font-semibold">{precautions}</div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!title || !beforeImage || !afterImage}
            className="mt-6 rounded-2xl brutal-border brutal-shadow bg-brand-coral px-5 py-3 text-sm font-bold disabled:opacity-50"
          >
            Publish Post (frontend demo)
          </button>
          {saved ? (
            <p className="mt-3 text-sm font-bold">Post added. Redirecting to Profile…</p>
          ) : null}
        </section>
      </main>
    </div>
  );
}

function UploadTile({ label, onPick }: { label: string; onPick: (src: string) => void }) {
  return (
    <label className="cursor-pointer rounded-2xl border-[3px] border-dashed border-brand-ink bg-brand-mint/40 p-5 text-center">
      <div className="text-sm font-bold">{label}</div>
      <p className="mt-1 text-xs font-medium">Click to upload</p>
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const previewUrl = URL.createObjectURL(file);
          if (previewUrl.startsWith("blob:")) onPick(previewUrl);
        }}
      />
    </label>
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
