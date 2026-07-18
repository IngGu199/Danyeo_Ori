import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";

export type AdminClient = Awaited<ReturnType<typeof createClient>>;

type AdminAccess =
  | { status: "authenticated"; supabase: AdminClient; userId: string }
  | { status: "unauthenticated"; supabase: AdminClient }
  | { status: "forbidden"; supabase: AdminClient };

export async function getAdminAccess(): Promise<AdminAccess> {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return { status: "unauthenticated", supabase };
  }

  const { data: access, error: accessError } = await supabase
    .from("current_admin_access")
    .select("is_admin")
    .maybeSingle();

  if (accessError) {
    throw new Error("관리자 권한을 확인하지 못했습니다.", { cause: accessError });
  }

  if (!access?.is_admin) {
    return { status: "forbidden", supabase };
  }

  return {
    status: "authenticated",
    supabase,
    userId: userData.user.id,
  };
}

export async function requireAdminPage() {
  const access = await getAdminAccess();

  if (access.status === "unauthenticated") {
    redirect("/login?next=/admin");
  }

  if (access.status === "forbidden") {
    redirect("/admin/forbidden");
  }

  return access;
}
