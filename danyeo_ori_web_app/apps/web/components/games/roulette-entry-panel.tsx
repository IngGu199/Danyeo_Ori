import { ArrowsClockwise, LockKey, Ticket } from "@phosphor-icons/react/dist/ssr";
import type { GameCatalogEntry } from "./game-catalog";

export function RouletteEntryPanel({ game }: { game: GameCatalogEntry }) {
  return (
    <section className="game-side-panel" aria-labelledby="roulette-entry-title">
      <div className="game-panel-heading">
        <span><Ticket weight="fill" /></span>
        <div><small>Roulette entry</small><h2 id="roulette-entry-title">룰렛 기회</h2></div>
      </div>
      <div className="roulette-entry-count">
        <span>보유 횟수</span><strong>—</strong><small>회</small>
      </div>
      <p>{game.roulette}</p>
      <ol className="server-flow-mini">
        <li><ArrowsClockwise />완료 결과를 서버에서 검증</li>
        <li><LockKey />검증된 횟수만 원장에 적립</li>
        <li><Ticket />서버가 룰렛 결과를 생성·확정</li>
      </ol>
    </section>
  );
}
