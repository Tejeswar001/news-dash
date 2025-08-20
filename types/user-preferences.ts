export interface UserPreferences {
  uid: string
  language: "english" | "hindi"
  defaultTopics: string[]
  defaultCountry: string
  emailNotifications: boolean
  displayName?: string
  createdAt: string
  updatedAt: string
}

export const DEFAULT_PREFERENCES: Omit<UserPreferences, "uid" | "createdAt" | "updatedAt"> = {
  language: "english",
  defaultTopics: ["general"],
  defaultCountry: "us",
  emailNotifications: true,
}
