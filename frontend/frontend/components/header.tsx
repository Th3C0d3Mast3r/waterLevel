"use client"

import { ThemeToggle } from "./theme-toggle"
import { Droplet } from "lucide-react"
import { ESPStatus } from "./esp-status"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 smooth-transition">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Droplet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Water Management</h1>
              <p className="text-xs text-muted-foreground">IoT Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ESPStatus />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
