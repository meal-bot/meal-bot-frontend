# DESIGN_NOTES.md

This file captures the current design-work context for continuing the redesign branch in another local environment or a new Codex session.

## Working Direction

- Keep shared UI, layout, and design tokens stable and consistent.
- Manage page-specific interactions and animations inside each feature, usually with feature CSS.
- Keep `src/index.css` minimal: Tailwind import, theme tokens, base HTML/body/root styles, and truly global defaults only.
- Do not force every complex animation into Tailwind classes. Use feature CSS when motion/state timing is page-specific.

## Design Priority

1. Landing + main chat
2. Fridge
3. Calendar
4. InBody
5. Login

## User Preferences

- Desktop-first design.
- Core product impression: meal recommendation service + AI chat service.
- Visual appeal has priority, then smoothness/lightweight implementation.
- Preserve most existing UX flows.
- Before design/code changes, explain what will change and wait for approval.
- After larger changes, report using:
  - purpose
  - changed files/folder structure
  - important code
  - verification result

## Current Architecture Direction

```txt
Common app structure:
- Layout
- Navigationbar
- shared UI components
- theme tokens

General app UI:
- Tailwind + shared UI

Feature-specific motion/interactions:
- feature CSS

Landing/marketing:
- independent landing CSS is allowed
```

## Completed Cleanup

- Renamed chat page concept from `MainPage` to `ChatPage`, while keeping route `/main`.
- Removed unused detail route and static meal data:
  - `src/features/meal/pages/MealDetailPage.jsx`
  - `src/features/meal/data/mealData.js`
  - `/meal/:id` route
- Removed unused InBody components:
  - `src/features/inbody/components/BodyDiagram.jsx`
  - `src/features/inbody/components/SegmentRow.jsx`
- Split chat page into:
  - `ChatPage.jsx`
  - `ChatIntroSection.jsx`
  - `ChatThread.jsx`
  - `ChatComposerLayer.jsx`
  - `ChatInput.jsx`
- Moved feature CSS out of `src/index.css`:
  - `src/features/calender/style/calendar.css`
  - `src/features/fridge/style/fridge.css`
- Added chat motion CSS:
  - `src/features/chat/style/chat.css`
- Added/refined landing chat preview:
  - `src/features/landing/components/ChatPreview.jsx`
  - `src/features/landing/components/Hero.jsx`
- Added fridge error-state visual support:
  - `src/assets/dumb_AI.png`
  - `src/features/fridge/components/ResultsPanel.jsx`
  - `src/shared/components/ui/EmptyState.jsx`
- Added fridge error UI debug route:
  - `/fridge?debugError=1`
- Redesigned the landing entry as a focused full-bleed hero:
  - full-screen food photo background with slow crossfade
  - left hero copy + right chat preview mockup
  - removed previous Features / How It Works / Final CTA sections
  - kept one primary CTA: `시작하기` -> `/login`
  - removed duplicate landing nav login button
- Updated landing hero copy:
  - eyebrow: `AI MEAL ASSISTANT`
  - title: `AI와 대화하며 찾는 / 오늘의 맞춤 식단`
  - `오늘의 맞춤` accent color now uses the landing green tone
  - subtitle font size increased
- Unified app font direction:
  - removed Google `Manrope` import
  - loaded `Pretendard Variable`
  - changed global font tokens to Pretendard
  - landing, fridge, and calendar CSS now use global font tokens
- Refined auth entry wording for OAuth-as-signup/login:
  - login page title: `어떤 방식으로 시작할까요?`
  - social buttons: `Google 계정으로 계속하기`, `Kakao 계정으로 계속하기`
  - guest action: `로그인 없이 시작하기`
  - do not rename guest-mode Navigationbar text unless explicitly requested
- Improved global secondary-text visibility:
  - `--color-on-surface-variant` changed from `#7c726a` to `#645b54`
- Removed misleading InBody dashboard bottom CTA:
  - the app does not automatically pass InBody data into AI chat
  - InBody dashboard now ends at the trend/history section
- Started Health Analytics handoff-based InBody dashboard redesign:
  - `InBodyDashboardPage.jsx` now composes dedicated section components
  - BMI hero is the main above-the-fold card
  - required-only data state is supported: BMI, BMR, daily calories, weight trend, and history still render
  - optional InBody fields render composition/metric cards when present and empty states when absent
  - extracted display helpers to `src/features/inbody/utils/inbodyDisplay.js`
- Continued InBody dashboard polish from the handoff:
  - changed the BMR card's recommended daily calories block to the handoff-style soft green panel
  - added BMR/activity calorie split labels and ratio bar inside the metabolism card
  - changed the composition card layout to a centered donut chart with lean/fat bars below it
  - kept composition and metabolism cards aligned to the same grid-row height
  - briefly tested a natural-height composition card, then reverted because the user wanted it aligned with the metabolism card
  - adjusted the composition card to reduce perceived empty space without breaking row-height alignment
- Temporary required-only InBody mock scenario was created for visual checking and then removed after confirmation.
- `.env.local` was restored back to `VITE_MOCK_SCENARIO=success` after the required-only mock check.
- The Health Analytics handoff ZIP was extracted under `.tmp-health-redesign/` for reference only.
  - this folder is not imported by source code
  - clean it before committing if it remains untracked
- Mock cleanup conclusion:
  - do not delete `src/mock/MOCK.js` or `src/mock/useMock.js` alone
  - before deployment/main merge, remove mock imports and `if (USE_MOCKS)` branches from API files first
  - after mock branches are removed, existing real API routes should keep working because the redesign changed the dashboard UI shell, not the endpoint contracts

## Recent InBody Dashboard Work

- Added Nivo Line support:
  - installed `@nivo/line`
  - `package.json` and `package-lock.json` changed
- Replaced the custom SVG trend chart with Nivo-based trend panels:
  - `src/features/inbody/components/InBodyTrendCard.jsx`
  - current structure is a 2-grid chart card
  - left chart: weight trend, actual `kg` values
  - right chart: body fat percentage trend, actual `%` values
  - previous "first measurement change rate %" approach was removed because it confused the user
  - Y-axis labels were hidden because they made the card visually noisy
  - tooltips still show the real measured values
- Expanded local InBody mock records for trend-chart visual checking:
  - `src/mock/MOCK.js`
  - full mock records increased from 2 to 5
  - added `daysAgo()` helper for safer mock dates
  - values now include visible weight/body-fat movement
  - this is temporary design-branch mock data and must be cleaned before final main merge
- Reworked the body composition card:
  - `src/features/inbody/components/InBodyCompositionCard.jsx`
  - removed the donut chart
  - replaced it with a total body-weight breakdown card
  - uses stacked bar for lean mass vs fat mass
  - shows separate mini cards for lean mass and body fat mass
  - keeps descriptions close to the related metric
- Reworked optional InBody metrics:
  - `src/features/inbody/components/InBodyMetricsCard.jsx`
  - changed from diagnostic wording to reference wording
  - `normal / low / high` display became:
    - `참고 범위 내`
    - `참고 범위보다 낮은 편`
    - `참고 범위보다 높은 편`
  - card copy now states that personal standards can vary by sex, age, and body type
- Removed unused prototype comparison code:
  - deleted `src/features/inbody/components/ComparisonBarChart.jsx`
  - deleted `src/features/inbody/components/SectionTitle.jsx`
  - removed `AVG_STATS` from `src/features/inbody/data/inbodyData.js`
- Summary cards:
  - recent-delta trend icon added earlier
  - color rule is now purely directional:
    - increase: red
    - decrease: blue
    - no change: green
  - no longer uses "good/bad" interpretation

## Remaining InBody Issues / Decisions

- Several InBody files still have mojibake/broken Korean strings and should be fixed before visual work continues:
  - `src/features/inbody/pages/InBodyDashboardPage.jsx`
  - `src/features/inbody/components/BmiHeroCard.jsx`
  - `src/features/inbody/components/InBodySummaryCards.jsx`
  - `src/features/inbody/components/InBodyMetabolismCard.jsx`
  - `src/features/inbody/data/inbodyData.js`
- The fixed reference ranges in `ADVANCED_FIELDS` are still hardcoded.
  - They existed before the latest edits.
  - They are now labeled as "reference ranges", not diagnosis.
  - Final decision needed: keep as weak reference UI, hide ranges, or replace with backend-provided/personalized standards.
- Unused InBody prototype files may still remain and should be reviewed:
  - `src/features/inbody/components/ScoreRing.jsx`
  - `src/features/inbody/components/TrendChart.jsx`
  - unused exports such as `SEGMENTS` and `LATEST` in `inbodyData.js`
- The InBody dashboard has not been command-verified after these latest changes because the user requested no routine verification.

## Current CSS Structure

```txt
src/index.css
- Tailwind import
- theme tokens
- html/body/root
- material symbols default

src/features/calender/style/calendar.css
- calendar-only layout, panel, day-cell, and animation styles

src/features/fridge/style/fridge.css
- fridge-only layout, ingredient board, chef panel, results, and animation styles

src/features/chat/style/chat.css
- chat-only message, recommendation card, input, and send button motion

src/features/landing/styles/landing.css
- landing-only visual and animation styles

src/features/landing/components/ChatPreview.jsx
- landing hero chat simulator
- loops a scripted AI meal recommendation conversation
- renders recommendation cards under bot messages
```

## Recent Chat Motion Additions

- `chat-message-row`
  - user messages enter slightly from the right
  - assistant messages enter slightly from the left
- `chat-bubble`
  - subtle hover lift
- `chat-recommendation-card`
  - staggered recommendation card entrance
- `chat-input-shell`
  - focus border/shadow micro interaction
- `chat-send-button`
  - hover/active micro interaction

## Important UX Decisions

- Chat typing animation should not force-scroll the user to the bottom.
- Scroll-to-bottom behavior is handled deliberately:
  - scroll on send
  - scroll when opening an existing chat
  - scroll when the floating latest-message button is clicked
- The previous 1-frame horizontal jump was caused by scrollbar appearance/disappearance.
  - Fixed with `html { scrollbar-gutter: stable; }` in `src/index.css`.
- Sidebar open/close behavior must keep working.
- Chat input and thread alignment should remain consistent with sidebar offsets.
- Landing should avoid duplicated entry actions:
  - use one main hero CTA when it goes to the same destination as nav login
- For login = first-time signup via OAuth, prefer `계속하기` wording over separate `회원가입`.
- Do not imply AI automatically reads body composition data unless that feature is actually implemented.
- User requested that routine design/CSS changes should not run `npm run lint` or `npm run build`.
  - If a change is structurally risky, explain the need for verification first.
- Sidebar state architecture is currently undecided:
  - `SidebarContext` is only consumed directly by `ChatPage` today, so it may be more complex than needed.
  - However, sidebar state now affects layout alignment, navigation positioning, composer positioning, and page-transition-related behavior.
  - Keep `SidebarContext` for now; revisit after the page transition/sidebar animation direction stabilizes.

## Temporary / Do Not Forget

- Mock data is temporary for the design branch only and must be removed before final main merge.
- `.env` files were not modified by Codex.
- Temporary InBody mock scenarios exist for A/B dashboard checks:
  - `VITE_MOCK_SCENARIO=success`: required + optional InBody data
  - `VITE_MOCK_SCENARIO=requiredOnly`: required fields only, optional fields set to `null`
  - remove this scenario structure together with mock cleanup before final main merge.
- Home agent added a temporary frontend-only guest route bypass for design review:
  - `src/App.jsx` now allows protected pages when `import.meta.env.DEV && VITE_ALLOW_GUEST_PAGES === 'true'`.
  - local `.env.local` has `VITE_ALLOW_GUEST_PAGES=true` together with `VITE_USE_MOCKS=true`.
  - this is only for checking page design and motion without login/API dependency.
  - revert by removing `allowGuestPages` from `ProtectedRoute` and deleting `VITE_ALLOW_GUEST_PAGES` from local env before final merge/deployment.
- Local mock usage, if needed:

```env
VITE_USE_MOCKS=true
VITE_MOCK_SCENARIO=success
VITE_ALLOW_GUEST_PAGES=true
```

- Temporary mock files:
  - `src/mock/MOCK.js`
  - `src/mock/useMock.js`
- APIs currently include mock branches. Before main merge, search and remove:

```bash
rg "USE_MOCKS|MOCK|VITE_USE_MOCKS|VITE_MOCK_SCENARIO" src
```

- Temporary debug outlines may still exist:
  - `src/features/chat/components/ChatThread.jsx`
  - `src/features/chat/components/ChatInput.jsx`
- Fridge error UI can be tested with:

```txt
/fridge?debugError=1
```

- `UserProfilePage` is planned for removal. Do not spend design/refactor effort on it unless explicitly asked.
- Figma MCP is not connected yet. It may be connected later.

## Last Known Verification

- Last explicit verification before the user's "do not verify" instruction:
  - `npm run lint` passed.
  - `npm run build` passed.
  - Vite chunk-size warning remains but is not blocking.
- After that instruction, later simple design/CSS/text changes were not verified by command.

## Likely Next Work

1. Review the current landing page in the browser after:
   - Pretendard font switch
   - darker secondary text token
   - landing hero/CTA cleanup
2. Decide whether to remove the temporary chat outlines.
3. Continue main chat visual polish.
4. Continue reviewing the new InBody dashboard against the handoff file.

## How To Continue In A New Codex Session

Tell Codex:

```txt
Read CODEX.md and DESIGN_NOTES.md, then continue the design work.
Before changing files, explain what will change and wait for approval.
```
