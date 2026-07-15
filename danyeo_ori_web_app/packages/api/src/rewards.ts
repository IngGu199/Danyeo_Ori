import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@danyeo-ori/types";

export async function listMyRewards(client: SupabaseClient<Database>) {
  const { data, error } = await client.from("rewards").select("*").order("issued_at", { ascending: false });
  if (error) throw error;
  return data;
}

export function claimGameReward(client: SupabaseClient<Database>, attemptId: string) {
  return client.functions.invoke("claim-reward", {
    body: { attemptId, idempotencyKey: crypto.randomUUID() },
  });
}
