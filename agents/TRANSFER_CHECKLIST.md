# 다른 컴퓨터 이전 체크리스트

## Git으로 이동되는 항목

- `feature/festival-page` 코드 전체
- 기준 커밋 `a9bed03ddd6f9e0589f910c92ac8c210a216859a`
- 루트 `AGENTS.md`, `plan.md`, `progress.md`
- 마이그레이션, 테스트, Edge Functions
- 커뮤니티 UI와 Server Actions

## 수동으로 복사할 항목

- `/home/inggu99/agents/` 전체
- `/home/inggu99/Danyeo_Ori/Documents/` 전체

`Documents/`에는 사업계획서, 회의 문서, 커뮤니티 시안 이미지가 있고 `.gitignore`로 제외되어 있다.

## 복사하지 않아도 되는 항목

- `node_modules/`
- `.next/`, `.turbo/`, `dist/`, build cache
- Supabase Docker volumes
- `supabase/.temp/`, `supabase/.branches/`
- 로그와 PID 파일

새 컴퓨터에서 의존성과 로컬 DB를 다시 생성한다.

## 환경 변수

- `.env.local`은 Git에 포함되지 않는다.
- 새 컴퓨터에서 `.env.example`을 복사해 다시 만든다.
- secret/service-role key는 메신저, Git, 인수인계 Markdown에 넣지 않는다.
- Cloud secret은 Supabase 관리 화면 또는 승인된 비밀 관리 수단으로 별도 이전한다.

## SSH와 GitHub

- 새 컴퓨터의 SSH key를 GitHub에 등록한다.
- `ssh -T git@github.com`으로 확인한다.
- 원격은 `origin git@github.com:IngGu199/Danyeo_Ori.git`이어야 한다.
- `git switch feature/festival-page` 후 `git pull --ff-only`만 수행한다.

## 최종 확인

```bash
git status --short --branch
git rev-parse HEAD
cd danyeo_ori_web_app
nvm use
npm install
npm run supabase:start
npm run supabase:reset
npm run supabase:test
npm run typecheck --workspace @danyeo-ori/web
npm run lint --workspace @danyeo-ori/web
npm run build --workspace @danyeo-ori/web
npm run dev
```

브라우저에서 `/community`와 `/admin`을 확인한 뒤 다음 기능 작업을 시작한다.
