# 다녀오리 DESIGN.md

다녀오리는 수도권에 거주하는 2030 사용자가 지역축제를 **발견하고, 짧게 미리 체험하고, 신뢰할 수 있는 현장 정보를 확인한 뒤, 마일리지와 함께 실제 방문하도록 돕는 지역축제 O2O 서비스**다.

이 문서는 다녀오리 웹·모바일 화면의 단일 디자인 기준이다. 새로운 화면, 컴포넌트, 문구, 게임을 만들 때 이 문서의 토큰과 규칙을 우선한다.

## 1. 제품 목표와 디자인 원칙

### 해결할 문제

- 청년 세대가 지역축제를 알기 어렵다.
- 행사 프로그램, 가격, 주차와 혼잡도 정보를 방문 전에 신뢰하기 어렵다.
- 축제 정보가 실제 여행·지역 소비로 이어지는 연결 고리가 약하다.
- 지자체는 젊은 방문객에게 축제의 차별점을 전달하기 어렵다.

### 핵심 사용자 여정

```text
축제 발견 → 대표 프로그램 미니게임 → 마일리지 획득 → 가격·현장 정보 확인 → 주말 방문 → 현장 후기 공유
```

모든 주요 화면은 이 흐름 중 어느 단계를 돕는지 명확해야 한다. 단순히 축제 목록을 늘어놓지 말고, 사용자가 “왜 이 축제를 가야 하는지”와 “가기 전에 무엇을 알 수 있는지”를 보여준다.

### 우선순위

1. 신뢰: 날짜, 가격, 장소, 출처, 마지막 업데이트를 숨기지 않는다.
2. 발견: 사진과 짧은 문장으로 주말 여행의 감정을 먼저 전달한다.
3. 체험: 축제 대표 프로그램을 10~30초 안에 이해하고 플레이하게 한다.
4. 보상: 마일리지의 획득 조건, 사용처, 소멸일을 항상 명시한다.
5. 전환: 한 화면의 주 CTA는 하나만 두고 다음 행동을 분명히 한다.
6. 접근성: 색상만으로 상태를 전달하지 않고 키보드·터치·스크린리더를 지원한다.

## 2. 참고 디자인 계층

외부 디자인을 여러 개 동시에 적용하지 않는다. **Starbucks를 기반 토큰으로 사용하고, 아래 디자인은 화면 목적별 참고 원칙으로만 사용한다.** 새로운 외부 `DESIGN.md`를 추가 설치하지 말고 이 파일의 규칙으로 번역한다.

### Base — Starbucks

- Source: https://getdesign.md/starbucks/design-md
- 따뜻한 크림 캔버스
- 녹색 계층형 브랜드 컬러
- 둥근 pill 버튼
- 리워드와 멤버십을 이해하기 쉬운 상태 UI
- 반복 방문을 자연스럽게 만드는 보상 강조

### Reference — Airbnb

- Source: https://getdesign.md/airbnb/design-md
- 여행지·축제의 사진 중심 카드
- 지역, 날짜, 테마를 빠르게 탐색하는 필터
- 카드에서 상세 정보로 이어지는 예약·방문 흐름

### Reference — Pinterest

- Source: https://getdesign.md/pinterest/design-md
- 이미지 우선의 발견 경험
- 찜·저장·공유를 통한 재방문
- 단조롭지 않은 카드 리듬

### Reference — Notion / Mintlify

- Sources: https://getdesign.md/notion/design-md, https://getdesign.md/mintlify/design-md
- 긴 축제 설명을 읽기 편하게 정리
- 정보 출처, 업데이트 날짜, 상태를 명확히 표시
- 복잡한 공공정보를 단계별 섹션으로 분리

### Reference — Claude

- Source: https://getdesign.md/claude/design-md
- 따뜻한 테라코타 포인트
- 과장하지 않는 친절한 설명 문구
- 감성적인 이야기와 실용 정보를 함께 배치

### Reference — Mastercard

- Source: https://getdesign.md/mastercard/design-md
- 크림 배경 위의 큰 pill과 원형 요소
- 마일리지, 쿠폰, 사용처의 연결 관계를 시각화

### Reference — Clay / Miro

- Sources: https://getdesign.md/clay/design-md, https://getdesign.md/miro/design-md
- 게임·캠페인에 한정한 유기적 형태와 playful interaction
- 서비스 전체에는 적용하지 않는다.
- 네온, 과도한 3D, 다크 게임 UI로 확장하지 않는다.

## 3. 브랜드 분위기

키워드:

```text
따뜻한 주말 · 로컬 여행 · 믿을 수 있는 정보 · 가벼운 놀이 · 소박한 설렘 · 함께 가는 발견
```

피해야 할 분위기:

```text
차가운 공공기관 포털 · 과한 앱테크 · 카지노 같은 보상 · 네온 게임장 · 복잡한 대시보드 · 과장 광고
```

## 4. 디자인 토큰

### 색상

```css
:root {
  /* brand */
  --color-olive-900: #3f4a2d;
  --color-olive-700: #59663d;
  --color-olive-500: #71804d;
  --color-olive-300: #aebf7e;
  --color-olive-100: #edf1df;

  /* warm surfaces */
  --color-cream-50: #fffdf9;
  --color-cream-100: #f8f3e8;
  --color-beige-200: #e8dcc8;
  --color-beige-300: #dfd0bb;
  --color-brown-500: #8a735d;
  --color-brown-700: #514637;

  /* supporting accents */
  --color-peach-100: #fae9da;
  --color-peach-400: #c98978;
  --color-sage-100: #e3eee1;
  --color-sage-600: #55704f;
  --color-gold-200: #f0d7a9;
  --color-danger-500: #bd6d62;

  /* semantic aliases */
  --color-bg: var(--color-cream-100);
  --color-surface: var(--color-cream-50);
  --color-text: #2f2a24;
  --color-text-subtle: #6f665c;
  --color-border: var(--color-beige-200);
  --color-primary: var(--color-olive-500);
  --color-primary-hover: var(--color-olive-700);
  --color-success: var(--color-sage-600);
  --color-reward: var(--color-gold-200);
}
```

Use `--color-primary` for the single primary action. Use peach for warm emphasis and reward highlights, not as a second primary brand color. Body text must remain `--color-text`; do not use olive for long paragraphs.

### Typography

- Korean UI: `Pretendard`, fallback `Noto Sans KR`, system sans-serif
- Display heading: 700–800 weight, tight but readable line-height 1.15–1.25
- Body: 400–500 weight, line-height 1.55–1.7
- Caption and metadata: minimum 12px, line-height 1.5
- Do not use all-caps English labels as the main information. Use them only as small section kickers.
- Keep heading hierarchy stable: page title → section title → card title → metadata.

### Spacing, radius and elevation

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  --radius-sm: 12px;
  --radius-md: 20px;
  --radius-lg: 28px;
  --radius-pill: 999px;

  --shadow-card: 0 8px 22px rgba(92, 72, 48, .07);
  --shadow-hover: 0 16px 32px rgba(92, 72, 48, .13);
  --shadow-focus: 0 0 0 4px rgba(174, 191, 126, .24);
}
```

Use generous whitespace. A card should feel like a small travel note or polaroid, not a dense admin table. Use shadows sparingly and never use a large black drop shadow.

## 5. Layout rules

- Desktop content width: 1120–1200px, centered.
- Mobile side padding: 16px; desktop side padding: 24–40px.
- Desktop cards: 3 columns for festival discovery, 2 columns for editorial/community cards.
- Tablet cards: 2 columns.
- Mobile cards: 1 column with full-width tap targets.
- Sticky desktop header may use translucent cream and subtle blur.
- Mobile primary navigation should remain reachable with one hand; use a bottom navigation only when the current flow has at least four top-level destinations.
- Never place more than one visually dominant hero CTA in the first viewport.

## 6. Component rules

### Header and navigation

- Background: `--color-cream-50` at 84–94% opacity with a subtle bottom border.
- Logo uses the duck mark and a calm olive/yellow accent.
- Active navigation: olive text plus a soft olive underline or background pill.
- Hover: `translateY(-1px)` and color shift only; no aggressive scale.
- Keyboard focus: visible `--shadow-focus` ring.

### Primary and secondary buttons

```css
.button-primary {
  min-height: 44px;
  padding: 0 18px;
  border-radius: var(--radius-pill);
  background: var(--color-primary);
  color: #fff;
  font-weight: 700;
  transition: transform .2s ease, background-color .2s ease, box-shadow .2s ease;
}

.button-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.button-primary:active { transform: translateY(0) scale(.98); }
.button-primary:focus-visible { outline: none; box-shadow: var(--shadow-focus); }
```

- Primary: one per section, used for `게임 시작`, `축제 상세 보기`, `사전예약`, `혜택 확인`.
- Secondary: cream/white surface with beige border.
- Destructive actions: muted danger red with confirmation, never bright red by default.
- Disabled actions must explain why: `미니게임을 완료하면 룰렛이 열려요`.

### Festival discovery card

Use an image-first, lightly polaroid-like card:

```text
[real festival image with 12–16px radius]
badge: 개최중 / 추천 / 가격정보 확인
festival name
date · location
one-line reason to visit
game tag + save action
```

- Use real photography or approved image assets. Do not use CSS gradients, emoji, ASCII, or placeholder shapes as the final visual asset.
- Card hover lifts 4px and deepens shadow; image may scale only 1.02.
- The card must expose the reason to visit, not only the festival name.
- Include a trusted-data indicator when date, price, or program has been verified.

### Festival detail / trust panel

The first detail section must show:

- title, date, location, status
- source organization and last updated date
- representative programs
- entrance fee and paid program prices
- food or local product price examples when available
- parking, shuttle, map link, and contact
- mileage use conditions and expiration date

Use short sections with clear headings. Do not hide price or update information behind a secondary tab.

### Filter bar

- Use rounded pills for region, month, category, and game availability.
- Active state: `--color-olive-100` background, `--color-olive-700` text, thin olive border.
- Keep the selected filter visible on mobile and allow one-tap reset.
- Search input must have an accessible label and an empty-state message.

### Mini-game card and Play Mode

Keep the global system warm, but make the play surface more focused:

- cream page background
- olive or muted local-color play panel
- large single interaction target
- visible time, score, progress, and attempt count
- one action per state
- no neon, casino-like flashing, or dark arcade chrome

#### MVP game order

1. **Hongcheon corn clicker**: 10-second tap game, progress gauge, clear success state.
2. **Hwacheon fishing timing**: moving target, limited attempts, timing feedback.
3. **Festival information quiz**: price, program, local product, parking and shuttle questions.
4. **Mileage roulette**: reward step unlocked only after a verified game completion.

#### Game state model

```text
locked → ready → playing → success / retry / failed → reward-pending → reward-confirmed
```

- `locked`: explain the unlock condition.
- `ready`: show duration, reward range, and what the user will learn.
- `playing`: prevent accidental navigation and keep controls large.
- `success`: show score and a clear next step.
- `reward-pending`: never claim points were granted until the server confirms them.
- `reward-confirmed`: show amount, eligible festival, usage location, and expiry.

Client code must not directly update point balances or decide roulette results. Use a server/API/Edge Function request and display a pending state while it is verified.

### Mileage and reward UI

Use Starbucks-like loyalty clarity without copying its visual identity:

```text
3,000 P
홍천 찰옥수수 축제에서 사용 가능
사용 기한: 2026.07.31
사용처: 현장 체험 부스 / 제휴 상점
```

- Reward amount uses `--color-reward` or olive emphasis, never a casino-gold gradient.
- Always show earning condition and expiry.
- Separate available, pending, expired, and used states.

### Community and field reviews

Prefer review cards over a dense forum table on the consumer-facing surface.

Each post should support:

- required festival tag
- field verification status
- price, parking, crowd, food, or game-review topic
- photo or evidence when available
- helpful count and comment count
- timestamp and source context

Use the forum table only for moderation/admin or a desktop archive view. Keep community copy direct, specific, and non-promotional.

### Calendar and itinerary

- Calendar cells use quiet borders, an olive selected state, and short event chips.
- A selected date must show a useful detail panel, not only the event name.
- Add “함께 가기 좋은 코스” after a festival detail: nearby food, café, attraction, and travel time.
- Do not overwhelm the first screen with map controls; progressive disclosure is preferred.

### Forms and modal states

- Use labels, not placeholder-only fields.
- Make required festival tags explicit.
- Success message must explain the next benefit or next action.
- Error messages should identify the missing field and preserve entered content.
- Modals need a visible close button, Escape support, focus trapping, and a mobile bottom-sheet fallback.

## 7. Interaction and motion

Default transition:

```css
transition: color .2s ease, background-color .2s ease,
  border-color .2s ease, box-shadow .2s ease, transform .2s ease;
```

- Hover lift: 1–4px only.
- Press feedback: scale to .97–.99.
- Success: one short confirmation motion, not continuous confetti.
- Game feedback: progress and target feedback must be immediate.
- No auto-advancing carousel for critical information.
- Respect `prefers-reduced-motion: reduce` and remove non-essential motion.

## 8. Accessibility and trust requirements

- Body text contrast target: WCAG AA minimum.
- Every interactive element needs a keyboard-visible focus state.
- Do not communicate status by color alone; include text or an icon with accessible label.
- Touch targets: minimum 44×44px, game targets preferably 52px or larger.
- Use semantic headings, landmarks, labels, and button elements.
- Real images require meaningful Korean alt text; decorative images use empty alt.
- Date, price, availability, and statistics must show source or “예시 데이터” status.
- Never present unverified example prices or mileage as live facts.

## 9. Voice and copy

Voice: 친근하고 구체적이며, 과장하지 않는 주말 동행자.

Use:

- “이번 주말, 아직 몰랐던 축제로 떠나볼까요?”
- “게임으로 먼저 맛보고, 현장에서 써보세요.”
- “가격 정보는 축제 운영기관 제출 자료를 기준으로 확인했어요.”
- “마일리지는 7월 31일까지 홍천 축제에서 사용할 수 있어요.”

Avoid:

- “대박”, “무조건”, “인생 축제” 같은 근거 없는 과장
- 보상만 강조하는 앱테크 문구
- 출처 없는 가격·통계
- 사용자가 무엇을 해야 하는지 알 수 없는 추상적인 CTA

## 10. Implementation rules for this repository

- `danyeo_ori_web_app/DESIGN.md` is the single source of truth for new UI work.
- Next.js components live under `apps/web/app` and `apps/web/components`.
- Shared domain types and example data stay in `packages/types` and `packages/constants`.
- Keep prototype HTML in `danyeoori-ui-prototype/` as reference material; do not copy its global scripts into the app.
- Prefer existing shared class names and tokens when extending the prototype, but migrate new code to semantic component classes or Tailwind tokens.
- Keep design tokens in one location. Do not reintroduce the old purple-first palette into new pages.
- External reference designs are inspiration only; do not copy logos, proprietary imagery, or exact branded layouts.
- Keep example festival dates, prices, statistics, and reward amounts clearly marked until verified.
- The visual design must never weaken Supabase RLS, server-side reward validation, or the point transaction ledger.

## 11. Definition of done

A new screen is ready when:

- it clearly supports one step of the discover → play → visit journey;
- its primary action and empty/loading/success/error states are defined;
- it uses the tokens in this document;
- it works at mobile, tablet, and desktop widths;
- price, date, source, and reward conditions are trustworthy or clearly marked as examples;
- keyboard focus, contrast, labels, and reduced-motion behavior are covered;
- it does not introduce a second visual language or another base `DESIGN.md`.
