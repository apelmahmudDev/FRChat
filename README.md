# FRChat

FRChat is a Next.js 16 messaging client backed by a REST API and Socket.IO.
REST handles authentication, conversation management, history, and message
persistence. Socket.IO delivers incoming messages and conversation updates to
TanStack Query caches in real time.

## Local development

Create `.env.local` from `.env.example`, then run:

```bash
pnpm install
pnpm dev
```

The application is available at `http://localhost:3000`.

## Verification

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Structure

- `app/` contains pages and backend-for-frontend route handlers.
- `features/` contains domain APIs, schemas, types, and UI.
- `providers/` owns application-wide query, theme, and realtime lifecycles.
- `components/ui/` contains only shared primitives currently used by the app.

The browser never receives the upstream REST base URL or stores the access
token. Route handlers read the HttpOnly session cookie and proxy authenticated
requests to the upstream service.
