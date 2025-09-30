import Link from "next/link";
export default function Home() {
  return (
    <section className="container-padded pt-14 md:pt-20 pb-20 md:pb-28">
      <div className="relative overflow-hidden rounded-xl border border-foreground/10 bg-background/60">
        <div className="absolute inset-0 img-blend" style={{ backgroundImage: "url(/grieg/grieg.png)", backgroundSize: "cover", backgroundPosition: "center 20%" }} />
        <div className="absolute inset-0 overlay-hero" />
        <div className="relative max-w-3xl px-6 md:px-8 py-10 md:py-14">
        <h1 className="hero-title text-4xl md:text-6xl font-semibold tracking-tight">
          Edvard Grieg
        </h1>
        <p className="mt-4 text-base md:text-lg text-foreground/80 leading-relaxed">
          Norwegian composer and pianist (1843–1907). Celebrated for his lyricism and
          national romantic style. Explore selected works, a short biography, and
          recordings.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/works"
            className="px-4 py-2 rounded-md bg-foreground text-background text-sm md:text-base"
          >
            Explore works
          </Link>
          <Link
            href="/listen"
            className="px-4 py-2 rounded-md border border-foreground/20 text-sm md:text-base hover:bg-foreground/5"
          >
            Listen
          </Link>
        </div>
        </div>
      </div>

      <div className="mt-16 md:mt-24">
        <h2 className="text-xl md:text-2xl font-medium">Highlights</h2>
        <ul className="mt-4 grid gap-3 text-sm md:text-base">
          <li>
            <Link className="underline underline-offset-4 hover:no-underline" href="/works/piano-concerto-a-minor">
              Piano Concerto in A minor, Op. 16
            </Link>
          </li>
          <li>
            <Link className="underline underline-offset-4 hover:no-underline" href="/works/peer-gynt-suites">
              Peer Gynt Suites, Op. 46 & 55
            </Link>
          </li>
          <li>
            <Link className="underline underline-offset-4 hover:no-underline" href="/biography">
              Biography
            </Link>
          </li>
        </ul>
      </div>

      <div className="mt-20">
        <h2 className="text-xl md:text-2xl font-medium">Selected works</h2>
        <ul className="mt-4 grid gap-3 text-sm md:text-base">
          <li>Peer Gynt Suites, Op. 46 & 55</li>
          <li>Piano Concerto in A minor, Op. 16</li>
          <li>Lyric Pieces (66 short works for piano)</li>
        </ul>
      </div>

      <div className="mt-16 max-w-3xl text-sm md:text-base text-foreground/85 leading-relaxed">
        Born in Bergen, Grieg studied in Leipzig and became a central figure in
        Norwegian musical identity, blending folk melodies with Romantic harmony.
      </div>

      <div className="mt-16">
        <h2 className="text-xl md:text-2xl font-medium">Listen</h2>
        <p className="mt-3 text-sm md:text-base text-foreground/80">Placeholder for embeds or links to recordings.</p>
      </div>
    </section>
  );
}
