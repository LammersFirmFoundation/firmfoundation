import { Head } from "vite-react-ssg";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  type?: string;
  image?: string;
  keywords?: string;
  noindex?: boolean;
  jsonLd?: object;
}

const SITE_URL = "https://firmfoundationsc.com";
const SITE_NAME = "Firm Foundation Property Services";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

const SEO = ({
  title,
  description,
  canonical,
  type = "website",
  image,
  keywords,
  noindex,
  jsonLd,
}: SEOProps) => {
  const fullTitle = title.includes("Firm Foundation") ? title : `${title} | ${SITE_NAME}`;
  // Escape `$` as \u0024: the static head is injected with a String.replace,
  // which treats `$$` as an escape sequence and was silently shipping
  // priceRange "$$" to crawlers as "$". JSON decodes \u0024 back to `$`, so
  // the structured data itself is unchanged.
  const jsonLdText = jsonLd
    ? JSON.stringify(jsonLd).replace(/\$/g, "\\u0024")
    : undefined;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : undefined;
  const ogImage = image || DEFAULT_OG_IMAGE;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {noindex && <meta name="robots" content="noindex" />}
      {keywords && <meta name="keywords" content={keywords} />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="A flagstone walkway installed by Firm Foundation in Mount Pleasant, SC" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content="A flagstone walkway installed by Firm Foundation in Mount Pleasant, SC" />

      <meta name="geo.region" content="US-SC" />
      <meta name="geo.placename" content="Mount Pleasant" />

      {jsonLdText && (
        <script type="application/ld+json">{jsonLdText}</script>
      )}
    </Head>
  );
};

export default SEO;
