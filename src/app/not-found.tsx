import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--color-bg)] p-8 text-center text-[var(--color-fg)]">
      <h1 className="text-5xl font-semibold leading-[1.04] tracking-[-0.065em]">
        404
      </h1>
      <p className="max-w-md text-[16px] leading-[1.5] text-[var(--color-mut)]">
        The page you are looking for does not exist.
      </p>
      <Button asChild className="mt-2">
        <Link href="/">Back to home</Link>
      </Button>
    </main>
  );
}