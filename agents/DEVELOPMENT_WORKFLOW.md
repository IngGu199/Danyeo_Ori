# 다음 작업자가 따를 개발 방식

## 작업 시작

```bash
cd <REPO_ROOT>
git status --short --branch
git branch --show-current
git remote -v
```

- 현재 브랜치에서만 작업한다.
- 사용자 요청 없이 switch, merge, rebase, cherry-pick하지 않는다.
- 기존 미커밋 변경이 있으면 소유자를 사용자로 보고 보존한다.

## 기준 문서 우선순위

1. 사용자의 최신 지시
2. `<REPO_ROOT>/AGENTS.md`
3. `<REPO_ROOT>/plan.md`
4. `<REPO_ROOT>/progress.md`
5. `<REPO_ROOT>/danyeo_ori_web_app/DESIGN.md`
6. 정적 프로토타입 및 `Documents/`의 참고 자료

실제 구현 상태와 오래된 문서가 충돌하면 코드·마이그레이션·최신 `progress.md`를 확인하고 문서를 갱신한다.

## DB 변경 순서

1. 관련 기존 마이그레이션과 RLS만 확인한다.
2. 새 마이그레이션을 추가한다.
3. 필요한 pgTAP 테스트를 추가한다.
4. `npm run supabase:reset`을 실행한다.
5. `npm run supabase:test`를 실행한다.
6. `npm run supabase:types`로 타입을 생성한다.
7. 앱 typecheck·lint·build를 실행한다.

금지:

- 이미 적용된 마이그레이션 수정
- `database.generated.ts` 수동 수정
- service-role key를 브라우저 코드에 추가
- UI만으로 관리자 권한 처리
- 클라이언트에서 포인트 또는 룰렛 결과 확정

## 웹 구현 순서

1. 기존 UI와 관련 컴포넌트 확인
2. Server Component와 Server Action 경계 결정
3. 인증이 필요한 쓰기는 서버에서 `auth.getUser()`와 RLS로 재검증
4. 로딩·빈 상태·오류·권한 없음 상태 구현
5. 모바일 390px과 데스크톱을 확인
6. `progress.md` 갱신

## 검증 명령

```bash
cd <REPO_ROOT>/danyeo_ori_web_app
nvm use
npm run typecheck --workspace @danyeo-ori/web
npm run lint --workspace @danyeo-ori/web
npm run build --workspace @danyeo-ori/web
npm run supabase:test
cd ..
git diff --check
git status --short
```

빌드는 typecheck/lint와 구분해서 결과를 기록한다.

## 프리뷰와 이미지

- 프리뷰·예시·도안은 `<REPO_ROOT>/Documents/`에 저장한다.
- 앱에서 실제 사용하는 자산만 `apps/web/public/`에 둔다.
- `Documents/`는 GitHub에 올리지 않는다.
- 새 컴퓨터로 이동할 때 `Documents/`는 수동 복사한다.

## 완료 보고

- 구현 결과를 먼저 말한다.
- 변경된 핵심 파일을 적는다.
- 수행한 테스트와 통과 여부를 적는다.
- Cloud에 반영하지 않았다면 명확히 적는다.
- `progress.md`가 최신인지 확인한다.
