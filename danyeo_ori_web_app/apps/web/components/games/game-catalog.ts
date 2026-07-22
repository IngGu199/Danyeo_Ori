import type { FestivalGameWithFestival } from "@danyeo-ori/types";

export const gameCodes = [
  "obstacle-runner",
  "whack-target",
  "festival-quiz",
  "drag-sort",
  "driving-dodge",
  "word-quiz",
  "slice-object",
] as const;

export type GameCode = (typeof gameCodes)[number];
export type GameIconName = "runner" | "tap" | "quiz" | "drag" | "drive" | "word" | "slice";

export interface GameCatalogEntry {
  code: GameCode;
  title: string;
  type: string;
  summary: string;
  controls: string;
  connection: string;
  scoring: string;
  roulette: string;
  ranking: string;
  expansion: string;
  duration: string;
  icon: GameIconName;
  tone: "moss" | "corn" | "river" | "clean" | "road" | "letter" | "fruit";
  compatibleGameTypes: FestivalGameWithFestival["game_type"][];
}

export const gameCatalog: GameCatalogEntry[] = [
  {
    code: "obstacle-runner",
    title: "장애물 뛰어넘기",
    type: "러너 · 타이밍",
    summary: "달리는 마스코트가 축제 오브젝트를 뛰어넘으며 오래 생존하는 게임입니다.",
    controls: "PC 스페이스바 · 모바일 화면 터치",
    connection: "축제별 마스코트 스킨과 특산물·체험물을 장애물로 연결",
    scoring: "통과 거리 + 연속 회피 + 특산물 수집 보너스",
    roulette: "목표 거리 달성 시 서버 검증 후 최대 1회",
    ranking: "게임별 최고 거리, 동점이면 먼저 달성한 기록 우선",
    expansion: "축제별 코스, 날씨, 장애물 패턴과 캐릭터 스킨을 확장합니다.",
    duration: "30–60초",
    icon: "runner",
    tone: "moss",
    compatibleGameTypes: ["timing"],
  },
  {
    code: "whack-target",
    title: "두더지 잡기형 순발력 게임",
    type: "탭 · 순발력",
    summary: "짧은 시간 동안 나타나는 축제 목표물을 빠르게 찾아 터치하는 게임입니다.",
    controls: "PC 클릭 · 모바일 직접 터치",
    connection: "특산물과 마스코트는 득점, 방해 오브젝트는 감점 대상으로 구성",
    scoring: "정답 터치 + 연속 콤보 − 오답 터치 감점",
    roulette: "정확도와 최소 점수를 함께 충족하면 최대 1회",
    ranking: "제한 시간 내 검증된 최고 점수 순",
    expansion: "등장 속도, 가짜 목표, 연속 콤보 연출과 축제 테마를 추가합니다.",
    duration: "20–30초",
    icon: "tap",
    tone: "corn",
    compatibleGameTypes: ["click"],
  },
  {
    code: "festival-quiz",
    title: "축제 퀴즈 게임",
    type: "퀴즈 · 정보",
    summary: "축제 일정, 지역 이야기와 특산물 정보를 짧은 문제로 익히는 게임입니다.",
    controls: "선택지 클릭 · 모바일 선택지 터치",
    connection: "축제 상세 페이지의 검증된 정보와 지역 콘텐츠를 문제 은행으로 활용",
    scoring: "정답 수 + 연속 정답 + 남은 시간 보너스",
    roulette: "정답률 기준을 통과하면 서버 검증 후 최대 1회",
    ranking: "정답 수, 남은 시간, 먼저 달성한 시각 순",
    expansion: "난이도, 오늘의 문제, 축제 현장 힌트와 해설 카드를 확장합니다.",
    duration: "5문제 · 약 45초",
    icon: "quiz",
    tone: "river",
    compatibleGameTypes: ["quiz"],
  },
  {
    code: "drag-sort",
    title: "쓰레기와 마스코트 드래그 분류",
    type: "드래그 · 분류",
    summary: "빠르게 나타나는 오브젝트를 알맞은 바구니로 옮겨 축제 공간을 정리합니다.",
    controls: "PC 드래그 · 모바일 터치 드래그",
    connection: "지역 특산물, 마스코트, 재활용·일반 쓰레기 분류 규칙을 축제별로 적용",
    scoring: "정확한 분류 + 연속 성공 − 오분류·시간 초과 감점",
    roulette: "정확도 기준과 최소 분류 수를 충족하면 최대 1회",
    ranking: "정확도 우선, 이후 점수와 먼저 달성한 시각 순",
    expansion: "바구니 종류, 낙하 속도, 환경 캠페인 메시지를 단계별로 확장합니다.",
    duration: "30–45초",
    icon: "drag",
    tone: "clean",
    compatibleGameTypes: ["puzzle"],
  },
  {
    code: "driving-dodge",
    title: "회피형 주행 게임",
    type: "주행 · 회피",
    summary: "차량이나 마스코트를 좌우로 움직여 장애물을 피하고 보너스 아이템을 모읍니다.",
    controls: "PC 방향키 · 모바일 좌우 드래그",
    connection: "축제장 진입로, 지역 풍경, 특산물 수집 아이템과 계절 스킨을 연결",
    scoring: "생존 거리 + 아이템 수집 + 근접 회피 보너스",
    roulette: "목표 거리와 비정상 이동 검증을 통과하면 최대 1회",
    ranking: "게임별 최고 거리와 수집 점수 합산 순",
    expansion: "다중 차선, 속도 단계, 지역 랜드마크와 일일 코스를 추가합니다.",
    duration: "45–60초",
    icon: "drive",
    tone: "road",
    compatibleGameTypes: ["timing"],
  },
  {
    code: "word-quiz",
    title: "낱말퀴즈 / 단어퀴즈",
    type: "단어 · 퍼즐",
    summary: "축제명, 지역명, 특산물과 대표 체험을 초성·빈칸·조합 문제로 맞힙니다.",
    controls: "키보드 입력 · 모바일 키패드와 선택 타일",
    connection: "축제 상세 정보의 고유명사와 검증된 지역 키워드를 문제로 활용",
    scoring: "정답 난이도 + 연속 정답 + 힌트 미사용 보너스",
    roulette: "정해진 문제 수를 완료하고 최소 점수를 넘으면 최대 1회",
    ranking: "난이도 가중 점수, 남은 시간, 먼저 달성한 시각 순",
    expansion: "초성, 단어 조합, 빈칸 채우기와 주간 문제 묶음을 확장합니다.",
    duration: "5문제 · 약 60초",
    icon: "word",
    tone: "letter",
    compatibleGameTypes: ["puzzle"],
  },
  {
    code: "slice-object",
    title: "푸르츠 닌자형 베기 게임",
    type: "스와이프 · 액션",
    summary: "날아오는 특산물을 베어 점수를 얻고 쓰레기와 마스코트는 피하는 게임입니다.",
    controls: "PC 포인터 드래그 · 모바일 스와이프",
    connection: "제철 특산물은 득점, 쓰레기는 감점, 마스코트는 큰 감점 대상으로 구성",
    scoring: "특산물 베기 + 콤보 − 방해물·마스코트 감점",
    roulette: "최소 점수와 마스코트 보호 조건을 통과하면 최대 1회",
    ranking: "검증된 최고 점수, 동점이면 먼저 달성한 기록 우선",
    expansion: "다중 베기, 희귀 특산물, 계절별 오브젝트와 보스 라운드를 추가합니다.",
    duration: "30–45초",
    icon: "slice",
    tone: "fruit",
    compatibleGameTypes: ["timing"],
  },
];

export function getGameCatalogEntry(code: string) {
  return gameCatalog.find((game) => game.code === code);
}

export function getRelatedActiveGame(
  entry: GameCatalogEntry,
  activeGames: FestivalGameWithFestival[],
) {
  return activeGames.find((game) => entry.compatibleGameTypes.includes(game.game_type));
}
