"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GameCatalogEntry, GameCode } from "./game-catalog";

export interface GameResult {
  score: number;
  clientEventCount: number;
  summary: string;
}

type SessionStatus = "ready" | "playing" | "result";
type CanvasGameCode = "obstacle-runner" | "whack-target" | "driving-dodge" | "slice-object";

const prototypeDetails: Record<GameCode, { title: string; description: string; emoji: string; hint: string; highScore: number }> = {
  "obstacle-runner": {
    title: "1. 산수유 꿀길 달리기",
    description: "마스코트 오리가 산수유 꽃길을 달립니다! 장애물(바위, 쓰레기)을 스페이스바 또는 터치로 점프하고 꽃을 모으세요.",
    emoji: "🏃🐥",
    hint: "[스페이스바] 또는 [화면 터치]하여 점프!",
    highScore: 1200,
  },
  "whack-target": {
    title: "2. 마스코트 쏙쏙! 두더지 잡기",
    description: "3x3 구멍에서 튀어나오는 마스코트 오리와 산수유 열매를 순발력 있게 클릭하세요! 폭탄과 쓰레기는 탭하지 마세요.",
    emoji: "🔨🐥",
    hint: "튀어나오는 특산물과 오리를 빠르게 터치하세요!",
    highScore: 850,
  },
  "festival-quiz": {
    title: "3. 구례 & 축제 상식 퀴즈",
    description: "구례 산수유꽃축제 및 지역 정보 관련 퀴즈를 제한 시간 내에 맞춰 포인트를 획득하세요.",
    emoji: "💡❓",
    hint: "올바른 정답 버튼을 선택하세요!",
    highScore: 1000,
  },
  "drag-sort": {
    title: "4. 특산물 vs 쓰레기 분리수거",
    description: "화면 중앙에 나타나는 물건 중 '지역 특산물'은 오른쪽 보물상자로, '쓰레기'는 왼쪽 쓰레기통으로 드래그하세요!",
    emoji: "📦↔️",
    hint: "좌우 버튼이나 드래그를 이용해 바르게 분류하세요!",
    highScore: 900,
  },
  "driving-dodge": {
    title: "5. 산수유 꽃길 드라이브",
    description: "3개 차선에서 위에서 내려오는 수많은 장애물을 자동차/오리로 피하며 꽃을 모으세요!",
    emoji: "🚗💨",
    hint: "[방향키 ← →] 또는 [좌/우 화면 터치]하여 차선 이동!",
    highScore: 1100,
  },
  "word-quiz": {
    title: "6. 산수유 초성 낱말 맞추기",
    description: "제시되는 초성 힌트(예: ㅅㅅㅇ)와 설명을 보고 알맞은 구례 축제 관련 단어를 맞추세요.",
    emoji: "🔤🧩",
    hint: "보기에서 올바른 글자를 눌러 단어를 완성하세요!",
    highScore: 800,
  },
  "slice-object": {
    title: "7. 특산물 싹둑! 슬라이스",
    description: "공중으로 올라오는 특산물(산수유, 오이, 감)을 마우스/손가락으로 베어내세요! 오리 마스코트를 베면 안 됩니다.",
    emoji: "⚔️🍒",
    hint: "마우스를 드래그하여 날아오는 열매를 싹둑 베어내세요!",
    highScore: 1500,
  },
};

let audioContext: AudioContext | null = null;

function playSound(type: "jump" | "score" | "correct" | "hit" | "wrong" | "slice") {
  try {
    audioContext ??= new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    const now = audioContext.currentTime;

    if (type === "jump") {
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(150, now);
      oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.15);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
      oscillator.start(now);
      oscillator.stop(now + 0.15);
    } else if (type === "score" || type === "correct") {
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(523.25, now);
      oscillator.frequency.setValueAtTime(659.25, now + 0.08);
      oscillator.frequency.setValueAtTime(783.99, now + 0.16);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
      oscillator.start(now);
      oscillator.stop(now + 0.25);
    } else if (type === "hit" || type === "wrong") {
      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(200, now);
      oscillator.frequency.linearRampToValueAtTime(80, now + 0.2);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      oscillator.start(now);
      oscillator.stop(now + 0.2);
    } else {
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(800, now);
      oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
      oscillator.start(now);
      oscillator.stop(now + 0.1);
    }
  } catch {
    // 브라우저가 Web Audio를 허용하지 않아도 게임은 계속 진행한다.
  }
}

function CanvasPrototypeGame({ code, onScore, onEvent, onFinish }: {
  code: CanvasGameCode;
  onScore: (delta: number) => void;
  onEvent: () => void;
  onFinish: (message: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let running = true;
    let animationFrame = 0;
    const cleanups: Array<() => void> = [];
    const finish = (message: string) => {
      if (!running) return;
      running = false;
      playSound("hit");
      onFinish(message);
    };

    if (code === "obstacle-runner") {
      const duck = { x: 50, y: 280, vy: 0, grounded: true };
      const obstacles: Array<{ x: number; type: string }> = [];
      const flowers: Array<{ x: number; y: number }> = [];
      let spawnTimer = 0;
      const jump = () => {
        onEvent();
        if (duck.grounded) {
          duck.vy = -12;
          duck.grounded = false;
          playSound("jump");
        }
      };
      const onKey = (event: KeyboardEvent) => {
        if (event.code === "Space" || event.code === "ArrowUp") {
          event.preventDefault();
          jump();
        }
      };
      window.addEventListener("keydown", onKey);
      canvas.addEventListener("pointerdown", jump);
      cleanups.push(() => window.removeEventListener("keydown", onKey), () => canvas.removeEventListener("pointerdown", jump));

      const loop = () => {
        if (!running) return;
        duck.y += duck.vy;
        duck.vy += 0.65;
        if (duck.y >= 280) {
          duck.y = 280;
          duck.vy = 0;
          duck.grounded = true;
        }

        spawnTimer += 1;
        if (spawnTimer % 90 === 0) {
          if (Math.random() > 0.3) obstacles.push({ x: 620, type: Math.random() > 0.5 ? "🪨" : "🗑️" });
          else flowers.push({ x: 620, y: 220 + Math.random() * 40 });
        }

        context.fillStyle = "#bae6fd";
        context.fillRect(0, 0, 600, 380);
        context.fillStyle = "#84cc16";
        context.fillRect(0, 320, 600, 60);
        context.font = "36px sans-serif";
        context.fillText("🐥", duck.x, duck.y + 30);

        for (let index = obstacles.length - 1; index >= 0; index -= 1) {
          const obstacle = obstacles[index];
          obstacle.x -= 5.5;
          context.font = "28px sans-serif";
          context.fillText(obstacle.type, obstacle.x, 310);
          if (Math.abs(obstacle.x - duck.x) < 25 && duck.y > 240) {
            finish("장애물에 걸렸습니다!");
            return;
          }
        }

        for (let index = flowers.length - 1; index >= 0; index -= 1) {
          const flower = flowers[index];
          flower.x -= 5.5;
          context.font = "24px sans-serif";
          context.fillText("🌼", flower.x, flower.y);
          if (Math.abs(flower.x - duck.x) < 30 && Math.abs(flower.y - duck.y) < 40) {
            onScore(100);
            playSound("score");
            flowers.splice(index, 1);
          }
        }
        animationFrame = requestAnimationFrame(loop);
      };
      loop();
    }

    if (code === "whack-target") {
      const holes = [
        { x: 100, y: 100 }, { x: 300, y: 100 }, { x: 500, y: 100 },
        { x: 100, y: 220 }, { x: 300, y: 220 }, { x: 500, y: 220 },
        { x: 100, y: 320 }, { x: 300, y: 320 }, { x: 500, y: 320 },
      ];
      let activeMole: { index: number; type: string } | null = null;
      let moleTimer = 0;
      const onPointer = (event: PointerEvent) => {
        if (!activeMole) return;
        onEvent();
        const rect = canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) * (600 / rect.width);
        const mouseY = (event.clientY - rect.top) * (380 / rect.height);
        const hole = holes[activeMole.index];
        if (Math.hypot(mouseX - hole.x, mouseY - (hole.y - 20)) < 40) {
          if (activeMole.type === "💣") finish("폭탄을 터뜨렸습니다!");
          else if (activeMole.type === "🗑️") { onScore(-100); playSound("wrong"); }
          else { onScore(150); playSound("score"); }
          activeMole = null;
        }
      };
      canvas.addEventListener("pointerdown", onPointer);
      cleanups.push(() => canvas.removeEventListener("pointerdown", onPointer));

      const loop = () => {
        if (!running) return;
        moleTimer += 1;
        if (moleTimer % 45 === 0 || !activeMole) {
          const types = ["🐥", "🍒", "🌰", "🗑️", "💣"];
          activeMole = { index: Math.floor(Math.random() * holes.length), type: types[Math.floor(Math.random() * types.length)] };
        }
        context.fillStyle = "#4ade80";
        context.fillRect(0, 0, 600, 380);
        holes.forEach((hole, index) => {
          context.fillStyle = "#78350f";
          context.beginPath();
          context.ellipse(hole.x, hole.y, 40, 20, 0, 0, Math.PI * 2);
          context.fill();
          if (activeMole?.index === index) {
            context.font = "36px sans-serif";
            context.fillText(activeMole.type, hole.x - 18, hole.y - 15);
          }
        });
        animationFrame = requestAnimationFrame(loop);
      };
      loop();
    }

    if (code === "driving-dodge") {
      let lane = 1;
      const laneX = [150, 300, 450];
      const enemies: Array<{ lane: number; y: number }> = [];
      const flowers: Array<{ lane: number; y: number }> = [];
      let driveTimer = 0;
      const toggleLane = () => { onEvent(); lane = (lane + 1) % 3; playSound("jump"); };
      const onKey = (event: KeyboardEvent) => {
        if (event.code === "ArrowLeft") { onEvent(); lane = Math.max(0, lane - 1); playSound("jump"); }
        else if (event.code === "ArrowRight") { onEvent(); lane = Math.min(2, lane + 1); playSound("jump"); }
      };
      window.addEventListener("keydown", onKey);
      canvas.addEventListener("pointerdown", toggleLane);
      cleanups.push(() => window.removeEventListener("keydown", onKey), () => canvas.removeEventListener("pointerdown", toggleLane));

      const loop = () => {
        if (!running) return;
        driveTimer += 1;
        if (driveTimer % 40 === 0) {
          const objectLane = Math.floor(Math.random() * 3);
          if (Math.random() > 0.4) enemies.push({ lane: objectLane, y: -40 });
          else flowers.push({ lane: objectLane, y: -40 });
        }
        context.fillStyle = "#334155";
        context.fillRect(0, 0, 600, 380);
        context.strokeStyle = "#fde047";
        context.setLineDash([20, 20]);
        context.beginPath();
        context.moveTo(225, 0); context.lineTo(225, 380);
        context.moveTo(375, 0); context.lineTo(375, 380);
        context.stroke();
        context.font = "36px sans-serif";
        context.fillText("🚗", laneX[lane] - 18, 330);

        for (let index = enemies.length - 1; index >= 0; index -= 1) {
          const enemy = enemies[index];
          enemy.y += 6;
          context.fillText("🚧", laneX[enemy.lane] - 18, enemy.y);
          if (enemy.lane === lane && Math.abs(enemy.y - 330) < 30) {
            finish("장애물과 충돌했습니다!");
            return;
          }
        }
        for (let index = flowers.length - 1; index >= 0; index -= 1) {
          const flower = flowers[index];
          flower.y += 6;
          context.fillText("🌼", laneX[flower.lane] - 18, flower.y);
          if (flower.lane === lane && Math.abs(flower.y - 330) < 30) {
            onScore(100);
            playSound("score");
            flowers.splice(index, 1);
          }
        }
        animationFrame = requestAnimationFrame(loop);
      };
      loop();
    }

    if (code === "slice-object") {
      const targets: Array<{ x: number; y: number; vx: number; vy: number; type: string }> = [];
      const pointerPath: Array<{ x: number; y: number }> = [];
      let sliceTimer = 0;
      const onPointerMove = (event: PointerEvent) => {
        onEvent();
        const rect = canvas.getBoundingClientRect();
        pointerPath.push({ x: (event.clientX - rect.left) * (600 / rect.width), y: (event.clientY - rect.top) * (380 / rect.height) });
        if (pointerPath.length > 8) pointerPath.shift();
      };
      canvas.addEventListener("pointermove", onPointerMove);
      cleanups.push(() => canvas.removeEventListener("pointermove", onPointerMove));

      const loop = () => {
        if (!running) return;
        sliceTimer += 1;
        if (sliceTimer % 35 === 0) {
          targets.push({ x: 100 + Math.random() * 400, y: 380, vx: (Math.random() - 0.5) * 4, vy: -11 - Math.random() * 3, type: Math.random() > 0.25 ? "🍒" : "🐥" });
        }
        context.fillStyle = "#2e1065";
        context.fillRect(0, 0, 600, 380);

        for (let index = targets.length - 1; index >= 0; index -= 1) {
          const target = targets[index];
          target.x += target.vx;
          target.y += target.vy;
          target.vy += 0.3;
          context.font = "36px sans-serif";
          context.fillText(target.type, target.x, target.y);
          if (pointerPath.length > 1) {
            const last = pointerPath[pointerPath.length - 1];
            if (Math.hypot(last.x - target.x, last.y - target.y) < 30) {
              if (target.type === "🐥") {
                finish("마스코트 오리를 베었습니다! 폭발!");
                return;
              }
              onScore(100);
              playSound("slice");
              targets.splice(index, 1);
            }
          }
        }
        if (pointerPath.length > 1) {
          context.strokeStyle = "#facc15";
          context.lineWidth = 4;
          context.beginPath();
          context.moveTo(pointerPath[0].x, pointerPath[0].y);
          for (let index = 1; index < pointerPath.length; index += 1) context.lineTo(pointerPath[index].x, pointerPath[index].y);
          context.stroke();
        }
        animationFrame = requestAnimationFrame(loop);
      };
      loop();
    }

    return () => {
      running = false;
      cancelAnimationFrame(animationFrame);
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [code, onEvent, onFinish, onScore]);

  return <canvas ref={canvasRef} width={600} height={380} className="prototype-game-canvas" aria-label="미니게임 플레이 화면" />;
}

const quizData = [
  { q: "구례 산수유꽃축제가 열리는 대표적인 마을은 어디일까요?", answers: ["산동면 산수유마을", "해운대 마을", "남이섬 마을", "한옥 마을"], correct: 0 },
  { q: "산수유 꽃의 상징적인 아름다운 색깔은 무엇일까요?", answers: ["분홍색", "노란색", "파란색", "보라색"], correct: 1 },
  { q: "다음 중 구례를 품고 있는 유명한 국립공원 산은?", answers: ["설악산", "한라산", "지리산", "태백산"], correct: 2 },
  { q: "산수유 열매는 주로 어떤 몸에 좋은 건강 효능이 있을까요?", answers: ["원기 회복 & 피로 회복", "이빨 강화", "시력 폭발", "키 성장"], correct: 0 },
];

function PrototypeQuiz({ onScore, onEvent, onFinish }: { onScore: (delta: number) => void; onEvent: () => void; onFinish: (message: string) => void }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const question = quizData[questionIndex];
  const answer = (selected: number) => {
    onEvent();
    if (selected !== question.correct) {
      playSound("wrong");
      window.alert("틀렸습니다! 다시 도전해보세요.");
      return;
    }
    onScore(250);
    playSound("correct");
    if (questionIndex === quizData.length - 1) onFinish("축제 퀴즈 만점 달성! 축제 박사 인증 🏆");
    else setQuestionIndex((value) => value + 1);
  };
  return (
    <div className="prototype-html-overlay">
      <div className="prototype-question-card">
        <span className="prototype-label amber">QUESTION {questionIndex + 1} / {quizData.length}</span>
        <h3>{question.q}</h3>
        <div className="prototype-answer-list">{question.answers.map((option, index) => <button key={option} type="button" onClick={() => answer(index)}>{index + 1}. {option}</button>)}</div>
      </div>
    </div>
  );
}

const sortItems = [
  { name: "산수유 열매", specialty: true, icon: "🍒" },
  { name: "플라스틱 병", specialty: false, icon: "🍾" },
  { name: "구례 오이", specialty: true, icon: "🥒" },
  { name: "비닐봉지", specialty: false, icon: "🛍️" },
  { name: "지리산 꿀", specialty: true, icon: "🍯" },
  { name: "담배꽁초", specialty: false, icon: "🚬" },
];

function PrototypeSort({ onScore, onEvent, onFinish }: { onScore: (delta: number) => void; onEvent: () => void; onFinish: (message: string) => void }) {
  const [itemIndex, setItemIndex] = useState(0);
  const item = sortItems[itemIndex];
  const choose = (specialty: boolean) => {
    onEvent();
    if (item.specialty === specialty) { onScore(150); playSound("score"); }
    else playSound("wrong");
    if (itemIndex === sortItems.length - 1) onFinish("분리수거 완료! 환경과 축제를 모두 지켰습니다!");
    else setItemIndex((value) => value + 1);
  };
  return (
    <div className="prototype-html-overlay">
      <div className="prototype-sorter">
        <h3>오브젝트를 바른 분류함으로 분류하세요!</h3>
        <div className="prototype-sort-item"><span>{item.icon}</span><small>{item.name}</small></div>
        <div className="prototype-sort-buttons">
          <button className="trash" type="button" onClick={() => choose(false)}><span>🗑️</span><b>쓰레기통 (LEFT)</b></button>
          <button className="specialty" type="button" onClick={() => choose(true)}><span>🎁</span><b>특산물 상자 (RIGHT)</b></button>
        </div>
      </div>
    </div>
  );
}

const wordData = [
  { hint: "노란 봄꽃이 만발하는 구례의 대표 축제 꽃 이름은?", initials: "ㅅㅅㅇ", answer: "산수유" },
  { hint: "산수유 축제가 열리는 아름다운 지역 시/군 이름은?", initials: "ㄱㄹ", answer: "구례" },
  { hint: "구례를 품고 있는 대한민국 대표 국립공원 산 이름은?", initials: "ㅈㄹㅅ", answer: "지리산" },
];

function PrototypeWord({ onScore, onEvent, onFinish }: { onScore: (delta: number) => void; onEvent: () => void; onFinish: (message: string) => void }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [value, setValue] = useState("");
  const word = wordData[wordIndex];
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onEvent();
    if (value.trim() !== word.answer) {
      playSound("wrong");
      window.alert("틀렸습니다! 초성과 힌트를 다시 확인하세요.");
      return;
    }
    onScore(300);
    playSound("correct");
    setValue("");
    if (wordIndex === wordData.length - 1) onFinish("낱말 맞추기 완벽 통과! 축제 단어 마스터!");
    else setWordIndex((current) => current + 1);
  };
  return (
    <div className="prototype-html-overlay">
      <div className="prototype-question-card word">
        <span className="prototype-label indigo">WORD QUIZ {wordIndex + 1} / {wordData.length}</span>
        <p>{word.hint}</p>
        <div className="prototype-initials">[ {word.initials} ]</div>
        <form className="prototype-word-form" onSubmit={submit}><input value={value} onChange={(event) => setValue(event.target.value)} placeholder="정답 입력" aria-label="정답 입력" /><button type="submit">확인</button></form>
      </div>
    </div>
  );
}

function PrototypeStage({ game, onComplete, onAbort }: { game: GameCatalogEntry; onComplete: (result: GameResult) => void; onAbort: () => void }) {
  const details = prototypeDetails[game.code];
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const eventCountRef = useRef(0);
  const finishedRef = useRef(false);
  const addScore = useCallback((delta: number) => {
    scoreRef.current = Math.max(0, scoreRef.current + delta);
    setScore(scoreRef.current);
  }, []);
  const registerEvent = useCallback(() => { eventCountRef.current += 1; }, []);
  const finish = useCallback((message: string) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onComplete({ score: scoreRef.current, clientEventCount: eventCountRef.current, summary: message });
  }, [onComplete]);

  return (
    <div className="prototype-stage">
      <div className="prototype-stage-bar">
        <div><button type="button" onClick={onAbort}>◀ MENU</button><h2>{details.title}</h2></div>
        <div><span>SCORE: <strong>{score}</strong></span><span>HIGH: <strong>{Math.max(details.highScore, score)}</strong></span></div>
      </div>
      <div className="prototype-viewport">
        {(game.code === "obstacle-runner" || game.code === "whack-target" || game.code === "driving-dodge" || game.code === "slice-object") && <CanvasPrototypeGame code={game.code} onScore={addScore} onEvent={registerEvent} onFinish={finish} />}
        {game.code === "festival-quiz" && <PrototypeQuiz onScore={addScore} onEvent={registerEvent} onFinish={finish} />}
        {game.code === "drag-sort" && <PrototypeSort onScore={addScore} onEvent={registerEvent} onFinish={finish} />}
        {game.code === "word-quiz" && <PrototypeWord onScore={addScore} onEvent={registerEvent} onFinish={finish} />}
      </div>
      <div className="prototype-control-bar"><span>🎮 {details.hint}</span><button type="button">ACTION BTN</button></div>
    </div>
  );
}

export function PlayableGame({ game }: { game: GameCatalogEntry; activeGameId?: string }) {
  const details = prototypeDetails[game.code];
  const [status, setStatus] = useState<SessionStatus>("ready");
  const [result, setResult] = useState<GameResult>();

  const start = () => setStatus("playing");

  const complete = (gameResult: GameResult) => {
    setResult(gameResult);
    setStatus("result");
  };

  const reset = () => {
    setResult(undefined);
    setStatus("ready");
  };

  if (status === "ready") {
    return (
      <div className="prototype-start-overlay">
        <div>{details.emoji}</div>
        <h2>{details.title}</h2>
        <p>{details.description}</p>
        <button type="button" onClick={start}>[ GAME START ]</button>
      </div>
    );
  }

  if (status === "playing") return <PrototypeStage game={game} onComplete={complete} onAbort={reset} />;

  return (
    <div className="prototype-game-over">
      <div>💥</div>
      <h2>GAME OVER</h2>
      <p>{result?.summary}</p>
      <strong>최종 점수: {result?.score ?? 0}점</strong>
      <small>이 프로토타입 점수는 랭킹·포인트·룰렛에 반영되지 않습니다.</small>
      <div><button type="button" onClick={reset}>RETRY 🔄</button><button type="button" onClick={reset}>MENU 🏠</button></div>
    </div>
  );
}
