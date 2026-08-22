For **FRChat**, keep the API layer separated by domain. Don’t put every request, query, type, and hook into one giant file. A clean production structure with TanStack Query would look like this:

```text
src/
├── api/
│   ├── api-client.ts
│   ├── api-error.ts
│   └── query-client.ts
│
├── features/
│   ├── auth/
│   │   ├── api/
│   │   │   ├── auth.api.ts
│   │   │   └── auth.queries.ts
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   └── hooks/
│   │       └── use-auth.ts
│   │
│   ├── users/
│   │   ├── api/
│   │   │   ├── users.api.ts
│   │   │   └── users.queries.ts
│   │   └── types/
│   │       └── user.types.ts
│   │
│   ├── conversations/
│   │   ├── api/
│   │   │   ├── conversations.api.ts
│   │   │   └── conversations.queries.ts
│   │   └── types/
│   │       └── conversation.types.ts
│   │
│   └── messages/
│       ├── api/
│       │   ├── messages.api.ts
│       │   └── messages.queries.ts
│       └── types/
│           └── message.types.ts
│
├── providers/
│   └── query-provider.tsx
│
└── lib/
    └── storage.ts
```

Your APIs map nicely into those four domains:

| Feature       | Endpoint                                         |
| ------------- | ------------------------------------------------ |
| Auth          | `POST /auth/login`                               |
| Auth          | `GET /auth/me`                                   |
| Users         | `GET /users/search`                              |
| Conversations | `GET /conversations`                             |
| Conversations | `POST /conversations`                            |
| Messages      | `GET /conversations/:id/messages`                |
| Groups        | `POST /conversations/group`                      |
| Groups        | `POST /conversations/:id/participants`           |
| Groups        | `DELETE /conversations/:id/participants/:userId` |
| Groups        | `POST /conversations/:id/admins`                 |
| Groups        | `PATCH /conversations/:id`                       |
| Messages      | `POST /messages`                                 |

## 1. Install

```bash
pnpm add @tanstack/react-query axios
pnpm add -D @tanstack/react-query-devtools
```

If you use npm:

```bash
npm install @tanstack/react-query axios
npm install -D @tanstack/react-query-devtools
```

## 2. Environment

```env
VITE_API_URL=https://api.yourdomain.com
```

Never hardcode this:

```ts
const API_URL = "http://localhost:5000";
```

Use:

```ts
const API_URL = import.meta.env.VITE_API_URL;
```

For production you can have:

```text
.env
.env.development
.env.production
```

## 3. Axios client

`src/api/api-client.ts`

```ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});
```

If your backend uses Bearer tokens:

```ts
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
```

And centralized error handling:

```ts
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
    }

    return Promise.reject(error);
  }
);
```

For a real production web app, an **HttpOnly secure cookie is preferable to keeping long-lived auth tokens in localStorage**. If you control the backend, I would eventually add refresh-token/logout support as well.

## 4. Query Client

`src/api/query-client.ts`

```ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
```

Don't set huge global cache times specifically for chat messages. Conversations, users, and messages behave differently.

## 5. Provider

`src/providers/query-provider.tsx`

```tsx
import {
  QueryClientProvider,
} from "@tanstack/react-query";

import { ReactNode } from "react";
import { queryClient } from "@/api/query-client";

interface Props {
  children: ReactNode;
}

export function QueryProvider({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

Then:

```tsx
<QueryProvider>
  <App />
</QueryProvider>
```

---

# 6. Centralized Query Keys

This is important. Don't manually write random query keys everywhere.

`conversations.queries.ts`

```ts
export const conversationKeys = {
  all: ["conversations"] as const,

  list: () =>
    [...conversationKeys.all, "list"] as const,

  messages: (conversationId: string) =>
    [
      ...conversationKeys.all,
      conversationId,
      "messages",
    ] as const,
};
```

Users:

```ts
export const userKeys = {
  all: ["users"] as const,

  search: (search: string) =>
    [...userKeys.all, "search", search] as const,
};
```

Auth:

```ts
export const authKeys = {
  me: ["auth", "me"] as const,
};
```

---

# 7. Auth API

`auth.api.ts`

```ts
import { apiClient } from "@/api/api-client";
import type {
  LoginPayload,
  LoginResponse,
  User,
} from "../types/auth.types";

export async function login(
  payload: LoginPayload
): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(
    "/auth/login",
    payload
  );

  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<User>("/auth/me");

  return data;
}
```

Types:

```ts
export interface LoginPayload {
  phone: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  avatar?: string | null;
}
```

Adjust these types according to your actual Swagger response.

## TanStack auth hooks

```ts
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { authKeys } from "./auth.keys";
import { getMe, login } from "./auth.api";

export function useMe() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: getMe,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      localStorage.setItem(
        "accessToken",
        data.accessToken
      );

      queryClient.setQueryData(
        authKeys.me,
        data.user
      );
    },
  });
}
```

Then UI stays simple:

```tsx
const loginMutation = useLogin();

const handleLogin = () => {
  loginMutation.mutate({
    phone,
    password,
  });
};
```

And:

```tsx
if (loginMutation.isPending) {
  return <LoadingButton />;
}

if (loginMutation.isError) {
  return <LoginError />;
}
```

---

# 8. User Search

`users.api.ts`

```ts
import { apiClient } from "@/api/api-client";
import type { User } from "../types/user.types";

export async function searchUsers(
  search: string
): Promise<User[]> {
  const { data } = await apiClient.get<User[]>(
    "/users/search",
    {
      params: {
        q: search,
      },
    }
  );

  return data;
}
```

Query:

```ts
import { useQuery } from "@tanstack/react-query";
import { searchUsers } from "./users.api";
import { userKeys } from "./users.keys";

export function useUserSearch(search: string) {
  return useQuery({
    queryKey: userKeys.search(search),
    queryFn: () => searchUsers(search),
    enabled: search.trim().length >= 2,
    staleTime: 60_000,
  });
}
```

For FRChat, debounce the search text before passing it here. Don't fire `/users/search` on every keystroke.

---

# 9. Conversations

`conversations.api.ts`

```ts
import { apiClient } from "@/api/api-client";
import type {
  Conversation,
  CreateConversationPayload,
} from "../types/conversation.types";

export async function getConversations():
Promise<Conversation[]> {
  const { data } =
    await apiClient.get<Conversation[]>(
      "/conversations"
    );

  return data;
}

export async function createConversation(
  payload: CreateConversationPayload
): Promise<Conversation> {
  const { data } =
    await apiClient.post<Conversation>(
      "/conversations",
      payload
    );

  return data;
}
```

Queries:

```ts
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createConversation,
  getConversations,
} from "./conversations.api";

import { conversationKeys } from "./conversation.keys";

export function useConversations() {
  return useQuery({
    queryKey: conversationKeys.list(),
    queryFn: getConversations,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createConversation,

    onSuccess: (conversation) => {
      queryClient.setQueryData(
        conversationKeys.list(),
        (old: typeof conversation[] = []) => [
          conversation,
          ...old,
        ]
      );
    },
  });
}
```

Here I prefer `setQueryData()` over refetching the entire list because you already received the newly created conversation from the server.

---

# 10. Message History

API:

```ts
export async function getMessages(
  conversationId: string
) {
  const { data } = await apiClient.get(
    `/conversations/${conversationId}/messages`
  );

  return data;
}
```

Query:

```ts
export function useMessages(
  conversationId?: string
) {
  return useQuery({
    queryKey: conversationKeys.messages(
      conversationId ?? ""
    ),

    queryFn: () =>
      getMessages(conversationId!),

    enabled: Boolean(conversationId),
  });
}
```

For a real chat application, I strongly recommend eventually making this an `useInfiniteQuery()` instead of loading every message.

For example:

```text
GET /conversations/:id/messages
    ?cursor=abc123
    &limit=30
```

Then older messages can load when the user scrolls upward.

---

# 11. Sending Messages

`messages.api.ts`

```ts
import { apiClient } from "@/api/api-client";

export interface SendMessagePayload {
  conversationId: string;
  content: string;
}

export async function sendMessage(
  payload: SendMessagePayload
) {
  const { data } = await apiClient.post(
    "/messages",
    payload
  );

  return data;
}
```

Mutation:

```ts
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,

    onSuccess: (message, variables) => {
      queryClient.setQueryData(
        conversationKeys.messages(
          variables.conversationId
        ),
        (old: any[] = []) => [
          ...old,
          message,
        ]
      );

      queryClient.invalidateQueries({
        queryKey: conversationKeys.list(),
      });
    },
  });
}
```

That second invalidation matters because the conversation list probably contains things like:

```text
lastMessage
lastMessageAt
unreadCount
```

---

# 12. Group APIs

Keep these in `conversations.api.ts`, because groups are still conversations.

```ts
export function createGroup(payload: {
  name: string;
  participantIds: string[];
}) {
  return apiClient
    .post("/conversations/group", payload)
    .then((res) => res.data);
}

export function addParticipants(
  conversationId: string,
  userIds: string[]
) {
  return apiClient
    .post(
      `/conversations/${conversationId}/participants`,
      { userIds }
    )
    .then((res) => res.data);
}

export function removeParticipant(
  conversationId: string,
  userId: string
) {
  return apiClient
    .delete(
      `/conversations/${conversationId}/participants/${userId}`
    )
    .then((res) => res.data);
}

export function promoteAdmin(
  conversationId: string,
  userId: string
) {
  return apiClient
    .post(
      `/conversations/${conversationId}/admins`,
      { userId }
    )
    .then((res) => res.data);
}

export function renameGroup(
  conversationId: string,
  name: string
) {
  return apiClient
    .patch(
      `/conversations/${conversationId}`,
      { name }
    )
    .then((res) => res.data);
}
```

After member/admin/name changes, invalidate that conversation's relevant cached data:

```ts
queryClient.invalidateQueries({
  queryKey: conversationKeys.all,
});
```

You can make this more targeted once your conversation-detail endpoint exists.

---

# 13. Don't Use TanStack Query as Your WebSocket

This is especially important for FRChat.

TanStack Query should handle:

```text
Initial API fetch
Caching
Loading state
Error state
Mutations
Pagination
Refetching
Cache synchronization
```

WebSocket or Socket.IO should handle:

```text
New message
Typing
User online/offline
Message delivered
Message seen
Group member added
Group member removed
Conversation updated
```

Then the socket updates the TanStack Query cache.

Architecture:

```text
                  FRChat
                    │
          ┌─────────┴─────────┐
          │                   │
       REST API           WebSocket
          │                   │
    TanStack Query      realtime events
          │                   │
          └─────────┬─────────┘
                    │
               Query Cache
                    │
                    ▼
                   UI
```

For example when Socket.IO receives a message:

```ts
socket.on("message:new", (message) => {
  queryClient.setQueryData(
    conversationKeys.messages(
      message.conversationId
    ),
    (old: Message[] = []) => [
      ...old,
      message,
    ]
  );
});
```

The component doesn't need complicated socket logic.

---

# 14. Loading, Empty, Error, Success States

Every major screen should handle all four.

Example conversation list:

```tsx
const {
  data,
  isLoading,
  isError,
  refetch,
} = useConversations();

if (isLoading) {
  return <ConversationSkeleton />;
}

if (isError) {
  return (
    <ErrorState
      title="Couldn't load conversations"
      onRetry={refetch}
    />
  );
}

if (!data?.length) {
  return (
    <EmptyState
      title="No conversations yet"
      description="Find someone and start chatting."
    />
  );
}

return <ConversationList conversations={data} />;
```

Don't put those states directly into the API files.

Keep:

```text
API layer → network only
Query hooks → server state
Components → UI state
```

---

# 15. Normalize API Errors

Create:

`api-error.ts`

```ts
import axios from "axios";

export function getApiError(
  error: unknown
): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.message ||
      "Something went wrong"
    );
  }

  return "Something went wrong";
}
```

Then:

```tsx
const message = getApiError(
  mutation.error
);
```

This prevents things like:

```tsx
error?.response?.data?.error?.message?.something
```

being repeated across 20 components.

---

# 16. Production Query Strategy

I'd configure FRChat roughly like this:

| Data          | Strategy                      |
| ------------- | ----------------------------- |
| `/auth/me`    | Long-ish stale time           |
| User search   | 30–60 sec cache               |
| Conversations | Cache + socket updates        |
| Messages      | Infinite query + socket       |
| Group details | Cache + invalidate after edit |
| Send message  | Optimistic update             |
| User presence | Socket, not REST polling      |
| Typing status | Socket only                   |

For example:

```ts
useQuery({
  queryKey: authKeys.me,
  queryFn: getMe,
  staleTime: 5 * 60 * 1000,
});
```

But messages shouldn't use that same configuration blindly.

---

# 17. Eventually Use Optimistic Messages

For good chat UX, don't wait for the server before displaying the sender's message.

Flow:

```text
User presses Send
      ↓
Immediately show message
      ↓
POST /messages
      ↓
Success → replace temporary message
      ↓
Failure → mark message as failed
```

You can create temporary messages:

```ts
{
  id: crypto.randomUUID(),
  content: "Hello",
  status: "sending"
}
```

Then:

```text
sending
sent
delivered
seen
failed
```

That will make FRChat feel much more like a real messaging product.

---

# 18. A Better Overall Architecture

I would build your frontend flow like this:

```text
UI Components
      │
      ▼
TanStack Query Hooks
      │
      ▼
Domain API Functions
      │
      ▼
Axios API Client
      │
      ▼
FRChat Backend
```

Realtime:

```text
FRChat Backend
      │
      ▼
WebSocket
      │
      ▼
Socket Service
      │
      ▼
TanStack Query Cache
      │
      ▼
UI
```

Avoid:

```text
Component
 ├── axios.get()
 ├── axios.post()
 ├── token handling
 ├── error parsing
 ├── socket handling
 ├── caching
 └── loading logic
```

That becomes difficult to maintain very quickly.

# Recommended FRChat files

For your exact APIs, I'd start with:

```text
src/
├── api/
│   ├── api-client.ts
│   ├── api-error.ts
│   └── query-client.ts
│
├── features/
│
│   ├── auth/
│   │   ├── api/
│   │   │   ├── auth.api.ts
│   │   │   ├── auth.keys.ts
│   │   │   └── auth.queries.ts
│   │   └── types/
│   │       └── auth.types.ts
│
│   ├── users/
│   │   ├── api/
│   │   │   ├── users.api.ts
│   │   │   ├── users.keys.ts
│   │   │   └── users.queries.ts
│   │   └── types/
│   │       └── user.types.ts
│
│   ├── conversations/
│   │   ├── api/
│   │   │   ├── conversations.api.ts
│   │   │   ├── conversations.keys.ts
│   │   │   └── conversations.queries.ts
│   │   └── types/
│   │       └── conversation.types.ts
│
│   └── messages/
│       ├── api/
│       │   ├── messages.api.ts
│       │   └── messages.queries.ts
│       └── types/
│           └── message.types.ts
│
├── realtime/
│   ├── socket.ts
│   ├── socket-events.ts
│   └── socket-provider.tsx
│
└── providers/
    └── query-provider.tsx
```

### Bottom line

For **FRChat**, I would use **Axios + TanStack Query for REST state**, and **Socket.IO/WebSocket for realtime state**. Keep API functions small, query keys centralized, feature code separated, messages paginated, and use `setQueryData()` for realtime/optimistic updates instead of constantly refetching everything.

One backend improvement I'd prioritize before FRChat gets serious usage is adding **message pagination/cursor support, refresh/logout auth, conversation-detail API, and realtime events**. Your current API set is enough to build the basic chat, direct conversations, groups, membership, admin management, and sending, but those additions will make the frontend much cleaner and more production-ready.
