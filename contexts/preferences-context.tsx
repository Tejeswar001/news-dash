"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getUserPreferences, saveUserPreferences } from "@/lib/firestore"
import { DEFAULT_PREFERENCES, type UserPreferences } from "@/types/user-preferences"

interface PreferencesContextType {
  preferences: UserPreferences | null
  loading: boolean
  updatePreferences: (updates: Partial<Omit<UserPreferences, "uid" | "createdAt">>) => Promise<void>
  refreshPreferences: () => Promise<void>
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined)

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const loadPreferences = async () => {
    if (!user) {
      setPreferences(null)
      setLoading(false)
      return
    }

    try {
  console.log("Loading preferences for user:", user.uid)
      const userPrefs = await getUserPreferences(user.uid)
      if (userPrefs) {
  console.log("Loaded existing preferences")
        setPreferences(userPrefs)
      } else {
  console.log("Creating default preferences")
        const defaultPrefs: UserPreferences = {
          ...DEFAULT_PREFERENCES,
          uid: user.uid,
          displayName: user.displayName || user.email || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        await saveUserPreferences(defaultPrefs)
        setPreferences(defaultPrefs)
      }
    } catch (error) {
      console.error("Error loading preferences:", error)
      const defaultPrefs: UserPreferences = {
        ...DEFAULT_PREFERENCES,
        uid: user.uid,
        displayName: user.displayName || user.email || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setPreferences(defaultPrefs)
    } finally {
      setLoading(false)
    }
  }

  const updatePreferences = async (updates: Partial<Omit<UserPreferences, "uid" | "createdAt">>) => {
    if (!user || !preferences) return

    try {
      const updatedPrefs = {
        ...preferences,
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      await saveUserPreferences(updatedPrefs)
      setPreferences(updatedPrefs)
    } catch (error) {
      console.error("Error updating preferences:", error)
      throw error
    }
  }

  const refreshPreferences = async () => {
    await loadPreferences()
  }

  useEffect(() => {
    loadPreferences()
  }, [user])

  const value = {
    preferences,
    loading,
    updatePreferences,
    refreshPreferences,
  }

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePreferences() {
  const context = useContext(PreferencesContext)
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider")
  }
  return context
}
