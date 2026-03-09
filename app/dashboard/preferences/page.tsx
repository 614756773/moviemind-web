"use client"

import { useState } from "react"
import { Plus, ArrowUpDown, Search, Edit2, Trash2, X, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"

// Preset tags
const presetTags = [
  "动作",
  "喜剧",
  "剧情",
  "科幻",
  "悬疑",
  "爱情",
  "恐怖",
  "动画",
  "纪录片",
  "推理",
  "奇幻",
  "冒险",
  "烧脑",
  "治愈",
  "暗黑",
  "搞笑",
  "发人深省",
  "视觉盛宴",
]

// Demo data
const demoPreferences = [
  {
    id: "1",
    title: "肖申克的救赎",
    rating: 10,
    notes: "关于希望和友谊的永恒杰作，结局堪称完美。",
    tags: ["剧情", "治愈", "发人深省"],
    addedAt: "2024-01-10",
  },
  {
    id: "2",
    title: "星际穿越",
    rating: 9,
    notes: "震撼的视觉效果和感人的父女情。",
    tags: ["科幻", "烧脑", "视觉盛宴"],
    addedAt: "2024-01-08",
  },
  {
    id: "3",
    title: "蝙蝠侠：黑暗骑士",
    rating: 9,
    notes: "希斯·莱杰的小丑是传奇，史上最佳超级英雄电影。",
    tags: ["动作", "悬疑", "暗黑"],
    addedAt: "2024-01-05",
  },
]

type SortOption = "date" | "rating" | "title"

interface Preference {
  id: string
  title: string
  rating: number
  notes: string
  tags: string[]
  addedAt: string
}

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState<Preference[]>(demoPreferences)
  const [sortBy, setSortBy] = useState<SortOption>("date")
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPreference, setEditingPreference] = useState<Preference | null>(null)

  // Form state
  const [formTitle, setFormTitle] = useState("")
  const [formRating, setFormRating] = useState([7])
  const [formNotes, setFormNotes] = useState("")
  const [formTags, setFormTags] = useState<string[]>([])
  const [customTag, setCustomTag] = useState("")

  const resetForm = () => {
    setFormTitle("")
    setFormRating([7])
    setFormNotes("")
    setFormTags([])
    setCustomTag("")
    setEditingPreference(null)
  }

  const openAddDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (pref: Preference) => {
    setEditingPreference(pref)
    setFormTitle(pref.title)
    setFormRating([pref.rating])
    setFormNotes(pref.notes)
    setFormTags(pref.tags)
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!formTitle.trim()) return

    const newPref: Preference = {
      id: editingPreference?.id || Date.now().toString(),
      title: formTitle,
      rating: formRating[0],
      notes: formNotes,
      tags: formTags,
      addedAt: editingPreference?.addedAt || new Date().toISOString().split("T")[0],
    }

    if (editingPreference) {
      setPreferences((prev) =>
        prev.map((p) => (p.id === editingPreference.id ? newPref : p))
      )
    } else {
      setPreferences((prev) => [newPref, ...prev])
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const handleDelete = (id: string) => {
    setPreferences((prev) => prev.filter((p) => p.id !== id))
  }

  const toggleTag = (tag: string) => {
    setFormTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const addCustomTag = () => {
    if (customTag.trim() && !formTags.includes(customTag.trim())) {
      setFormTags((prev) => [...prev, customTag.trim()])
      setCustomTag("")
    }
  }

  // Sort and filter
  const sortedPreferences = [...preferences]
    .filter((p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "title":
          return a.title.localeCompare(b.title)
        case "date":
        default:
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      }
    })

  const sortLabels: Record<SortOption, string> = {
    date: "添加时间",
    rating: "评分",
    title: "标题",
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex h-14 items-center gap-4 border-b border-border bg-background px-6">
        <SidebarTrigger className="-ml-2" />
        <Separator orientation="vertical" className="h-6" />
        <h1 className="text-lg font-semibold">偏好管理</h1>
        <div className="ml-auto flex items-center gap-3">
          {/* Search */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索电影..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                {sortLabels[sortBy]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("date")}>
                添加时间
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("rating")}>
                评分
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("title")}>
                标题
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={openAddDialog}>
                <Plus className="w-4 h-4 mr-2" />
                添加电影
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingPreference ? "编辑电影" : "添加看过的电影"}
                </DialogTitle>
                <DialogDescription>
                  告诉我们您看过的电影以及您的感受。
                </DialogDescription>
              </DialogHeader>

              <FieldGroup className="py-4">
                <Field>
                  <FieldLabel>电影名称</FieldLabel>
                  <Input
                    placeholder="输入电影名称"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel>
                    评分：<span className="text-primary font-semibold">{formRating[0]}</span> / 10
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
                    placeholder="您喜欢或不喜欢这部电影的哪些方面？"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    rows={3}
                  />
                </Field>

                <Field>
                  <FieldLabel>标签</FieldLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {presetTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={formTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {/* Custom tag input */}
                  <div className="flex gap-2 mt-3">
                    <Input
                      placeholder="添加自定义标签"
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addCustomTag()}
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm" onClick={addCustomTag}>
                      添加
                    </Button>
                  </div>
                  {/* Selected custom tags */}
                  {formTags.filter((t) => !presetTags.includes(t)).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formTags
                        .filter((t) => !presetTags.includes(t))
                        .map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => toggleTag(tag)}
                          >
                            {tag}
                            <X className="w-3 h-3 ml-1" />
                          </Badge>
                        ))}
                    </div>
                  )}
                </Field>
              </FieldGroup>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleSave} disabled={!formTitle.trim()}>
                  {editingPreference ? "保存更改" : "添加电影"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-6">
        {sortedPreferences.length > 0 ? (
          <div className="grid gap-4">
            {sortedPreferences.map((pref) => (
              <Card key={pref.id} className="group">
                <CardContent className="flex items-start gap-4 p-4">
                  {/* Rating */}
                  <div className="flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-primary/10 shrink-0">
                    <span className="text-xl font-bold text-primary">{pref.rating}</span>
                    <span className="text-[10px] text-muted-foreground -mt-0.5">/ 10</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-foreground">{pref.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {pref.notes || "暂无备注"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditDialog(pref)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(pref.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {/* Tags */}
                    {pref.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {pref.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs font-normal">
                            {tag}
                          </Badge>
                        ))}
                      </div>
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
                <Star className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-1">还没有偏好数据</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
                先添加一些您看过的电影吧。您的评分和备注将帮助我们为您推荐更好的电影。
              </p>
              <Button onClick={openAddDialog}>
                <Plus className="w-4 h-4 mr-2" />
                添加第一部电影
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
