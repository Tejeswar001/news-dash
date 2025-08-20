import { db } from "./firebase"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import type { UserPreferences } from "@/types/user-preferences"

const STORAGE_KEY_PREFIX = "userPreferences_"

function getLocalStorageKey(uid: string): string {
  return `${STORAGE_KEY_PREFIX}${uid}`
}

function saveToLocalStorage(preferences: UserPreferences): void {
  try {
    localStorage.setItem(getLocalStorageKey(preferences.uid), JSON.stringify(preferences))
  } catch (error) {
    console.error("Error saving to localStorage:", error)
  }
}

function getFromLocalStorage(uid: string): UserPreferences | null {
  try {
    const stored = localStorage.getItem(getLocalStorageKey(uid))
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error("Error reading from localStorage:", error)
    return null
  }
}

function isFirestoreOfflineError(error: any): boolean {
  return (
    error?.message?.includes("client is offline") ||
    error?.code === "unavailable" ||
    error?.message?.includes("Failed to get document")
  )
}

export async function getUserPreferences(uid: string): Promise<UserPreferences | null> {
  try {
  console.log("Attempting to get preferences from Firestore")
    const docRef = doc(db, "userPreferences", uid)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
  console.log("Successfully retrieved from Firestore")
      return docSnap.data() as UserPreferences
    }
    return null
  } catch (error) {
    console.error("Error getting user preferences:", error)

    if (isFirestoreOfflineError(error)) {
  console.log("Firestore offline, falling back to localStorage")
      return getFromLocalStorage(uid)
    }
    return null
  }
}

export async function saveUserPreferences(preferences: UserPreferences): Promise<void> {
  try {
  console.log("Attempting to save preferences to Firestore")
    const docRef = doc(db, "userPreferences", preferences.uid)
    await setDoc(docRef, {
      ...preferences,
      updatedAt: new Date().toISOString(),
    })
  console.log("Successfully saved to Firestore")
  } catch (error) {
    console.error("Error saving user preferences:", error)

    if (isFirestoreOfflineError(error)) {
  console.log("Firestore offline, saving to localStorage instead")
      saveToLocalStorage({
        ...preferences,
        updatedAt: new Date().toISOString(),
      })
      return // Don't throw error, localStorage save succeeded
    }
    throw error
  }
}

export async function updateUserPreferences(
  uid: string,
  updates: Partial<Omit<UserPreferences, "uid" | "createdAt">>,
): Promise<void> {
  try {
  console.log("Attempting to update preferences in Firestore")
    const docRef = doc(db, "userPreferences", uid)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
  console.log("Successfully updated in Firestore")
  } catch (error) {
    console.error("Error updating user preferences:", error)

    if (isFirestoreOfflineError(error)) {
  console.log("Firestore offline, updating localStorage instead")
      const existing = getFromLocalStorage(uid)
      if (existing) {
        saveToLocalStorage({
          ...existing,
          ...updates,
          updatedAt: new Date().toISOString(),
        })
        return // Don't throw error, localStorage update succeeded
      }
    }
    throw error
  }
}
