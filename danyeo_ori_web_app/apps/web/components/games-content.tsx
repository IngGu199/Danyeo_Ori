"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  LockKey,
  ShieldCheck,
  Ticket,
} from "@phosphor-icons/react/dist/ssr";
import type { FestivalGameWithFestival } from "@danyeo-ori/types";
import { GameCard } from "./games/game-card";
import { gameCatalog, getRelatedActiveGame } from "./games/game-catalog";

const rouletteRewards = ["100 P", "500 P", "축제 쿠폰", "다시 한 번", "내일 다시", "200 P"];

export function GamesContent({ games }: { games: FestivalGameWithFestival[] }) {
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState("예시 화면에서는 랜덤한 결과를 보여주지 않습니다. 실제 룰렛과 결과는 실제 런칭 후 보여드립니다.");

  const previewServerCheck = () => {
    if (spinning) return;
    setSpinning(true);
    setMessage("예상 흐름 보여주는 중…");
    window.setTimeout(() => {
      setSpinning(false);
      setMessage("예시 화면에서는 랜덤한 결과를 보여주지 않습니다. 실제 룰렛과 결과는 실제 런칭 후 보여드립니다.");
    }, 1400);
  };

  return (
    <>
      <section>
        <div className="container">
          <div className="roulette-hero">
            <div className="roulette-copy">
              <span className="eyebrow">Get Reward</span>
              <h1>마일리지를 획득하세요!</h1>
              <p>마일리지를 얻어, 지역으로 나아가세요!</p>
              <div className="reward-list">{rouletteRewards.map((reward) => <span className="reward-pill" key={reward}>{reward}</span>)}</div>
              <button className="primary-btn" onClick={previewServerCheck} type="button" disabled={spinning}>
                {spinning ? "돌리는 중" : "룰렛 돌리기"}<ArrowRight weight="bold" />
              </button>
              <p className="roulette-message" role="status"><CheckCircle weight="fill" />{message}</p>
            </div>
            <div className="roulette-wrap" role="img" aria-label="예상 룰렛">
              <span className="roulette-pointer" aria-hidden="true" />
              <div className={spinning ? "reward-wheel spinning" : "reward-wheel"}>
                {rouletteRewards.map((reward, index) => <span className={`wheel-label wheel-label-${index}`} key={reward}>{reward}</span>)}
                <span className="wheel-hub" aria-hidden="true">룰렛</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section games-catalog-section">
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">Seven game concepts</span><h2>7가지 축제 미니게임</h2><p>다양한 게임을 즐기세요!</p></div>
            <span className="catalog-count">7개 전체 공개</span>
          </div>
          <div className="game-grid">
            {gameCatalog.map((game) => (
              <GameCard game={game} activeGame={getRelatedActiveGame(game, games)} key={game.code} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft game-security-section">
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">Game flow</span><h2>게임을 플레이하세요!</h2><p>각 게임을 플레이하여 각 지역의 지역화폐를 얻어보세요!</p></div>
          </div>
          <ol className="game-security-flow">
            <li><span><Ticket weight="duotone" /></span><b>1. 게임을 찾으세요!</b><p>리스트에서 원하는 게임을 찾으세요!</p></li>
            <li><span><ShieldCheck weight="duotone" /></span><b>2. 게임을 플레이하세요!</b><p>다양한 소재의 게임을 10~30초 사이의 미니게임으로 즐기세요!</p></li>
            <li><span><LockKey weight="duotone" /></span><b>3. 룰렛을 돌리세요!</b><p>게임별 룰렛을 돌려, 마일리지를 획득하세요!</p></li>
          </ol>
        </div>
      </section>
    </>
  );
}
