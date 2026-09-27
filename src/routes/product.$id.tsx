import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    throw redirect({ to: "/reference/$id", params: { id: params.id } });
  },
  component: () => null,
});
