# FRChat

![Next.js 16](https://img.shields.io/badge/NEXT.JS-16-111111?style=flat-square&logo=nextdotjs&logoColor=white) ![React 19](https://img.shields.io/badge/REACT-19-149ECA?style=flat-square&logo=react&logoColor=white) ![TypeScript 5](https://img.shields.io/badge/TYPESCRIPT-5-3178C6?style=flat-square&logo=typescript&logoColor=white) ![TanStack Query](https://img.shields.io/badge/TANSTACK-QUERY-FF4154?style=flat-square&logo=reactquery&logoColor=white) ![Socket.IO 4](https://img.shields.io/badge/SOCKET.IO-4-3B3B3B?style=flat-square&logo=socketdotio&logoColor=white) ![Tailwind CSS 4](https://img.shields.io/badge/TAILWIND-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

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

## Part 3 - Thought Process Write-up

### Part 1: Architecture and approach

I used the Next.js App Router as both the UI framework and a small
backend-for-frontend. Server route handlers validate requests, attach the
HttpOnly session token, normalize upstream errors, and keep the REST API URL out
of the client bundle. The browser requests the token only in memory when it
opens the Socket.IO connection; it is never written to browser storage. This
adds a server hop and some duplicate boundary schemas, but the security and
consistent client-facing contract were worthwhile trade-offs.

The code is organized by feature so authentication, conversations, messages,
users, realtime behavior, and landing-page UI can evolve independently.
TanStack Query owns remote state and cache invalidation, while short-lived UI
state remains local to components. Server Components provide the initial
conversation list, Zod validates form and network boundaries, and Socket.IO
updates or invalidates Query caches as events arrive. Optimistic message writes
make sending feel immediate, with rollback on failure and cache reconciliation
when the canonical socket message arrives. The main compromise is that, without
an upstream client-generated message ID, matching an optimistic message by
sender and text is best-effort.

### Part 2: Landing-page design

The landing page uses a calm green and warm neutral palette to make a busy chat
product feel focused rather than noisy. Large, tightly tracked headings create
a clear hierarchy, while rounded surfaces, restrained shadows, dot patterns,
and a handcrafted product scene give the page its own visual identity without
depending on stock imagery. The single-column hero introduces the value first,
then reveals a cropped version of the actual chat interface with a dark fade so
the product remains the focal point without dominating the page.

The sections are split into focused components and styled primarily with
Tailwind; only masks and layered gradients remain in global CSS. Responsive
layouts, keyboard focus states, light/dark/system themes, semantic structure,
and reduced-motion fallbacks were included from the start. I intentionally
avoided generic testimonials and FAQ blocks because they would add length
without demonstrating the implemented product.

### AI usage

OpenAI Codex was used as a pair-programming assistant for repository analysis,
implementation and refactoring, debugging the Base UI theme menu, iterating on
the landing-page design, running verification commands, and drafting this
summary. Its suggestions were not accepted wholesale: unnecessary CSS files,
extra abstractions, and generic landing-page patterns were rejected or removed;
the final code and wording were checked against the supplied brief, the actual
API boundaries, and browser renders. Madagascar is included here only because
the assignment explicitly requested it, not because it influenced a technical
decision.

### Improvements with more time

I would add Vitest and React Testing Library coverage for schemas, cache
reconciliation, and forms, plus Playwright tests for sign-in, conversation
creation, sending, and reconnect behavior. The message list should implement a
true near-bottom rule with a "jump to latest" control instead of following every
new message. I would also add stronger dialog focus management, a visible socket
connection status, broader device and accessibility testing, and idempotent
message creation if the API gains a client message ID.

### API issues and workarounds

- Message history was not represented by one stable shape. Responses could be a
  direct array or place messages under `data`, `messages`, or `data.messages`,
  while pagination used `nextCursor` or `nextBefore` with an optional
  `hasMore`. The proxy normalizes these into one `{ data, nextCursor, hasMore }`
  contract.
- Socket messages could be direct or wrapped in `message`/`data`, and equivalent
  fields used different names such as `_id`/`id`,
  `conversationId`/`conversation`, and `text`/`content`. Sender and timestamp
  values also varied. Zod transforms valid variants; incomplete identifiable
  events trigger a history refetch instead of being inserted blindly.
- Direct conversations exposed a singular `participant`, while groups used
  `participants`. A server-side mapper converts both into the same internal
  participant model before rendering.
- The successful send-message response body was not reliable enough to treat as
  the canonical message. The proxy treats any successful status as an
  acknowledgement, returns `{ ok: true }`, and lets optimistic state plus the
  socket event or later history fetch provide the final message.
- Error bodies could use `message`, a string `error`, or a nested error object.
  A shared normalizer preserves the upstream HTTP status and presents one safe
  message/code shape to the UI.
