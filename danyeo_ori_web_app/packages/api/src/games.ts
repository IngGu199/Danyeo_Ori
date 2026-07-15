import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@danyeo-ori/types";

export async function listActiveGames(client: SupabaseClient<Database>, festivalId?: string) {
  let query = client.from("festival_games").select("*").eq("status", "active");
  if (festivalId) query = query.eq("festival_id", festivalId);
  const { data, error } = await query.order("title");
  if (error) throw error;
  return data;
}

export function startGameAttempt(client: SupabaseClient<Database>, gameId: string) {
  return client.functions.invoke("start-game-attempt", {
    body: { gameId, idempotencyKey: crypto.randomUUID() },
  });
}
