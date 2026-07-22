import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listActiveGames } from "@danyeo-ori/api";
import { GameShell } from "../../../components/games/game-shell";
import {
  gameCodes,
  getGameCatalogEntry,
  getRelatedActiveGame,
} from "../../../components/games/game-catalog";
import { createClient } from "../../../lib/supabase/server";
import { getCurrentThemeSeason } from "../../../lib/theme-season";

type GameDetailPageProps = { params: Promise<{ gameCode: string }> };

export function generateStaticParams() {
  return gameCodes.map((gameCode) => ({ gameCode }));
}

export async function generateMetadata({ params }: GameDetailPageProps): Promise<Metadata> {
  const { gameCode } = await params;
  const game = getGameCatalogEntry(gameCode);
  return game
    ? { title: `${game.title} | 페스티벌 게임`, description: game.summary }
    : { title: "게임을 찾을 수 없습니다" };
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  const { gameCode } = await params;
  const game = getGameCatalogEntry(gameCode);
  if (!game) notFound();

  const client = await createClient();
  const activeGames = await listActiveGames(client);
  const activeGame = getRelatedActiveGame(game, activeGames);

  return (
    <main className="game-detail-page" data-season={getCurrentThemeSeason()}>
      <GameShell game={game} activeGame={activeGame} />
    </main>
  );
}
