"use client"

import { useState } from "react"
import { Check, Clock, Trash2, Star, Calendar, Film, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"

interface WatchlistItem {
  id: string
  title: string
  year: number
  genres: string[]
  poster: string
  aiReason: string
  addedAt: string
  watched: boolean
  rating?: number
  notes?: string
  watchedAt?: string
}

// Demo data
const demoWatchlist: WatchlistItem[] = [
  {
    id: "1",
    title: "沙丘2",
    year: 2024,
    genres: ["科幻", "动作", "冒险"],
    poster: "/placeholder.svg?height=200&width=135",
    aiReason: "延续您喜爱的第一部史诗传奇。",
    addedAt: "2024-01-15",
    watched: false,
  },
  {
    id: "2",
    title: "奥本海默",
    year: 2023,
    genres: ["传记", "剧情", "历史"],
    poster: "/placeholder.svg?height=200&width=135",
    aiReason: "符合您对发人深省电影喜好的史诗历史剧。",
    addedAt: "2024-01-12",
    watched: false,
  },
  {
    id: "3",
    title: "瞬息全宇宙",
    year: 2022,
    genres: ["动作", "冒险", "喜剧"],
    poster: "/placeholder.svg?height=200&width=135",
    aiReason: "烧脑的多元宇宙故事，情感深度十足。",
    addedAt: "2024-01-08",
    watched: true,
    rating: 9,
    notes: "太爱了！情感核心令人难以置信。",
    watchedAt: "2024-01-20",
  },
]

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(demoWatchlist)
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<WatchlistItem | null>(null)
  const [formRating, setFormRating] = useState([7])
  const [formNotes, setFormNotes] = useState("")

  const pendingItems = watchlist.filter((item) => !item.watched)
  const watchedItems = watchlist.filter((item) => item.watched)

  const handleRemove = (id: string) => {
    setWatchlist((prev) => prev.filter((item) => item.id !== id))
  }

  const openRatingDialog = (item: WatchlistItem) => {
    setSelectedMovie(item)
    setFormRating([item.rating || 7])
    setFormNotes(item.notes || "")
    setRatingDialogOpen(true)
  }

  const handleMarkWatched = () => {
    if (!selectedMovie) return

    setWatchlist((prev) =>
      prev.map((item) =>
        item.id === selectedMovie.id
          ? {
              ...item,
              watched: true,
              rating: formRating[0],
              notes: formNotes,
              watchedAt: new Date().toISOString().split("T")[0],
            }
          : item
      )
    )
    setRatingDialogOpen(false)
    setSelectedMovie(null)
    setFormRating([7])
    setFormNotes("")
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getDaysSinceAdded = (dateStr: string) => {
    return Math.floor(
      (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex h-14 items-center gap-4 border-b border-border bg-background px-6">
        <SidebarTrigger className="-ml-2" />
        <Separator orientation="vertical" className="h-6" />
        <h1 className="text-lg font-semibold">待看清单</h1>
        <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
          <span>{pendingItems.length} 部待看</span>
          <span>·</span>
          <span>{watchedItems.length} 部已看</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="w-4 h-4" />
              待看
              {pendingItems.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {pendingItems.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="watched" className="gap-2">
              <Check className="w-4 h-4" />
              已看
            </TabsTrigger>
          </TabsList>

          {/* Pending Tab */}
          <TabsContent value="pending">
            {pendingItems.length > 0 ? (
              <div className="grid gap-4">
                {pendingItems.map((item) => {
                  const daysAdded = getDaysSinceAdded(item.addedAt)
                  const isOverdue = daysAdded > 7

                  return (
                    <Card
                      key={item.id}
                      className={isOverdue ? "border-warning/50 bg-warning/5" : ""}
                    >
                      <CardContent className="flex items-start gap-4 p-4">
                        {/* Poster */}
                        <div className="w-16 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
                          <img
                            src={item.poster}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {item.title}
                                <span className="text-muted-foreground font-normal ml-2">
                                  ({item.year})
                                </span>
                              </h3>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {item.genres.map((genre) => (
                                  <Badge
                                    key={genre}
                                    variant="outline"
                                    className="text-xs font-normal"
                                  >
                                    {genre}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => handleRemove(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {item.aiReason}
                          </p>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="w-3.5 h-3.5" />
                              添加于 {formatDate(item.addedAt)}
                              {isOverdue && (
                                <Badge
                                  variant="outline"
                                  className="ml-2 text-warning border-warning/50"
                                >
                                  已添加 {daysAdded} 天
                                </Badge>
                              )}
                            </div>
                            <Button
                              size="sm"
                              onClick={() => openRatingDialog(item)}
                            >
                              <Check className="w-4 h-4 mr-1.5" />
                              标记为已看
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Film className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-foreground mb-1">
                    待看清单为空
                  </h3>
                  <p className="text-sm text-muted-foreground text-center max-w-sm">
                    您从推荐中采纳的电影将显示在这里。
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Watched Tab */}
          <TabsContent value="watched">
            {watchedItems.length > 0 ? (
              <div className="grid gap-4">
                {watchedItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="flex items-start gap-4 p-4">
                      {/* Poster */}
                      <div className="w-16 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
                        <img
                          src={item.poster}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {item.title}
                              <span className="text-muted-foreground font-normal ml-2">
                                ({item.year})
                              </span>
                            </h3>
                            <div className="flex items-center gap-3 mt-2">
                              {item.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="font-medium">
                                    {item.rating}/10
                                  </span>
                                </div>
                              )}
                              {item.watchedAt && (
                                <span className="text-sm text-muted-foreground">
                                  观看于 {formatDate(item.watchedAt)}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive shrink-0"
                            onClick={() => handleRemove(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {item.notes && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Check className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-foreground mb-1">
                    还没有已看电影
                  </h3>
                  <p className="text-sm text-muted-foreground text-center max-w-sm">
                    您标记为已看的电影将连同评分一起显示在这里。
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Rating Dialog */}
        <Dialog open={ratingDialogOpen} onOpenChange={setRatingDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>为《{selectedMovie?.title}》评分</DialogTitle>
              <DialogDescription>
                您对这部电影的观影体验如何？
              </DialogDescription>
            </DialogHeader>

            <FieldGroup className="py-4">
              <Field>
                <FieldLabel>
                  您的评分：
                  <span className="text-primary font-semibold">
                    {formRating[0]}
                  </span>
                  {" "}/ 10
                </FieldLabel>
                <Slider
                  value={formRating}
                  onValueChange={setFormRating}
                  min={1}
                  max={10}
                  step={1}
                  className="mt-2"
                />
              </Field>

              <Field>
                <FieldLabel>备注（可选）</FieldLabel>
                <Textarea
                  placeholder="分享您对这部电影的看法..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  rows={3}
                />
              </Field>
            </FieldGroup>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setRatingDialogOpen(false)}
              >
                取消
              </Button>
              <Button onClick={handleMarkWatched}>
                <Star className="w-4 h-4 mr-1.5" />
                保存评分
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
