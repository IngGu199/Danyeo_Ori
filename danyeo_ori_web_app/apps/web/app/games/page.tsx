import type { Metadata } from "next";
import { listActiveGames } from "@danyeo-ori/api";
import { GamesContent } from "../../components/games-content";
import { createClient } from "../../lib/supabase/server";
export const metadata: Metadata = { title: "페스티벌 게임" };
export default async function GamesPage() {
  const client = await createClient();
  const games = await listActiveGames(client);
  return <main><GamesContent games={games} /></main>;
}
