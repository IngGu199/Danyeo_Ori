import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@danyeo-ori/types";
import { supabasePublicEnv } from "./env";

export async function createClient() {
  const cookieStore = await cookies();
  const { url, publishableKey } = supabasePublicEnv();

  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Component에서는 쿠키를 쓸 수 없으므로 middleware가 세션을 갱신한다.
        }
      },
    },
  });
}
