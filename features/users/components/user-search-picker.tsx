"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Check, LoaderCircle, Search, X } from "lucide-react"

import { userSearchQueryOptions } from "@/features/users/api/users.queries"
import { useDebouncedValue } from "@/features/users/hooks/use-debounced-value"
import { normalizeUserSearch } from "@/features/users/lib/user-search"
import type { ChatUser } from "@/features/users/types/user.types"

type UserSearchPickerProps = {
  id: string
  selectedUsers: readonly ChatUser[]
  onSelectionChange: (users: ChatUser[]) => void
  disabled?: boolean
  multiple?: boolean
  maxSelections?: number
}

export function UserSearchPicker({
  id,
  selectedUsers,
  onSelectionChange,
  disabled = false,
  multiple = false,
  maxSelections = multiple ? 100 : 1,
}: UserSearchPickerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const trimmedSearchTerm = searchTerm.trim()
  const debouncedSearchTerm = useDebouncedValue(trimmedSearchTerm, 300)
  const normalizedSearchTerm = normalizeUserSearch(trimmedSearchTerm)
  const normalizedDebouncedSearchTerm = normalizeUserSearch(debouncedSearchTerm)
  const userSearch = useQuery(userSearchQueryOptions(debouncedSearchTerm))
  const isDebouncing = normalizedSearchTerm !== normalizedDebouncedSearchTerm
  const isSearching = isDebouncing || userSearch.isFetching
  const canShowResults =
    normalizedSearchTerm.length >= 2 && !isDebouncing && userSearch.isSuccess

  function toggleUser(user: ChatUser) {
    const isSelected = selectedUsers.some(({ _id }) => _id === user._id)

    if (isSelected) {
      onSelectionChange(selectedUsers.filter(({ _id }) => _id !== user._id))
      return
    }

    if (multiple) {
      if (selectedUsers.length >= maxSelections) return
      onSelectionChange([...selectedUsers, user])
      return
    }

    onSelectionChange([user])
  }

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        Find people
      </label>

      {selectedUsers.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2" aria-label="Selected people">
          {selectedUsers.map((user) => (
            <span
              key={user._id}
              className="inline-flex max-w-full items-center gap-2 rounded-full bg-primary/10 py-1 pr-1 pl-2.5 text-xs text-primary"
            >
              <span className="truncate">{user.name}</span>
              <button
                type="button"
                aria-label={`Remove ${user.name}`}
                onClick={() => toggleUser(user)}
                disabled={disabled}
                className="flex size-5 shrink-0 items-center justify-center rounded-full transition hover:bg-primary/15 disabled:opacity-50"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative mt-2">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id={id}
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value)
            if (!multiple) onSelectionChange([])
          }}
          autoComplete="off"
          disabled={disabled}
          placeholder="Search by name or phone"
          className="h-10 w-full rounded-lg border bg-background pr-10 pl-9 text-sm transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
        />
        {isSearching && (
          <LoaderCircle className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {normalizedSearchTerm.length > 0 && normalizedSearchTerm.length < 2 && (
        <p className="mt-2 text-xs text-muted-foreground">
          Enter at least 2 characters to search.
        </p>
      )}

      {userSearch.isError && !isDebouncing && (
        <p className="mt-2 text-sm text-destructive">
          {userSearch.error.message}
        </p>
      )}

      {canShowResults && userSearch.data.length === 0 && (
        <p className="mt-2 text-sm text-muted-foreground">
          No matching people found.
        </p>
      )}

      {canShowResults && userSearch.data.length > 0 && (
        <ul className="mt-2 max-h-44 overflow-y-auto rounded-lg border bg-background p-1">
          {userSearch.data.map((user) => {
            const isSelected = selectedUsers.some(({ _id }) => _id === user._id)
            const selectionLimitReached =
              !isSelected && selectedUsers.length >= maxSelections

            return (
              <li key={user._id}>
                <button
                  type="button"
                  onClick={() => toggleUser(user)}
                  disabled={disabled || selectionLimitReached}
                  aria-pressed={isSelected}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition hover:bg-muted disabled:opacity-50 ${
                    isSelected ? "bg-primary/10" : ""
                  }`}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                    {user.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {user.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {user.phone}
                    </span>
                  </span>
                  {isSelected && (
                    <Check className="size-4 shrink-0 text-primary" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
