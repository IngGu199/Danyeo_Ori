# Supabase 로컬 개발·Cloud 배포 기준

이 디렉터리는 다녀오리의 PostgreSQL 스키마, RLS, Edge Functions, 개인정보 파기 작업을 코드로 관리합니다.

## 사전 조건

- Node.js 22 이상
- Docker Desktop, Podman 등 Docker 호환 컨테이너 런타임
- Supabase Cloud 반영 전 사용자 승인

## 로컬 실행

```bash
npm run supabase:start
npm run supabase:reset
npm run supabase:test
```

로컬에는 `seed.sql`의 가상 데이터만 사용하며 운영 개인정보를 복사하지 않습니다. `test-` slug와 `[TEST]` 이름을 사용하는 축제는 목록·달력·게임 연결 검증용이며 관리자 입력 화면이 안정화되면 제거할 수 있습니다.

## 보안 원칙

- `private`와 `retention` 스키마를 Data API에 노출하지 않습니다.
- 비회원의 다녀오리 웹·앱 출시 알림 신청은 `submit-pre-registration` Edge Function만 사용합니다. 특정 축제 참가 예약으로 사용하지 않습니다.
- 게임 기록, 룰렛 결과, 포인트 지급은 서버가 검증합니다.
- `point_transactions`는 수정하지 않는 원장이며 지갑은 원장 처리 함수에서만 변경합니다.
- secret/service 역할 키와 함수 암호화 키는 Git에 커밋하지 않습니다.

관리자 등록·해제, 개인정보 파기, 비밀값 운영 절차는 [OPERATIONS.md](./OPERATIONS.md)를 따릅니다.
