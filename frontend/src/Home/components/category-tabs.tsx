"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const categories = [
  { id: "all", label: "All Posts", icon: "📰" },
  { id: "tech", label: "Technology", icon: "💻" },
  { id: "design", label: "Design", icon: "🎨" },
  { id: "business", label: "Business", icon: "💼" },
  { id: "writing", label: "Writing", icon: "✍️" },
  { id: "trending", label: "Trending", icon: "🔥" },
]

export function CategoryTabs() {
  const [activeCategory, setActiveCategory] = useState("all")

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={activeCategory === category.id ? "default" : "outline"}
          className={`whitespace-nowrap gap-2 ${
            activeCategory === category.id ? "bg-primary text-primary-foreground" : "border-border hover:bg-muted"
          }`}
          onClick={() => setActiveCategory(category.id)}
        >
          <span>{category.icon}</span>
          {category.label}
        </Button>
      ))}
    </div>
  )
}
