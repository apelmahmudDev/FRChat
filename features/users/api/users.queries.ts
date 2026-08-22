import { queryOptions } from "@tanstack/react-query"

import {
  normalizeUserSearch,
  userMatchesSearch,
} from "@/features/users/lib/user-search"

import { searchUsers } from "./users.api"
import { userKeys } from "./users.keys"

export const userSearchQueryOptions = (query: string) => {
  const normalizedQuery = normalizeUserSearch(query)

  return queryOptions({
    queryKey: userKeys.search(query),
    queryFn: () => searchUsers(query.trim()),
    enabled: normalizedQuery.length >= 2,
    staleTime: 60_000,
    select: (users) =>
      users.filter((user) => userMatchesSearch(user, normalizedQuery)),
  })
}
