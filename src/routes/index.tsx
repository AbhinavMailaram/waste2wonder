import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import LiveBackground from "@/components/LiveBackground";
import CircularGallery from "@/components/CircularGallery";
import TiltedCard from "@/components/TiltedCard";
import SiteNav from "@/components/SiteNav";
import { Link } from "@tanstack/react-router";
import { PRODUCTS } from "@/lib/products";
import heroBottle from "@/assets/hero-bottle.png";
import heroBox from "@/assets/hero-box.png";
import heroJar from "@/assets/hero-jar.png";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Waste2Wonder — Turn Your Waste Into Wonder" },
      {
        name: "description",
        content:
          "AI-powered upcycling. Snap household waste and get DIY project ideas, safety tips, cost estimates and your live environmental impact.",
      },
    ],
  }),
});

const NAV = [
  { label: "Home", href: "#home" },
  { label: "Explore Ideas", href: "#explore" },
  { label: "Scan / Upload", href: "#upload" },
  { label: "Community", href: "#community" },
  { label: "Profile", href: "#profile" },
];

const HERO_OBJECTS = [
  { src: heroBottle, alt: "Plastic bottle upcycled into a plant pot" },
  { src: heroBox, alt: "Cardboard box turned into a tiny house" },
  { src: heroJar, alt: "Glass jar reborn as a fairy-light lantern" },
];

const RECOMMENDED = [
  { image: "https://images.unsplash.com/photo-1520923642038-b4259acecbd7?w=900&q=80", text: "Bottle Planter" },
  { image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80", text: "Jar Lantern" },
  { image: "https://images.unsplash.com/photo-1493552832879-9147d504dbd7?w=900&q=80", text: "Cardboard Desk Org" },
  { image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80", text: "Denim Tote" },
  { image: "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=900&q=80", text: "Tin Can Lamp" },
  { image: "https://images.unsplash.com/photo-1490252305180-8c58b6ed12bb?w=900&q=80", text: "Pallet Shelf" },
  { image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80", text: "Cork Board" },
  { image: "https://images.unsplash.com/photo-1516685304081-de7947d419d5?w=900&q=80", text: "Paper Bead Art" },
];

function Home() {
  const [heroIdx, setHeroIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setHeroIdx((i) => (i + 1) % HERO_OBJECTS.length), 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <div id="home" className="relative min-h-screen text-foreground">
      <LiveBackground />
      <SiteNav />
      <Hero heroIdx={heroIdx} />
      <VotingBanner />
      <UploadSection />
      <ProductsSection />
      <RecommendedSection />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="glass-nav mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl px-4 py-3"
      >
        <a href="#home" className="flex items-center gap-2 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-xl brutal-border brutal-shadow-sm bg-brand-mint">
            <span className="h-3 w-3 rotate-45 bg-brand-ink" />
          </span>
          <span className="font-display text-lg tracking-tight">Waste2Wonder</span>
        </a>
        <ul className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <li key={n.label}>
              <a
                href={n.href}
                className="relative rounded-lg px-3 py-2 text-sm font-semibold transition-transform duration-150 hover:-translate-y-0.5 hover:bg-brand-mustard/60"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#upload"
          className="rounded-xl brutal-border brutal-shadow-sm bg-brand-coral px-4 py-2 text-sm font-bold text-brand-ink transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          Scan Now
        </a>
      </motion.nav>
    </header>
  );
}

function Hero({ heroIdx }: { heroIdx: number }) {
  return (
    <section className="relative mx-auto max-w-6xl px-6 pt-36 pb-10 md:pt-44 md:pb-16">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-8">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full brutal-border bg-card px-3 py-1 text-xs font-bold uppercase tracking-widest"
          >
            <span className="h-2 w-2 rounded-full bg-brand-coral" />
            AI-Powered Upcycling
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-5 text-5xl leading-[0.95] md:text-7xl"
          >
            Turn Your{" "}
            <span className="inline-block rotate-[-2deg] rounded-xl brutal-border brutal-shadow bg-brand-mint px-3">
              Trash
            </span>
            <br /> Into{" "}
            <span className="inline-block rotate-[2deg] rounded-xl brutal-border brutal-shadow bg-brand-mustard px-3">
              Wonder
            </span>
          </motion.h1>
          <p className="mt-6 max-w-md text-lg font-medium text-foreground/80">
            Snap a photo of any household waste. Our AI identifies the material and delivers step-by-step DIY project ideas, safety tips, cost, time and your real environmental impact.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#upload"
              className="rounded-2xl brutal-border brutal-shadow bg-brand-coral px-6 py-3 text-base font-bold transition-transform hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              Scan Your Waste
            </a>
            <a
              href="#explore"
              className="rounded-2xl brutal-border brutal-shadow-sm bg-card px-6 py-3 text-base font-bold transition-transform hover:-translate-y-1"
            >
              Explore Ideas
            </a>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            {[
              { k: "12.4k", v: "Projects made" },
              { k: "38t", v: "Waste diverted" },
              { k: "9.1k", v: "Active makers" },
            ].map((s) => (
              <div key={s.v} className="rounded-xl brutal-border brutal-shadow-sm bg-card px-4 py-2">
                <div className="font-display text-xl leading-none">{s.k}</div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-foreground/60">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="relative aspect-square overflow-hidden rounded-3xl brutal-border brutal-shadow-lg bg-brand-mint">
            <span className="absolute left-4 top-4 rounded-lg brutal-border bg-brand-mustard px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
              Live AI
            </span>
            <span className="absolute right-4 top-4 rounded-lg brutal-border bg-brand-pink px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
              v2.0
            </span>
            <div className="absolute inset-6 rounded-full brutal-border opacity-60" />
            <div className="absolute inset-14 rounded-full brutal-border opacity-40" />
            {HERO_OBJECTS.map((o, i) => (
              <motion.img
                key={o.alt}
                src={o.src}
                alt={o.alt}
                width={1024}
                height={1024}
                className="absolute inset-0 m-auto h-4/5 w-4/5 object-contain animate-float"
                initial={false}
                animate={{ opacity: i === heroIdx ? 1 : 0, scale: i === heroIdx ? 1 : 0.9 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              />
            ))}
            <span className="absolute bottom-4 left-4 rounded-lg brutal-border bg-card px-2 py-1 text-[10px] font-bold">
              MATERIAL: {["PLASTIC", "CARDBOARD", "GLASS"][heroIdx]}
            </span>
            <span className="absolute bottom-4 right-4 rounded-lg brutal-border bg-brand-coral px-2 py-1 text-[10px] font-bold">
              IDEAS: {["12", "9", "15"][heroIdx]}
            </span>
          </div>
          <div className="absolute -right-6 -top-6 h-16 w-16 rounded-2xl brutal-border brutal-shadow bg-brand-pink animate-wiggle" />
          <div className="absolute -bottom-6 -left-6 h-12 w-12 rounded-full brutal-border brutal-shadow bg-brand-mustard animate-float-slow" />
        </div>
      </div>
    </section>
  );
}

function VotingBanner() {
  const [t, setT] = useState({ d: 3, h: 12, m: 45, s: 20 });
  useEffect(() => {
    const id = setInterval(() => {
      setT((p) => {
        let { d, h, m, s } = p;
        s -= 1;
        if (s < 0) { s = 59; m -= 1; }
        if (m < 0) { m = 59; h -= 1; }
        if (h < 0) { h = 23; d -= 1; }
        if (d < 0) { d = 6; h = 23; m = 59; s = 59; }
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section aria-label="Weekly voting contest" className="relative mx-auto max-w-6xl px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl brutal-border brutal-shadow-lg bg-brand-mustard"
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, var(--brand-ink) 0 2px, transparent 2px 22px)",
          }}
        />
        <div className="relative grid gap-6 p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:p-8">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl brutal-border bg-brand-coral">
              <TrophyMark />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest">Weekly Contest</div>
              <h3 className="mt-1 font-display text-2xl leading-none md:text-3xl">Best Bottle Rebuild</h3>
              <p className="mt-1 text-sm font-medium text-foreground/70">
                Vote for this week's most creative upcycling project.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:justify-center">
            {(["d", "h", "m", "s"] as const).map((k, i) => (
              <div key={k} className="flex flex-col items-center">
                <div className="min-w-[54px] rounded-xl brutal-border bg-card px-3 py-2 text-center font-display text-2xl tabular-nums">
                  {String(t[k]).padStart(2, "0")}
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-widest">
                  {["Days", "Hrs", "Min", "Sec"][i]}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 md:justify-end">
            <Link
              to="/community"
              className="rounded-2xl brutal-border brutal-shadow bg-brand-mint px-5 py-3 text-sm font-bold transition-transform hover:-translate-y-1 active:translate-x-1 active:shadow-none"
            >
              Vote Now
            </Link>
            <Link
              to="/community"
              className="rounded-2xl brutal-border brutal-shadow-sm bg-card px-5 py-3 text-sm font-bold transition-transform hover:-translate-y-1"
            >
              View Contest
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function TrophyMark() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
      <path d="M4 6h3v2a3 3 0 0 1-3-3V6ZM17 6h3v-1a3 3 0 0 1-3 3V6Z" />
      <path d="M9 15h6l-1 4h-4l-1-4ZM8 21h8" />
    </svg>
  );
}

function UploadSection() {
  const [count, setCount] = useState(0);
  return (
    <section id="upload" className="relative mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <span className="inline-block rounded-full brutal-border bg-brand-pink px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
            Step 01 — Scan
          </span>
          <h2 className="mt-3 text-4xl md:text-6xl">
            Snap your waste.
            <br />
            Watch the{" "}
            <span className="rounded-xl brutal-border brutal-shadow bg-brand-mint px-3">magic</span> happen.
          </h2>
        </div>
        <p className="max-w-sm font-medium text-foreground/80">
          Upload up to 4 photos. Our AI vision reads the material and returns full DIY blueprints in seconds.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[1.1fr_1fr]">
        <div className="relative rounded-3xl brutal-border brutal-shadow-lg bg-card p-6 md:p-8">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`h-3 w-3 rounded-full brutal-border ${["bg-brand-coral","bg-brand-mustard","bg-brand-mint"][i]}`}
                />
              ))}
            </div>
            <span className="rounded-lg brutal-border bg-brand-mustard px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
              {count}/4 slots
            </span>
          </div>

          <label
            htmlFor="w2w-upload"
            className="group relative flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-2xl border-[3px] border-dashed border-brand-ink bg-brand-mint/40 p-8 text-center transition-colors hover:bg-brand-mint/70"
          >
            <UploadMark />
            <div className="mt-4 font-display text-2xl">Drop photos here</div>
            <p className="mt-2 max-w-xs text-sm font-medium text-foreground/70">
              or click to select from your device. JPG, PNG, WEBP · up to 10 MB each.
            </p>
            <input
              id="w2w-upload"
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => setCount(Math.min(4, e.target.files?.length ?? 0))}
            />
          </label>

          <ol className="mt-6 grid gap-3 md:grid-cols-3">
            {["Good lighting, no glare", "One item per photo", "Plain background"].map((tip, i) => (
              <li key={tip} className="flex items-start gap-2 rounded-xl brutal-border bg-brand-pink/60 p-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md brutal-border bg-card font-display text-xs">
                  {i + 1}
                </span>
                <span className="text-sm font-semibold">{tip}</span>
              </li>
            ))}
          </ol>

          <button
            type="button"
            className="mt-6 w-full rounded-2xl brutal-border brutal-shadow bg-brand-coral px-6 py-4 font-display text-xl transition-transform hover:-translate-y-1 active:translate-x-1 active:shadow-none"
          >
            Analyze With AI
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
          {HERO_OBJECTS.map((o, i) => (
            <div
              key={o.alt}
              className={`rounded-3xl brutal-border brutal-shadow-lg p-5 ${["bg-brand-pink","bg-brand-mustard","bg-brand-mint"][i]}`}
            >
              <TiltedCard
                imageSrc={o.src}
                altText={o.alt}
                containerHeight="220px"
                containerWidth="100%"
                imageHeight="200px"
                imageWidth="200px"
                rotateAmplitude={16}
                scaleOnHover={1.08}
                displayOverlayContent
                overlayContent={
                  <div className="pointer-events-none absolute left-3 top-3 rounded-lg brutal-border bg-card px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                    {["Plastic","Cardboard","Glass"][i]}
                  </div>
                }
              />
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <div className="font-display text-lg leading-none">
                    {["Bottle → Planter","Box → Micro House","Jar → Lantern"][i]}
                  </div>
                  <div className="mt-1 text-[11px] font-bold uppercase tracking-widest text-foreground/70">
                    {["18 min · $0","32 min · $2","15 min · $1"][i]}
                  </div>
                </div>
                <span className="rounded-lg brutal-border bg-card px-2 py-1 text-[10px] font-bold">
                  AI Match
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UploadMark() {
  return (
    <div className="grid h-16 w-16 place-items-center rounded-2xl brutal-border brutal-shadow bg-card">
      <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 16V4" />
        <path d="m6 10 6-6 6 6" />
        <path d="M4 20h16" />
      </svg>
    </div>
  );
}

function RecommendedSection() {
  return _RecommendedSection();
}

function ProductsSection() {
  const featured = PRODUCTS.slice(0, 6);
  return (
    <section id="products" className="relative mx-auto max-w-6xl px-6 py-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-block rounded-full brutal-border bg-brand-coral px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
            Products
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl">Browse every blueprint.</h2>
        </div>
        <Link
          to="/community"
          className="rounded-xl brutal-border brutal-shadow-sm bg-card px-4 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5"
        >
          Open Community
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((p, i) => (
          <Link
            key={p.id}
            to="/product/$id"
            params={{ id: p.id }}
            className={`group rounded-3xl brutal-border brutal-shadow-lg overflow-hidden transition-transform hover:-translate-y-1 ${
              ["bg-brand-mint", "bg-brand-mustard", "bg-brand-pink", "bg-brand-coral", "bg-brand-lilac", "bg-card"][i % 6]
            }`}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              <span className="absolute left-3 top-3 rounded-lg brutal-border bg-card px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                {p.material}
              </span>
              <span className="absolute right-3 top-3 rounded-lg brutal-border bg-brand-coral px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                {p.difficulty}
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="font-display text-xl leading-none">{p.title}</div>
                <span className="rounded-md brutal-border bg-card px-2 py-1 text-[10px] font-bold">{p.time}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-foreground/75 line-clamp-2">{p.summary}</p>
              <div className="mt-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-foreground/70">
                <span>{p.cost}</span>
                <span>{p.impactKg} kg saved</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function _RecommendedSection() {
  return (
    <section id="explore" className="relative mx-auto max-w-7xl px-6 py-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-block rounded-full brutal-border bg-brand-mint px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
            Recommended
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl">Popular Upcycles This Week</h2>
        </div>
        <a
          href="#explore"
          className="rounded-xl brutal-border brutal-shadow-sm bg-card px-4 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5"
        >
          See all ideas
        </a>
      </div>

      <div className="rounded-3xl brutal-border brutal-shadow-lg bg-card p-2">
        <div className="h-[520px] w-full rounded-2xl bg-brand-lilac/40">
          <CircularGallery items={RECOMMENDED} bend={2.5} textColor="#1a1420" borderRadius={0.06} />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative mt-10 border-t-[3px] border-brand-ink bg-brand-ink text-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl border-[3px] border-card bg-brand-mint">
              <span className="h-3 w-3 rotate-45 bg-brand-ink" />
            </span>
            <span className="font-display text-xl text-card">Waste2Wonder</span>
          </div>
          <p className="mt-4 max-w-md text-sm text-card/70">
            AI-powered upcycling for a lighter planet. Turn what you'd throw away into something worth keeping.
          </p>
          <div className="mt-6 text-xs uppercase tracking-widest text-card/50">Contact</div>
          <div className="mt-1 text-sm font-medium">hello@waste2wonder.app</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-card/50">Quick Links</div>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV.map((n) => (
              <li key={n.label}>
                <a className="hover:text-brand-mustard" href={n.href}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-card/50">Legal</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a className="hover:text-brand-mustard" href="#">Privacy</a></li>
            <li><a className="hover:text-brand-mustard" href="#">Terms</a></li>
            <li><a className="hover:text-brand-mustard" href="#">Contest Rules</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-card/15 py-4 text-center text-xs text-card/50">
        © 2026 Waste2Wonder. Built for HackLabify V1.0.
      </div>
    </footer>
  );
}