import { keepPreviousData, queryOptions } from "@tanstack/react-query"

import { searchUsers } from "./users.api"
import { userKeys } from "./users.keys"

export const userSearchQueryOptions = (query: string) =>
  queryOptions({
    queryKey: userKeys.search(query),
    queryFn: () => searchUsers(query),
    enabled: query.trim().length >= 2,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  })
