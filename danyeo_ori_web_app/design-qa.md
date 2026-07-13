# Design QA — 2026-07-13

## Comparison target

- Source visual truth: [`DESIGN.md`](./DESIGN.md) and the generated local visual assets in `apps/web/public/images/`.
- Intended implementation: Next.js routes `/`, `/festivals`, `/games`, `/calendar`, and `/community`.
- Target viewport/state: desktop and mobile, default route state with the home hero visible.

## Evidence status

- Source capture: available as the design-system specification and generated image files.
- Browser-rendered implementation screenshot: unavailable. The current task environment does not expose the required in-app Browser capture surface, and no user-approved alternative browser automation is available.
- Full-view comparison: unavailable because an implementation screenshot could not be captured.
- Focused-region comparison: unavailable for the same reason.
- Primary interaction and console checks: not browser-verified. Static validation completed with `npm run typecheck && npm run build`.

## Required fidelity surfaces

- Fonts and typography: implemented from `DESIGN.md` tokens and the existing Pretendard/Noto Sans KR fallback stack; not visually verified in a rendered browser.
- Spacing and layout rhythm: cream surface, 20–30px card radii, responsive grids, and elevated cards are implemented; not visually verified at target breakpoints.
- Colors and visual tokens: the previous purple palette is replaced with cream, olive, sage, peach, brown, and gold semantic tokens.
- Image quality and asset fidelity: CSS/emoji illustrations were replaced in the hero, festival cards, game cards, roulette, header, and community title with generated local photography and an icon library. Actual crops remain unverified in a browser.
- Copy and content: the core flow keeps festival discovery → mini-game → reward → visit language, including the server-verification constraint for rewards.

## Findings

- [P1] Rendered responsive layout has not been visually compared.
  - Location: all routes, especially the home hero and 3-column-to-1-column card transitions.
  - Evidence: no browser-rendered screenshot is available for comparison.
  - Impact: image crops, typography wrapping, and mobile overflow cannot be confirmed from source code or a successful production build.
  - Fix: capture desktop and mobile screenshots in the in-app Browser, compare them beside the intended design source, then resolve any P1/P2 differences and update this report.

## Open Questions

- Does the user want the local app opened in the in-app Browser so the visual QA pass can be completed?

## Implementation Checklist

1. Open the local Next.js app in the in-app Browser.
2. Capture `/`, `/festivals`, `/games`, `/calendar`, and `/community` at desktop and mobile widths.
3. Test favorite toggle, filters/reset, roulette status, calendar-date selection, community tabs/form, and pre-registration form.
4. Compare the captures beside the design source; record and fix any P0/P1/P2 issues.

## Follow-up Polish

- [P3] Add route-specific original imagery when live festival photography becomes available, replacing the intentionally reused concept photography.

final result: blocked
