import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@danyeo-ori/types";

export interface PreRegistrationInput {
  name: string;
  phone: string;
  consentVersion: string;
  privacyConsent: true;
}

export function submitPreRegistration(
  client: SupabaseClient<Database>,
  input: PreRegistrationInput,
) {
  return client.functions.invoke("submit-pre-registration", { body: input });
}

export async function getPreRegistrationCount(
  client: SupabaseClient<Database>,
) {
  const { data, error } = await client.rpc("get_pre_registration_count");
  if (error) throw error;
  return Number(data ?? 0);
}
