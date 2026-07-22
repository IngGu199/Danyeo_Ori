"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, CheckCircle, Clock, Coins, GameController, Sparkle } from "@phosphor-icons/react/dist/ssr";
import type { FestivalGameWithFestival, Json } from "@danyeo-ori/types";
import { getFestivalImage } from "../lib/festival-display";
import { getThemeSeasonFromDate } from "../lib/theme-season";

const rouletteRewards = ["100 P", "500 P", "축제 쿠폰", "다시 한 번", "내일 다시", "200 P"];

function isJsonObject(value: Json): value is { [key: string]: Json | undefined } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getDurationLabel(game: FestivalGameWithFestival) {
  if (isJsonObject(game.rules) && typeof game.rules.duration_seconds === "number") {
    return `${game.rules.duration_seconds}초`;
  }
  const labels: Record<string, string> = { click: "클릭", roulette: "룰렛", quiz: "퀴즈", runner: "러닝" };
  return labels[game.game_type] ?? "미니게임";
}

function getRewardLabel(rewardConfig: Json) {
  if (!isJsonObject(rewardConfig)) return "서버 확정";
  if (typeof rewardConfig.point_amount === "number") return `${rewardConfig.point_amount.toLocaleString()} P`;
  if (Array.isArray(rewardConfig.outcomes)) {
    const points = rewardConfig.outcomes.flatMap((outcome) =>
      isJsonObject(outcome) && typeof outcome.points === "number" ? [outcome.points] : [],
    );
    if (points.length) return `${Math.max(...points).toLocaleString()} P`;
  }
  return "서버 확정";
}

export function GamesContent({ games }: { games: FestivalGameWithFestival[] }) {
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState("오늘의 룰렛 기회를 확인해 보세요.");
  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setMessage("룰렛 결과를 확인하는 중…");
    window.setTimeout(() => {
      setSpinning(false);
      setMessage("MVP에서는 보상을 확정하지 않아요. 운영 버전은 서버가 결과를 검증합니다.");
    }, 1400);
  };

  return (
    <>
      <section>
        <div className="container">
          <div className="roulette-hero">
            <div className="roulette-copy">
              <span className="eyebrow">Daily reward</span>
              <h1>오늘의 축제 룰렛,<br />한 번 돌려볼까요?</h1>
              <p>게임을 끝낸 뒤 열리는 작은 보상이에요. 결과와 포인트 지급은 운영 버전에서 서버가 검증합니다.</p>
              <div className="reward-list">{rouletteRewards.map((reward) => <span className="reward-pill" key={reward}>{reward}</span>)}</div>
              <button className="primary-btn" onClick={spin} type="button" disabled={spinning}>{spinning ? "룰렛 확인 중" : "룰렛 기회 확인"}<ArrowRight weight="bold" /></button>
              <p className="roulette-message" role="status"><CheckCircle weight="fill" />{message}</p>
            </div>
            <div className="roulette-wrap" role="img" aria-label="100 포인트, 500 포인트, 축제 쿠폰 등의 보상이 나뉜 원형 룰렛">
              <span className="roulette-pointer" aria-hidden="true" />
              <div className={spinning ? "reward-wheel spinning" : "reward-wheel"}>
                {rouletteRewards.map((reward, index) => <span className={`wheel-label wheel-label-${index}`} key={reward}>{reward}</span>)}
                <span className="wheel-hub" aria-hidden="true">행운</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head"><div><span className="eyebrow">Festival mini games</span><h2>축제별 미니게임</h2><p>실제 축제의 대표 체험을 짧은 게임 콘셉트로 연결합니다.</p></div></div>
          {games.length ? (
            <div className="game-grid">
              {games.map((game) => (
                <article className="game-card" data-season={getThemeSeasonFromDate(game.festival.start_date)} key={game.id}>
                  <div className="game-cover">
                    <Image src={getFestivalImage(game.festival)} alt={`${game.festival.name} 미니게임 이미지`} fill sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw" />
                    <span className="game-icon"><GameController weight="fill" /></span>
                  </div>
                  <div className="game-body">
                    <span className="card-tag"><Sparkle weight="fill" />{game.festival.name}</span>
                    <h3>{game.title}</h3>
                    <p>{game.description ?? "축제를 미리 체험할 수 있는 짧은 미니게임입니다."}</p>
                    <div className="game-stats">
                      <div className="stat"><Clock weight="fill" /><b>{getDurationLabel(game)}</b> 플레이</div>
                      <div className="stat"><Coins weight="fill" /><b>{getRewardLabel(game.reward_config)}</b> 최대 보상</div>
                    </div>
                    <button className="primary-btn" type="button" onClick={() => setMessage("게임 상세 화면은 다음 MVP 단계에서 연결됩니다. 완료 보상은 서버에서 확정됩니다.")}>게임 상세 보기<ArrowRight weight="bold" /></button>
                  </div>
                </article>
              ))}
            </div>
          ) : <p className="empty-state">아직 플레이 가능한 축제 미니게임이 없어요. 준비 중인 게임을 곧 만날 수 있어요.</p>}
        </div>
      </section>
    </>
  );
}
