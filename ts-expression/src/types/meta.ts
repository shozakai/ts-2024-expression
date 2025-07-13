export interface MetaInfo {
  title: string;
  description: string;
  keywords?: string[];
  author?: string;
  image?: string;
  imageAlt?: string;
  url?: string;
  siteName?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  locale?: string;
  canonicalUrl?: string;
  robots?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export interface LayoutProps {
  meta: MetaInfo;
  lang?: string;
  class?: string;
}

// デフォルトのメタ情報
export const defaultMeta: MetaInfo = {
  title: 'Astro TypeScript Expression',
  description: 'Astro、TypeScript、TailwindCSS、SASSを使用したモダンなWebサイト',
  keywords: ['Astro', 'TypeScript', 'TailwindCSS', 'SASS', 'Web Development'],
  author: 'Developer',
  type: 'website',
  twitterCard: 'summary_large_image',
  locale: 'ja_JP',
  robots: 'index, follow',
  siteName: 'Astro TS Expression',
}; 