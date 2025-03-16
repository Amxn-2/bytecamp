"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useHealthStore } from "@/lib/healthStore";
import { useNotificationStore } from "@/lib/notificationStore";
import { cn } from "@/lib/utils";
import { Bell, Check, Menu, Settings, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Define pushNotification function
function pushNotification(message: string, id?: string): void {
  // TODO: Implement push notifications (browser notifications, Gmail SMTP, etc.)
  console.log("Push notification:", message);
  useNotificationStore.getState().addNotification({
    id: id || String(new Date().getTime()),
    message,
    read: false,
  });
}

const navigation = [
  { name: "Dashboard", href: "/" },
  { name: "Pollution Data", href: "/pollution" },
  { name: "Outbreak Alerts", href: "/outbreaks" },
  { name: "Weather Data", href: "/weather" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifSheetOpen, setNotifSheetOpen] = useState(false);
  const pathname = usePathname();

  const healthData = useHealthStore((state) => state.healthData);
  // Use the notification store
  const {
    notifications,
    markAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotificationStore();

  // For mobile responsiveness: if window width < 768px, use Sheet for notifications
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Track which outbreak notifications have been pushed so they aren't re-added.
  const [pushedOutbreakIds, setPushedOutbreakIds] = useState<Set<string>>(
    new Set()
  );

  // Listen for healthData changes to push notifications for new outbreaks.
  useEffect(() => {
    if (healthData?.diseaseOutbreaks) {
      healthData.diseaseOutbreaks.forEach((outbreak) => {
        if (
          outbreak.status === "active" &&
          !pushedOutbreakIds.has(outbreak.id)
        ) {
          pushNotification(
            `Outage: ${`Outbreak for ${
              outbreak.disease
            } detected at ${outbreak.affectedAreas.map((area) => area.name)}`}`,
            outbreak.id
          );
          setPushedOutbreakIds((prev) => {
            const newSet = new Set(prev);
            newSet.add(outbreak.id);
            return newSet;
          });
        }
      });
    }
  }, [healthData, pushedOutbreakIds]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="px-7">
                <Link
                  href="/"
                  className="flex items-center"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="font-mono text-lg font-bold text-teal">
                    ResiliChain
                  </span>
                </Link>
              </div>
              <nav className="flex flex-col gap-4 px-2 pt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2 text-base font-medium transition-colors hover:text-primary",
                      pathname === item.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.name}
                    {item.name === "Outbreak Alerts" && (
                      <Badge variant="destructive" className="ml-auto">
                        {
                          healthData?.diseaseOutbreaks.filter(
                            (o) => o.status === "active"
                          ).length
                        }
                      </Badge>
                    )}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold text-teal hidden md:inline-block">
              ResiliChain
            </span>
            <span className="font-mono text-lg font-bold text-teal md:hidden">
              ResiliChain
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
              {item.name === "Outbreak Alerts" && (
                <Badge variant="destructive">
                  {
                    healthData?.diseaseOutbreaks.filter(
                      (o) => o.status === "active"
                    ).length
                  }
                </Badge>
              )}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {isMobile ? (
            // Mobile: use a bottom Sheet for notifications
            <Sheet open={notifSheetOpen} onOpenChange={setNotifSheetOpen}>
              <SheetTrigger asChild>
                <div className="relative">
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                  </Button>
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 flex h-3 w-3 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                      {notifications.length > 9 ? "9+" : notifications.length}
                    </span>
                  )}
                </div>
              </SheetTrigger>
              <SheetContent className="w-full h-full p-0" side="bottom">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between px-4 py-2 border-b">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                    <div className="flex items-center gap-2 mr-5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllNotifications}
                      >
                        Clear All
                      </Button>
                      {/* <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setNotifSheetOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button> */}
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`flex items-center justify-between px-4 py-2 border-b ${
                            notification.read ? "bg-gray-100" : ""
                          }`}
                        >
                          <p className="text-sm">{notification.message}</p>
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            // Desktop: use a popover card for notifications
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                  </Button>
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 flex h-3 w-3 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                      {notifications.length > 9 ? "9+" : notifications.length}
                    </span>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 shadow-lg">
                <div className="border rounded-lg bg-white">
                  <div className="flex items-center justify-between px-4 py-2 border-b">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearAllNotifications}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`flex items-center justify-between px-4 py-2 border-b ${
                            notification.read ? "bg-gray-100" : ""
                          }`}
                        >
                          <p className="text-sm">{notification.message}</p>
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
