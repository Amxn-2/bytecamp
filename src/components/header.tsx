"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useHealthStore } from "@/lib/healthStore";
import { cn } from "@/lib/utils";
import { Bell, Menu, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/" },
  { name: "Pollution Data", href: "/pollution" },
  { name: "Outbreak Alerts", href: "/outbreaks" },
  // { name: "Mental Health", href: "/mental-health" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const healthData = useHealthStore((state) => state.healthData);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
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
                  onClick={() => setOpen(false)}
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
                    onClick={() => setOpen(false)}
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
                  {" "}
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
          <Button variant="ghost" size="icon" asChild>
            <Link href="/notifications">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Link>
          </Button>
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
