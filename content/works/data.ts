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
      "66 short works for piano spanning ten volumes, showcasing Grieg's intimate lyricism.",
  },
  {
    slug: "violin-sonatas",
    title: "Violin Sonatas",
    year: "1865–1887",
    description:
      "Three sonatas blending classical forms with Norwegian folk melodies.",
  },
  {
    slug: "ballade-g-minor",
    title: "Ballade in G minor, Op. 24",
    year: "1875",
    description:
      "A theme and variations piece considered one of Grieg's most profound piano compositions.",
  },
  {
    slug: "norwegian-dances",
    title: "Norwegian Dances, Op. 35",
    year: "1881",
    description:
      "A set of four dances inspired by traditional Norwegian folk tunes.",
  },
  {
    slug: "haugtussa",
    title: "Haugtussa, Op. 67",
    year: "1895",
    description:
      "A song cycle set to poems by Arne Garborg, depicting the life of a young girl in the Norwegian countryside.",
  },
  {
    slug: "string-quartet-g-minor",
    title: "String Quartet in G minor, Op. 27",
    year: "1878",
    description:
      "A quartet noted for its intensity and innovative use of folk elements.",
  },
  {
    slug: "cello-sonata-a-minor",
    title: "Cello Sonata in A minor, Op. 36",
    year: "1883",
    description:
      "A significant contribution to the cello repertoire, blending lyrical melodies with Norwegian folk influences.",
  },
  {
    slug: "piano-sonata-e-minor",
    title: "Piano Sonata in E minor, Op. 7",
    year: "1865",
    description:
      "Grieg's only piano sonata, showcasing his early compositional style and Romantic influences.",
  },
  {
    slug: "humoresques",
    title: "Humoresques, Op. 6",
    year: "1865",
    description:
      "A set of piano pieces reflecting Grieg's humor and lightheartedness.",
  },
  {
    slug: "improvisations-norwegian-folk-songs",
    title: "Improvisations on Two Norwegian Folk Songs, Op. 29",
    year: "1878",
    description:
      "Piano compositions based on Norwegian folk melodies, highlighting Grieg's nationalistic style.",
  },
  {
    slug: "waltz-caprices",
    title: "Waltz-Caprices, Op. 37",
    year: "1883",
    description:
      "A set of piano pieces combining waltz rhythms with capricious elements.",
  },
  {
    slug: "moods",
    title: "Moods, Op. 73",
    year: "1905",
    description:
      "A collection of piano pieces capturing various emotional states.",
  },
];

export function getWorkBySlug(slug: string): Work | undefined {
  return works.find((w) => w.slug === slug);
}


