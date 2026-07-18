export interface CommunityPost {
  id: number;
  festival: string;
  category: "공지" | "현장후기" | "질문" | "게임";
  title: string;
  author: string;
  time: string;
  views: number;
}

export type { Database, Json } from "./database.generated";
export type {
  FestivalRow,
  FestivalGameRow,
  FestivalWithGames,
  FestivalGameWithFestival,
  GameAttemptRow,
  PointWalletRow,
  PointTransactionRow,
  RewardRow,
} from "./domain";
