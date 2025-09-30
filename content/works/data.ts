export type Work = {
  slug: string;
  title: string;
  year?: string;
  description?: string;
};

export const works: Work[] = [
  {
    slug: "peer-gynt-suites",
    title: "Peer Gynt Suites, Op. 46 & 55",
    year: "1875–1891",
    description:
      "Incidental music turned orchestral suites; includes Morning Mood and In the Hall of the Mountain King.",
  },
  {
    slug: "piano-concerto-a-minor",
    title: "Piano Concerto in A minor, Op. 16",
    year: "1868",
    description:
      "Grieg's only piano concerto; lyrical themes and Norwegian character with virtuosic writing.",
  },
  {
    slug: "holberg-suite",
    title: "Holberg Suite, Op. 40",
    year: "1884",
    description:
      "Suite in the olden style for string orchestra or piano, honoring Ludvig Holberg.",
  },
  {
    slug: "lyric-pieces",
    title: "Lyric Pieces",
    year: "1867–1901",
    description:
      "66 short works for piano spanning ten volumes, showcasing Grieg’s intimate lyricism.",
  },
];

export function getWorkBySlug(slug: string): Work | undefined {
  return works.find((w) => w.slug === slug);
}


