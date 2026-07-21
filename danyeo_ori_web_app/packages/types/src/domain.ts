import type { Database } from "./database.generated";

export type FestivalRow = Database["public"]["Tables"]["festivals"]["Row"];
export type FestivalGameRow = Database["public"]["Tables"]["festival_games"]["Row"];
export type FestivalWithGames = FestivalRow & { festival_games: FestivalGameRow[] };
export type FestivalGameWithFestival = FestivalGameRow & { festival: FestivalRow };
export type GameAttemptRow = Database["public"]["Tables"]["game_attempts"]["Row"];
export type PointWalletRow = Database["public"]["Tables"]["point_wallets"]["Row"];
export type PointTransactionRow = Database["public"]["Tables"]["point_transactions"]["Row"];
export type RewardRow = Database["public"]["Tables"]["rewards"]["Row"];

export type CommunityPostKind = "review" | "question" | "game";

export interface CommunityFestivalCategory {
  id: string;
  slug: string;
  name: string;
  region: string;
  category: string;
  imagePath: string | null;
}

export interface CommunityFeedPost {
  id: string;
  festivalId: string;
  festivalSlug: string;
  festivalName: string;
  festivalRegion: string;
  festivalCategory: string;
  festivalImagePath: string | null;
  kind: CommunityPostKind;
  title: string;
  author: string;
  content: string;
  imagePath: string | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  likedByMe: boolean;
  isOwner: boolean;
}

export interface CommunityCommentItem {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
  isOwner: boolean;
}
