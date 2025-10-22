<!-- Brief, actionable instructions for AI coding agents working on spotify-dashboard -->
# copilot-instructions for spotify-dashboard

Focus your edits on minimal, well-scoped changes. This repo is a small FastAPI backend + Vite React frontend that communicates via simple REST endpoints and an OAuth flow with Spotify.

- Architecture & big picture
  - Backend: `backend/` — FastAPI app. Entry: `backend/main.py`. Auth and user routes live in `backend/api/` (`auth.py`, `user.py`). Spotify integration is in `backend/services/spotify.py` and uses `httpx` and Pydantic models in `backend/models`.
  - Frontend: `frontend/` — Vite + React + TanStack Router/Query. Entry: `frontend/src/main.tsx`. Routes are in `frontend/src/routes/` and components in `frontend/src/components/`.
  - Deployment: Docker + docker-compose. Dev and prod compose files overlay `docker-compose.base.yml` with `docker-compose.dev.yml` or `docker-compose.prod.yml`. Common Makefile targets: `make dev`, `make prod`, `make down`.

- Important flows and integration points (include concrete file refs)
  - OAuth login: backend `GET /login` -> redirects to Spotify; `GET /callback` exchanges code for token and redirects to the frontend with `?access_token=...` (see `backend/api/auth.py`). Frontend picks token up in `frontend/src/utils/auth.ts` and stores it in `localStorage` under `spotify_auth`.
  - API base: frontend uses env variable `VITE_API_BASE_URL` (accessed via `getEnvVar` in `frontend/src/env.ts`). Ensure this points to the backend URL when running locally (e.g., via compose envs or .env).
  - Top-items: backend service `get_top_items` in `backend/services/spotify.py` and frontend hook `frontend/src/hooks/useTopItems.ts` (use this pattern when adding new endpoints: service -> api route -> frontend hook -> component).

- Developer workflows & commands (verified from repo)
  - Local dev (compose):
    - Start dev environment: `make dev` (uses `docker-compose.base.yml` + `docker-compose.dev.yml`).
    - Stop: `make down`.
  - Frontend local (without docker):
    - From `frontend/`: `yarn dev` (Vite dev server). Build: `yarn build`. Tests: `yarn test` (vitest).
  - Backend local (without docker):
    - From `backend/`: install `requirements.txt` and run `uvicorn main:app --reload` (exposed CORS origin must match `FRONTEND_URL` in `backend/config.py`).

- Project conventions & patterns to follow
  - Small, focused commits and PRs. Prefer updating or adding a single route / hook / component per change.
  - Frontend state & data fetching: use TanStack Query for server data and keep caching options consistent (see `frontend/src/main.tsx` `QueryClient` defaults). New query hooks should accept `token` and `enabled` flags like `useTopItems`.
  - Type usage: frontend uses TypeScript and shares models via `frontend/src/types.ts`. Use `TimeRange` union and typed hooks to avoid `any`. Backend uses Pydantic models in `backend/models/schemas.py`; return validated models from services.
  - Env configuration: backend `config.Settings` loads env from `../.env` (see `backend/config.py`). Frontend uses `import.meta.env` with `VITE_*` keys. Do not hardcode secrets; prefer environment variables and `.env` in dev.

- Debugging hints & edge cases
  - Token lifetime: frontend stores token and expires it after 1 hour (`frontend/src/utils/auth.ts`). When testing auth flows, ensure tokens appear as `?access_token=` in the frontend URL after callback.
  - CORS: backend allows origins based on `FRONTEND_URL` from settings — mismatched frontend URL is a common cause of issues.
  - HTTP errors: backend services use `response.raise_for_status()`; in the frontend handle errors from hooks and surface user-friendly messages (see `frontend/src/routes/index.tsx`).

- Where to look when adding features
  - New backend endpoints: add service in `backend/services/`, model in `backend/models/schemas.py` and route in `backend/api/` following `auth.py` / `user.py` patterns.
  - New frontend pages: add route in `frontend/src/routes/` using `createFileRoute` and a component under `frontend/src/components/`. Use hooks under `frontend/src/hooks/` to encapsulate API calls.

If any section is unclear or you want more detail (tests, CI, docker env vars), tell me which area and I'll expand or update this file.
