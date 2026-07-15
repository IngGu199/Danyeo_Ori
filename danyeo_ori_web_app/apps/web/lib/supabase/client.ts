import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@danyeo-ori/types";
import { supabasePublicEnv } from "./env";

export function createClient() {
  const { url, publishableKey } = supabasePublicEnv();
  return createBrowserClient<Database>(url, publishableKey);
}
