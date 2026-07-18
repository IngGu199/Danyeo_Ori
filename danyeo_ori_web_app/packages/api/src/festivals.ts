import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, FestivalWithGames } from "@danyeo-ori/types";
import { listActiveGames } from "./games";

export async function listPublishedFestivals(client: SupabaseClient<Database>) {
  const { data, error } = await client
    .from("festivals")
    .select("*")
    .eq("status", "published")
    .order("start_date")
    .order("name");
  if (error) throw error;
  return data;
}

export async function listPublishedFestivalsByDateRange(
  client: SupabaseClient<Database>,
  range: { start: string; end: string },
) {
  const { data, error } = await client
    .from("festivals")
    .select("*")
    .eq("status", "published")
    .lte("start_date", range.end)
    .gte("end_date", range.start)
    .order("start_date")
    .order("name");
  if (error) throw error;
  return data;
}

export async function listPublishedFestivalsWithGames(
  client: SupabaseClient<Database>,
): Promise<FestivalWithGames[]> {
  const [festivals, games] = await Promise.all([
    listPublishedFestivals(client),
    listActiveGames(client),
  ]);
  const gamesByFestival = new Map<string, typeof games>();

  for (const game of games) {
    const festivalGames = gamesByFestival.get(game.festival_id) ?? [];
    festivalGames.push(game);
    gamesByFestival.set(game.festival_id, festivalGames);
  }

  return festivals.map((festival) => ({
    ...festival,
    festival_games: gamesByFestival.get(festival.id) ?? [],
  }));
}
