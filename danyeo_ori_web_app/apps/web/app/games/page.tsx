import type { Metadata } from "next";
import { GamesContent } from "../../components/games-content";
export const metadata: Metadata = { title: "페스티벌 게임" };
export default function GamesPage() { return <main><GamesContent /></main>; }
