"use client"

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function FeaturedSection() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-accent p-8 text-primary-foreground">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_1px)] bg-[length:40px_40px]" />
      </div>

      <div className="relative z-10 max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-semibold">Featured This Week</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
          Discover the Best Stories from Our Community
        </h2>
        <p className="text-primary-foreground/90 mb-6 text-lg">
          Curated posts from top writers and communities. Explore insights, tutorials, and inspiring stories.
        </p>
        <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold">
          Explore Featured
        </Button>
      </div>
    </div>
  )
}
