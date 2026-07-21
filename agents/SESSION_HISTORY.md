# 지금까지의 주요 작업 내역

## 1. 정적 프로토타입과 웹 MVP 전환

- `danyeoori-ui-prototype/`을 0단계 UI·정보구조 검증 자료로 보존했다.
- 실제 앱은 `danyeo_ori_web_app/` Turborepo로 구성했다.
- Next.js App Router, React 컴포넌트, TypeScript 상태 관리로 전환했다.
- 기존 전역 스크립트·인라인 이벤트 중심 구현을 앱 컴포넌트로 대체했다.

## 2. Cozy 디자인 방향과 소개 화면

- 크림·베이지·올리브·소프트 브라운·피치 중심의 따뜻한 여행 UI를 채택했다.
- 소개 페이지, 축제 카드, 게임 카드, CTA 흐름을 정리했다.
- 픽셀 아트는 로고·히어로·게임·보상 영역으로 범위를 제한했다.
- `danyeo_ori_web_app/DESIGN.md`를 현재 디자인 규약으로 사용한다.

## 3. Supabase 기반 구축

- `profiles`, `festivals`, `festival_games`, `pre_registrations`, 게임 기록, 포인트 원장, 리워드, 관리자 테이블을 마이그레이션으로 구축했다.
- RLS, 명시적 GRANT/REVOKE, 관리자 권한 함수, 데이터 파기 함수를 구성했다.
- 브라우저에는 publishable key만 전달하고 secret/service-role key는 서버 도구와 Edge Function에서만 사용하도록 분리했다.
- DB 타입은 로컬 스키마에서 생성하며 수동 편집하지 않는다.

## 4. 출시 알림과 인증

- 사전 신청은 특정 축제 참가 예약이 아니라 다녀오리 웹·앱 전체 출시 알림 신청으로 확정했다.
- 이메일 회원가입·로그인, 인증 콜백, 닉네임 기반 계정 표시를 연결했다.
- 연락처 중복 방지와 보존 기간을 DB/Edge Function에서 처리한다.

## 5. 관리자 페이지

- `/admin`에서 축제와 축제별 미니게임 CRUD를 제공한다.
- UI 접근만으로 권한을 판단하지 않고 Server Action과 RLS에서 다시 확인한다.
- 실제 권한 원본은 `private.admin_users`다.
- 관리자 등록·해제·정지 CLI가 있으며 Node/CommonJS 환경에서 `async main()` 패턴을 사용한다.

## 6. 커뮤니티 UI

- 제품 디자인 시안 3번을 선택했다.
- 기본 진입은 목록만 보인다.
- 게시글 클릭 시 데스크톱은 오른쪽 슬라이드 상세, 태블릿은 오버레이, 모바일은 전체 화면 상세로 전환한다.
- 추천 UI를 하트 좋아요로 교체했다.
- 작성, 수정, 삭제 확인, 댓글, 검색, 글 분류 탭을 구현했다.

## 7. 커뮤니티 Supabase 연결

- `community_posts`, `community_likes`, `community_comments`를 추가했다.
- 축제 목록의 `festivals`를 커뮤니티 카테고리의 단일 원본으로 사용한다.
- `community_festival_categories` 뷰가 축제 생성·수정 상태를 자동 반영한다.
- 공개된 축제만 일반 사용자 선택 목록에 보인다.
- 게시글은 `festival_id`로 연결되고 축제 slug로 커뮤니티를 필터링한다.
- 작성자 본인만 게시글을 수정·삭제할 수 있다.
- 좋아요·댓글 집계는 DB 트리거가 관리한다.
- 리뷰가 있는 축제는 FK가 삭제를 막으며 관리자에게 보관 전환을 안내한다.

## 8. 최근 저장 정책

- 프리뷰·예시·도안 이미지는 `<REPO_ROOT>/Documents/` 아래에만 저장한다.
- `Documents/`는 `.gitignore`로 GitHub에서 제외한다.
