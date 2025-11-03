import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { siteConfig } from "@/src/config/site";

type EventItem = {
  id: string;
  title: string;
  startDate: string; // ISO
  endDate?: string; // ISO
  location?: string;
  url?: string;
  provider?: string;
  providerUrl?: string;
};

async function fetchEvents(): Promise<{ upcoming: EventItem[]; past: EventItem[] }> {
  // Provider 0 (preferred): concerti.de composer page (HTML parse)
  // https://www.concerti.de/komponisten/edvard-grieg/
  const results: EventItem[] = [];
  try {
    const res = await fetch("https://www.concerti.de/komponisten/edvard-grieg/", { next: { revalidate: 60 * 60 } });
    if (res.ok) {
      const html = await res.text();
      // Extract the Termine section roughly: capture blocks around a German date pattern
      const monthMap: Record<string, string> = {
        Januar: "01",
        Februar: "02",
        März: "03",
        Maerz: "03",
        April: "04",
        Mai: "05",
        Juni: "06",
        Juli: "07",
        August: "08",
        September: "09",
        Oktober: "10",
        November: "11",
        Dezember: "12",
      };
      const lines = html
        .replace(/\r/g, "")
        .split(/\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        // Match date like: Mi., 01. Oktober 2025 17:00 Uhr
        const m = line.match(/(?:Mo\.|Di\.|Mi\.|Do\.|Fr\.|Sa\.|So\.)?,?\s*(\d{1,2})\.\s+([A-Za-zÄÖÜäöü]+)\s+(\d{4})(?:\s+(\d{1,2}:\d{2}))?/);
        if (!m) continue;
        const day = m[1];
        const monName = m[2]
          .replace("ä", "ae")
          .replace("ö", "oe")
          .replace("ü", "ue")
          .replace("Ä", "Ae")
          .replace("Ö", "Oe")
          .replace("Ü", "Ue");
        const year = m[3];
        const time = m[4] || "19:30";
        const month = monthMap[monName as keyof typeof monthMap];
        if (!month) continue;
        const iso = `${year}-${month}-${String(day).padStart(2, "0")}T${time}:00Z`;
        // Try to read nearby lines for venue/city and title
        let venueCity: string | undefined;
        let title: string | undefined;
        for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
          const ln = lines[j].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
          if (!venueCity && /,\s*[A-ZÄÖÜÄÖÜa-zäöü\- ]+$/.test(ln) && ln.length < 120) {
            venueCity = ln;
            continue;
          }
          if (!title && (ln.startsWith("### ") || ln.length < 140)) {
            // try heading or program line as title
            const t = ln.replace(/^#+\s*/, "").trim();
            if (t && !/Konzert|Oper|Termintipp|Anzeige/i.test(t)) title = t;
          }
        }
        const city = venueCity?.split(",").pop()?.trim();
        results.push({
          id: `concerti-${year}-${month}-${day}-${i}`,
          title: title || "Grieg Konzert",
          startDate: iso,
          location: venueCity || city,
          url: "https://www.concerti.de/komponisten/edvard-grieg/",
          provider: "Concerti",
          providerUrl: "https://www.concerti.de/komponisten/edvard-grieg/",
        });
      }
    }
  } catch {
    // ignore and try API providers
  }

  // Provider 0b: classicalevents.co.uk composer page (HTML parse)
  try {
    const res = await fetch("https://www.classicalevents.co.uk/composers/edvard-grieg/concerts", { next: { revalidate: 60 * 60 } });
    if (res.ok) {
      const html = await res.text();
      const lines = html
        .replace(/\r/g, "")
        .split(/\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      const monthMap: Record<string, string> = {
        January: "01",
        February: "02",
        March: "03",
        April: "04",
        May: "05",
        June: "06",
        July: "07",
        August: "08",
        September: "09",
        October: "10",
        November: "11",
        December: "12",
      };
      for (let i = 0; i < lines.length; i++) {
        const text = lines[i].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        // Match like: 4th October 2025 7:30 PM
        const m = text.match(/(\d{1,2})(st|nd|rd|th)?\s+([A-Za-z]+)\s+(\d{4})(?:\s+(\d{1,2}:\d{2})\s*(AM|PM)?)?/);
        if (!m) continue;
        const day = m[1];
        const monName = m[3];
        const year = m[4];
        let time = m[5] || "19:30";
        const ampm = (m[6] || "").toUpperCase();
        // Convert to 24h if AM/PM present
        if (ampm) {
          const [hh, mm] = time.split(":").map((v) => parseInt(v, 10));
          let h = hh;
          if (ampm === "PM" && h < 12) h = h + 12;
          if (ampm === "AM" && h === 12) h = 0;
          time = `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
        }
        const month = monthMap[monName as keyof typeof monthMap];
        if (!month) continue;
        const iso = `${year}-${month}-${String(day).padStart(2, "0")}T${time}:00Z`;
        // Read nearby for title and venue
        let title: string | undefined;
        let venueCity: string | undefined;
        for (let j = i - 4; j <= i + 6; j++) {
          if (j < 0 || j >= lines.length) continue;
          const ln = lines[j].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
          if (!title && /^##?\s?/.test(ln)) {
            title = ln.replace(/^#+\s*/, "").trim();
            continue;
          }
          if (!venueCity && /(Church|Cathedral|Hall|Theatre|Concert|Chapel|Venue|St\.?\s|Abbey|Philharmonic|Konzerthaus|Musikverein)/i.test(ln)) {
            venueCity = ln;
          }
        }
        results.push({
          id: `classicalevents-${year}-${month}-${day}-${i}`,
          title: title || "Grieg Concert",
          startDate: iso,
          location: venueCity,
          url: "https://www.classicalevents.co.uk/composers/edvard-grieg/concerts",
          provider: "Classical Events",
          providerUrl: "https://www.classicalevents.co.uk/composers/edvard-grieg/concerts",
        });
      }
    }
  } catch {
    // ignore
  }

  // Start aggregated with scraped sources
  const aggregated: EventItem[] = [...results];

  // Provider 1: Ticketmaster Discovery API (keyword search for "Grieg")
  const tmKey = process.env.TM_API_KEY || process.env.TICKETMASTER_API_KEY;
  const nowIso = new Date().toISOString();
  try {
    if (tmKey) {
      const tmUrl = new URL("https://app.ticketmaster.com/discovery/v2/events.json");
      tmUrl.searchParams.set("apikey", tmKey);
      tmUrl.searchParams.set("keyword", "Grieg");
      tmUrl.searchParams.set("size", "100");
      tmUrl.searchParams.set("sort", "date,asc");
      // Request all locales; their API uses * to mean all
      tmUrl.searchParams.set("locale", "*");
      const res = await fetch(tmUrl.toString(), { next: { revalidate: 60 * 30 } });
      if (res.ok) {
        const data = (await res.json()) as unknown;
        const items = (
          (data as {
            _embedded?: {
              events?: Array<{
                id?: string;
                name?: string;
                url?: string;
                dates?: { start?: { dateTime?: string; localDate?: string } };
                _embedded?: {
                  venues?: Array<{
                    city?: { name?: string };
                    country?: { name?: string; countryCode?: string };
                  }>;
                };
              }>;
            };
          })._embedded?.events || []
        );
        for (const ev of items) {
          const dateStr: string | undefined = ev?.dates?.start?.dateTime || ev?.dates?.start?.localDate;
          const venue = ev?._embedded?.venues?.[0];
          const city = venue?.city?.name;
          const country = venue?.country?.name || venue?.country?.countryCode;
          const loc = [city, country].filter(Boolean).join(", ");
          if (!dateStr) continue;
          aggregated.push({
            id: ev?.id || `${ev?.name}-${dateStr}`,
            title: ev?.name || "Grieg Event",
            startDate: dateStr,
            location: loc || undefined,
            url: ev?.url || undefined,
            provider: "Ticketmaster",
            providerUrl: "https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/",
          });
        }
      }
    }
  } catch {
    // ignore and try next provider
  }

  // Provider 2: Eventbrite public search (requires OAuth token)
  try {
    if (results.length === 0) {
      const ebToken = process.env.EVENTBRITE_TOKEN;
      if (ebToken) {
        const ebUrl = new URL("https://www.eventbriteapi.com/v3/events/search/");
        ebUrl.searchParams.set("q", "Grieg");
        ebUrl.searchParams.set("sort_by", "date");
        ebUrl.searchParams.set("expand", "venue");
        const res = await fetch(ebUrl.toString(), {
          headers: { Authorization: `Bearer ${ebToken}` },
          next: { revalidate: 60 * 30 },
        });
        if (res.ok) {
          const data = (await res.json()) as unknown;
          const items = (
            (data as {
              events?: Array<{
                id?: string;
                name?: { text?: string };
                url?: string;
                start?: { utc?: string; local?: string };
                venue?: { address?: { city?: string; country?: string } };
              }>;
            }).events || []
          );
          for (const ev of items) {
            const dateStr: string | undefined = ev?.start?.utc || ev?.start?.local;
            const venue = ev?.venue;
            const city = venue?.address?.city;
            const country = venue?.address?.country;
            const loc = [city, country].filter(Boolean).join(", ");
            if (!dateStr) continue;
            aggregated.push({
              id: ev?.id || `${ev?.name?.text}-${dateStr}`,
              title: ev?.name?.text || "Grieg Event",
              startDate: dateStr,
              location: loc || undefined,
              url: ev?.url || undefined,
              provider: "Eventbrite",
              providerUrl: "https://www.eventbrite.com/platform/docs",
            });
          }
        }
      }
    }
  } catch {
    // ignore
  }

  // Classify into upcoming/past based on current time
  const upcoming: EventItem[] = [];
  const past: EventItem[] = [];
  for (const ev of aggregated) {
    const d = new Date(ev.startDate);
    if (isNaN(d.getTime())) continue;
    if (d.toISOString() >= nowIso) upcoming.push(ev);
    else past.push(ev);
  }

  // Sort
  upcoming.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  past.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  return { upcoming, past };
}

export default async function EventsPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const t = await getTranslations();
  const { locale } = await params;
  const { upcoming, past } = await fetchEvents();
  // Optional filters via query params: q, city, country, from, to
  const rawSearch = (await searchParams) || {};
  const sp = rawSearch as Record<string, string | undefined>;
  const q = (sp.q || sp.query || "")?.toLowerCase();
  const cityFilter = (sp.city || "")?.toLowerCase();
  const countryFilter = (sp.country || "")?.toLowerCase();
  const fromStr = sp.from;
  const toStr = sp.to;
  const fromTs = fromStr ? new Date(fromStr).getTime() : undefined;
  const toTs = toStr ? new Date(toStr).getTime() : undefined;

  function matches(ev: EventItem): boolean {
    const title = (ev.title || "").toLowerCase();
    const loc = (ev.location || "").toLowerCase();
    const ts = new Date(ev.startDate).getTime();
    if (!isFinite(ts)) return false;
    if (q && !(title.includes(q) || loc.includes(q))) return false;
    if (cityFilter && !loc.includes(cityFilter)) return false;
    if (countryFilter && !loc.includes(countryFilter)) return false;
    if (fromTs && ts < fromTs) return false;
    if (toTs && ts > toTs) return false;
    return true;
  }

  const filteredUpcoming = upcoming.filter(matches);
  const filteredPast = past.filter(matches);
  return (
    <section className="py-2 md:py-20">
      <h1 className="hero-title text-3xl md:text-5xl font-semibold tracking-tight">{t("events.title")}</h1>
      <p className="mt-6 max-w-2xl text-[1.0625rem] md:text-base leading-[1.7] text-foreground/85">{t("events.intro")}</p>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-foreground/10 bg-background/60 p-6">
          <h2 className="text-xl font-semibold tracking-tight">{t("events.upcoming")}</h2>
      {filteredUpcoming.length === 0 ? (
            <div className="mt-3 text-sm text-foreground/60">{t("events.noEvents")}</div>
          ) : (
            <ul className="mt-4 space-y-4">
              {filteredUpcoming.map((ev) => (
                <li key={ev.id} className="border-b border-foreground/10 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {ev.url ? (
                        <a href={ev.url} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4 font-medium">
                          {ev.title}
                        </a>
                      ) : (
                        <span className="font-medium">{ev.title}</span>
                      )}
                      <div className="mt-1 text-sm text-foreground/70">
                        <span>{new Date(ev.startDate).toISOString().slice(0, 10)}</span>
                        {ev.location ? <span className="ml-2">· {ev.location}</span> : null}
                        {ev.provider ? (
                          <span className="ml-2">
                            · <a className="underline hover:no-underline" href={ev.providerUrl} target="_blank" rel="noopener noreferrer">{ev.provider}</a>
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-foreground/10 bg-background/60 p-6">
          <h2 className="text-xl font-semibold tracking-tight">{t("events.past")}</h2>
      {filteredPast.length === 0 ? (
            <div className="mt-3 text-sm text-foreground/60">{t("events.noEvents")}</div>
          ) : (
            <ul className="mt-4 space-y-4">
              {filteredPast.map((ev) => (
                <li key={ev.id} className="border-b border-foreground/10 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {ev.url ? (
                        <a href={ev.url} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4 font-medium">
                          {ev.title}
                        </a>
                      ) : (
                        <span className="font-medium">{ev.title}</span>
                      )}
                      <div className="mt-1 text-sm text-foreground/70">
                        <span>{new Date(ev.startDate).toISOString().slice(0, 10)}</span>
                        {ev.location ? <span className="ml-2">· {ev.location}</span> : null}
                        {ev.provider ? (
                          <span className="ml-2">
                            · <a className="underline hover:no-underline" href={ev.providerUrl} target="_blank" rel="noopener noreferrer">{ev.provider}</a>
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  const locale = await getLocale();
  const title = t("events.title");
  const description = t("events.intro");
  const ogImage = "/grieg/grieg-og-image.png";
  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      siteName: t("site.title"),
      locale,
      url: `/${locale}/events`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `${siteConfig.baseUrl}/${locale}/events`,
      languages: { en: `${siteConfig.baseUrl}/en/events`, fa: `${siteConfig.baseUrl}/fa/events`, no: `${siteConfig.baseUrl}/no/events` },
    },
  };
}


