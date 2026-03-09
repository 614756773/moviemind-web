"use client"

import { Star, ThumbsDown, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Movie {
  id: string
  title: string
  year: number
  rating: number
  genres: string[]
  poster: string
  aiReason: string
}

interface MovieCardProps {
  movie: Movie
  onReject: () => void
  onAdopt: () => void
}

export function MovieCard({ movie, onReject, onAdopt }: MovieCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        {/* Poster */}
        <div className="relative aspect-[2/3] bg-muted overflow-hidden">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Rating Badge */}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-black/60 text-white border-0 backdrop-blur-sm">
              <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
              {movie.rating}
            </Badge>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-foreground leading-tight line-clamp-1">
              {movie.title}
            </h3>
            <span className="text-sm text-muted-foreground shrink-0">{movie.year}</span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {movie.genres.slice(0, 3).map((genre) => (
              <Badge key={genre} variant="outline" className="text-xs font-normal">
                {genre}
              </Badge>
            ))}
          </div>

          {/* AI Reason */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/50 mb-4">
            <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
              {movie.aiReason}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onReject}
            >
              <ThumbsDown className="w-4 h-4 mr-1.5" />
              不感兴趣
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={onAdopt}
            >
              <Check className="w-4 h-4 mr-1.5" />
              采纳
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
