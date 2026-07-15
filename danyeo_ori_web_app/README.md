# 다녀오리 웹 MVP

기존 `danyeoori-ui-prototype/`의 정적 HTML/CSS를 Next.js App Router 컴포넌트로 전환한 Turborepo 기반 MVP입니다.

## 실행

```bash
nvm use
npm install
npm run dev
```

웹 앱은 `apps/web`에서 실행됩니다. 현재 축제·게임·커뮤니티 데이터는 `packages/constants`의 예시 데이터이며, 실제 축제 일정과 보상은 Supabase 연동 전에 검증해야 합니다.

## Supabase 로컬 개발

Node.js 22 이상과 Docker 호환 컨테이너 런타임이 필요합니다.

```bash
npm run supabase:start
npm run supabase:reset
npm run supabase:test
npm run supabase:types
```

- DB 변경은 `supabase/migrations/`에만 기록합니다.
- 로컬에는 `supabase/seed.sql`의 가상 데이터만 사용합니다.
- 운영 개인정보를 로컬로 내려받지 않습니다.
- Cloud 연결·마이그레이션·함수 배포는 별도 승인 후 수행합니다.
- 앱에는 publishable key만 제공하고 secret/service 역할 키는 노출하지 않습니다.

## 구조

- `apps/web`: Next.js + TypeScript + Tailwind CSS 웹 MVP
- `apps/mobile`: 후속 Expo 앱을 위한 최소 진입점
- `packages/constants`: 웹·앱이 공유할 예시 도메인 데이터
- `packages/types`: 공유 TypeScript 타입
- `packages/api`: 웹·앱 공유 Supabase API 래퍼
- `packages/utils`: 플랫폼 독립 유틸리티
- `supabase`: DB 마이그레이션·RLS·Edge Functions·파기 테스트

디자인 작업은 루트의 [`DESIGN.md`](./DESIGN.md)를 단일 기준으로 사용합니다. Starbucks를 기본 토큰으로 삼고, 여행 탐색·정보 읽기·커뮤니티·게임 패턴은 문서에 정리된 외부 참고 원칙으로만 확장합니다.
