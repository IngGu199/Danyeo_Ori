# Design QA — 소개 페이지 픽셀 아트 히어로

검증일: 2026-07-13

## Comparison target

- Source visual truth: `apps/web/Documents/design-reference/landing-concept-3-reference.png`
- Generated hero asset: `apps/web/public/images/about-pixel-hero-v2.png`
- Implementation route: `/about`
- Intended viewport: 1536 × 1024 desktop, 390 × 844 mobile
- State: 비로그인 기본 화면, 소개 메뉴 활성화, 히어로 노출

## Evidence status

- Source visual: 열람 완료. 3번 시안의 크림색 캔버스, 올리브 계열 픽셀 풍경, 왼쪽 타이포그래피, 오른쪽 다녀오리 마스코트 구성을 확인했다.
- Generated asset: 열람 완료. 2048 × 1152 PNG이며 왼쪽 텍스트 안전 영역, 범용 축제 풍경, 텍스트·로고·워터마크·특정 축제 농산물 제외 조건을 확인했다.
- Browser-rendered implementation screenshot: 없음. 현재 세션에 Codex 인앱 Browser 캡처 도구가 노출되지 않았고, Playwright 직접 사용은 사용자 승인이 필요하다.
- Full-view comparison evidence: 구현 캡처가 없어 비교 불가.
- Focused-region comparison evidence: 구현 캡처가 없어 비교 불가.
- Static validation: `git diff --check`, `npm run typecheck`, `npm run build` 통과.

## Required fidelity surfaces

- Fonts and typography: 기존 무료 Pretendard/Noto Sans KR 스택을 유지하고 3번 시안과 유사한 800~850 굵기, 1.14 행간, 좁은 자간을 적용했다. 브라우저 렌더링은 미확인이다.
- Spacing and layout rhythm: 전체 폭 히어로, 1180px 내부 텍스트 축, 왼쪽 텍스트 안전 영역, 오른쪽 픽셀 아트 구성을 코드에 적용했다. 실제 줄바꿈과 크롭은 미확인이다.
- Colors and visual tokens: `DESIGN.md`의 크림·올리브 토큰을 유지하며 흰색 사진 오버레이형 텍스트를 짙은 올리브 텍스트로 전환했다.
- Image quality and asset fidelity: ImageGen으로 제작한 실 raster 자산을 사용했다. 생성 자산 자체는 선명하고 시안의 픽셀 아트 방향과 일치하나, `object-position` 결과는 브라우저 캡처가 필요하다.
- Copy and content: 핵심 헤드라인과 10~30초 체험 설명을 편집 가능한 HTML 텍스트로 유지했다. 특정 축제 사진은 히어로와 하단 CTA에서 제거했다.

## Findings

- [P1] 브라우저 렌더 캡처가 없어 최종 이미지 크롭과 타이포그래피 줄바꿈을 검증할 수 없다.
  - Location: `/about` 히어로, `.about-hero-photo`, `.about-hero-copy`.
  - Evidence: 소스 시안과 생성 자산은 열었지만 동일 뷰포트의 구현 스크린샷이 없다.
  - Impact: 오른쪽 마스코트의 발·다리·축제 부스가 잘리거나, 모바일에서 배경과 본문이 충돌하는 문제가 남을 수 있다.
  - Fix: 사용자 승인 후 Playwright로 데스크톱·모바일 캡처를 만들고 소스와 같은 비교 입력에서 확인한 뒤 `object-position`, 히어로 높이, 모바일 베일을 조정한다.

## Open Questions

- 인앱 Browser 대신 Playwright를 사용해 `/about`의 데스크톱·모바일 시각 검증을 진행해도 되는가?

## Implementation Checklist

1. 데스크톱 1536 × 1024에서 `/about` 기본 상태 캡처
2. 모바일 390 × 844에서 히어로와 CTA 캡처
3. 소스 시안과 구현 캡처를 하나의 비교 입력으로 열기
4. P1/P2 크롭·줄바꿈·대비 문제 수정
5. 재캡처 후 `final result: passed`로 갱신

## Follow-up Polish

- [P3] 실제 저해상도 픽셀 그리드와 브라우저 리샘플링이 충돌하면 `image-rendering` 설정을 뷰포트별로 미세 조정한다.

final result: blocked
