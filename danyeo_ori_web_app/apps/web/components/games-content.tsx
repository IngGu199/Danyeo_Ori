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
  const [message, setMessage] = useState("게임 완료 후 서버가 검증한 룰렛 횟수만 사용할 수 있어요.");

  const previewServerCheck = () => {
    if (spinning) return;
    setSpinning(true);
    setMessage("서버 검증 흐름을 미리 보여드리는 중…");
    window.setTimeout(() => {
      setSpinning(false);
      setMessage("예시 화면에서는 결과를 확정하지 않아요. 실제 룰렛 결과는 서버가 생성합니다.");
    }, 1400);
  };

  return (
    <>
      <section>
        <div className="container">
          <div className="roulette-hero">
            <div className="roulette-copy">
              <span className="eyebrow">Verified game reward</span>
              <h1>게임으로 얻은 룰렛,<br />서버가 안전하게 지켜요</h1>
              <p>게임 결과가 검증되면 룰렛 기회가 적립되고, 보유 횟수만큼 사용할 수 있어요. 최종 결과와 포인트 지급은 서버에서만 확정합니다.</p>
              <div className="reward-list">{rouletteRewards.map((reward) => <span className="reward-pill" key={reward}>{reward}</span>)}</div>
              <button className="primary-btn" onClick={previewServerCheck} type="button" disabled={spinning}>
                {spinning ? "검증 흐름 확인 중" : "보상 흐름 미리보기"}<ArrowRight weight="bold" />
              </button>
              <p className="roulette-message" role="status"><CheckCircle weight="fill" />{message}</p>
            </div>
            <div className="roulette-wrap" role="img" aria-label="서버 검증 후 사용할 수 있는 예시 보상 룰렛">
              <span className="roulette-pointer" aria-hidden="true" />
              <div className={spinning ? "reward-wheel spinning" : "reward-wheel"}>
                {rouletteRewards.map((reward, index) => <span className={`wheel-label wheel-label-${index}`} key={reward}>{reward}</span>)}
                <span className="wheel-hub" aria-hidden="true">서버 확정</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section games-catalog-section">
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">Seven game concepts</span><h2>7가지 축제 미니게임</h2><p>특정 게임 하나를 고르지 않고, 모든 게임의 조작·점수·보상 확장 방향을 먼저 준비했습니다.</p></div>
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
            <div><span className="eyebrow">Server verified flow</span><h2>점수·룰렛·랭킹은 같은 검증 기록을 사용해요</h2><p>브라우저는 플레이 이벤트를 제출하지만 최종 상태는 직접 수정하지 못합니다.</p></div>
          </div>
          <ol className="game-security-flow">
            <li><span><Ticket weight="duotone" /></span><b>1. 시도 발급</b><p>로그인 사용자가 서버에서 만료 시간과 중복 방지 키가 있는 게임 시도를 발급받습니다.</p></li>
            <li><span><ShieldCheck weight="duotone" /></span><b>2. 결과 검증</b><p>플레이 시간, 점수 범위, 이벤트 수와 룰 버전을 서버에서 비교합니다.</p></li>
            <li><span><LockKey weight="duotone" /></span><b>3. 원자적 반영</b><p>검증된 기록만 랭킹 후보와 룰렛 기회 원장에 한 번만 반영합니다.</p></li>
          </ol>
        </div>
      </section>
    </>
  );
}
