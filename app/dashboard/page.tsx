"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { RefreshCw, ThumbsDown, Check, Star, Clock, ArrowRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { MovieCard } from "@/components/movie-card"
import { ReminderCard } from "@/components/reminder-card"
import { OnboardingBanner } from "@/components/onboarding-banner"

// Demo data - would come from API
const demoRecommendations = [
  {
    id: "1",
    title: "盗梦空间",
    year: 2010,
    rating: 8.8,
    genres: ["科幻", "动作", "悬疑"],
    poster: "/placeholder.svg?height=400&width=270",
    aiReason: "基于您对烧脑剧情的喜爱，以及对《黑客帝国》和《星际穿越》的高评分，这部梦境盗窃惊悚片应该会吸引您。",
  },
  {
    id: "2",
    title: "布达佩斯大饭店",
    year: 2014,
    rating: 8.1,
    genres: ["喜剧", "剧情", "冒险"],
    poster: "/placeholder.svg?height=400&width=270",
    aiReason: "您对独特视觉叙事和古怪幽默的欣赏表明，这部韦斯·安德森的杰作会让您感到愉悦。",
  },
  {
    id: "3",
    title: "寄生虫",
    year: 2019,
    rating: 8.5,
    genres: ["悬疑", "剧情", "喜剧"],
    poster: "/placeholder.svg?height=400&width=270",
    aiReason: "鉴于您对社会评论类电影和不可预测叙事的兴趣，这部奥斯卡获奖影片与您的品味完美契合。",
  },
  {
    id: "4",
    title: "爆裂鼓手",
    year: 2014,
    rating: 8.5,
    genres: ["剧情", "音乐"],
    poster: "/placeholder.svg?height=400&width=270",
    aiReason: "您对深度角色研究和关于奉献精神电影的高评分表明，这部爵士乐剧情片会深深打动您。",
  },
]

const demoReminders = [
  {
    id: "r1",
    movieId: "m1",
    movieTitle: "沙丘2",
    poster: "/placeholder.svg?height=80&width=54",
    adoptedDate: "2024-01-15",
  },
]

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState(demoRecommendations)
  const [reminders, setReminders] = useState(demoReminders)
  const [isLoading, setIsLoading] = useState(false)
  const [hasPreferences, setHasPreferences] = useState(true) // Would check from API
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    // Check if user has preferences (demo)
    const preferences = sessionStorage.getItem("userPreferences")
    if (!preferences) {
      setShowOnboarding(true)
    }
  }, [])

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleReject = (id: string) => {
    setRecommendations((prev) => prev.filter((r) => r.id !== id))
  }

  const handleAdopt = (id: string) => {
    const movie = recommendations.find((r) => r.id === id)
    if (movie) {
      // Add to watchlist (would be API call)
      setRecommendations((prev) => prev.filter((r) => r.id !== id))
    }
  }

  const handleReminderDismiss = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id))
  }

  const handleReminderRate = (id: string) => {
    // Navigate to rating modal or page
    setReminders((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex h-14 items-center gap-4 border-b border-border bg-background px-6">
        <SidebarTrigger className="-ml-2" />
        <Separator orientation="vertical" className="h-6" />
        <h1 className="text-lg font-semibold">电影推荐</h1>
        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            换一批
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-6">
        {/* Onboarding Banner */}
        {showOnboarding && (
          <OnboardingBanner onDismiss={() => setShowOnboarding(false)} />
        )}

        {/* Reminder Section */}
        {reminders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">
              待评分提醒
            </h2>
            <div className="flex flex-col gap-3">
              {reminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  onDismiss={() => handleReminderDismiss(reminder.id)}
                  onRate={() => handleReminderRate(reminder.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Grid */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-4">
            为您精选
          </h2>
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendations.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onReject={() => handleReject(movie.id)}
                  onAdopt={() => handleAdopt(movie.id)}
                />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <RefreshCw className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground mb-1">暂无更多推荐</h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
                  您已浏览完当前所有推荐，点击换一批获取更多。
                </p>
                <Button onClick={handleRefresh} disabled={isLoading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                  获取新推荐
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
