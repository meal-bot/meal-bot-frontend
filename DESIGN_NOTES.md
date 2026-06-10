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

- `npm run lint` passed.
- `npm run build` passed.
- Vite chunk-size warning remains but is not blocking.

## Likely Next Work

1. Start with landing page design/motion review.
2. Review the new main chat motion in the browser.
3. Decide whether to remove the temporary chat outlines.
4. Continue landing + main chat design improvements.
5. Then move to fridge, calendar, InBody, and login in that order.

## How To Continue In A New Codex Session

Tell Codex:

```txt
Read AGENTS.md and DESIGN_NOTES.md, then continue the design work.
Before changing files, explain what will change and wait for approval.
```
