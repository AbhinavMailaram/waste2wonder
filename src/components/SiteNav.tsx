import { Link, useRouter } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useAuth } from "@/lib/auth";

const NAV = [
  { label: "Discover", to: "/" as const },
  { label: "Image Analysis", to: "/create" as const },
  { label: "Contest", to: "/contest" as const },
  { label: "Create Post", to: "/create-post" as const },
  { label: "Profile", to: "/profile" as const },
];

export default function SiteNav() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="glass-nav mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl px-4 py-3"
      >
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-xl brutal-border brutal-shadow-sm bg-brand-mint">
            <span className="h-3 w-3 rotate-45 bg-brand-ink" />
          </span>
          <span className="font-display text-lg tracking-tight">Waste2Wonder</span>
        </Link>
        <ul className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <li key={n.label}>
              <Link
                to={n.to}
                className="relative rounded-lg px-3 py-2 text-sm font-semibold transition-transform duration-150 hover:-translate-y-0.5 hover:bg-brand-mustard/60"
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <button
                onClick={() => {
                  logout();
                  router.navigate({ to: "/" });
                }}
                className="rounded-xl brutal-border brutal-shadow-sm bg-brand-coral px-3 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-flex rounded-xl brutal-border brutal-shadow-sm bg-card px-3 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="rounded-xl brutal-border brutal-shadow-sm bg-brand-coral px-3 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </motion.nav>
    </header>
  );
}
