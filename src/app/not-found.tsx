import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16">
      <div className="max-w-xl space-y-6 rounded-[2rem] border border-white/10 bg-white/6 p-10 text-center text-white backdrop-blur">
        <p className="text-sm uppercase tracking-[0.24em] text-sky-300">404</p>
        <h1 className="text-4xl font-semibold tracking-tight">
          The page you are looking for does not exist.
        </h1>
        <p className="text-base leading-8 text-slate-300">
          Check the URL or head back to the bilingual homepage and continue from
          there.
        </p>
        <Link
          href="/zh"
          className="inline-flex h-12 items-center justify-center rounded-full bg-sky-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-sky-400"
        >
          Go to homepage
        </Link>
      </div>
    </main>
  );
}
