"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [locationTracking, setLocationTracking] = useState(true)
  const [dataSharing, setDataSharing] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  const handleSaveNotifications = () => {
    toast.success("Notification settings saved successfully")
  }

  const handleSaveProfile = () => {
    toast.success("Profile settings saved successfully")
  }

  const handleSavePrivacy = () => {
    toast.success("Privacy settings saved successfully")
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6 font-mono">Settings</h1>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts about disease outbreaks and environmental hazards
                  </p>
                </div>
                <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Notification Types</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                    disabled={!notificationsEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                    disabled={!notificationsEnabled}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Alert Categories</h3>

                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="disease-alerts">Disease Outbreak Alerts</Label>
                    <Select defaultValue="all" disabled={!notificationsEnabled}>
                      <SelectTrigger id="disease-alerts" className="w-[180px]">
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Severities</SelectItem>
                        <SelectItem value="critical">Critical Only</SelectItem>
                        <SelectItem value="high">High & Critical</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="pollution-alerts">Pollution Alerts</Label>
                    <Select defaultValue="high" disabled={!notificationsEnabled}>
                      <SelectTrigger id="pollution-alerts" className="w-[180px]">
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="high">High & Critical</SelectItem>
                        <SelectItem value="critical">Critical Only</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="mental-health">Mental Health Resources</Label>
                    <Select defaultValue="weekly" disabled={!notificationsEnabled}>
                      <SelectTrigger id="mental-health" className="w-[180px]">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john.doe@example.com" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="+91 9876543210" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Preferences</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Use dark theme for the application</p>
                  </div>
                  <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="mr">Marathi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="location">Default Location</Label>
                  <Select defaultValue="mumbai">
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="andheri">Andheri</SelectItem>
                      <SelectItem value="bandra">Bandra</SelectItem>
                      <SelectItem value="dadar">Dadar</SelectItem>
                      <SelectItem value="worli">Worli</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>Save Profile Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Manage your data privacy and sharing preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="location-tracking">Location Tracking</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow the app to track your location for personalized alerts
                  </p>
                </div>
                <Switch id="location-tracking" checked={locationTracking} onCheckedChange={setLocationTracking} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="data-sharing">Anonymous Data Sharing</Label>
                  <p className="text-sm text-muted-foreground">Share anonymous data to improve health monitoring</p>
                </div>
                <Switch id="data-sharing" checked={dataSharing} onCheckedChange={setDataSharing} />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Data Management</h3>

                <div className="grid gap-2">
                  <p className="text-sm text-muted-foreground">
                    You can download all your data or delete your account at any time.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline">Download My Data</Button>
                    <Button variant="destructive">Delete My Account</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePrivacy}>Save Privacy Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

