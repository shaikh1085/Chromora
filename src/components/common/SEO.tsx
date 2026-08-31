import React, { useEffect } from 'react';
import { SEOConfig } from '../../types';

export const SEO: React.FC<{ config: SEOConfig }> = ({ config }) => {
  const {
    title,
    description,
    canonicalUrl,
    ogType = 'website',
    ogImage = '/og-image.png',
    keywords,
    robots = 'index, follow',
    breadcrumbs,
    faqs,
    softwareApp,
  } = config;

  const siteName = 'Chromora';
  const fullTitle = title.includes('Chromora') ? title : `${title} | ${siteName}`;
  const keywordsString = keywords ? keywords.join(', ') : '';

  useEffect(() => {
    document.title = fullTitle;

    // Helper to set or create meta tags
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('robots', robots);
    if (keywordsString) {
      setMeta('keywords', keywordsString);
    }
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:type', ogType, true);
    setMeta('og:image', ogImage, true);
    setMeta('og:site_name', siteName, true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:image', ogImage);

    // Canonical link
    if (canonicalUrl) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonicalUrl);
    }
  }, [fullTitle, description, canonicalUrl, ogType, ogImage, robots, keywordsString]);

  // Construct JSON-LD schemas
  const schemas: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      alternateName: 'Chromora Color Platform',
      url: 'https://chromora.app',
      description: 'Intelligent color discovery, palette generation, and WCAG accessibility contrast platform.',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Chromora',
      url: 'https://chromora.app',
      logo: 'https://chromora.app/logo.png',
      slogan: 'Create colors that work beautifully.',
    },
  ];

  if (softwareApp) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: softwareApp.name,
      description: softwareApp.description,
      applicationCategory: softwareApp.applicationCategory || 'DesignApplication',
      operatingSystem: 'Any Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
      },
    });
  }

  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((b, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: b.name,
        item: b.url,
      })),
    });
  }

  if (faqs && faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    });
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
};
