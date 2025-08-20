"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { usePreferences } from "@/contexts/preferences-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { User, Settings, Globe, Bell, Save, X } from "lucide-react"

const topics = [
  { value: "general", label: "General" },
  { value: "technology", label: "Technology" },
  { value: "business", label: "Business" },
  { value: "entertainment", label: "Entertainment" },
  { value: "health", label: "Health" },
  { value: "science", label: "Science" },
  { value: "sports", label: "Sports" },
  { value: "artificial intelligence", label: "AI" },
  { value: "environment", label: "Environment" },
  { value: "politics", label: "Politics" },
]

const countries = [
  { value: "us", label: "United States" },
  { value: "in", label: "India" },
  { value: "gb", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "br", label: "Brazil" },
]

export default function ProfilePage() {
  const { user } = useAuth()
  const { preferences, loading, updatePreferences } = usePreferences()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    displayName: "",
    language: "english" as "english" | "hindi",
    defaultTopics: [] as string[],
    defaultCountry: "us",
    emailNotifications: true,
  })
  const { toast } = useToast()

  // Initialize form data when preferences load
  useState(() => {
    if (preferences) {
      setFormData({
        displayName: preferences.displayName || user?.displayName || user?.email || "",
        language: preferences.language,
        defaultTopics: preferences.defaultTopics,
        defaultCountry: preferences.defaultCountry,
        emailNotifications: preferences.emailNotifications,
      })
    }
  })

  const handleTopicToggle = (topic: string) => {
    setFormData((prev) => ({
      ...prev,
      defaultTopics: prev.defaultTopics.includes(topic)
        ? prev.defaultTopics.filter((t) => t !== topic)
        : [...prev.defaultTopics, topic],
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updatePreferences(formData)
      toast({
        title: "Preferences Saved",
        description: "Your preferences have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account preferences and personalize your news experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info Card */}
          <Card className="border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-yellow-600" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.displayName || "User"}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <Badge variant="secondary" className="mt-1 bg-yellow-100 text-yellow-800">
                    {user?.emailVerified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
              </div>

              <div className="pt-4 border-t border-yellow-200">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, displayName: e.target.value }))}
                  className="mt-1 border-yellow-200 focus:border-yellow-400"
                  placeholder="Enter your display name"
                />
              </div>
            </CardContent>
          </Card>

          {/* Preferences Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Language & Region */}
            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-yellow-600" />
                  Language & Region
                </CardTitle>
                <CardDescription>Set your preferred language and default region for news</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value: "english" | "hindi") =>
                        setFormData((prev) => ({ ...prev, language: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="hindi">Hindi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultCountry">Default Region</Label>
                    <Select
                      value={formData.defaultCountry}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, defaultCountry: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Topics of Interest */}
            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-yellow-600" />
                  Topics of Interest
                </CardTitle>
                <CardDescription>Select your preferred topics to personalize your dashboard experience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {topics.map((topic) => (
                    <div key={topic.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={topic.value}
                        checked={formData.defaultTopics.includes(topic.value)}
                        onCheckedChange={() => handleTopicToggle(topic.value)}
                        className="border-yellow-300 data-[state=checked]:bg-yellow-600"
                      />
                      <Label htmlFor={topic.value} className="text-sm font-medium cursor-pointer">
                        {topic.label}
                      </Label>
                    </div>
                  ))}
                </div>

                {formData.defaultTopics.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-yellow-200">
                    <p className="text-sm text-gray-600 mb-2">Selected topics:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.defaultTopics.map((topic) => (
                        <Badge
                          key={topic}
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-800 cursor-pointer hover:bg-yellow-200"
                          onClick={() => handleTopicToggle(topic)}
                        >
                          {topics.find((t) => t.value === topic)?.label || topic}
                          <X className="h-3 w-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-yellow-600" />
                  Notifications
                </CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emailNotifications"
                    checked={formData.emailNotifications}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, emailNotifications: checked as boolean }))
                    }
                    className="border-yellow-300 data-[state=checked]:bg-yellow-600"
                  />
                  <Label htmlFor="emailNotifications" className="cursor-pointer">
                    Receive email notifications for breaking news and updates
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-8"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
