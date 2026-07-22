# 추천 다음 작업

## 우선순위 1 — 게임·보상 실제 연결

- 웹 게임 화면에서 `start-game-attempt`, `complete-game-attempt`, `claim-reward` Edge Function을 호출한다.
- 클라이언트 점수와 시간을 그대로 신뢰하지 않는다.
- idempotency key와 중복 보상 차단을 유지한다.
- 성공 후 `point_transactions` 원장과 지갑 조회를 UI에 연결한다.

## 우선순위 2 — 축제 상세 페이지

- URL은 `/festivals/{slug}` 형태를 권장한다.
- slug로 축제 UUID를 조회하고 관련 게임·커뮤니티를 `festival_id`로 연결한다.
- 커뮤니티 CTA는 `/community?festival={slug}`를 사용한다.
- 404, 비공개, 종료, 이미지·게임 없음, 조회 실패 상태를 설계한다.

## 우선순위 3 — 문서 정합성

- `danyeo_ori_web_app/README.md`의 커뮤니티 예시 데이터 설명을 Supabase 실데이터 설명으로 갱신한다.
- 실제 경로 `/games`, `/about#pre-register`와 계획 문서의 오래된 경로를 정리한다.
- `progress.md` 기준 날짜를 최신 상태로 갱신한다.

## 우선순위 4 — 법률·개인정보 검토

- 개인정보 처리방침을 확정한다.
- 포인트 원장 5년 보존 근거를 검토한다.
- 출시 알림 연락처 보존·파기 문구와 구현을 대조한다.

## 우선순위 5 — Integration Cloud 반영

반드시 사용자 승인 후 진행한다.

- Supabase 대상 프로젝트와 환경 확인
- 마이그레이션 적용
- Auth Site URL/Redirect URL 설정
- Edge Function secrets 및 allowed origins 설정
- 함수 배포
- owner/operator/일반 회원/비회원 스모크 테스트
- Vercel 환경 변수와 Root Directory 확인

## 후속 범위

- 관리자 출시 알림 신청자·게임 로그 관리
- Expo 모바일 앱
- 지도·푸시·광고
- 초기 MVP 제외: 실시간 랭킹, 자체 결제, 멀티플레이, 복잡한 지도 추천
