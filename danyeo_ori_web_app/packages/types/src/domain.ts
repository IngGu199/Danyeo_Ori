import type { Database } from "./database.generated";

export type FestivalRow = Database["public"]["Tables"]["festivals"]["Row"];
export type FestivalGameRow = Database["public"]["Tables"]["festival_games"]["Row"];
export type FestivalWithGames = FestivalRow & { festival_games: FestivalGameRow[] };
export type FestivalGameWithFestival = FestivalGameRow & { festival: FestivalRow };
export type GameAttemptRow = Database["public"]["Tables"]["game_attempts"]["Row"];
export type PointWalletRow = Database["public"]["Tables"]["point_wallets"]["Row"];
export type PointTransactionRow = Database["public"]["Tables"]["point_transactions"]["Row"];
export type RewardRow = Database["public"]["Tables"]["rewards"]["Row"];
