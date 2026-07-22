---
name: danyeo-ori-minigame
description: Design, implement, review, or extend Danyeo Ori festival minigames in the Next.js web app, including reusable templates, React or Phaser selection, mobile controls, Supabase attempt and reward integration, asset placement, accessibility, performance, and verification. Use for playable game work, game-detail routes, game rules and scoring, roulette eligibility, rankings, festival-specific variants, or preparing web games for later Expo use.
---

# 다녀오리 미니게임 제작

## 먼저 확인하기

1. 루트 `AGENTS.md`와 `progress.md`를 읽는다.
2. `danyeo_ori_web_app/DESIGN.md`의 미니게임·픽셀 표현층·접근성 규칙을 읽는다.
3. `danyeo_ori_web_app/IMAGE_ASSETS.md`와 현재 게임 카탈로그·상세 셸을 확인한다.
4. DB나 보상 경계를 바꾸면 `../danyeo-ori-db-change/SKILL.md`도 읽는다.
5. 현재 코드·DB 기준선은 [references/project-baseline.md](references/project-baseline.md)를 확인한다.

현재 코드와 `progress.md`가 문서 예시보다 우선한다. 현재 카탈로그에 없는 여덟 번째 게임이나 보상 규칙을 임의로 확정하지 않는다.

## 제품 계약 정의하기

게임을 구현하기 전에 다음을 먼저 정한다.

- 축제의 어떤 대표 체험이나 정보를 미리 경험하게 하는가
- 사용자가 10~60초 안에 조작을 이해하고 완료할 수 있는가
- 한 손 터치와 마우스·키보드를 모두 지원하는가
- 성공, 실패, 재시도 조건이 수치로 명확한가
- 서버가 검증할 입력과 결과는 무엇인가
- 축제별로 코드 복제 없이 교체할 규칙, 문구, 에셋은 무엇인가
- 연습 모드와 보상 가능한 시도를 구분할 필요가 있는가

재미만 있는 범용 게임보다 축제 프로그램, 특산물, 지역 이야기, 교통·주차 정보를 자연스럽게 전달하는 게임을 우선한다. 실시간 멀티플레이, 자체 결제, 복잡한 실시간 랭킹은 웹 MVP에서 제외한다.

## 기술 선택하기

| 조건 | 기본 선택 |
|---|---|
| 퀴즈, 단어, 카드, 단순 탭, 제한된 드래그, 게이지 타이밍 | React Client Component + TypeScript + CSS |
| 좌표 기반 드래그·스와이프지만 오브젝트 수가 적음 | React + Pointer Events, 필요할 때 Canvas 보조 |
| 매 프레임 이동, 충돌, 카메라, 다수 스프라이트, 물리 판정 | Phaser + TypeScript |
| 서버 데이터 조회, 메타데이터, 접근 권한 | Next.js Server Component 또는 서버 경계 |

간단한 게임에 Phaser를 도입하지 않는다. Phaser가 필요한 러너·주행·베기 게임은 Client Component에서 동적으로 import하고 SSR을 끈다. 엔진과 대형 에셋을 실제 플레이 진입 전까지 지연 로딩한다.

React 웹 UI를 Expo React Native 컴포넌트로 직접 공유하지 않는다. 다음만 공유한다.

- `packages/types`: 규칙, 상태, 결과, API 계약 타입
- `packages/api`: 게임 시작·완료·보상 요청
- `packages/utils`: seed 규칙, 점수 계산, 순수 판정 함수

웹 UI는 `apps/web`에 둔다. Expo 초기 버전은 WebView 또는 DOM Component로 웹 게임을 재사용할 수 있지만, 네이티브 품질이 필요한 게임은 UI를 별도로 구현한다.

## 재사용 구조 만들기

다음 책임을 분리한다.

```txt
게임 페이지/셸
  ├─ attempt 시작과 인증 상태
  ├─ 공통 HUD와 상태 전환
  ├─ 게임 템플릿
  │    ├─ 렌더링과 입력
  │    └─ 순수 규칙·점수 계산
  ├─ 축제별 설정과 에셋 경로
  └─ 결과 제출과 보상 확인
```

현재 7개 콘셉트 카탈로그를 한 번에 플레이 가능한 코드로 바꾸지 않는다. 첫 번째 게임에서 공통 계약과 서버 흐름을 검증한 뒤 나머지 게임에 적용한다. 기존 UI와 사용자 변경을 보존하고 대규모 경로 이동은 별도 작업으로 다룬다.

게임 모듈은 다음 책임만 가진다.

```ts
interface GameModuleProps {
  attemptId: string;
  seed: string;
  rules: GameRules;
  assets: GameAssets;
  onComplete(result: GameResult): void;
  onAbort(): void;
}
```

게임 모듈은 포인트 지갑을 수정하거나 룰렛 결과를 생성하지 않는다. 플레이 결과만 상위 셸에 전달한다.

## 상태 모델 지키기

```txt
잠김 → 준비 → 플레이 중 → 성공 / 실패 / 재시도
     → 결과 검증 중 → 결과 확정 → 보상 확인 중 → 보상 확정
```

- `준비`에서 조작법, 제한 시간, 성공 조건, 보상 가능 여부를 알린다.
- `플레이 중`에는 의도하지 않은 이동과 페이지 스크롤을 막는다.
- `결과 검증 중`에는 포인트가 지급되었다고 표시하지 않는다.
- 네트워크 실패와 게임 실패를 구분한다.
- 중복 제출에는 같은 idempotency key를 사용한다.
- 창이 숨겨지거나 앱이 백그라운드로 가면 타이머와 애니메이션을 일시 정지한다.

## 서버 검증 연결하기

보상 가능한 플레이는 다음 순서를 사용한다.

```txt
start-game-attempt
→ attemptId, 규칙 버전, seed 또는 서버 기준값 수신
→ 클라이언트에서 플레이
→ complete-game-attempt에 결과 제출
→ 시간·점수·이벤트 수·중복·규칙 버전 검증
→ claim-reward 또는 서버 확정 보상
→ point_transactions 원장 반영
```

매 탭과 매 프레임을 Supabase에 저장하지 않는다. 기본 요청은 시작 1회와 완료 1회로 제한하고, 필요한 경우 압축된 입력 요약이나 재현 가능한 이벤트 로그를 제출한다.

다음을 서버에서 검증한다.

- attempt 소유자와 게임 ID
- 시작·종료 시간과 허용 플레이 시간
- 규칙 버전과 seed
- 점수 범위와 이론상 증가 속도
- 입력 이벤트 수와 점수의 일관성
- 일일 시도 횟수와 rate limit
- 완료·보상 idempotency key
- 이미 완료되거나 지급된 attempt인지 여부

브라우저 결과를 완전히 신뢰할 수 없음을 전제로 한다. 고가 보상을 피하고 일일 한도, 이상 기록 검토, 중복 차단을 함께 둔다.

룰렛은 여덟 번째 플레이 게임이 아니라 공통 보상 표현층으로 취급한다. 클라이언트는 서버가 확정한 룰렛 결과를 애니메이션으로 보여주기만 한다.

## 축제별 변형 만들기

조작과 판정이 같다면 새 게임 코드를 복제하지 말고 같은 템플릿에서 다음만 바꾼다.

- 축제·행사 ID
- 제목, 안내 문구, 해설
- 난이도와 제한 시간
- 목표 점수와 오브젝트 구성
- 에셋 기본 경로
- 보상 설정과 활성 기간

현재 `festival_games.game_type`만으로 템플릿 구분이 부족하면 `template_key`와 `template_version` 도입을 검토한다. 기존 enum과 적용된 마이그레이션을 직접 수정하지 않는다.

## 에셋 관리하기

- 코드와 함께 고정되는 게임 에셋은 `apps/web/public/images/games/<game-slug>/`에 둔다.
- 여러 게임의 승인된 공통 UI는 `apps/web/public/images/games/shared/`에 둔다.
- 관리자가 교체하는 축제별 에셋과 대량 동적 업로드는 Supabase Storage를 사용한다.
- DB에는 바이너리나 만료 signed URL 대신 bucket과 object path를 저장한다.
- Storage 파일은 같은 경로를 덮어쓰기보다 UUID 또는 버전 경로를 사용한다.
- 참고, 프리뷰, 저작권 검토 전 원본은 루트 `Documents/`에 두고 Git에 추가하지 않는다.
- 운영 에셋은 저작자, 원본, 라이선스, 상업적 이용, 수정 허용, 확인일을 기록한다.

## 모바일·접근성·성능 지키기

- 390px 세로 화면을 기본 모바일 플레이 화면으로 검증한다.
- 주요 터치 대상은 최소 52×52px로 만든다.
- Pointer Events로 터치, 펜, 마우스를 함께 처리한다.
- 키보드 대체 조작과 보이는 포커스를 제공한다.
- 필수 상태를 색, 진동, 소리 하나에만 의존하지 않는다.
- 음향은 사용자 입력 후 시작하고 음소거 옵션을 제공한다.
- `prefers-reduced-motion`에서 흔들림, 빠른 카메라, 연속 파티클을 줄인다.
- 타이머는 실제 경과 시간을 기준으로 하고 `setInterval` 누적 오차에 의존하지 않는다.
- DPR과 화면 크기가 달라도 판정 좌표와 렌더링 좌표를 일치시킨다.
- 저사양 모바일에서 과도한 리렌더링과 긴 메인 스레드 작업을 피한다.

## 검증하기

변경 범위에 맞춰 다음을 수행한다.

1. 순수 점수·판정 함수 단위 테스트
2. 시작, 성공, 실패, 재시도, 네트워크 오류 상태 테스트
3. 중복 완료와 중복 보상 테스트
4. 비정상 점수, 너무 짧은 시간, 과도한 이벤트 수 거절 테스트
5. 390px 모바일과 데스크톱의 터치·키보드 조작 확인
6. 저감 모션과 음소거 확인
7. 관련 pgTAP 또는 Edge Function 테스트
8. Node 22에서 typecheck, lint, production build
9. `git diff --check`와 `git status --short`

Cloud 마이그레이션, secret 등록, Edge Function 배포, Vercel 배포는 사용자의 별도 요청 없이 수행하지 않는다.

## 완료 보고하기

- 구현한 게임 템플릿과 축제별 설정 범위를 구분한다.
- 클라이언트 판정과 서버 검증 경계를 설명한다.
- 추가·변경한 에셋의 출처와 저장 위치를 밝힌다.
- 모바일, 접근성, 성능, 보안 테스트 결과를 구분해 보고한다.
- 실제 보상이 연결되지 않았으면 완료된 보상처럼 표현하지 않는다.
