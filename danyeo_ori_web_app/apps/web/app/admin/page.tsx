import type { Metadata } from "next";
import { AdminConsole } from "./admin-console";
import { requireAdminPage } from "../../lib/admin/auth";

export const metadata: Metadata = {
  title: "관리자",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const { supabase } = await requireAdminPage();
  const [festivalResult, gameResult] = await Promise.all([
    supabase.from("festivals").select("*").order("start_date", { ascending: false }).order("name"),
    supabase.from("festival_games").select("*").order("updated_at", { ascending: false }),
  ]);

  if (festivalResult.error || gameResult.error) {
    throw new Error("관리자 운영 데이터를 불러오지 못했습니다.", {
      cause: festivalResult.error ?? gameResult.error,
    });
  }

  return (
    <main>
      <AdminConsole festivals={festivalResult.data} games={gameResult.data} />
    </main>
  );
}
