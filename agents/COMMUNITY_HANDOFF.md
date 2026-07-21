# 커뮤니티 구현 인수인계

## 확정된 제품 동작

- 최초 화면은 게시글 목록만 표시한다.
- 게시글 선택 시 시안 3번과 같은 master-detail 화면으로 전환한다.
- 데스크톱: 오른쪽 상세 패널 slide-in
- 980px 이하: 목록 위 오버레이
- 800px 이하: 전체 화면 상세
- 추천 대신 하트 좋아요 사용
- 게시글 작성·수정·삭제, 댓글 작성 지원

## 축제 카테고리 연결

- `festivals`가 단일 원본이다.
- 별도 카테고리를 복제해 동기화하지 않는다.
- 어드민 축제 생성 즉시 `community_festival_categories` 뷰에 반영된다.
- 일반 커뮤니티에는 공개된 축제만 나타난다.
- 작성 폼은 축제 UUID를 저장한다.
- 축제 페이지에서 다음 URL로 리뷰 목록을 연결할 수 있다.

```txt
/community?festival={festival.slug}
```

- 특정 게시글 딥링크는 다음 형식이다.

```txt
/community?post={community_posts.id}&festival={festival.slug}
```

## 주요 코드

- `apps/web/app/community/page.tsx`: Server Component 조회, 축제·게시글·내 좋아요 매핑
- `apps/web/app/community/actions.ts`: 게시글 CRUD, 좋아요, 댓글, 상세 조회 Server Actions
- `apps/web/components/community-board.tsx`: 목록, 필터, slide-in 상세, 편집기, 낙관적 좋아요
- `apps/web/app/globals.css`: 커뮤니티 반응형 스타일
- `supabase/migrations/202607210001_create_festival_community.sql`: 테이블, RLS, 트리거, 뷰, 조회수 함수
- `supabase/migrations/202607210002_add_community_author_defaults.sql`: 작성자 스냅샷 기본값
- `supabase/migrations/202607210003_split_community_read_policies.sql`: 공개/관리자 읽기 정책 분리
- `supabase/tests/database/community_festival_link.test.sql`: 축제 자동 카테고리와 커뮤니티 RLS 테스트

## 권한 동작

- 비회원: 공개 축제 카테고리와 게시글·댓글 읽기 가능
- 회원: 공개 축제 게시글 작성, 자신의 게시글 수정·삭제, 자신의 좋아요, 댓글 작성 가능
- 관리자: 관리자 정책으로 운영 조회 가능
- 닉네임은 클라이언트 입력을 신뢰하지 않고 DB 트리거가 프로필에서 기록
- 좋아요는 `(post_id, user_id)`로 중복 차단

## 관리자 화면 연동

- 축제 입력 폼에 “커뮤니티 카테고리 자동 생성” 안내가 있다.
- 공개 축제 행에는 축제별 커뮤니티 바로가기가 있다.
- 커뮤니티 글이 연결된 축제는 삭제가 차단된다.
- 해당 축제를 숨기려면 삭제 대신 `archived` 상태로 전환한다.

## Seed와 로컬 화면

- `supabase/seed.sql`에 축제와 연결된 커뮤니티 예시 게시글·댓글이 있다.
- `supabase:reset` 후 `/community`에서 바로 확인할 수 있다.
- 예시 데이터는 운영 실제 데이터가 아니다.

## 디자인 자산

- 모든 프리뷰·예시·도안 이미지는 `<REPO_ROOT>/Documents/`에 저장한다.
- 이 폴더는 Git에서 제외되므로 새 컴퓨터에 수동 복사한다.
- 선택 시안은 `Documents/design-previews/community/option-3-fast-feed.png`에 있다.
- 프로젝트의 `danyeo_ori_web_app/design-qa.md`에는 기존 컴퓨터의 Codex 캐시 경로가 일부 포함되어 있으므로 QA 스크린샷이 필요하면 별도로 복사하거나 새 컴퓨터에서 다시 캡처한다.

## 검증된 상태

- 1440×1024 데스크톱 목록/상세
- 390×844 모바일 목록/상세
- 가로 overflow 없음
- 작성·수정·삭제 확인, 좋아요, 댓글 상태
- 실제 로컬 회원 세션 CRUD 스모크 테스트
- pgTAP 70개
- typecheck, lint, production build
