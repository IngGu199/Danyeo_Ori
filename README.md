# 다녀오리 (Danyeo Ori)

> 지역축제를 미니게임으로 먼저 체험하고, 실제 방문으로 이어가는 지역축제 O2O 플랫폼

다녀오리는 지역축제의 대표 프로그램·특산물·캐릭터를 짧은 미니게임으로 소개합니다. 사용자는 축제를 가볍게 미리 경험하고, 축제별 혜택과 현장 정보를 확인해 실제 방문을 계획할 수 있습니다.

## 주요 기능

- **축제 탐색**: 지역·시기·테마를 기준으로 전국 축제 정보를 탐색
- **페스티벌 게임**: 축제 대표 체험을 바탕으로 한 짧은 미니게임과 룰렛 UI
- **축제 달력**: 날짜별 진행 축제를 확인하는 달력 화면
- **커뮤니티**: 축제 태그를 기준으로 후기·질문·현장 정보를 공유하는 게시판
- **소개 페이지**: 서비스 이용 흐름과 축제별 대표 게임을 소개하는 랜딩 페이지

현재 화면의 축제 일정, 게임 보상, 게시글은 UI 검증을 위한 예시 데이터입니다.

## 기술 스택

| 구분 | 기술 |
|---|---|
| 웹 | Next.js 14, React, TypeScript |
| 스타일 | Tailwind CSS, CSS |
| 모노레포 | Turborepo, npm Workspaces |
| 아이콘 | Phosphor Icons |
| 예정 백엔드 | Supabase, PostgreSQL, Supabase Auth, Edge Functions |
| 예정 모바일 | Expo, React Native |

## 프로젝트 구조

```text
.
├── danyeo_ori_web_app/       # Turborepo 기반 웹·앱 프로젝트
│   ├── apps/
│   │   ├── web/              # Next.js 웹 MVP
│   │   └── mobile/           # Expo 앱 확장 예정
│   ├── packages/
│   │   ├── constants/        # 공유 예시 데이터와 상수
│   │   └── types/            # 공유 TypeScript 타입
│   └── supabase/             # 마이그레이션·Edge Function 추가 예정
├── danyeoori-ui-prototype/   # 초기 정적 UI 프로토타입
├── AGENTS.md                 # Codex 구현 규약
├── plan.md                   # 개발 계획과 완료 기준
└── progress.md               # 실제 진행 현황
```

## 시작하기

### 요구 사항

- Node.js
- npm

### 설치 및 실행

```bash
git clone <YOUR_REPOSITORY_URL>
cd Danyeo_Ori/danyeo_ori_web_app
npm install
npm run dev
```

개발 서버가 실행되면 [http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 검증 명령어

```bash
# TypeScript 검사
npm run typecheck

# 프로덕션 빌드
npm run build
```

## 주요 경로

| 경로 | 화면 |
|---|---|
| `/` | 홈 |
| `/about` | 다녀오리 소개 |
| `/games` | 페스티벌 게임과 룰렛 |
| `/festivals` | 전국 축제 탐색 |
| `/calendar` | 축제 달력 |
| `/community` | 축제 커뮤니티 |

## 마일리지와 보상 원칙

마일리지는 모든 축제에 공통으로 쓰는 전역 포인트가 아니라, **축제별로 분리된 마일리지**를 목표로 설계합니다.

- 축제마다 마일리지 보상·룰렛 상품·참여 조건이 다를 수 있습니다.
- 룰렛은 축제별 마일리지 차감 또는 지정 미니게임 플레이 횟수를 조건으로 사용합니다.
- 운영 버전에서는 보상과 룰렛 결과를 클라이언트가 확정하지 않습니다.
- Supabase RLS와 Edge Function을 통해 축제 범위, 중복 지급, 권한을 검증할 예정입니다.

## 로드맵

1. 웹 MVP UI와 사용자 흐름 검증
2. Supabase 인증·데이터베이스·사전예약 연동
3. 축제별 마일리지·게임 로그·룰렛 보상 서버 검증
4. 관리자 페이지 구축
5. Expo 기반 모바일 앱 확장

상세 계획은 [plan.md](./plan.md), 현재 진행 현황은 [progress.md](./progress.md)에서 확인할 수 있습니다.

## 개발 원칙

- 비밀키와 `.env` 파일은 저장소에 올리지 않습니다.
- 예시 데이터와 실제 운영 데이터를 명확히 구분합니다.
- 축제별 마일리지와 룰렛 결과는 서버 검증을 전제로 구현합니다.
- 기능별 브랜치에서 작업하고, 작은 단위로 커밋합니다.

## 팀

Local Value Up
