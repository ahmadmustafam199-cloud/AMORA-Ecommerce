import { useEffect } from "react";

const SITE_NAME = "AMORA – Elegance & Style";

// IMPORTANT:
// Deployment ke baad YOUR-DOMAIN.com ko apne real domain se replace karna.
const SITE_URL = "https://YOUR-DOMAIN.com";

function SEO({
  title = "AMORA – Elegance & Style | Premium Fashion & Lifestyle",
  description = "Shop premium fashion, shoes, bags, electronics, beauty, sports and lifestyle products at AMORA. Discover quality products, modern style and a seamless online shopping experience.",
  image = "/Image/Logo.png",
  url = "/",
  noIndex = false,
}) {
  useEffect(() => {
    // -----------------------------------------
    // TITLE
    // -----------------------------------------
    document.title = title;

    // -----------------------------------------
    // Helper: Create / Update Meta Tag
    // -----------------------------------------
    const setMeta = (name, content, attribute = "name") => {
      if (!content) return;

      let element = document.head.querySelector(
        `meta[${attribute}="${name}"]`
      );

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    // -----------------------------------------
    // Helper: Create / Update Link Tag
    // -----------------------------------------
    const setLink = (rel, href) => {
      let element = document.head.querySelector(
        `link[rel="${rel}"]`
      );

      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }

      element.setAttribute("href", href);
    };

    // -----------------------------------------
    // Full URL
    // -----------------------------------------
    const fullUrl = `${SITE_URL}${url}`;

    const fullImageUrl = image.startsWith("http")
      ? image
      : `${SITE_URL}${image}`;

    // -----------------------------------------
    // Basic SEO
    // -----------------------------------------
    setMeta("description", description);

    setMeta(
      "robots",
      noIndex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large"
    );

    // -----------------------------------------
    // Canonical
    // -----------------------------------------
    setLink("canonical", fullUrl);

    // -----------------------------------------
    // Open Graph
    // -----------------------------------------
    setMeta("og:type", "website", "property");
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", fullUrl, "property");
    setMeta("og:site_name", SITE_NAME, "property");
    setMeta("og:image", fullImageUrl, "property");

    // -----------------------------------------
    // Twitter / X
    // -----------------------------------------
    setMeta(
      "twitter:card",
      "summary_large_image"
    );

    setMeta("twitter:title", title);

    setMeta(
      "twitter:description",
      description
    );

    setMeta(
      "twitter:image",
      fullImageUrl
    );

    // -----------------------------------------
    // Cleanup on route change
    // -----------------------------------------
    return () => {
      // SEO values will be replaced by
      // the next page/component.
    };
  }, [
    title,
    description,
    image,
    url,
    noIndex,
  ]);

  return null;
}

export default SEO;