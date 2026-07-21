# 주요 파일 지도

## 루트

| 경로 | 역할 |
|---|---|
| `AGENTS.md` | 지속적인 구현·보안·Git 규약 |
| `plan.md` | 장기 로드맵과 완료 기준 |
| `progress.md` | 실제 구현 진행 상태와 다음 작업 |
| `README.md` | GitHub용 프로젝트 소개 |
| `.gitignore` | 환경 변수, 캐시, `Documents/` 제외 |
| `Documents/` | 사업 문서와 프리뷰 이미지, Git 비추적 |
| `danyeoori-ui-prototype/` | 역사적 정적 프로토타입 |

## 웹 앱

| 경로 | 역할 |
|---|---|
| `danyeo_ori_web_app/apps/web/app/` | Next.js App Router 페이지 |
| `danyeo_ori_web_app/apps/web/components/` | 웹 React 컴포넌트 |
| `danyeo_ori_web_app/apps/web/lib/supabase/` | 브라우저·서버·미들웨어 Supabase 클라이언트 |
| `danyeo_ori_web_app/apps/web/app/admin/` | 관리자 페이지와 Server Actions |
| `danyeo_ori_web_app/apps/web/app/community/` | 커뮤니티 페이지와 Server Actions |
| `danyeo_ori_web_app/apps/web/components/community-board.tsx` | 커뮤니티 master-detail UI |
| `danyeo_ori_web_app/apps/web/app/globals.css` | 전역·커뮤니티 반응형 스타일 |
| `danyeo_ori_web_app/apps/web/public/images/` | 실제 앱에서 쓰는 이미지 자산 |
| `danyeo_ori_web_app/DESIGN.md` | 디자인 시스템 기준 |
| `danyeo_ori_web_app/design-qa.md` | 커뮤니티 디자인 QA 기록 |

## 공유 패키지

| 경로 | 역할 |
|---|---|
| `packages/types/src/database.generated.ts` | Supabase 자동 생성 타입 |
| `packages/types/src/domain.ts` | 앱 도메인 타입 |
| `packages/api/src/` | 공유 Supabase API 래퍼 |
| `packages/utils/` | 플랫폼 독립 유틸리티 |
| `packages/constants/` | 공유 상수; 커뮤니티 실제 데이터 원본은 아님 |

## Supabase

| 경로 | 역할 |
|---|---|
| `supabase/config.toml` | 로컬 Supabase 설정 |
| `supabase/migrations/` | DB 스키마·RLS의 단일 진실 |
| `supabase/seed.sql` | 로컬 개발 예시 데이터 |
| `supabase/tests/database/` | pgTAP DB 테스트 |
| `supabase/functions/` | Edge Functions |
| `scripts/admin/` | 관리자 등록·해제·정지 CLI |

모든 상대 경로는 `<REPO_ROOT>/danyeo_ori_web_app` 기준이며, 루트 항목만 `<REPO_ROOT>` 기준이다.
