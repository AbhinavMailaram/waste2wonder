import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import LiveBackground from "@/components/LiveBackground";
import SiteNav from "@/components/SiteNav";
import { findProduct, PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = findProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Project not found — Waste2Wonder" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.product;
    return {
      meta: [
        { title: `${p.title} — Waste2Wonder` },
        { name: "description", content: p.summary },
        { property: "og:title", content: `${p.title} — Waste2Wonder` },
        { property: "og:description", content: p.summary },
        { property: "og:image", content: p.image },
        { name: "twitter:image", content: p.image },
      ],
    };
  },
  component: ProductPage,
  notFoundComponent: ProductNotFound,
});

function ProductNotFound() {
  return (
    <div className="relative min-h-screen">
      <LiveBackground />
      <SiteNav />
      <div className="grid min-h-screen place-items-center px-6 text-center">
        <div className="rounded-2xl brutal-border brutal-shadow-lg bg-card p-6">
          <div className="font-display text-2xl">Project not found</div>
          <p className="mt-1 text-sm text-foreground/70">The project you're looking for doesn't exist.</p>
          <Link to="/community" className="mt-4 inline-block rounded-xl brutal-border brutal-shadow-sm bg-brand-coral px-4 py-2 text-sm font-bold">
            Browse Community
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProductPage() {
  const { product } = Route.useLoaderData();
  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="relative min-h-screen text-foreground">
      <LiveBackground />
      <SiteNav />
      <main className="mx-auto max-w-6xl px-6 pt-32 pb-16">
        <nav className="mb-6 text-xs font-bold uppercase tracking-widest text-foreground/60">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/community" className="hover:underline">Projects</Link>
          <span className="mx-2">/</span>
          <span>{product.title}</span>
        </nav>

        <section className="grid gap-8 md:grid-cols-[1.1fr_1fr]">
          <div className="relative overflow-hidden rounded-3xl brutal-border brutal-shadow-lg bg-brand-mint">
            <img src={product.image} alt={product.title} className="h-full max-h-[520px] w-full object-cover" />
            <span className="absolute left-4 top-4 rounded-lg brutal-border bg-brand-mustard px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
              {product.material}
            </span>
            <span className="absolute right-4 top-4 rounded-lg brutal-border bg-brand-coral px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
              {product.difficulty}
            </span>
          </div>

          <div>
            <span className="inline-block rounded-full brutal-border bg-brand-pink px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
              Project Blueprint
            </span>
            <h1 className="mt-3 text-4xl md:text-5xl leading-[0.95]">{product.title}</h1>
            <p className="mt-3 text-lg font-medium text-foreground/80">{product.summary}</p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { k: product.time, v: "Time" },
                { k: product.cost, v: "Cost" },
                { k: `${product.impactKg} kg`, v: "Impact" },
                { k: product.ideas, v: "Variants" },
              ].map((s) => (
                <div key={s.v} className="rounded-xl brutal-border brutal-shadow-sm bg-card px-3 py-3 text-center">
                  <div className="font-display text-xl leading-none">{s.k}</div>
                  <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-foreground/60">{s.v}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-2xl brutal-border brutal-shadow bg-brand-coral px-6 py-3 text-base font-bold transition-transform hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
                Start This Project
              </button>
              <Link
                to="/community"
                className="rounded-2xl brutal-border brutal-shadow-sm bg-card px-6 py-3 text-base font-bold transition-transform hover:-translate-y-0.5"
              >
                Vote in Community
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl brutal-border brutal-shadow-lg bg-card p-6">
            <h2 className="font-display text-2xl">Materials</h2>
            <ul className="mt-3 space-y-2 text-sm font-medium">
              {product.materialsList.map((m: string) => (
                <li key={m} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-coral" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl brutal-border brutal-shadow-lg bg-card p-6 md:col-span-2">
            <h2 className="font-display text-2xl">Step-by-Step</h2>
            <ol className="mt-3 space-y-3">
              {product.steps.map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-3 rounded-xl brutal-border bg-brand-mint/50 p-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md brutal-border bg-card font-display text-xs">
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mt-10 rounded-3xl brutal-border brutal-shadow-lg bg-brand-mustard p-6">
          <h2 className="font-display text-2xl">Safety Tips</h2>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {product.safety.map((s: string) => (
              <li key={s} className="rounded-xl brutal-border bg-card px-3 py-2 text-sm font-semibold">{s}</li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-3xl">You might also like</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.id}
                to="/product/$id"
                params={{ id: p.id }}
                className="group rounded-3xl brutal-border brutal-shadow-lg bg-card overflow-hidden transition-transform hover:-translate-y-1"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={p.image} alt={p.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <div className="font-display text-lg leading-none">{p.title}</div>
                  <div className="mt-1 text-[11px] font-bold uppercase tracking-widest text-foreground/60">
                    {p.material} · {p.time}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}