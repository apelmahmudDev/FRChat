import { normalizeUserSearch } from "@/features/users/lib/user-search"

export const userKeys = {
  all: ["users"] as const,
  search: (query: string) =>
    [...userKeys.all, "search", normalizeUserSearch(query)] as const,
}
