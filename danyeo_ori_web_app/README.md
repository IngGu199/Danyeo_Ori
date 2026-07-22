# 다녀오리 웹 MVP

기존 `danyeoori-ui-prototype/`의 정적 HTML/CSS를 Next.js App Router 컴포넌트로 전환한 Turborepo 기반 MVP입니다.

## 실행

```bash
nvm use
npm install
npm run dev
```

웹 앱은 `apps/web`에서 실행됩니다. 확인 메일 없이 즉시 로그인되는 이메일·비밀번호 회원가입과 로그인, 비회원 다녀오리 출시 알림 신청, 홈 추천 축제, 축제 목록·달력·미니게임 목록은 Supabase에 연결됩니다. 이메일·휴대폰 정보 필드는 향후 본인 인증 확장을 위해 유지합니다. 실제 축제 일정과 보상은 운영 반영 전에 검증해야 합니다.

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

## 인증·출시 알림 신청

- `/signup`: 이메일·비밀번호 회원가입 후 즉시 로그인
- `/login`: 이메일·비밀번호 로그인
- `/auth/callback`: 향후 이메일 인증 재도입을 위해 유지하는 인증 코드 콜백
- `/about#pre-register`: 개인정보 동의가 포함된 다녀오리 웹·앱 출시 알림 신청. 특정 축제 참가 예약은 받지 않음

현재 로컬 Supabase는 이메일 가입을 허용하고 확인 메일 요구만 비활성화합니다. 이메일·휴대폰 필드와 인증 콜백 구조는 향후 인증 재도입을 위해 유지합니다. 출시 알림 신청 Edge Function에는 실제 배포 도메인을 `ALLOWED_ORIGINS`로 추가하고 암호화·HMAC 비밀값을 Cloud Secret으로 등록합니다.

## 구조

- `apps/web`: Next.js + TypeScript + Tailwind CSS 웹 MVP
- `apps/mobile`: 후속 Expo 앱을 위한 최소 진입점
- `packages/constants`: 웹·앱이 공유할 정적 UI 상수와 커뮤니티 예시 데이터
- `packages/types`: 공유 TypeScript 타입
- `packages/api`: 웹·앱 공유 Supabase API 래퍼
- `packages/utils`: 플랫폼 독립 유틸리티
- `supabase`: DB 마이그레이션·RLS·Edge Functions·파기 테스트

디자인 작업은 루트의 [`DESIGN.md`](./DESIGN.md)를 단일 기준으로 사용합니다. Starbucks를 기본 토큰으로 삼고, 여행 탐색·정보 읽기·커뮤니티·게임 패턴은 문서에 정리된 외부 참고 원칙으로만 확장합니다.
