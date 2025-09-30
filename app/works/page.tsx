import Link from "next/link";
import { works } from "./data";

export default function WorksPage() {
  return (
    <section className="container-padded py-14 md:py-20">
      <h1 className="hero-title text-3xl md:text-5xl font-semibold tracking-tight">Works</h1>
      <p className="mt-6 max-w-2xl text-sm md:text-base text-foreground/85">
        A small selection of notable pieces. This is a starter—you can expand with
        full catalog data later.
      </p>
      <ul className="mt-6 grid gap-3 text-sm md:text-base">
        {works.map((w) => (
          <li key={w.slug} className="border-b border-foreground/10 pb-3">
            <Link href={`/works/${w.slug}`} className="hover:underline underline-offset-4">
              {w.title}
            </Link>
            {w.year ? <span className="ml-2 text-foreground/60">{w.year}</span> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}


