import Link from "next/link";

export const SiteHeader = () => {
  return (
    <header className="bg-background/60 supports-[backdrop-filter]:bg-background/60 border-border sticky top-0 h-14 w-full border-b backdrop-blur">
      <div className="container flex h-full w-full items-center justify-between p-4">
        {/*  LOGO */}
        <Link href={"/"} className="text-2xl font-bold">
          unstmsg
        </Link>
      </div>
    </header>
  );
};
