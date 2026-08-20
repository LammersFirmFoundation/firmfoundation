import {
  BUSINESS,
  areaServedSchema,
  postalAddressSchema,
  serviceAreas,
} from "@/data/business";
import { services } from "@/data/services";

const ORG_ID = `${BUSINESS.url}/#business`;

/** Mount Pleasant, from the same coordinates the service-area map plots. */
const HQ = serviceAreas.find((a) => a.name === BUSINESS.address.locality)!;

/**
 * The business entity, emitted in full on the homepage.
 *
 * `HomeAndConstructionBusiness` rather than plain LocalBusiness: it is a real,
 * directly-usable schema.org type and the closest honest fit for excavation
 * plus hardscapes, landscaping and tree work. Deliberately NOT
 * `GeneralContractor` — schema.org defines that as a licensed role, and we make
 * no licensing claim anywhere else on the site.
 *
 * Deliberately carries no aggregateRating or Review nodes: Google's structured
 * data policy makes a business republishing reviews about itself ineligible for
 * the star rich result, so that markup could never pay off. The real ratings
 * still render in the page for visitors — they are just not claimed as schema.
 */
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": ORG_ID,
  name: BUSINESS.name,
  description:
    "Family-run property services in Mount Pleasant, SC — small excavation, grading, drainage, and irrigation work, plus landscaping, hardscapes, tree services, and custom projects inside and out across the greater Charleston area.",
  image: `${BUSINESS.url}/og-logo.jpg`,
  logo: `${BUSINESS.url}/favicon-192.png`,
  telephone: BUSINESS.phone,
  email: BUSINESS.email,
  url: BUSINESS.url,
  // A relative price tier, not a cost claim.
  priceRange: "$$",
  founder: { "@type": "Person", name: BUSINESS.owner },
  sameAs: [BUSINESS.instagram, BUSINESS.googleMapsUrl],
  areaServed: areaServedSchema,
  address: postalAddressSchema,
  geo: {
    "@type": "GeoCoordinates",
    latitude: HQ.coords[0],
    longitude: HQ.coords[1],
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    contactType: "customer service",
    areaServed: "Mount Pleasant and the greater Charleston area, SC",
    availableLanguage: "English",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Property Services",
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        serviceType: service.title,
        url: `${BUSINESS.url}/services#${service.slug}`,
        description: service.summary,
      },
    })),
  },
};

/**
 * Reference to the business for use on interior pages.
 *
 * A bare `{ "@id": … }` does not work here: JSON-LD @id resolution happens
 * within a single document, and every route is a separate document to a
 * crawler. A pointer on its own left /services, /gallery, /about and /reviews
 * with no name, phone or address to extract at all. So this carries the
 * identifying properties inline while keeping the same @id, which still ties
 * every page back to one entity.
 */
export const businessRef = {
  "@type": "HomeAndConstructionBusiness",
  "@id": ORG_ID,
  name: BUSINESS.name,
  telephone: BUSINESS.phone,
  email: BUSINESS.email,
  url: BUSINESS.url,
  address: postalAddressSchema,
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BUSINESS.url}/#website`,
  url: BUSINESS.url,
  name: BUSINESS.name,
  publisher: { "@id": ORG_ID },
};

/** Breadcrumb trail for an interior page. */
export const breadcrumbSchema = (name: string, path: string) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BUSINESS.url },
    { "@type": "ListItem", position: 2, name, item: `${BUSINESS.url}${path}` },
  ],
});
