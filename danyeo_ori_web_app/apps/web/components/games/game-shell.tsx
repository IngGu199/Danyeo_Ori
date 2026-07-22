import Link from "next/link";
import {
  ArrowLeft,
  ArrowsOutCardinal,
  CursorClick,
  Knife,
  PersonSimpleRun,
  Question,
  ShieldCheck,
  SteeringWheel,
  TextAa,
} from "@phosphor-icons/react/dist/ssr";
import type { FestivalGameWithFestival } from "@danyeo-ori/types";
import type { GameCatalogEntry, GameIconName } from "./game-catalog";
import { GameRankingPanel } from "./game-ranking-panel";
import { PlayableGame } from "./playable-game";
import { RouletteEntryPanel } from "./roulette-entry-panel";

const icons = {
  runner: PersonSimpleRun,
  tap: CursorClick,
  quiz: Question,
  drag: ArrowsOutCardinal,
  drive: SteeringWheel,
  word: TextAa,
  slice: Knife,
} satisfies Record<GameIconName, typeof PersonSimpleRun>;

export function GameShell({
  game,
  activeGame,
}: {
  game: GameCatalogEntry;
  activeGame?: FestivalGameWithFestival;
}) {
  const Icon = icons[game.icon];

  return (
    <div className="container game-detail-container">
      <Link className="game-back-link" href="/games"><ArrowLeft weight="bold" />전체 게임으로</Link>
      <header className="game-detail-head">
        <div>
          <span className="eyebrow">Festival mini game concept</span>
          <h1>{game.title}</h1>
          <p>{game.summary}</p>
          <div className="game-detail-tags">
            <span>{game.type}</span><span>{game.duration}</span><span>{activeGame?.festival.name ?? "축제 테마 연결 예정"}</span>
          </div>
        </div>
        <div className={`game-detail-icon game-concept-cover-${game.tone}`}><Icon weight="duotone" /></div>
      </header>

      <div className="game-detail-layout">
        <div className="game-detail-main">
          <section className="game-stage-placeholder" aria-labelledby="game-stage-title">
            <PlayableGame game={game} activeGameId={activeGame?.id} />
          </section>

          <section className="game-rule-section">
            <div><span>01</span><h3>조작 방식</h3><p>{game.controls}</p></div>
            <div><span>02</span><h3>점수 기준</h3><p>{game.scoring}</p></div>
            <div><span>03</span><h3>축제 연결</h3><p>{game.connection}</p></div>
            <div><span>04</span><h3>확장 방향</h3><p>{game.expansion}</p></div>
          </section>

          <section className="verification-callout">
            <ShieldCheck weight="duotone" />
            <div><h2>최종 점수는 서버가 확정합니다</h2><p><code>start-game-attempt</code>로 시도를 발급하고, 완료 이벤트의 시간·점수 범위·이벤트 수·중복 키를 검증한 뒤에만 기록과 룰렛 기회를 반영합니다.</p></div>
          </section>
        </div>
        <aside className="game-detail-aside">
          <RouletteEntryPanel game={game} />
          <GameRankingPanel game={game} />
        </aside>
      </div>
    </div>
  );
}
