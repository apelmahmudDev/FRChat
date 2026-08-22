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

## Part 3: Thought Process Write-up

### Overview

My goal was to build a messaging client that feels responsive while keeping the
codebase secure, predictable, and easy to maintain. I separated server data,
realtime events, and temporary UI state instead of managing all three through a
single state layer. I also kept the landing page visually connected to the chat
product rather than treating it as a separate template.

### 1. Architecture, libraries, and trade-offs

I used the Next.js App Router for the interface and as a small
backend-for-frontend layer. Its route handlers validate requests, attach the
HttpOnly session cookie, normalize upstream errors, and prevent the REST API
base URL from being exposed in the client bundle. The Socket.IO token is held
only in memory while the connection is active and is never stored in local or
session storage.

The main trade-off is an additional server hop and some repeated validation at
system boundaries. I accepted that cost because it provides safer token
handling and gives the browser one consistent API contract.

The application is organized by feature so authentication, users,
conversations, messages, realtime behavior, and landing-page components can be
changed independently. The main library choices were:

- **TanStack Query** for server state, caching, pagination, invalidation, and
  optimistic updates.
- **Socket.IO** for incoming messages and conversation updates.
- **Zod** for validating forms and normalizing inconsistent REST and socket
  payloads.
- **Tailwind CSS** for responsive styling without creating large component-level
  stylesheets.
- **Server Components** for the initial conversation data, reducing unnecessary
  client-side loading work.

When a user sends a message, the UI creates an optimistic entry, rolls it back
if the request fails, and reconciles it when the confirmed socket event arrives.
This makes the interface feel immediate. However, the API does not provide a
client-generated message ID, so matching an optimistic message by sender and
text remains a best-effort solution.

### 2. Design reasoning

I chose a calm green and warm neutral palette because messaging interfaces
already contain many competing elements. The restrained colors, spacing, and
shadows help the page feel focused without using the common blue appearance of
many chat products.

The hero follows a single-column structure: the message and actions appear
first, followed by a cropped preview of the real chat interface. A dark fade
limits the preview's visual height, allowing visitors to understand the product
without letting the mockup dominate the page. Large headings establish the
main hierarchy, while rounded surfaces and subtle dot patterns add character
without relying on stock imagery.

I split the page into focused components and used global CSS only for effects
that are difficult to express clearly with utilities, such as masks and layered
gradients. The implementation also includes responsive layouts, semantic HTML,
keyboard focus states, light/dark/system themes, and reduced-motion fallbacks.
I left out generic testimonials and FAQ sections because they would increase
the page length without demonstrating the implemented product.

### 3. Use of AI tools

I used OpenAI Codex as a development assistant for repository analysis,
boilerplate, refactoring suggestions, debugging the Base UI theme menu,
reviewing API integration, iterating on the landing-page design, running
verification commands, and helping draft this write-up.

I did not accept its output without review. I rejected or removed unnecessary
CSS files, premature abstractions, and generic landing-page sections. I checked
the remaining code against the assignment brief, the observed API behavior,
TypeScript and lint results, and browser renders. I made the final decisions on
the architecture, UI direction, component boundaries, and wording. Madagascar
is included to satisfy the explicit instruction in the assignment document.

### 4. What I would improve with more time

- Add unit and component tests with Vitest and React Testing Library for Zod
  schemas, forms, optimistic updates, and cache reconciliation.
- Add Playwright tests for sign-in, conversation creation, message sending, and
  socket reconnection.
- Improve message scrolling with a true near-bottom check and a **Jump to
  latest** control.
- Add clearer socket connection and reconnection status.
- Strengthen dialog focus management and test accessibility across more devices
  and assistive technologies.
- Use idempotent message creation if the API later supports client-generated
  message IDs.

### 5. API issues and workarounds

| Issue observed | How I handled it |
| --- | --- |
| Message history appeared as a direct array or under `data`, `messages`, or `data.messages`. Pagination also used `nextCursor` or `nextBefore`, sometimes with `hasMore`. | The proxy converts these variants into one `{ data, nextCursor, hasMore }` response. |
| Socket payloads could be direct or wrapped in `message`/`data`. Equivalent fields also used names such as `_id`/`id`, `conversationId`/`conversation`, and `text`/`content`. | Zod schemas transform recognized variants into one internal shape. If an event is identifiable but incomplete, the client refetches message history instead of inserting uncertain data. |
| Direct conversations used a singular `participant`, while group conversations used `participants`. | A server-side mapper converts both responses into one participant model before rendering. |
| The successful send-message response was not reliable enough to use as the final message object. | The proxy treats a successful status as acknowledgement and returns `{ ok: true }`. The optimistic entry is later reconciled by the socket event or a history refetch. |
| Error bodies used inconsistent forms, including `message`, a string `error`, or a nested error object. | A shared error normalizer preserves the upstream status while returning one safe message and code shape to the UI. |

These inconsistencies did not block the implementation, but they required a
normalization layer so UI components would not depend on every possible
upstream response shape.
