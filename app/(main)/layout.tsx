import { SiteHeader } from "@/components/global/site-header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="container max-w-7xl p-4">{children}</main>
    </>
  );
}
