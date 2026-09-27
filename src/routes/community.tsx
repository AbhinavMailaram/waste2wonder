import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/community")({
  loader: () => {
    throw redirect({ to: "/contest" });
  },
  component: () => null,
});
