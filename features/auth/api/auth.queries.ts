import { queryOptions } from "@tanstack/react-query"

import { getCurrentSession } from "./auth.api"
import { authKeys } from "./auth.keys"

export const currentSessionQueryOptions = () =>
  queryOptions({
    queryKey: authKeys.session(),
    queryFn: getCurrentSession,
    staleTime: 5 * 60_000,
  })
