import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@danyeo-ori/types";

export interface PreRegistrationInput {
  festivalId: string;
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
