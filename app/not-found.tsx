import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-padded py-20 text-center">
      <h1 className="hero-title text-3xl md:text-5xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-4 text-foreground/80">The page you are looking for does not exist.</p>
      <div className="mt-8">
        <Link href="/" className="px-4 py-2 rounded-md bg-foreground text-background">Back home</Link>
      </div>
    </section>
  );
}


