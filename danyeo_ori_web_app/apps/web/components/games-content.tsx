"use client";

import { useState } from "react";

const games = [
  ["fish", "🐟", "화천 산천어축제", "산천어 낚시 타이밍", "찌가 움직이는 순간을 눌러 제한 시간 안에 산천어를 잡는 타이밍 게임.", "15초", "500 P"],
  ["corn", "🌽", "홍천 찰옥수수 축제", "옥수수 빨리 먹기", "10초 동안 화면을 빠르게 탭해 옥수수 게이지를 100% 채우는 게임.", "10초", "300 P"],
  ["mud", "🛝", "보령머드축제", "머드 슬라이드 런", "장애물을 피하며 머드 슬라이드 결승선까지 내려가는 반응형 러닝 게임.", "20초", "700 P"],
  ["chicken", "🍲", "금산 삼계탕축제", "삼계탕 재료 맞히기", "제한 시간 안에 인삼·대추·찹쌀 등 올바른 재료를 골라 담는 퀴즈.", "5문제", "250 P"],
  ["water", "💦", "장수 쿨밸리 페스티벌", "계곡 물살 피하기", "좌우 버튼으로 바위를 피하고 시원한 계곡 코스를 완주하는 게임.", "25초", "600 P"],
  ["default", "🧩", "울산조선해양축제", "배 조립 퍼즐", "흩어진 선박 부품을 올바른 위치에 배치해 제한 시간 안에 완성합니다.", "8조각", "400 P"]
];

export function GamesContent() {
  const [spinning, setSpinning] = useState(false); const [message, setMessage] = useState("오늘의 룰렛 기회를 확인해 보세요.");
  const spin = () => { if (spinning) return; setSpinning(true); setMessage("룰렛 결과를 확인하는 중…"); window.setTimeout(() => { setSpinning(false); setMessage("MVP에서는 보상을 확정하지 않아요. 운영 버전은 서버가 결과를 검증합니다."); }, 1400); };
  return <><section><div className="container"><div className="roulette-hero"><div><span className="eyebrow lime">Daily roulette</span><h1>오늘의 축제 룰렛<br />한 번 돌려볼까요?</h1><p>운영 버전에서는 출석·광고·게임 완료 후 룰렛 기회가 활성화되고, 결과와 포인트 지급은 서버에서 확정됩니다.</p><div className="reward-list">{["100 P", "500 P", "축제 쿠폰", "다시 한 번", "꽝"].map((reward) => <span className="reward-pill" key={reward}>{reward}</span>)}</div><button className="primary-btn lime-btn" onClick={spin} type="button" disabled={spinning}>{spinning ? "룰렛 확인 중" : "룰렛 기회 확인"}</button><p className="roulette-message" role="status">{message}</p></div><div className="roulette-wrap"><span className="roulette-pointer" /><div className={`roulette-wheel ${spinning ? "spinning" : ""}`} /></div></div></div></section><section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow">Festival mini games</span><h2>축제별 미니게임</h2><p>실제 축제의 대표 체험을 짧은 게임 콘셉트로 연결합니다.</p></div></div><div className="game-grid">{games.map(([cover, icon, festival, title, description, duration, reward]) => <article className="game-card" key={title}><div className={`game-cover ${cover === "default" ? "" : cover}`}><span className="game-icon">{icon}</span></div><div className="game-body"><span className="card-tag">{festival}</span><h3>{title}</h3><p>{description}</p><div className="game-stats"><div className="stat"><b>{duration}</b>플레이</div><div className="stat"><b>{reward}</b>최대 보상</div></div><button className="primary-btn" type="button" onClick={() => alert("게임 상세 화면은 다음 MVP 단계에서 연결됩니다.")}>게임 상세 보기</button></div></article>)}</div></div></section></>;
}
