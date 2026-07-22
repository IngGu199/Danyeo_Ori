import Link from "next/link";
import {
  ArrowRight,
  ArrowsOutCardinal,
  CheckCircle,
  CursorClick,
  Knife,
  PersonSimpleRun,
  Question,
  Sparkle,
  SteeringWheel,
  TextAa,
  Ticket,
  Trophy,
} from "@phosphor-icons/react/dist/ssr";
import type { FestivalGameWithFestival } from "@danyeo-ori/types";
import type { GameCatalogEntry, GameIconName } from "./game-catalog";

const icons = {
  runner: PersonSimpleRun,
  tap: CursorClick,
  quiz: Question,
  drag: ArrowsOutCardinal,
  drive: SteeringWheel,
  word: TextAa,
  slice: Knife,
} satisfies Record<GameIconName, typeof PersonSimpleRun>;

export function GameCard({
  game,
  activeGame,
}: {
  game: GameCatalogEntry;
  activeGame?: FestivalGameWithFestival;
}) {
  const Icon = icons[game.icon];

  return (
    <article className="game-card game-catalog-card" id={`game-${game.code}`}>
      <div className={`game-cover game-concept-cover game-concept-cover-${game.tone}`}>
        <span className="game-type-label">{game.type}</span>
        <Icon aria-hidden="true" weight="duotone" />
        <span className="game-cover-caption">{game.duration}</span>
      </div>
      <div className="game-body">
        <div className="game-card-status-row">
          <span className="card-tag"><Sparkle weight="fill" />{activeGame?.festival.name ?? "축제 테마 연결 가능"}</span>
          <span className="preparing-badge"><CheckCircle weight="fill" />기획 완료</span>
        </div>
        <h3>{game.title}</h3>
        <p className="game-summary">{game.summary}</p>
        <dl className="game-spec-list">
          <div><dt>조작</dt><dd>{game.controls}</dd></div>
          <div><dt>연결</dt><dd>{game.connection}</dd></div>
          <div><dt>점수</dt><dd>{game.scoring}</dd></div>
          <div><dt>보상</dt><dd>{game.roulette}</dd></div>
          <div><dt>확장</dt><dd>{game.expansion}</dd></div>
        </dl>
        <div className="game-capabilities" aria-label="지원 예정 기능">
          <span><Ticket weight="fill" />룰렛 기회</span>
          <span><Trophy weight="fill" />게임별 랭킹</span>
        </div>
        <Link className="primary-btn" href={`/games/${game.code}`}>
          게임 준비 중 <ArrowRight weight="bold" />
        </Link>
      </div>
    </article>
  );
}
