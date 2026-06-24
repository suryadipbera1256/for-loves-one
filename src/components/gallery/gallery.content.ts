/**
 * Gallery ("Travels") data + the arrange/filter engine. Photos resolve from a
 * real file when present, otherwise a refined accent gradient (so the wall never
 * shows a broken image). `chapter` ties a photo back to a Roadmap chapter id
 * ("01".."20") so /gallery?chapter=01 can pull those to the front.
 */

export type GalleryTag = "Travels" | "Tours" | "Couple Nights" | "Adventures" | "Bike Rides" | "Festivals";

export const TAGS: readonly GalleryTag[] = [
  "Travels",
  "Tours",
  "Couple Nights",
  "Adventures",
  "Bike Rides",
  "Festivals",
] as const;

export type GalleryPhoto = {
  id: string;
  title: string;
  location: string;
  chapter: string; // Roadmap chapter id, e.g. "01"
  tags: GalleryTag[];
  accent: [string, string];
  image?: string;
};

const A = {
  amber: ["#9c763f", "#0b0907"] as [string, string],
  honey: ["#b9824a", "#0a0807"] as [string, string],
  gold: ["#d9a566", "#0b0907"] as [string, string],
  ember: ["#a85b32", "#0a0706"] as [string, string],
  dusk: ["#6b5232", "#0b0907"] as [string, string],
  rose: ["#b06a52", "#0a0807"] as [string, string],
};

export const PHOTOS: GalleryPhoto[] = [
  { id: "p01", title: "The Rocky Shore", location: "Where it began", chapter: "01", tags: ["Travels", "Couple Nights"], accent: A.amber, image: "/image/home header.jpg" },
  { id: "p02", title: "First Light", location: "Coastal road", chapter: "01", tags: ["Travels", "Adventures"], accent: A.gold },
  { id: "p03", title: "Salt & Wind", location: "The cliffs", chapter: "01", tags: ["Adventures"], accent: A.honey },
  { id: "p04", title: "Two Helmets", location: "Open highway", chapter: "02", tags: ["Bike Rides", "Adventures"], accent: A.ember, image: "/image/roadmap header.png" },
  { id: "p05", title: "Wrong Turn, Right Day", location: "Backroads", chapter: "02", tags: ["Bike Rides", "Travels"], accent: A.dusk },
  { id: "p06", title: "Throttle & Sunset", location: "Mountain pass", chapter: "02", tags: ["Bike Rides"], accent: A.rose },
  { id: "p07", title: "Lantern Streets", location: "Old town", chapter: "03", tags: ["Tours", "Couple Nights"], accent: A.gold },
  { id: "p08", title: "Shared Mornings", location: "Our kitchen", chapter: "03", tags: ["Couple Nights"], accent: A.amber },
  { id: "p09", title: "Market Colours", location: "Spice quarter", chapter: "03", tags: ["Tours", "Travels"], accent: A.honey },
  { id: "p10", title: "The Long Hike", location: "Pine ridge", chapter: "04", tags: ["Adventures", "Travels"], accent: A.dusk },
  { id: "p11", title: "Rain & Shelter", location: "Valley hut", chapter: "04", tags: ["Adventures"], accent: A.ember },
  { id: "p12", title: "Storm Light", location: "North coast", chapter: "04", tags: ["Travels"], accent: A.rose },
  { id: "p13", title: "Festival of Lamps", location: "River ghats", chapter: "05", tags: ["Festivals", "Couple Nights"], accent: A.gold, image: "/image/home header.jpg" },
  { id: "p14", title: "Fireworks", location: "Rooftop", chapter: "05", tags: ["Festivals", "Couple Nights"], accent: A.amber },
  { id: "p15", title: "Golden Hour", location: "Wheat fields", chapter: "05", tags: ["Travels", "Tours"], accent: A.honey },
  { id: "p16", title: "City of Bridges", location: "Canal district", chapter: "06", tags: ["Tours", "Travels"], accent: A.dusk },
  { id: "p17", title: "Midnight Drive", location: "Neon expressway", chapter: "06", tags: ["Bike Rides", "Couple Nights"], accent: A.ember, image: "/image/roadmap header.png" },
  { id: "p18", title: "Quiet Harbour", location: "Fishing port", chapter: "06", tags: ["Travels"], accent: A.rose },
  { id: "p19", title: "Desert Stars", location: "Dune camp", chapter: "07", tags: ["Adventures", "Couple Nights"], accent: A.gold },
  { id: "p20", title: "Tea on the Ridge", location: "Hill station", chapter: "07", tags: ["Tours"], accent: A.amber },
  { id: "p21", title: "Snow First Time", location: "Alpine village", chapter: "08", tags: ["Travels", "Adventures"], accent: A.honey },
  { id: "p22", title: "Carnival Night", location: "Old square", chapter: "08", tags: ["Festivals"], accent: A.ember },
  { id: "p23", title: "The Lookout", location: "Cape point", chapter: "02", tags: ["Adventures", "Travels"], accent: A.dusk },
  { id: "p24", title: "Slow Sunday", location: "Home", chapter: "03", tags: ["Couple Nights"], accent: A.rose },
  { id: "p25", title: "Coast to Coast", location: "Route 7", chapter: "05", tags: ["Bike Rides", "Travels"], accent: A.gold },
  { id: "p26", title: "Temple Bells", location: "Hilltop shrine", chapter: "07", tags: ["Tours"], accent: A.amber },
  { id: "p27", title: "Bonfire", location: "Beach camp", chapter: "04", tags: ["Couple Nights", "Adventures"], accent: A.honey },
  { id: "p28", title: "New Year Lights", location: "Downtown", chapter: "06", tags: ["Festivals", "Couple Nights"], accent: A.ember },
];

export type Arrange = { query: string; tag: GalleryTag | null; chapter: string | null };

/** Filter by tag + free-text query, then float a focused chapter to the front. */
export function arrangePhotos(photos: GalleryPhoto[], opts: Arrange): GalleryPhoto[] {
  const q = opts.query.trim().toLowerCase();
  let list = photos.filter((p) => {
    const tagOk = !opts.tag || p.tags.includes(opts.tag);
    const qOk =
      !q ||
      [p.title, p.location, `chapter ${parseInt(p.chapter, 10)}`, p.chapter, ...p.tags]
        .join(" ")
        .toLowerCase()
        .includes(q);
    return tagOk && qOk;
  });

  if (opts.chapter) {
    const inCh = list.filter((p) => p.chapter === opts.chapter);
    const rest = list.filter((p) => p.chapter !== opts.chapter);
    list = [...inCh, ...rest];
  }
  return list;
}

export const chapterLabel = (id: string) => `Chapter ${parseInt(id, 10) || id}`;
