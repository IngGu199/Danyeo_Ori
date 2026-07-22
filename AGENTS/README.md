# 다녀오리 프로젝트 인수인계와 문서 배치

이 폴더에는 다른 컴퓨터나 새 작업에서 필요한 프로젝트 맥락을 둔다. 항상 적용되는 규칙은 루트 `AGENTS.md`, 실제 구현 상태는 `progress.md`가 단일 원본이다.

## 현재 스냅샷

- 작성 기준일: 2026-07-23 (Asia/Seoul)
- 브랜치: `feature/festival-page`
- upstream: `origin/feature/festival-page`
- 기준 커밋: `5b8992d496fbb5a60f1c21b6ad70ce1086887542`
- `main` 대비: 12 commits ahead, 0 behind
- Supabase Cloud 반영: 하지 않음

시점 정보가 달라졌다면 Git과 `progress.md`를 다시 확인하고 이 스냅샷을 사실로 고정하지 않는다.

## AGENTS와 SKILLS 구분

| 위치 | 저장할 내용 | 저장하지 않을 내용 |
|---|---|---|
| 루트 `AGENTS.md` | 서비스 목표, 기술 경계, 보안 불변조건, Git 규칙 | 상세 구현 튜토리얼, 시점별 작업 기록 |
| `AGENTS/` | 현재 맥락, 인수인계, 파일 지도, 세션 역사 | 루트 규약의 복제본, 긴 반복 절차 |
| `SKILLS/` | 특정 작업을 수행하는 순서, 기술 선택, 테스트 체크리스트 | 브랜치·커밋·완료율처럼 금방 낡는 상태 |
| `plan.md` | 장기 단계와 완료 기준 | 실제 완료 주장 |
| `progress.md` | 현재 구현 결과와 다음 작업 | 영구적인 보안 규칙 |

## 정리한 내용

- 루트와 중복되던 `AGENTS/AGENTS.md`를 제거했다.
- 범용 실행 절차를 담던 `AGENTS/DEVELOPMENT_WORKFLOW.md`를 제거했다.
- 일반 Next.js 화면·데이터 연결 절차는 `SKILLS/danyeo-ori-web-change/`로 옮겼다.
- 미니게임 기술 선택, 상태 모델, 서버 검증, 모바일 QA는 `SKILLS/danyeo-ori-minigame/`로 옮겼다.
- 마이그레이션, RLS, pgTAP, 타입 생성 절차는 `SKILLS/danyeo-ori-db-change/`로 옮겼다.
- Supabase 구조, 커뮤니티 구조, 현재 상태와 세션 역사는 인수인계 맥락이므로 `AGENTS/`에 유지한다.

## 읽는 순서

1. 루트 [`AGENTS.md`](../AGENTS.md)
2. 요청에 해당하는 `SKILLS/*/SKILL.md`
3. [`CURRENT_STATE.md`](./CURRENT_STATE.md)
4. [`SUPABASE_AND_SECURITY.md`](./SUPABASE_AND_SECURITY.md)
5. [`COMMUNITY_HANDOFF.md`](./COMMUNITY_HANDOFF.md)
6. [`SESSION_HISTORY.md`](./SESSION_HISTORY.md)
7. [`FILE_MAP.md`](./FILE_MAP.md)
8. [`NEXT_STEPS.md`](./NEXT_STEPS.md)
9. [`START_HERE.md`](./START_HERE.md)와 [`TRANSFER_CHECKLIST.md`](./TRANSFER_CHECKLIST.md)

Skill의 상세 reference는 해당 `SKILL.md`가 지시할 때만 추가로 읽는다.
