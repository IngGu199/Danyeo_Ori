import { createClient } from "@supabase/supabase-js";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} 환경 변수가 필요합니다.`);
  return value;
}

export function createAdminClient() {
  const secret = process.env.SUPABASE_SECRET_KEY
    ?? process.env.SUPABASE_SERVICE_ROLE_KEY
    ?? requiredEnv("SUPABASE_SECRET_KEY");
  return createClient(requiredEnv("SUPABASE_URL"), secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function requiredArgument(value: string | undefined, description: string): string {
  if (!value?.trim()) throw new Error(`${description} 인수가 필요합니다.`);
  return value.trim();
}
