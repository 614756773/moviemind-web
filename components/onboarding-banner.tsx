"use client"

import Link from "next/link"
import { X, Heart, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface OnboardingBannerProps {
  onDismiss: () => void
}

export function OnboardingBanner({ onDismiss }: OnboardingBannerProps) {
  return (
    <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/10">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Heart className="w-5 h-5 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground">
            欢迎！让我们了解您的电影口味
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            添加一些您看过的电影并评分，我们将为您提供个性化推荐。
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            暂时跳过
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/preferences">
              添加偏好
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
