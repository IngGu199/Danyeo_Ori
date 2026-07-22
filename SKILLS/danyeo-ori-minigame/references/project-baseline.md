# 현재 미니게임 기준선

작업을 시작할 때 경로가 실제로 존재하는지 확인한다. 이동되었으면 `rg --files`로 새 위치를 찾는다.

## 현재 주요 경로

| 경로 | 역할 |
|---|---|
| `danyeo_ori_web_app/apps/web/app/games/page.tsx` | 게임 목록 Route |
| `danyeo_ori_web_app/apps/web/app/games/[gameCode]/page.tsx` | 게임별 개념 상세 Route |
| `danyeo_ori_web_app/apps/web/components/games/game-catalog.ts` | 현재 7개 게임 카탈로그 |
| `danyeo_ori_web_app/apps/web/components/games/game-shell.tsx` | 공통 상세 셸 |
| `danyeo_ori_web_app/apps/web/components/games/roulette-entry-panel.tsx` | 서버 검증 룰렛 안내 |
| `danyeo_ori_web_app/apps/web/components/games/game-ranking-panel.tsx` | 랭킹 준비·빈 상태 |
| `danyeo_ori_web_app/apps/web/styles/games.css` | 게임 화면 스타일 |
| `danyeo_ori_web_app/packages/api/src/games.ts` | 활성 게임 조회와 attempt 시작 API |
| `danyeo_ori_web_app/packages/api/src/rewards.ts` | 보상 조회·요청 API |
| `danyeo_ori_web_app/supabase/functions/start-game-attempt/` | 게임 시도 시작 |
| `danyeo_ori_web_app/supabase/functions/complete-game-attempt/` | 게임 결과 제출 |
| `danyeo_ori_web_app/supabase/functions/claim-reward/` | 보상 확정 요청 |
| `danyeo_ori_web_app/supabase/migrations/` | DB와 RLS의 단일 원본 |
| `danyeo_ori_web_app/DESIGN.md` | 픽셀 게임 표현층과 접근성 기준 |
| `danyeo_ori_web_app/IMAGE_ASSETS.md` | 이미지 저장·출처·용량 기준 |

## 현재 카탈로그

```txt
obstacle-runner
whack-target
festival-quiz
drag-sort
driving-dodge
word-quiz
slice-object
```

현재 7개 항목은 플레이 구현이 아니라 개념 카드와 상세 셸 중심이다. 사용자가 기본 게임 8개를 원했지만 마지막 한 개는 아직 확정되지 않았다. 룰렛은 공통 보상 단계이며 기본 플레이 게임 수에 포함하지 않는다.

## 현재 데이터 경계

- `festival_games`는 축제 연결, `game_type`, `rules`, `reward_config`, 공개 상태와 기간을 가진다.
- `game_attempts`는 사용자별 시도, 상태, 점수, 시작·완료 시각을 기록한다.
- `point_transactions`는 모든 포인트 변동의 원장이다.
- 현재 `game_type` enum은 `click`, `quiz`, `roulette`, `timing`, `puzzle`을 기준으로 한다.
- 공개 게임 조회는 상위 축제가 공개 상태이고 게임이 활성·노출 기간 안에 있을 때만 허용한다.
- 게임과 보상 쓰기는 브라우저에서 테이블을 직접 수정하지 않고 Edge Function과 내부 DB 함수를 통과한다.

## 구현 시작 기준

첫 플레이 게임은 현재 제품 우선순위와 서버 검증 난이도를 고려해 탭, 타이밍 또는 퀴즈 중에서 선택한다. 러너·주행·베기처럼 Phaser가 필요한 게임부터 시작하지 않는다. 다른 브랜치 구현을 사용자 지시 없이 병합하거나 복사하지 않는다.
