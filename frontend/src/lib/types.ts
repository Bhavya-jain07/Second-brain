export type ContentType = "youtube" | "twitter" | "file" | "other";

export interface ContentItem {
  _id: string;
  title: string;
  link: string;
  type: ContentType;
  thumbnail?: string;
  fileName?: string;
  fileMimeType?: string;
  fileSize?: number;
  tags?: string[];
  note?: string;
  pinned?: boolean;
  userId: string;
  createdAt: string;
}
