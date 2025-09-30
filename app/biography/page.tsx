import { getMarkdownBySlug } from "@/lib/markdown";

export default async function BiographyPage() {
  const doc = await getMarkdownBySlug(".", "biography");
  const html = doc?.html ?? "";
  return (
    <section className="container-padded py-14 md:py-20">
      <h1 className="hero-title text-3xl md:text-5xl font-semibold tracking-tight">Biography</h1>
      <article className="prose mt-6 max-w-3xl text-sm md:text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}


