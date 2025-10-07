import {
  dehydrate,
  HydrationBoundary,
  type QueryClient,
} from "@tanstack/react-query";

interface Props {
  children: React.ReactNode;
  client: QueryClient;
}

export const HydrateClient = ({ children, client }: Props) => {
  return (
    <HydrationBoundary state={dehydrate(client)}>{children}</HydrationBoundary>
  );
};
