/** Free Library item: story or song with audio and optional cover. See FREE_LIBRARY_ADMIN.md */
export interface FreeLibraryItem {
  _id: string;
  type: "story" | "song";
  title: string;
  description?: string;
  audioUrl: string;
  coverImageUrl?: string;
  duration?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
