# 다녀오리 Codex 작업 규약

이 파일은 다녀오리 프로젝트에서 Codex가 지속적으로 따라야 하는 구현 기준이다. 세부 일정·완료 기준은 `plan.md`, 실제 작업 현황은 `progress.md`에서 관리한다.

## 서비스 목표와 MVP 우선순위

다녀오리는 사용자가 지역축제를 미니게임으로 미리 체험하고, 축제별 마일리지와 현장 혜택을 통해 실제 방문·소비로 이어지게 하는 O2O 플랫폼이다.

1. 웹 MVP를 먼저 완성한다.
2. 사전예약, 축제 탐색, 미니게임, 게임 로그, 포인트 원장을 우선 구현한다.
3. 관리자 페이지를 구축해 운영 기반을 마련한다.
4. 모바일 앱·광고·지도·푸시알림은 웹 MVP 검증 후 확장한다.
5. 복잡한 지도 추천, 실시간 랭킹, 자체 결제, 멀티플레이는 초기 MVP 범위에서 제외한다.

## 기술 스택

```txt
Next.js + Expo React Native + Supabase + TypeScript + Turborepo
```

| 영역 | 기준 기술 |
|---|---|
| 웹·관리자 | Next.js + TypeScript + Tailwind CSS |
| 모바일 | Expo Router + React Native + NativeWind |
| 백엔드·인증·DB | Supabase + PostgreSQL + Supabase Auth |
| 보안·보상 | Supabase RLS + Edge Functions |
| 공통 코드 | Turborepo의 `packages/types`, `packages/api`, `packages/utils` |
| 배포 | Vercel, Supabase Cloud, EAS Build |

## 목표 프로젝트 구조

```txt
apps/
  web/          # Next.js 웹 MVP·관리자
  mobile/       # Expo 앱
packages/
  types/        # 웹·앱 공유 TypeScript 타입
  api/          # 공유 API 클라이언트
  utils/        # 공유 유틸리티
  constants/    # 공유 상수
supabase/
  migrations/   # 데이터베이스 마이그레이션
  functions/    # Edge Functions
```

웹 앱의 주요 경로는 `/`, `/festivals`, `/game`, `/pre-register`, `/admin`을 기준으로 구성한다.

## 구현 원칙

- 기존 `danyeoori-ui-prototype/`은 0단계 UI·정보구조 검증 자산이다. 보존하면서 React 컴포넌트로 전환한다.
- UI는 React 상태와 컴포넌트 기반으로 구현한다. `document.getElementById`, 인라인 `onclick`, 전역 스크립트 중심 구현은 사용하지 않는다.
- 웹과 앱의 UI를 억지로 공통화하지 않는다. 타입, API, 유틸리티만 공유하고 각 플랫폼 UI는 최적화한다.
- 축제 일정·가격·통계는 예시 데이터와 실제 운영 데이터를 구분한다. 실제 데이터 반영 전 출처와 기준일을 확인한다.
- 작업 완료, 범위 변경, 우선순위 변경 시 `progress.md`를 함께 갱신한다.

## 데이터와 보상 보안

핵심 테이블은 `profiles`, `festivals`, `pre_registrations`, `game_attempts`, `ad_events`, `point_wallets`, `point_transactions`, `rewards`, `community_posts`, `community_likes`, `admin_users`를 기준으로 설계한다.

- `point_transactions`는 모든 포인트 변동의 원장이다.
- 클라이언트는 포인트 잔액을 직접 수정할 수 없다.
- 게임·광고·룰렛 보상은 서버에 요청하고, Edge Function이 성공 여부와 중복 지급을 검증한 뒤 지급한다.
- 룰렛 결과는 서버에서 생성·확정한다.
- RLS로 사용자별 데이터 접근을 제한하고, 관리자 권한을 별도로 검증한다.
- 동일 게임·광고·미션에 대한 중복 보상을 차단한다.

다음 패턴은 금지한다.

```tsx
setPoints(points + 1000);
const prize = Math.random() > 0.5 ? 1000 : 0;
document.getElementById("score").innerText = "100";
```

## 작업 순서

1. 기존 문서와 정적 UI 프로토타입을 확인한다.
2. Turborepo와 `apps/web` Next.js 프로젝트를 구성한다.
3. 정적 HTML을 반응형 React 컴포넌트로 전환하고, 사전예약 CTA·폼을 추가한다.
4. 미니게임 상태 관리와 게임 로그 저장을 구현한다.
5. Supabase 스키마·RLS·인증을 구성한다.
6. Edge Function 기반 보상 지급과 중복 방지를 구현한다.
7. 최소 관리자 페이지를 구현한다.
8. 검증된 타입·API·유틸리티를 공유하며 Expo 앱으로 확장한다.

## Git 작업 규칙

- 기본적으로 현재 체크아웃된 브랜치에서만 파일을 수정한다.
- 다른 브랜치는 비교·참고 목적으로 읽을 수 있지만, 사용자 지시 없이 전환·병합·rebase·cherry-pick하지 않는다.
- 커밋되지 않은 사용자 변경을 덮어쓰거나 삭제하지 않는다.
- `.env`와 비밀키는 Git에 추가하지 않는다.
- 프리뷰·예시·도안 이미지는 루트 `Documents/` 아래에 저장하고 GitHub에는 올리지 않는다. 해당 폴더는 `.gitignore`의 `Documents/` 규칙으로 계속 추적에서 제외한다.
