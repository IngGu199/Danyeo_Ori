# 커뮤니티 시안 3번 디자인 QA

## 검증 기준

- Source of truth: `/home/inggu99/Danyeo_Ori/design-previews/community/option-3-fast-feed.png`
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

별도의 부분 확대 비교는 필요하지 않았다. 목록·상세가 동시에 보이는 데스크톱 전체 화면에서 분할 비율, 이미지 크기, 타이포그래피, 좋아요·작성·작성자 메뉴 위치를 같은 상태로 확인할 수 있기 때문이다.

## 비교 결과

- 정보 구조와 시각 계층: 시안의 고밀도 축제 피드, 왼쪽 목록과 오른쪽 상세 구조, 초록 선택 상태, 코랄 하트 좋아요를 유지했다.
- 사용자 요구 반영: 시안과 달리 최초 진입은 목록만 표시하고, 행을 선택할 때 상세가 오른쪽에서 나타나도록 상태 전환을 추가했다.
- 반응형: 980px 이하에서는 상세가 목록 위 오버레이로, 800px 이하에서는 390px 너비의 전체 화면 상세로 전환한다. 측정 결과 목록·상세 모두 문서 너비가 뷰포트와 같은 `390px`로 가로 넘침이 없었다.
- 디자인 시스템: 기존 다녀오리 헤더와 크림·올리브 토큰, 실제 축제 이미지 자산, Phosphor 아이콘을 재사용했다. 시안의 별도 로고·헤더 복제는 프로젝트 일관성을 위해 적용하지 않았다.
- 기능 상태: 좋아요 수와 댓글은 즉시 반영되고, 작성·수정·삭제는 명확한 진입·취소·확인 상태를 제공한다. 현재 데이터는 로컬 예시 상태라 새로고침하면 초기화된다.
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
