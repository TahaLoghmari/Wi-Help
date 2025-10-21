import { createRouter } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import { queryClient } from "@/providers/react-query";
import { PageLoading } from "@/components/ui/page-loading";

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPendingComponent: () => <PageLoading />,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
