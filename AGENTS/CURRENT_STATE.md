# 현재 프로젝트 상태

## Git 기준선

| 항목 | 값 |
|---|---|
| 브랜치 | `feature/festival-page` |
| upstream | `origin/feature/festival-page` |
| HEAD | `5b8992d496fbb5a60f1c21b6ad70ce1086887542` |
| HEAD 제목 | `스니펫 제거` |
| 기준 시점 상태 | clean |
| `main` 대비 | 12 commits ahead, 0 behind |
| 원격 | `git@github.com:IngGu199/Danyeo_Ori.git` |

커밋 목록은 빠르게 바뀌므로 `git log --oneline -10`으로 확인한다.

## 실행 기준

- 실제 앱 루트: `<REPO_ROOT>/danyeo_ori_web_app`
- 웹 앱: `apps/web`
- Node 기준: `.nvmrc`의 22
- 현재 컴퓨터의 시스템 기본 Node는 v18이므로 항상 `nvm use` 후 명령을 실행했다.
- Next.js: `^16.2.10`
- React: `^19.2.7`
- Supabase JS: `^2.110.6`
- Supabase SSR: `^0.12.3`

## 완료된 핵심 기능

- Next.js/Turborepo 웹 MVP 구조
- 이메일 회원가입·로그인·콜백
- 다녀오리 웹·앱 전역 출시 알림 신청
- Supabase 기반 공개 축제·게임 조회
- 홈, 소개, 축제 목록, 달력, 게임 목록 UI
- 7개 기본 게임 콘셉트 카드와 `/games/[gameCode]` 상세 셸
- `private.admin_users` 기반 관리자 권한
- `/admin` 축제·미니게임 CRUD
- 서버 검증 보상을 위한 Edge Function과 DB 함수 기반
- 시안 3번 기반 반응형 커뮤니티 목록/슬라이드 상세 UI
- Supabase 커뮤니티 게시글 CRUD·좋아요·댓글·조회수
- `festivals` 단일 원본 기반 커뮤니티 축제 카테고리
- `/community?festival={slug}` 축제별 리뷰 딥링크

## 최근 검증 결과

- 최신 로컬 기준 pgTAP 83개 통과
- 실제 로컬 회원 세션: 게시글 생성·수정·삭제, 좋아요, 댓글 집계 스모크 테스트 통과
- 웹 workspace typecheck 통과
- ESLint 통과
- Next.js production build 통과
- 커뮤니티 1440px 데스크톱 및 390px 모바일 반응형 QA 통과

## 로컬/외부 상태

- Supabase 로컬 컨테이너는 기준 시점에 실행 중이었다.
- Supabase Cloud에는 최신 마이그레이션·함수·비밀값을 반영하지 않았다.
- Vercel 및 Supabase Cloud 배포는 사용자 별도 승인 전 수행하지 않는다.
- `Documents/`는 Git에서 제외된다.
- `AGENTS/`와 `SKILLS/`는 저장소 안의 문서다. `Documents/`만 별도 전송한다.

## 알려진 문서 차이

- `<REPO_ROOT>/danyeo_ori_web_app/README.md`의 “커뮤니티가 예시 데이터를 사용한다”는 설명은 현재 구현보다 오래된 내용이다. 실제 커뮤니티는 Supabase에 연결되어 있다.
- `progress.md`의 표와 최신 커밋을 현재 구현 상태의 우선 근거로 사용한다.
