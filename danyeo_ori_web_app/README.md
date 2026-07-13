# 다녀오리 웹 MVP

기존 `danyeoori-ui-prototype/`의 정적 HTML/CSS를 Next.js App Router 컴포넌트로 전환한 Turborepo 기반 MVP입니다.

## 실행

```bash
npm install
npm run dev
```

웹 앱은 `apps/web`에서 실행됩니다. 현재 축제·게임·커뮤니티 데이터는 `packages/constants`의 예시 데이터이며, 실제 축제 일정과 보상은 Supabase 연동 전에 검증해야 합니다.

## 구조

- `apps/web`: Next.js + TypeScript + Tailwind CSS 웹 MVP
- `apps/mobile`: 후속 Expo 앱을 위한 최소 진입점
- `packages/constants`: 웹·앱이 공유할 예시 도메인 데이터
- `packages/types`: 공유 TypeScript 타입
- `supabase`: DB 마이그레이션·Edge Function을 추가할 자리

디자인 작업은 루트의 [`DESIGN.md`](./DESIGN.md)를 단일 기준으로 사용합니다. Starbucks를 기본 토큰으로 삼고, 여행 탐색·정보 읽기·커뮤니티·게임 패턴은 문서에 정리된 외부 참고 원칙으로만 확장합니다.
