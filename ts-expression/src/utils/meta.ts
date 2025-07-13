import type { MetaInfo } from '@/types/meta';
import { defaultMeta } from '@/types/meta';

/**
 * メタ情報をマージする関数
 * デフォルト値、ページ固有の値、動的な値を適切に結合
 */
export function mergeMeta(pageMeta: Partial<MetaInfo>, overrides?: Partial<MetaInfo>): MetaInfo {
  return {
    ...defaultMeta,
    ...pageMeta,
    ...overrides,
  };
}

/**
 * 記事用のメタ情報を生成する関数
 */
export function createArticleMeta(
  title: string,
  description: string,
  author: string,
  publishedTime: string,
  options?: {
    keywords?: string[];
    image?: string;
    imageAlt?: string;
    modifiedTime?: string;
  }
): MetaInfo {
  const meta: Partial<MetaInfo> = {
    title,
    description,
    author,
    type: 'article',
    publishedTime,
    modifiedTime: options?.modifiedTime || publishedTime,
    keywords: options?.keywords || [],
  };

  if (options?.image) {
    meta.image = options.image;
  }
  if (options?.imageAlt) {
    meta.imageAlt = options.imageAlt;
  }

  return mergeMeta(meta);
}

/**
 * 製品ページ用のメタ情報を生成する関数
 */
export function createProductMeta(
  title: string,
  description: string,
  price: string,
  options?: {
    keywords?: string[];
    image?: string;
    imageAlt?: string;
    availability?: 'in_stock' | 'out_of_stock';
  }
): MetaInfo {
  const meta: Partial<MetaInfo> = {
    title,
    description,
    type: 'product',
    keywords: options?.keywords || [],
  };

  if (options?.image) {
    meta.image = options.image;
  }
  if (options?.imageAlt) {
    meta.imageAlt = options.imageAlt;
  }

  return mergeMeta(meta);
}

/**
 * URLからページタイトルを生成する関数
 */
export function generateTitleFromPath(path: string, siteName?: string): string {
  const defaultSiteName = defaultMeta.siteName ?? '';
  const finalSiteName = siteName ?? defaultSiteName;
  
  // パスからページ名を推測
  const segments = path.split('/').filter(Boolean);
  
  if (segments.length === 0) {
    return `ホーム - ${finalSiteName}`;
  }
  
  // 最後のセグメントをページ名として使用
  const pageName = segments[segments.length - 1]
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
  
  return `${pageName} - ${finalSiteName}`;
}

/**
 * OGP画像のURLを生成する関数
 */
export function generateOgImageUrl(
  title: string,
  description?: string,
  baseUrl: string = 'https://example.com'
): string {
  const params = new URLSearchParams({
    title,
    ...(description && { description }),
  });
  
  return `${baseUrl}/api/og?${params.toString()}`;
}

/**
 * パンくずリストの構造化データを生成する関数
 */
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

/**
 * 記事の構造化データを生成する関数
 */
export function generateArticleJsonLd(meta: MetaInfo): object {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": meta.title,
    "description": meta.description,
    "author": {
      "@type": "Person",
      "name": meta.author
    },
    "datePublished": meta.publishedTime,
    "dateModified": meta.modifiedTime,
    ...(meta.image && { "image": meta.image }),
    ...(meta.keywords && { "keywords": meta.keywords.join(', ') }),
  };
}

/**
 * FAQの構造化データを生成する関数
 */
export function generateFaqJsonLd(
  faqs: Array<{ question: string; answer: string }>
): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
} 