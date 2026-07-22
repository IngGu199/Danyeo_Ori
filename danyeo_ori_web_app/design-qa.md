# `festival_page.html` 기반 축제 상세 페이지 디자인 QA

## 검증 기준

- Source HTML: `/home/inggu99/Danyeo_Ori/Documents/danyeoori-ui-prototype/festival_page.html`
- Source desktop: `/home/inggu99/Danyeo_Ori/Documents/previews/festival-detail-html/source-desktop-1440.png`
- Source mobile: `/home/inggu99/Danyeo_Ori/Documents/previews/festival-detail-html/source-mobile-390.png`
- Implementation URL: `http://localhost:3000/festivals/boryeong-mud-2026`
- Implementation desktop: `/home/inggu99/Danyeo_Ori/Documents/previews/festival-detail-html/implementation-desktop-1440-pass2.png`
- Implementation mobile: `/home/inggu99/Danyeo_Ori/Documents/previews/festival-detail-html/implementation-mobile-390-pass2.png`
- Desktop combined comparison: `/home/inggu99/Danyeo_Ori/Documents/previews/festival-detail-html/comparison-desktop-pass2.png`
- Mobile combined comparison: `/home/inggu99/Danyeo_Ori/Documents/previews/festival-detail-html/comparison-mobile-pass2.png`
- State: 공개된 보령머드축제 예시 데이터, 여름 테마, 활성 미니게임 1개, Supabase 후기 1개
- Device scale factor: source와 implementation 모두 `1`

원본 HTML은 구례 산수유꽃축제를, 구현은 Supabase의 보령머드축제를 표시하므로 문구와 사진의 동일성 대신 정보 위계·레이아웃 밀도·반응형 구조를 비교했다. 원본에만 있는 사전예약, 운영 시간, 전화번호, 지도, 프로그램, 별점 통계는 DB 근거가 없어 의도적으로 복제하지 않았다.

## 화면 크기와 정규화

| 대상 | CSS viewport | 캡처 pixels | 문서 상태 |
|---|---:|---:|---|
| Source desktop | `1440 × 1000` | `1432 × 2826` | 세로 전체 캡처 |
| Implementation desktop | `1440 × 1000` | `1425 × 3170` | 세로 전체 캡처 |
| Source mobile | `390 × 844` | `1040 × 4471` | 원본 HTML 자체의 `1040px` 가로 넘침 포함 |
| Implementation mobile | `390 × 844` | `375 × 4254` | 스크롤바를 제외한 `clientWidth`와 `scrollWidth` 모두 `375px` |

데스크톱 비교는 양쪽을 `900px` 폭으로 맞춰 `1800 × 2002` 한 장으로 결합했다. 모바일 비교는 원본의 넘치는 전체 문서 폭을 `375px`로 축소하고 구현도 `375px` 폭으로 맞춰 `750 × 4254` 한 장으로 결합했다. 모바일 원본의 축소는 원본의 반응형 결함을 숨기기 위한 것이 아니라 전체 구성을 같은 비교 입력에 담기 위한 정규화다.

## 전체 화면·부분 비교 증거

- 전체 화면은 위 두 combined comparison에서 원본을 왼쪽, 구현을 오른쪽에 배치해 같은 입력으로 확인했다.
- 상단 제목·3단 갤러리·썸네일·4개 정보 카드와 하단 방문 정보·미니게임·후기는 데스크톱 결합 이미지에서 텍스트와 카드 경계까지 읽을 수 있어 별도의 부분 확대는 만들지 않았다.
- 모바일은 원본의 `1040px` 가로 넘침과 구현의 실제 `375px` 단일 열을 한 장에서 확인했다. 구현은 제목, 대표 이미지, 정보 카드, 소개, 방문 정보, 게임, 후기 순서를 유지하면서 숨겨지는 본문이 없다.

## 필수 충실도 점검

- Fonts and typography: 원본의 Noto Sans KR 계열 굵은 제목과 작은 메타데이터 위계를 기존 프로젝트 폰트 스택으로 재현했다. 모바일 구현은 원본을 축소한 작은 글씨를 답습하지 않고 축제명 `34px`, 본문 `14px`를 유지해 읽기 쉽다.
- Spacing and layout rhythm: 제목 다음의 3단 갤러리, 썸네일, 4개 핵심 카드, 5개 하이라이트, 소개, 체험 방법, 방문, 게임, 후기 순서가 원본과 일치한다. 데스크톱의 밀도와 둥근 카드 리듬도 유지했다.
- Colors and visual tokens: 원본의 크림·올리브를 그대로 고정하지 않고 `start_date` 7월에 맞춘 여름 민트·오션 블루 파스텔 토큰을 페이지 전체에 적용했다. 배경·배지·아이콘·버튼·카드 테두리가 같은 의미 토큰을 공유한다.
- Image quality and asset fidelity: 새 이미지를 만들지 않았다. DB `image_path`를 대표 이미지로 사용하고 저장소의 기존 축제 이미지만 보조 갤러리에 재사용했으며 모두 `next/image`와 적절한 커버 크롭을 사용한다.
- Copy and content: 축제명·기간·장소·분류·설명·게임·후기는 Supabase 실데이터를 사용한다. 출처가 없는 값은 자연스러운 안내 문구로 대체하며 `사전예약` 문구·CTA·링크는 표시하지 않는다.
- Icons and accessibility: 기존 Phosphor 아이콘만 사용하고 텍스트 기호·CSS 그림으로 대체하지 않았다. 갤러리 이전·다음과 썸네일에 레이블과 선택 상태를 제공하고, 저장 버튼은 `aria-pressed`를 동기화한다. 주요 버튼은 44px 이상이며 저감 모션 설정을 지원한다.

## 비교 이력과 발견 사항

| 우선순위 | 발견 사항 | 처리 | 수정 후 증거 |
|---|---|---|---|
| P2 | 원본 HTML은 `390px` viewport에서도 문서가 `1040px`까지 넘쳐 모바일 본문이 축소되거나 잘린다. | 원본의 정보 순서는 유지하되 구현은 갤러리·정보 카드·소개·방문·게임·후기를 실제 1열로 전환하고 일부 요약 카드만 의도적인 가로 스크롤로 처리했다. | implementation mobile에서 `clientWidth=375`, `scrollWidth=375`; 가려진 본문과 페이지 가로 스크롤 없음 |

원본과 구현을 결합한 최종 비교에서 남은 실행 가능한 P0/P1/P2는 없다. 계절 색상과 실제 콘텐츠가 다른 점, 가짜 지도·연락처·프로그램·사전예약을 제외한 점은 사용자 요구와 데이터 신뢰성에 따른 의도적 차이다.

## 브라우저·기능 검증

- 프로덕션 빌드 화면에서 갤러리 다음 버튼이 `1 / 3 → 2 / 3`, 3번 썸네일이 `3 / 3`으로 전환됐다.
- 상단과 하단 저장 버튼을 함께 `aria-pressed=true`로 동기화하고 localStorage에 저장하는 동작을 확인했다.
- 미니게임 링크 `/games#game-mud-roulette-2026`, 후기 링크 `/community?festival=boryeong-mud-2026`, 게임이 없는 축제의 정확한 빈 상태 문구를 확인했다.
- 본문에 `사전예약`이 없고, 모바일 문서 가로 넘침이 없음을 확인했다.
- JavaScript 런타임 예외는 없었다. 프로덕션 검증의 콘솔 오류는 프로젝트 공통 `favicon.ico` 404 한 건뿐이며 상세 페이지 기능과 무관하다.
- `typecheck`, `lint`, Next.js production build가 통과했다.

## 최종 결과

passed

---

# 커뮤니티 시안 3번 디자인 QA

## 검증 기준

- Source of truth: `/home/inggu99/Danyeo_Ori/Documents/previews/community/option-3-fast-feed.png`
- Implementation: `http://localhost:3000/community`
- Desktop viewport: `1440 × 1024`
- Mobile viewport: `390 × 844`
- 검증 상태: 기본 목록, 게시글 선택 상세, 좋아요, 댓글 추가, 수정 진입·취소, 삭제 확인·취소, 새 글 작성 진입

## 비교 증거

- 전체 화면 비교: `/mnt/c/Users/mushr/.codex/visualizations/2026/07/20/019f8060-ff7b-7e83-8ed0-2fd77d426d99/community-qa/comparison-desktop-detail.png`
- 데스크톱 기본 목록: `/mnt/c/Users/mushr/.codex/visualizations/2026/07/20/019f8060-ff7b-7e83-8ed0-2fd77d426d99/community-qa/desktop-list.png`
- 데스크톱 상세 상호작용: `/mnt/c/Users/mushr/.codex/visualizations/2026/07/20/019f8060-ff7b-7e83-8ed0-2fd77d426d99/community-qa/desktop-detail-interaction.png`
- 모바일 기본 목록: `/mnt/c/Users/mushr/.codex/visualizations/2026/07/20/019f8060-ff7b-7e83-8ed0-2fd77d426d99/community-qa/mobile-list-390.png`
- 모바일 상세: `/mnt/c/Users/mushr/.codex/visualizations/2026/07/20/019f8060-ff7b-7e83-8ed0-2fd77d426d99/community-qa/mobile-detail-390.png`
- Supabase 축제 카테고리 목록: `/mnt/c/Users/mushr/.codex/visualizations/2026/07/20/019f8060-ff7b-7e83-8ed0-2fd77d426d99/community-qa/supabase-community-list.png`
- Supabase 축제 slug 상세 딥링크: `/mnt/c/Users/mushr/.codex/visualizations/2026/07/20/019f8060-ff7b-7e83-8ed0-2fd77d426d99/community-qa/supabase-community-detail.png`

별도의 부분 확대 비교는 필요하지 않았다. 목록·상세가 동시에 보이는 데스크톱 전체 화면에서 분할 비율, 이미지 크기, 타이포그래피, 좋아요·작성·작성자 메뉴 위치를 같은 상태로 확인할 수 있기 때문이다.

## 비교 결과

- 정보 구조와 시각 계층: 시안의 고밀도 축제 피드, 왼쪽 목록과 오른쪽 상세 구조, 초록 선택 상태, 코랄 하트 좋아요를 유지했다.
- 사용자 요구 반영: 시안과 달리 최초 진입은 목록만 표시하고, 행을 선택할 때 상세가 오른쪽에서 나타나도록 상태 전환을 추가했다.
- 반응형: 980px 이하에서는 상세가 목록 위 오버레이로, 800px 이하에서는 390px 너비의 전체 화면 상세로 전환한다. 측정 결과 목록·상세 모두 문서 너비가 뷰포트와 같은 `390px`로 가로 넘침이 없었다.
- 디자인 시스템: 기존 다녀오리 헤더와 크림·올리브 토큰, 실제 축제 이미지 자산, Phosphor 아이콘을 재사용했다. 시안의 별도 로고·헤더 복제는 프로젝트 일관성을 위해 적용하지 않았다.
- 기능 상태: 좋아요 수와 댓글은 Supabase 집계 트리거로 즉시 반영되고, 작성·수정·삭제는 회원 세션과 RLS를 통과한 경우에만 저장된다. 새로고침 후에도 유지되며, 로컬 개발 환경에는 축제와 연결된 예시 seed가 제공된다.
- 축제 연결: 어드민의 `festivals`가 커뮤니티 카테고리의 단일 원본이다. 공개 축제는 선택 목록에 자동 반영되고 `festival_id`·축제 slug 딥링크로 해당 리뷰 피드를 바로 열 수 있다.
- 접근성: 버튼 레이블, `aria-pressed`, 검색·댓글 입력 레이블, Escape 닫기, 포커스 복귀, 모션 감소 설정을 확인했다.

## 발견 사항 이력

| 우선순위 | 발견 사항 | 처리 결과 |
|---|---|---|
| P1 | 모바일 상세가 데스크톱 분할 너비를 유지할 가능성 | 800px 이하에서 고정 전체 화면 패널과 단일 열 본문으로 전환해 해결 |
| P2 | 상세 닫기 후 선택 행으로 포커스가 이동하며 목록이 불필요하게 스크롤될 수 있음 | `focus({ preventScroll: true })`로 복귀하도록 해결 |
| P2 | 모바일의 긴 게시글 제목과 작성 버튼이 좁은 너비에서 충돌할 수 있음 | 제목 줄바꿈과 아이콘형 작성 버튼으로 해결 |
| P3 | 프로젝트 공통 모바일 헤더는 가로 탐색 방식을 유지함 | 커뮤니티 본문에는 가로 넘침이 없으며 공통 헤더 동작은 기존 디자인 시스템 범위로 유지 |

## 최종 결과

passed
