import { createClient, type SupabaseClient, type User } from "npm:@supabase/supabase-js@2";
import { HttpError } from "./errors.ts";

function requiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function publishableKey(): string {
  return Deno.env.get("SUPABASE_ANON_KEY")
    ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY")
    ?? requiredEnv("SUPABASE_ANON_KEY");
}

function secretKey(): string {
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    ?? Deno.env.get("SUPABASE_SECRET_KEY")
    ?? requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
}

export function createServiceClient(): SupabaseClient {
  return createClient(requiredEnv("SUPABASE_URL"), secretKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function requireUser(request: Request): Promise<User> {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    throw new HttpError(401, "로그인이 필요합니다.");
  }

  const client = createClient(requiredEnv("SUPABASE_URL"), publishableKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: authorization } },
  });
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new HttpError(401, "유효하지 않은 인증 정보입니다.");
  if (!data.user.email_confirmed_at) throw new HttpError(403, "이메일 인증이 필요합니다.");
  return data.user;
}
