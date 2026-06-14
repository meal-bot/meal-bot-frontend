# Documentation Work Context

This file preserves the current documentation-work context for OBOB API specification and screen design documentation.

## Working Rules

- Work from `C:\OBOB_system` as the project root.
- Do not modify code without explicit user permission.
- Read and analyze code/documents first; document edits require explicit permission.
- Use polite Korean in user-facing answers.
- Make answers logical and evidence-based.
- Separate confirmed facts from assumptions.
- Before putting content into the final API specification or screen design document, verify it against implementation files.

## Current Documentation Goal

The immediate deliverables are:

- API specification
- Screen design document

The current plan is:

1. Use the existing root `API_SPEC_DRAFT.md` as the API specification base.
2. Verify the draft against backend controllers, DTOs, frontend API modules, and AI server schemas.
3. Build the screen design document from frontend routes, page components, UI behavior, and connected APIs.

## Project Structure Context

The workspace contains three main repositories:

```txt
C:\OBOB_system
├─ meal-bot-frontend
├─ meal-bot-backend
└─ meal-bot-ai
```

High-level runtime flow:

```txt
Frontend -> Service Backend -> AI Backend -> Service Backend -> Frontend
```

Known role split:

- A: `meal-bot-frontend` and `meal-bot-backend`
- B: `meal-bot-ai`

## Read Documentation

Root:

- `API_SPEC_DRAFT.md`: existing API specification draft.
- `CODEX_SESSION_CONTEXT.md`: project-wide context, role split, architecture notes, chat/fridge behavior.
- `CLAUDE.md`: project overview and module summary.

Frontend:

- `meal-bot-frontend/CODEX.md`: frontend architecture, API call list, auth behavior, route-level notes.
- `meal-bot-frontend/DESIGN_NOTES.md`: UI/UX decisions and recent screen-design context.
- `meal-bot-frontend/CLAUDE.md`: similar frontend guidance to `CODEX.md`.
- `meal-bot-frontend/README.md`: default Vite README; low value for final docs.

Backend:

- `meal-bot-backend/CLAUDE.md`: Spring backend structure, auth, guest chat, AI integration, DB, deployment notes.

AI:

- `meal-bot-ai/rag-api/docs/architecture_snapshot.md`: current AI architecture and v0.3 `/chat` flow.
- `meal-bot-ai/rag-api/docs/orchestrator-v0.3.md`: current chat orchestrator flow.
- `meal-bot-ai/rag-api/docs/refine-v0.3.md`: refine behavior.
- `meal-bot-ai/rag-api/docs/prompts/intent-v0.3.md`: intent classification policy.
- `meal-bot-ai/rag-api/docs/prompts/slot-v0.3.md`: slot extraction policy.
- `meal-bot-ai/rag-api/artifacts/code_review_summary.md`: useful implementation analysis, but should be verified against current code before reuse.
- `meal-bot-ai/rag-api/baseline/answer_tone_v0/*.md` and `answer_tone_v1/*.md`: useful for chat scenario examples, not primary API contract sources.

## Important Source Priority

Use these as primary sources for API specification:

1. Backend controllers and DTOs in `meal-bot-backend`.
2. Frontend API modules in `meal-bot-frontend/src/features/**/api`.
3. AI FastAPI routes and schemas in `meal-bot-ai/rag-api/api`.
4. Existing Markdown documents only after code verification.

Known stale or risky source:

- `meal-bot-ai/rag-api/docs/api.md` appears older because it documents `/recommend`, `/ask`, and `spicy_max`.
- Current AI behavior should be checked against v0.3 `/chat` implementation and schemas instead.

## Known Frontend Routes

From frontend route structure:

| Path | Screen | Auth |
|---|---|---|
| `/` | Landing page | Public |
| `/main` | Chat page | Public or guest/login flow dependent |
| `/login` | Login page | Public |
| `/oauth/callback` | OAuth callback page | Public |
| `/fridge` | Fridge recommendation page | Protected |
| `/calendar` | Calendar page | Protected |
| `/inbody` | InBody dashboard page | Protected |
| `/inbody/new` | InBody input page | Protected |

These should be rechecked against `meal-bot-frontend/src/App.jsx` before finalizing.

## Known API Areas To Verify

Frontend to Service Backend:

- Auth/OAuth callback flow
- Chat
- Guest chat
- Recipe random/detail
- Fridge recommendation
- InBody save/list/delete
- Calendar date lookup

Service Backend to AI Backend:

- `POST /chat`
- Recipe detail lookup
- Random recipe lookup, if present in current deployed code

## Next Read-Only Work

Recommended next step:

1. Inspect backend controller annotations.
2. Inspect backend DTOs used by each controller.
3. Inspect frontend API modules and route components.
4. Compare findings against `API_SPEC_DRAFT.md`.
5. Produce a correction list before editing any final document.
