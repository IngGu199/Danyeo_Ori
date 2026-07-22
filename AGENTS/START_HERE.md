# 새 컴퓨터에서 시작하기

## 1. 필수 도구

- Git 및 GitHub SSH 접근
- Node.js 22와 NVM
- npm 10 계열
- Docker Desktop 또는 Docker Engine
- Supabase CLI는 프로젝트 `devDependencies`로 설치되므로 전역 설치가 필수는 아님

시스템 기본 Node가 18이어도 프로젝트에서는 반드시 `.nvmrc`의 Node 22를 사용한다.

## 2. 저장소 받기

```bash
git clone git@github.com:IngGu199/Danyeo_Ori.git
cd Danyeo_Ori
git switch feature/festival-page
git pull --ff-only origin feature/festival-page
git status --short --branch
git rev-parse HEAD
```

이 문서 작성 시 기준 커밋은 다음과 같다.

```txt
5b8992d496fbb5a60f1c21b6ad70ce1086887542
```

다른 커밋이 보이면 먼저 원격 브랜치와 최신 작업 여부를 확인하고, 사용자 지시 없이 다른 브랜치를 병합하거나 rebase하지 않는다.

## 3. Node와 의존성 설치

```bash
cd danyeo_ori_web_app
nvm install 22
nvm use
node --version
npm install
```

`node --version`은 `v22.x`여야 한다. 루트 `package.json`은 `npm@10.8.2`와 Node `>=22`를 기준으로 한다.

## 4. 로컬 Supabase 시작

```bash
npm run supabase:start
npm run supabase:reset
npm run supabase:test
npm run supabase:types
```

- `supabase:reset`은 로컬 DB를 재생성하고 모든 마이그레이션과 `seed.sql`을 적용한다.
- 테스트 개수는 마이그레이션과 함께 바뀌므로 이번 실행 결과를 기준으로 기록한다.
- `supabase:types`는 `packages/types/src/database.generated.ts`를 로컬 스키마에서 다시 생성한다.
- 로컬 DB를 운영 DB와 혼동하지 않는다.

## 5. 웹 환경 변수 준비

```bash
cp apps/web/.env.example apps/web/.env.local
```

`apps/web/.env.local`에는 다음 공개 값만 넣는다.

```dotenv
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<로컬 PUBLISHABLE_KEY>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

로컬 값은 `npx supabase status -o env`로 확인할 수 있다. 이 명령은 secret/service-role 값도 출력하므로 화면 공유·로그·문서에 복사하지 않는다. 브라우저 코드에는 publishable key만 사용한다.

## 6. 웹 실행

```bash
npm run dev
```

주요 확인 URL:

- `http://localhost:3000/`
- `http://localhost:3000/about`
- `http://localhost:3000/festivals`
- `http://localhost:3000/calendar`
- `http://localhost:3000/games`
- `http://localhost:3000/community`
- `http://localhost:3000/admin`

축제별 커뮤니티 딥링크 예시:

```txt
http://localhost:3000/community?festival=boryeong-mud-2026
```

## 7. 첫 검증

```bash
npm run typecheck --workspace @danyeo-ori/web
npm run lint --workspace @danyeo-ori/web
npm run build --workspace @danyeo-ori/web
npm run supabase:test
git diff --check
git status --short
```

환경 설정만 한 경우 `.env.local`, Supabase 임시 파일, 빌드 캐시는 Git에 나타나지 않아야 한다.
