"use client"

import { X, Star, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Reminder {
  id: string
  movieId: string
  movieTitle: string
  poster: string
  adoptedDate: string
}

interface ReminderCardProps {
  reminder: Reminder
  onDismiss: () => void
  onRate: () => void
}

export function ReminderCard({ reminder, onDismiss, onRate }: ReminderCardProps) {
  const adoptedDays = Math.floor(
    (Date.now() - new Date(reminder.adoptedDate).getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex items-center gap-4 p-4">
        {/* Poster Thumbnail */}
        <div className="w-12 h-16 rounded overflow-hidden bg-muted shrink-0">
          <img
            src={reminder.poster}
            alt={reminder.movieTitle}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate">
            {reminder.movieTitle}
          </h4>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
            <Clock className="w-3.5 h-3.5" />
            {adoptedDays} 天前加入
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={onDismiss}>
            还没看
          </Button>
          <Button size="sm" onClick={onRate}>
            <Star className="w-4 h-4 mr-1.5" />
            去评分
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
