/**
 * Single source of truth for name/address/phone and coverage. Search engines
 * penalise NAP that drifts between pages, and this site previously wrote the
 * phone, email, and service-area list out by hand in seven different files.
 */
export const BUSINESS = {
  name: "Firm Foundation Property Services",
  shortName: "Firm Foundation",
  url: "https://firmfoundationsc.com",
  owner: "Josiah Lammers",
  phone: "(843) 998-5593",
  phoneHref: "tel:8439985593",
  email: "josiahlammers1@gmail.com",
  instagram: "https://www.instagram.com/firmfoundation_chs",
  googleReviewsUrl:
    "https://search.google.com/local/reviews?placeid=ChIJ5eaJLR-TCSgRcovM30Gs8yw",
  /** Built from the same place_id api/reviews.ts pins; used in schema sameAs. */
  googleMapsUrl:
    "https://www.google.com/maps/place/?q=place_id:ChIJ5eaJLR-TCSgRcovM30Gs8yw",
  address: {
    locality: "Mount Pleasant",
    region: "SC",
    postalCode: "29464",
    country: "US",
  },
} as const;

/**
 * Towns and cities we cover. These are real municipalities, so they're the
 * only ones that belong in `areaServed` as schema.org City nodes — and the map,
 * the footer, and the prerendered fallback list all read from this same array
 * so they can never disagree about coverage again.
 */
export const serviceAreas: {
  name: string;
  coords: [number, number];
  tooltipDir: "top" | "bottom" | "left" | "right";
  tooltipOffset: [number, number];
}[] = [
  { name: "Mount Pleasant", coords: [32.7933, -79.8772], tooltipDir: "top", tooltipOffset: [0, -10] },
  { name: "Isle of Palms", coords: [32.7866, -79.7868], tooltipDir: "right", tooltipOffset: [10, 0] },
  { name: "Sullivan's Island", coords: [32.7658, -79.8375], tooltipDir: "bottom", tooltipOffset: [0, 10] },
  { name: "Daniel Island", coords: [32.859, -79.902], tooltipDir: "top", tooltipOffset: [0, -10] },
  { name: "Charleston", coords: [32.7765, -79.9311], tooltipDir: "left", tooltipOffset: [-10, 0] },
  { name: "West Ashley", coords: [32.799, -79.984], tooltipDir: "left", tooltipOffset: [-10, 0] },
  { name: "James Island", coords: [32.733, -79.945], tooltipDir: "bottom", tooltipOffset: [0, 10] },
  { name: "Johns Island", coords: [32.7, -80.03], tooltipDir: "left", tooltipOffset: [-10, 0] },
  { name: "Folly Beach", coords: [32.6552, -79.9404], tooltipDir: "bottom", tooltipOffset: [0, 10] },
];

export const serviceAreaNames = serviceAreas.map((a) => a.name);

/**
 * Neighbourhoods inside Mount Pleasant. Worth naming in copy because people
 * search for them, but they are not municipalities — listing them as schema
 * City nodes (as the homepage used to) is simply incorrect.
 */
export const neighborhoods = ["Dunes West", "Park West", "Rivertowne", "Belle Hall"];

/** schema.org areaServed nodes, derived so schema can't drift from the map. */
export const areaServedSchema = serviceAreaNames.map((name) => ({
  "@type": "City" as const,
  name,
  addressRegion: BUSINESS.address.region,
}));

/** schema.org PostalAddress, shared by every page that emits LocalBusiness. */
export const postalAddressSchema = {
  "@type": "PostalAddress" as const,
  addressLocality: BUSINESS.address.locality,
  addressRegion: BUSINESS.address.region,
  postalCode: BUSINESS.address.postalCode,
  addressCountry: BUSINESS.address.country,
};
