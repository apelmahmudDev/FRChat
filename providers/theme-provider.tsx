"use client"

import * as React from "react"

type Theme = "light" | "dark" | "system"

type ThemeProviderProps = React.PropsWithChildren<{
  defaultTheme?: Theme
  storageKey?: string
}>

const ThemeContext = React.createContext<{
  resolvedTheme: "light" | "dark"
  setTheme: (theme: Theme) => void
} | null>(null)

function useThemeContext() {
  const themeContext = React.useContext(ThemeContext)

  if (!themeContext) {
    throw new Error("ThemeProvider context is missing.")
  }

  return themeContext
}

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function getStoredTheme(storageKey: string, defaultTheme: Theme) {
  if (typeof window === "undefined") {
    return defaultTheme
  }

  const savedTheme = window.localStorage.getItem(storageKey)

  if (
    savedTheme === "light" ||
    savedTheme === "dark" ||
    savedTheme === "system"
  ) {
    return savedTheme
  }

  return defaultTheme
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  const resolvedTheme = theme === "system" ? getSystemTheme() : theme

  root.classList.remove("light", "dark")
  root.classList.add(resolvedTheme)
  root.style.colorScheme = resolvedTheme

  return resolvedTheme
}

function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">(
    "light"
  )

  React.useEffect(() => {
    const initialTheme = getStoredTheme(storageKey, defaultTheme)
    setThemeState(initialTheme)
    setResolvedTheme(applyTheme(initialTheme))
  }, [defaultTheme, storageKey])

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const syncTheme = () => {
      setResolvedTheme(applyTheme(theme))
    }

    syncTheme()

    const onChange = () => {
      if (theme === "system") {
        syncTheme()
      }
    }

    mediaQuery.addEventListener("change", onChange)

    return () => {
      mediaQuery.removeEventListener("change", onChange)
    }
  }, [theme])

  const setTheme = React.useCallback(
    (nextTheme: Theme) => {
      setThemeState(nextTheme)
      window.localStorage.setItem(storageKey, nextTheme)
      setResolvedTheme(applyTheme(nextTheme))
    },
    [storageKey]
  )

  return (
    <ThemeContext.Provider value={{ resolvedTheme, setTheme }}>
      <ThemeHotkey />
      {children}
    </ThemeContext.Provider>
  )
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useThemeContext()

  const onKeyDown = React.useEffectEvent((event: KeyboardEvent) => {
    if (event.defaultPrevented || event.repeat) {
      return
    }

    if (event.metaKey || event.ctrlKey || event.altKey) {
      return
    }

    if (event.key.toLowerCase() !== "d") {
      return
    }

    if (isTypingTarget(event.target)) {
      return
    }

    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  })

  React.useEffect(() => {
    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [onKeyDown])

  return null
}

export { ThemeProvider }
