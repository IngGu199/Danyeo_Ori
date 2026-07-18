import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, FestivalGameWithFestival } from "@danyeo-ori/types";

export async function listActiveGames(
  client: SupabaseClient<Database>,
  festivalId?: string,
): Promise<FestivalGameWithFestival[]> {
  let query = client
    .from("festival_games")
    .select("*, festival:festivals!inner(*)")
    .eq("status", "active")
    .eq("festival.status", "published");
  if (festivalId) query = query.eq("festival_id", festivalId);
  const { data, error } = await query.order("title");
  if (error) throw error;

  const now = Date.now();
  return data.filter((game) => {
    const startsAt = game.starts_at ? Date.parse(game.starts_at) : Number.NEGATIVE_INFINITY;
    const endsAt = game.ends_at ? Date.parse(game.ends_at) : Number.POSITIVE_INFINITY;
    return startsAt <= now && now <= endsAt;
  });
}

export function startGameAttempt(client: SupabaseClient<Database>, gameId: string) {
  return client.functions.invoke("start-game-attempt", {
    body: { gameId, idempotencyKey: crypto.randomUUID() },
  });
}
