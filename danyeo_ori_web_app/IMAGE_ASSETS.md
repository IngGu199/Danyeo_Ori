# 다녀오리 웹 이미지 자산 관리 가이드

이 문서는 다녀오리 웹 MVP에서 사용하는 정적 이미지의 저장 위치, 파일명, 최적화, Git 및 Vercel 배포 기준을 정의한다. UI 표현 규칙은 `DESIGN.md`를 따르고, 이 문서는 이미지 파일의 수명주기와 운영 방식을 담당한다.

## 1. 이미지 관리 목적

- 실제 서비스 자산과 참고·프리뷰·작업 중 자산을 물리적으로 분리한다.
- Next.js와 Vercel이 배포해야 하는 파일만 Git에서 추적한다.
- 축제, 미니게임, 배너, 아이콘, placeholder가 늘어나도 경로를 예측할 수 있게 한다.
- 대용량 원본과 미사용 시안이 Git 저장소 크기를 키우지 않게 한다.
- 저작권 또는 사용 허가를 확인한 이미지만 공개 저장소와 서비스에 배포한다.
- 향후 관리자 업로드가 필요해질 때 Supabase Storage로 안전하게 전환할 수 있게 한다.

## 2. 기준 폴더 구조

`Documents/`는 Git 저장소 루트에 둔다. `danyeo_ori_web_app/` 내부에 중복 생성하지 않는다.

```txt
Danyeo_Ori/
  Documents/                         # 로컬 전용, Git 제외
    references/                      # 외부 참고 자료
    previews/                        # 화면·자산 프리뷰
    drafts/                          # 작업 중 파일과 대용량 원본

  danyeo_ori_web_app/
    apps/
      web/
        public/
          images/                    # 실제 웹에서 사용하는 승인 자산
            festivals/
              spring/
              summer/
              autumn/
              winter/
            games/
              shared/
              <game-slug>/
            banners/
              home/
              campaigns/
              seasons/
            icons/
            placeholders/
```

빈 폴더는 Git이 추적하지 않는다. 새 자산이 처음 추가되는 시점에 해당 폴더가 저장소에 반영되는 것이 정상이다. 폴더 유지용 `.gitkeep`은 필요하지 않다.

## 3. 폴더별 역할

| 경로 | 역할 | GitHub | Vercel |
| --- | --- | --- | --- |
| `public/images/festivals/<season>/` | 실제 축제 카드·상세·달력 이미지 | 포함 | 포함 |
| `public/images/games/<game-slug>/` | 게임 키아트·배경·HUD·스프라이트 | 포함 | 포함 |
| `public/images/games/shared/` | 여러 게임이 공동 사용하는 승인 자산 | 포함 | 포함 |
| `public/images/banners/` | 홈 히어로·CTA·캠페인·계절 배너 | 포함 | 포함 |
| `public/images/icons/` | 로고·마스코트 등 직접 관리해야 하는 고정 아이콘 | 포함 | 포함 |
| `public/images/placeholders/` | 이미지 부재 상태의 기본 자산 | 포함 | 포함 |
| `Documents/references/` | 외부 사이트·기관 자료 등 참고 이미지 | 제외 | 제외 |
| `Documents/previews/` | 시안·스크린샷·QA 비교 이미지 | 제외 | 제외 |
| `Documents/drafts/` | 편집 원본·생성 실험·대용량 작업 파일 | 제외 | 제외 |

`Documents/`의 파일은 코드, CSS, DB의 `image_path`에서 참조하지 않는다. 배포가 확정된 자산은 검토와 최적화를 마친 뒤 `public/images/`의 알맞은 폴더로 복사하고 코드 경로를 갱신한다.

## 4. GitHub 포함·제외 기준

### GitHub에 포함한다

- 현재 웹 화면에서 실제로 호출하는 이미지
- 이미지가 없을 때 표시하는 공통 placeholder
- 서비스 로고, 마스코트, 고정 브랜드 자산
- 미니게임 실행에 필요한 키아트, 배경, 스프라이트, HUD
- Vercel 배포 결과에서 반드시 접근할 수 있어야 하는 이미지
- 출처와 사용 권한이 확인된 운영 이미지

### GitHub에 포함하지 않는다

- 디자인 참고 자료와 경쟁 서비스 캡처
- 선택되지 않은 시안과 프리뷰
- AI 이미지 생성 실험 결과와 중간 산출물
- PSD, AI, 대용량 무압축 PNG 등 편집 원본
- 저작권·초상권·상표 사용 여부를 확인하지 않은 이미지
- 사용 화면과 담당자가 확정되지 않은 이미지
- 일회성 QA 스크린샷과 로컬 테스트 결과

공개 GitHub 저장소에 들어간 이미지는 소스 코드에서 사용하지 않더라도 외부에서 내려받을 수 있다고 간주한다.

## 5. 파일명 규칙

### 공통 규칙

- 영문 소문자, 숫자, 하이픈만 사용한다.
- 공백, 한글, 밑줄, 괄호와 `@`를 사용하지 않는다.
- 확장자는 실제 파일 포맷과 일치시킨다.
- 모호한 `image1`, `final`, `new`, `copy`, `수정본`을 사용하지 않는다.
- 축제명과 게임명은 프로젝트에서 사용하는 영문 slug와 맞춘다.
- 연도별 내용이 달라지는 축제 포스터만 연도를 포함한다.
- 동일한 파일을 교체할 때는 Git 이력을 우선 사용한다. 두 버전을 동시에 운영할 때만 `v2`처럼 버전을 붙인다.

### 패턴

```txt
festival-<festival-slug>-<year>-<usage>.<ext>
game-<game-slug>-<usage>.<ext>
banner-<campaign-or-season>-<usage>.<ext>
icon-<name>.<ext>
placeholder-<target>.<ext>
```

### 예시

```txt
festival-boryeong-mud-2026-card.webp
festival-hwacheon-sancheoneo-2027-poster.webp
game-corn-clicker-key-art.webp
game-fishing-timing-hud-frame.png
banner-home-community.webp
banner-summer-festival.webp
icon-danyeo-ori-mascot.png
placeholder-festival.webp
placeholder-game.webp
```

픽셀 자산의 배율은 파일명 대신 자산 메타데이터나 게임별 README에서 관리한다. 기존 `DESIGN.md`의 정수 배율 렌더링 원칙은 유지하되, 공통 파일명 규칙과 충돌하는 `@2x` 표기는 새 파일부터 사용하지 않는다.

## 6. 포맷과 크기 기준

### 포맷

| 포맷 | 사용 기준 |
| --- | --- |
| WebP | 사진, 축제 카드, 썸네일, 일반 배너의 기본 포맷 |
| PNG | 투명 배경, 픽셀 아트, 무손실이 필요한 UI 자산 |
| SVG | 검증된 로고와 단순 벡터 아이콘. 외부 또는 사용자 SVG는 살균 없이 허용하지 않음 |
| JPEG | 기존 자산 호환용. 새 운영 자산은 가능하면 WebP로 변환 |
| GIF | 사용하지 않음. 필요한 애니메이션은 CSS, 영상 또는 검토된 애니메이션 포맷 사용 |

### 권장 규격과 용량

| 용도 | 권장 화면 비율·해상도 | 권장 용량 | 검토 상한 |
| --- | --- | ---: | ---: |
| 축제 세로 카드·포스터 | 3:4 또는 원본 포스터 비율, 긴 변 1,200px 안팎 | 300KB 이하 | 500KB |
| 게임 카드 키아트 | 4:3 또는 16:9, 1,200×900px 이하 | 300KB 이하 | 500KB |
| 홈·CTA 배너 | 16:9 중심, 1,600×900px 안팎 | 500KB 이하 | 800KB |
| 일반 아이콘 | 실제 표시 크기의 2배 정도 | 50KB 이하 | 100KB |
| 마스코트·투명 PNG | 필요한 최대 표시 크기의 2배 | 200KB 이하 | 500KB |
| placeholder | 대상 컴포넌트 비율과 동일 | 100KB 이하 | 200KB |

- 1MB를 넘는 배포 자산은 예외 사유 없이 추가하지 않는다.
- 원본 해상도가 작은 파일을 억지로 확대하지 않는다.
- 같은 이미지를 화면마다 다른 이름으로 복제하지 않고 `sizes`와 `next/image` 최적화를 이용한다.
- 사진의 EXIF 위치·촬영자 정보가 불필요하면 공개 전 제거한다.
- 픽셀 아트는 PNG를 유지할 수 있으며 `image-rendering: pixelated`와 정수 배율 원칙을 따른다.

## 7. Next.js 사용 기준

`apps/web/public/images/`의 파일은 URL에서 `public`을 제외하고 `/images/...`로 접근한다.

```tsx
import Image from "next/image";

<Image
  src="/images/festivals/summer/festival-boryeong-mud-2026-card.webp"
  alt="보령머드축제 머드 체험 현장"
  fill
  sizes="(max-width: 700px) 50vw, (max-width: 1000px) 33vw, 250px"
/>
```

### 구현 규칙

- 일반 래스터 이미지는 `next/image`를 우선 사용한다.
- 고정 크기 자산에는 `width`와 `height`, 반응형 커버 이미지에는 `fill`과 정확한 `sizes`를 제공한다.
- `fill` 부모 요소에는 크기와 `position: relative`를 지정해 레이아웃 이동을 방지한다.
- 첫 화면의 실제 LCP 이미지에만 `priority` 또는 즉시 로딩을 적용한다.
- 픽셀 아트처럼 최적화 과정이 표현을 훼손하는 경우에만 근거를 남기고 `unoptimized`를 사용한다.
- 파일 경로의 대소문자를 정확히 맞춘다. 로컬에서 동작해도 Vercel의 Linux 빌드에서 실패할 수 있다.
- 로컬 절대 경로와 `Documents/` 경로를 `src`에 사용하지 않는다.
- 코드에서는 `public/images/...`가 아니라 `/images/...`를 사용한다.

### 대체 텍스트

- 정보 전달 이미지: 화면 맥락에서 사용자가 알아야 할 내용을 짧게 쓴다.
- 링크 이미지: 이미지 모양보다 링크의 목적을 설명한다.
- 장식 이미지: `alt=""`를 사용하고 중복 설명을 만들지 않는다.
- 포스터의 중요한 일정·장소 정보는 이미지에만 넣지 않고 HTML 텍스트로도 제공한다.
- `축제 이미지`, `사진` 같은 의미 없는 대체 텍스트와 파일명 자동 변환을 피한다.

## 8. DB 저장 기준

현재 `festivals.image_path`와 `community_posts.image_path`에는 파일 자체가 아니라 경로 문자열만 저장한다.

```txt
image_path = /images/festivals/summer/festival-boryeong-mud-2026-card.webp
```

- 정적 public 자산은 `/images/`로 시작하는 절대 URL 경로를 저장한다.
- DB에 Base64 이미지, 로컬 파일 경로, `public/`이 포함된 경로를 저장하지 않는다.
- 관리자 입력은 `/images/` 허용 경로 또는 승인된 Supabase Storage URL인지 검증한다.
- 이미지 교체 전에 해당 경로를 참조하는 seed, DB 레코드, 컴포넌트를 모두 검색한다.
- 관리자 업로드를 도입할 때는 `image_alt`, 출처, 권리 확인 상태를 별도 필드 또는 운영 메타데이터로 관리하는 방안을 검토한다.

경로 변경 검색 예시:

```bash
rg -n '/images/기존-파일명' \
  apps/web packages supabase
```

## 9. 자산 반입과 승인 절차

1. 참고·원본 파일을 루트 `Documents/references/` 또는 `Documents/drafts/`에 둔다.
2. 출처, 소유자, 라이선스, 사용 범위, 확인일을 기록한다.
3. 실제 화면 비율에 맞게 자르고 색상·가독성을 검토한다.
4. WebP 또는 필요한 포맷으로 변환하고 메타데이터와 용량을 줄인다.
5. 파일명을 규칙에 맞게 확정한다.
6. `public/images/`의 용도별 폴더에 최종본 하나만 추가한다.
7. 컴포넌트와 DB 경로를 갱신한다.
8. 데스크톱·모바일에서 잘림, 흐림, 레이아웃 이동과 대체 텍스트를 확인한다.
9. `git diff --stat`으로 예상하지 않은 원본·프리뷰 파일이 포함되지 않았는지 확인한다.

운영 이미지의 권리 기록이 늘어나면 `danyeo_ori_web_app/IMAGE_LICENSES.md`를 별도로 만들고 다음 항목을 관리한다.

```txt
파일 경로 | 출처 URL·제공 기관 | 권리 유형 | 사용 범위 | 확인자 | 확인일
```

## 10. 현재 자산 점검 결과와 이전 계획

기준일: 2026-07-22

- `public/images/`에는 래스터 이미지 14개가 있다.
- 10개 파일이 1MB를 넘으며, 가장 큰 파일은 약 2.6MB이다.
- 홈 슬라이더 4장은 각각 약 1.4~1.8MB이다.
- 세로 축제 이미지 3장은 각각 약 2.1~2.5MB이다.
- `reward-wheel.png`는 현재 코드에서 직접 참조되지 않아 삭제 후보 여부를 별도 확인해야 한다.
- 코드가 참조하는 `/images/화천산천어축제.jpg`는 실제 `public/images/`에 존재하지 않는다.
- 기존 포스터 파일명 `boryeng`, `hongchen`, `hwachen`은 새 규칙 적용 시 각각 `boryeong`, `hongcheon`, `hwacheon`으로 바로잡아야 한다.
- 현재 이미지의 저작권·사용 허가 상태는 저장소만으로 확인할 수 없으므로 운영 전 별도 확인이 필요하다.

경로를 즉시 이동하면 컴포넌트, `seed.sql`, 기존 Cloud DB 레코드가 깨질 수 있다. 다음 매핑을 기준으로 별도 자산 마이그레이션 커밋에서 파일 이동, 참조 변경, 압축과 회귀 검증을 함께 수행한다.

| 현재 자산 | 목표 분류 |
| --- | --- |
| `GooseGooseDuckDuck.png` | `icons/` 마스코트 |
| `about-pixel-hero.png` | `banners/` 소개 배너 |
| `home-slider-*.png` | `banners/home/` 홈 슬라이더 |
| `coastal-mud-festival.png`, `corn-market-festival.png`, `summer-valley-festival.png` | `festivals/summer/` |
| `lantern-river-festival.png` | `festivals/autumn/` |
| `festivals/poster/boryeng-mud-poster.jpg` | `festivals/summer/` 보령 포스터 |
| `festivals/poster/hongchen-corn-poster.jpg` | `festivals/summer/` 홍천 포스터 |
| `festivals/poster/hwachen-fish-poster.jpg` | `festivals/winter/` 화천 포스터 |
| `reward-wheel.png` | 사용 확인 후 `games/shared/` 이동 또는 삭제 |

## 11. Supabase Storage 도입 검토 기준

초기 웹 MVP는 Git에서 검토 가능한 `public/images/` 정적 자산을 사용한다. 다음 중 하나가 실제 요구사항이 되면 Supabase Storage 도입을 검토한다.

- 관리자가 `/admin`에서 이미지를 직접 업로드하거나 교체해야 한다.
- 운영자가 코드 배포 없이 축제 이미지를 바꿔야 한다.
- 이미지 변경 빈도나 파일 수가 Git 기반 검토에 부담을 준다.
- 사용자 게시글 이미지 업로드가 필요하다.
- 공개·비공개 접근 권한, 만료 링크 또는 사용자별 접근 제어가 필요하다.
- 원본, 썸네일, 변환본의 비동기 처리가 필요하다.

### Storage 도입 원칙

- 공개 축제 자산과 사용자 업로드 자산을 bucket 또는 최상위 path로 분리한다.
- service role 또는 secret key를 브라우저에 노출하지 않는다.
- 사용자 업로드에는 인증, RLS, 소유자 경로와 업로드 횟수 제한을 적용한다.
- 서버에서 파일 크기, MIME type, 확장자, 실제 파일 시그니처를 검증한다.
- 임의 SVG와 실행 가능한 파일은 허용하지 않는다.
- 업로드 파일명을 신뢰하지 않고 서버에서 UUID 기반 object path를 생성한다.
- 공개 운영 이미지는 public bucket, 비공개·심사 전 이미지는 private bucket과 signed URL을 검토한다.
- DB에는 object path 또는 승인된 public URL만 저장한다.
- 임시 업로드와 승인된 운영 이미지를 경로로 분리하고 삭제 정책을 둔다.

예시:

```txt
festival-public/<festival-id>/<asset-id>.webp
community-private/<user-id>/<asset-id>.webp
uploads-pending/<user-id>/<asset-id>.webp
```

## 12. Vercel 배포 기준

- `public/images/` 파일은 Git 커밋에 포함되어야 Vercel 빌드에 포함된다.
- 이미지 추가·삭제·경로 변경은 코드 변경과 같은 배포 단위로 처리한다.
- 대소문자만 바꾸는 파일명 변경도 Git에서 정상적으로 기록됐는지 확인한다.
- Vercel 배포 로그의 404와 실제 배포 URL의 이미지 응답을 확인한다.
- public 정적 자산에는 비공개 원본, 개인정보, API 키나 내부 메모를 포함하지 않는다.
- 원격 이미지를 도입할 경우 `next.config.mjs`의 허용 호스트를 최소 범위로 제한하고 출처 정책을 먼저 확정한다.

## 13. 완료 체크리스트

- [ ] 파일이 실제 운영 자산인가?
- [ ] 출처와 공개 사용 권한을 확인했는가?
- [ ] 용도별 폴더와 파일명 규칙을 지켰는가?
- [ ] 포맷, 해상도와 용량 기준을 만족하는가?
- [ ] `next/image`의 크기 또는 `fill`·`sizes`를 올바르게 지정했는가?
- [ ] 의미 있는 `alt` 또는 장식용 `alt=""`를 적용했는가?
- [ ] seed와 DB의 기존 `image_path`를 확인했는가?
- [ ] `Documents/` 파일이 Git 변경 목록에 포함되지 않았는가?
- [ ] 데스크톱과 모바일에서 잘림·흐림·레이아웃 이동이 없는가?
- [ ] Vercel Preview에서 이미지 404가 없는가?

## 14. 주의사항

- `Documents/` 이미지를 웹에서 직접 참조하지 않는다.
- 새 이미지를 요청 없이 생성하지 않는다.
- 기존 승인 자산을 재사용할 수 있으면 새 파일을 만들지 않는다.
- 저작권이 불명확한 이미지를 GitHub 또는 Supabase Storage에 올리지 않는다.
- 대용량 원본을 `public/`에 보관하지 않는다.
- 관리자 입력만으로 임의 외부 URL이나 파일을 신뢰하지 않는다.
- 현재 단계에서는 자산 관리 편의를 이유로 Supabase Storage를 미리 도입하지 않는다.
