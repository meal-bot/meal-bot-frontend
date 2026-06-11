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

## Temporary / Do Not Forget

- Mock data is temporary for the design branch only and must be removed before final main merge.
- `.env` files were not modified by Codex.
- Local mock usage, if needed:

```env
VITE_USE_MOCKS=true
VITE_MOCK_SCENARIO=success
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
