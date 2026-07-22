# Supabase와 보안 인수인계

## 원칙

- DB의 진실은 `danyeo_ori_web_app/supabase/migrations/`이다.
- 이미 반영된 마이그레이션을 수정하지 말고 새 마이그레이션을 추가한다.
- `packages/types/src/database.generated.ts`는 수동 편집하지 않는다.
- Cloud link, `db push`, Edge Function 배포, 비밀값 등록은 사용자 별도 승인 후 수행한다.
- 브라우저에는 publishable key만 둔다.
- 관리자 기능은 UI 노출 여부와 별개로 서버 권한과 RLS를 모두 통과해야 한다.

## 로컬 명령

```bash
cd <REPO_ROOT>/danyeo_ori_web_app
nvm use
npm run supabase:start
npm run supabase:reset
npm run supabase:test
npm run supabase:types
```

## 최신 마이그레이션

```txt
202607160001_create_schemas_and_enums.sql
202607160002_create_core_tables.sql
202607160003_create_indexes_and_triggers.sql
202607160004_create_admin_functions.sql
202607160005_create_rls_policies.sql
202607160006_create_service_functions.sql
202607160007_create_retention_functions.sql
202607160008_schedule_retention_job.sql
202607160009_add_pre_registration_count.sql
202607180001_add_admin_management_access.sql
202607210001_create_festival_community.sql
202607210002_add_community_author_defaults.sql
202607210003_split_community_read_policies.sql
```

## 커뮤니티 데이터 모델

### `community_posts`

- `festival_id`로 `festivals`에 직접 연결
- `author_id`는 로그인 사용자 UUID
- `author_nickname`은 작성 시 프로필 닉네임 스냅샷
- `kind`: `review`, `question`, `game`
- `view_count`, `like_count`, `comment_count`는 음수가 될 수 없음
- 연결 축제 삭제는 `ON DELETE RESTRICT`

### `community_likes`

- `(post_id, user_id)` 복합 PK로 중복 좋아요 차단
- 자신의 좋아요만 추가·삭제·조회 가능
- insert/delete 트리거가 게시글 `like_count`를 동기화

### `community_comments`

- 게시글 삭제 시 cascade
- 작성자 닉네임 스냅샷 저장
- insert/delete 트리거가 `comment_count`를 동기화

### `community_festival_categories`

- 별도 중복 카테고리 테이블이 아니라 `festivals` 기반 보안 뷰
- 어드민에서 축제를 만들면 뷰에 자동 반영
- 일반 사용자에게는 `published` 축제만 노출
- 어드민이 만든 `draft` 축제는 공개 전까지 커뮤니티 선택 목록에 나타나지 않음

## 관리자 권한

- 권한 원본: `private.admin_users`
- 확인 함수: `private.is_admin()`, `private.is_owner()`
- 공개 확인 뷰: `public.current_admin_access`
- 일반 사용자에게 관리자 목록 자체를 공개하지 않는다.
- 축제에 커뮤니티 게시글이 있으면 삭제하지 말고 `archived` 상태로 전환한다.

## Edge Functions

```txt
claim-reward
complete-game-attempt
start-game-attempt
submit-pre-registration
withdraw-account
```

- 보상·룰렛·포인트 지급은 클라이언트가 확정하지 않는다.
- `point_transactions`는 포인트 변동 원장이다.
- 게임 보상은 서버에서 시간, 점수, 이벤트 수, idempotency key, 중복 지급을 검증한다.

## 테스트

DB 테스트 경로:

```txt
supabase/tests/database/
```

최신 기준은 9개 SQL 파일, 70개 pgTAP 테스트 통과다. 커뮤니티 테스트는 `community_festival_link.test.sql`에 있다.

## Cloud 반영 전 체크

1. 사용자에게 Integration Cloud 반영 승인을 받는다.
2. 현재 프로젝트 ref와 대상 환경을 확인한다.
3. `git diff`와 마이그레이션 순서를 검토한다.
4. Cloud 백업·적용 창구를 확인한다.
5. 마이그레이션 적용 후 생성 타입을 다시 비교한다.
6. Auth Site URL·Redirect URL을 실제 Vercel 도메인으로 설정한다.
7. Edge Function secrets와 `ALLOWED_ORIGINS`를 설정한다.
8. owner/operator/일반 회원/비회원 스모크 테스트를 수행한다.

Secret/service-role 값은 이 폴더나 Git 저장소에 기록하지 않는다.
