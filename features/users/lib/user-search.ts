import type { ChatUser } from "@/features/users/types/user.types"

export function normalizeUserSearch(value: string) {
  return value.trim().normalize("NFKC").toLocaleLowerCase("en-US")
}

export function userMatchesSearch(user: ChatUser, query: string) {
  const normalizedQuery = normalizeUserSearch(query)

  return (
    normalizeUserSearch(user.name).includes(normalizedQuery) ||
    normalizeUserSearch(user.phone).includes(normalizedQuery)
  )
}
