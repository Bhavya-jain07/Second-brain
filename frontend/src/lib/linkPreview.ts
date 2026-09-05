import { ContentType } from "./types";

const YOUTUBE_REGEX = /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/;
const TWITTER_REGEX = /(?:twitter\.com|x\.com)\/[^/]+\/status\/\d+/;

export function detectType(url: string): ContentType {
  if (YOUTUBE_REGEX.test(url)) return "youtube";
  if (TWITTER_REGEX.test(url)) return "twitter";
  return "other";
}

export interface LinkPreview {
  title: string;
  thumbnail?: string;
}

/**
 * Fetches a title + thumbnail for a dropped/pasted link using public,
 * key-free oEmbed endpoints. Falls back to the raw URL as the title if the
 * oEmbed call fails (e.g. offline, or the link doesn't support oEmbed).
 */
export async function fetchLinkPreview(url: string, type: ContentType): Promise<LinkPreview> {
  try {
    if (type === "youtube") {
      const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
      if (res.ok) {
        const data = await res.json();
        return { title: data.title ?? url, thumbnail: data.thumbnail_url };
      }
    }

    if (type === "twitter") {
      const res = await fetch(`https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const data = await res.json();
        return { title: data.author_name ? `Tweet by ${data.author_name}` : url };
      }
    }
  } catch {
    // network hiccup or blocked request — fall through to the default below
  }

  return { title: url };
}
