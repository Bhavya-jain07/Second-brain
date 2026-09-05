export type ContentType = "youtube" | "twitter" | "other";

export interface ContentItem {
  _id: string;
  title: string;
  link: string;
  type: ContentType;
  thumbnail?: string;
  tags?: string[];
  note?: string;
  pinned?: boolean;
  userId: string;
  createdAt: string;
}
