import { ShieldCheck, Trophy } from "@phosphor-icons/react/dist/ssr";
import type { GameCatalogEntry } from "./game-catalog";

export function GameRankingPanel({ game }: { game: GameCatalogEntry }) {
  return (
    <section className="game-side-panel" aria-labelledby="ranking-title">
      <div className="game-panel-heading">
        <span><Trophy weight="fill" /></span>
        <div><small>Game ranking</small><h2 id="ranking-title">게임 내부 랭킹</h2></div>
      </div>
      <div className="ranking-table-head" aria-hidden="true">
        <span>순위</span><span>닉네임</span><span>점수</span>
      </div>
      <div className="ranking-empty">
        <ShieldCheck weight="duotone" />
        <strong>검증된 기록만 표시됩니다</strong>
        <p>플레이 기능 연결 후 최고 점수, 달성일, 축제명을 서버에서 조회합니다.</p>
      </div>
      <p className="panel-policy">{game.ranking}</p>
    </section>
  );
}
