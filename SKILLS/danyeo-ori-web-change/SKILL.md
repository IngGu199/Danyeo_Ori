---
name: danyeo-ori-web-change
description: Implement or review scoped Danyeo Ori Next.js web changes, including App Router pages, React components, Server Components and Actions, Supabase-backed reads and writes, responsive UI, loading and error states, asset use, and verification. Use for homepage, festival, calendar, community, authentication, admin, about, navigation, or shared web UI work that is not primarily a minigame or database migration task.
---

# 다녀오리 웹 변경

## 작업 시작하기

1. 루트 `AGENTS.md`, `progress.md`, 관련 `DESIGN.md` 규칙을 읽는다.
2. `git status --short --branch`로 사용자 변경을 확인한다.
3. 관련 Route, 컴포넌트, 스타일, API, 타입만 좁게 확인한다.
4. 미니게임 작업이면 `../danyeo-ori-minigame/SKILL.md`를 우선한다.
5. 마이그레이션이나 RLS가 필요하면 `../danyeo-ori-db-change/SKILL.md`도 읽는다.

기존 UI와 승인된 이미지, 사용자 미커밋 변경을 보존한다. 데이터 원본만 바꾸는 요청에서 화면 구조와 노출 규칙을 함께 재설계하지 않는다.

## 경계 결정하기

- 정적 표시와 공개 데이터 조회는 Server Component를 우선한다.
- 상태, 이벤트, 브라우저 API가 필요한 최소 경계만 Client Component로 만든다.
- 인증이 필요한 쓰기는 Server Action 또는 명시적 서버 경계를 사용한다.
- 쓰기 전에 `auth.getUser()`와 RLS를 다시 확인한다.
- service-role key와 secret은 Client Component나 `NEXT_PUBLIC_*`에 넣지 않는다.
- 공유 가능한 도메인 타입, API, 순수 유틸리티만 `packages/`에 둔다. 웹과 Expo UI를 억지로 공유하지 않는다.

## 화면 상태 구현하기

요청 범위에 해당하는 상태를 명시한다.

- 로딩
- 데이터 없음
- 조회 실패
- 로그인 필요
- 권한 없음
- 공개 전 또는 종료
- 저장 중과 저장 실패
- 성공 후 다음 행동

오류를 빈 상태로 숨기지 않는다. 낙관적 UI를 사용해도 서버 실패 시 원래 상태로 복구하고 사용자에게 이유를 알린다.

## 디자인과 자산 지키기

- `danyeo_ori_web_app/DESIGN.md`의 토큰과 컴포넌트 언어를 따른다.
- 계절 테마와 기존 반응형 구조를 유지한다.
- 390px 모바일과 데스크톱을 확인한다.
- 주요 터치 대상은 최소 44×44px로 만든다.
- 의미 있는 이미지에는 alt를 제공하고 장식용 이미지는 `alt=""`로 둔다.
- 승인된 운영 자산은 앱 public 경로나 Supabase Storage를 사용한다.
- 프리뷰, 도안, 참고 이미지는 루트 `Documents/`에 두고 Git에 추가하지 않는다.
- 외부 이미지나 축제 정보를 추가할 때 출처, 사용 권한, 기준일을 확인한다.

## 데이터 연결 지키기

- 축제, 게임, 커뮤니티의 공개 상태와 RLS 노출 조건을 유지한다.
- 존재하지 않는 축제 정보, 연락처, 가격, 프로그램을 임의로 생성하지 않는다.
- 특정 축제 참가 예약과 다녀오리 웹·앱 출시 알림 신청을 혼동하지 않는다.
- DB 기반 화면에서 seed 예시와 운영 데이터를 구분한다.
- 작성자·관리자 권한을 UI 버튼 노출 여부만으로 판단하지 않는다.

## 검증하기

변경 범위에 맞춰 다음을 수행한다.

```bash
cd <REPO_ROOT>/danyeo_ori_web_app
nvm use
npm run typecheck --workspace @danyeo-ori/web
npm run lint --workspace @danyeo-ori/web
npm run build --workspace @danyeo-ori/web
cd ..
git diff --check
git status --short
```

추가로 확인한다.

- 수정한 Route의 정상, 빈 상태, 오류 상태
- 390px 모바일 가로 overflow
- 키보드 포커스와 기본 접근성
- 로그인·비로그인·작성자·관리자 권한 차이
- 관련 데이터가 공개 상태 조건을 우회하지 않는지

DB 변경이 있으면 DB Skill의 전체 검증을 추가한다. 빌드 결과는 typecheck와 lint 결과와 구분해 기록한다.

## 완료 보고하기

- 사용자에게 보이는 결과를 먼저 설명한다.
- 변경한 핵심 파일과 데이터 경계를 적는다.
- 실행한 검증과 실행하지 못한 검증을 구분한다.
- `progress.md`를 실제 결과에 맞게 갱신한다.
- Cloud나 Vercel에 반영하지 않았으면 명확히 밝힌다.
