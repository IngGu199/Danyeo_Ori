import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@danyeo-ori/types";

export async function listPublishedFestivals(
  client: SupabaseClient<Database>,
  range?: { start: string; end: string },
) {
  let query = client.from("festivals").select("*").eq("status", "published");
  if (range) query = query.lte("start_date", range.end).gte("end_date", range.start);
  const { data, error } = await query.order("start_date");
  if (error) throw error;
  return data;
}
