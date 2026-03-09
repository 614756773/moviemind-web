"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Bell, Shield, LogOut, Save, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SettingsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState({
    watchReminders: true,
    newRecommendations: false,
    weeklyDigest: true,
  })
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const getUsername = () => {
    if (typeof window !== "undefined") {
      const user = sessionStorage.getItem("user")
      if (user) {
        return JSON.parse(user).username
      }
    }
    return "User"
  }

  const handleLogout = () => {
    sessionStorage.removeItem("user")
    router.push("/login")
  }

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert("两次输入的密码不一致")
      return
    }
    // Simulate API call
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setPasswordDialogOpen(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }, 800)
  }

  const handleClearData = () => {
    // Clear all user data
    sessionStorage.clear()
    router.push("/login")
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex h-14 items-center gap-4 border-b border-border bg-background px-6">
        <SidebarTrigger className="-ml-2" />
        <Separator orientation="vertical" className="h-6" />
        <h1 className="text-lg font-semibold">设置</h1>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Account Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-muted-foreground" />
                <CardTitle className="text-lg">账户</CardTitle>
              </div>
              <CardDescription>
                管理您的账户信息
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel>用户名</FieldLabel>
                  <Input value={getUsername()} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground mt-1">
                    用户名无法更改，如需修改请联系管理员。
                  </p>
                </Field>

                <Field>
                  <FieldLabel>密码</FieldLabel>
                  <div className="flex items-center gap-3">
                    <Input
                      type="password"
                      value="••••••••"
                      disabled
                      className="bg-muted flex-1"
                    />
                    <Dialog
                      open={passwordDialogOpen}
                      onOpenChange={setPasswordDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Key className="w-4 h-4 mr-1.5" />
                          修改
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>修改密码</DialogTitle>
                          <DialogDescription>
                            请输入当前密码并设置新密码。
                          </DialogDescription>
                        </DialogHeader>
                        <FieldGroup className="py-4">
                          <Field>
                            <FieldLabel>当前密码</FieldLabel>
                            <Input
                              type="password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                          </Field>
                          <Field>
                            <FieldLabel>新密码</FieldLabel>
                            <Input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                          </Field>
                          <Field>
                            <FieldLabel>确认新密码</FieldLabel>
                            <Input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                            />
                          </Field>
                        </FieldGroup>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setPasswordDialogOpen(false)}
                          >
                            取消
                          </Button>
                          <Button
                            onClick={handlePasswordChange}
                            disabled={
                              isSaving ||
                              !currentPassword ||
                              !newPassword ||
                              !confirmPassword
                            }
                          >
                            {isSaving ? "保存中..." : "更新密码"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <CardTitle className="text-lg">通知</CardTitle>
              </div>
              <CardDescription>
                配置您希望接收通知的方式
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">观影提醒</p>
                  <p className="text-sm text-muted-foreground">
                    提醒我为已采纳的电影评分
                  </p>
                </div>
                <Switch
                  checked={notifications.watchReminders}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({
                      ...prev,
                      watchReminders: checked,
                    }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">新推荐通知</p>
                  <p className="text-sm text-muted-foreground">
                    有新推荐时通知我
                  </p>
                </div>
                <Switch
                  checked={notifications.newRecommendations}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({
                      ...prev,
                      newRecommendations: checked,
                    }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">每周摘要</p>
                  <p className="text-sm text-muted-foreground">
                    您的观影活动周报
                  </p>
                </div>
                <Switch
                  checked={notifications.weeklyDigest}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({
                      ...prev,
                      weeklyDigest: checked,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-destructive" />
                <CardTitle className="text-lg text-destructive">
                  危险区域
                </CardTitle>
              </div>
              <CardDescription>
                不可逆操作，请谨慎操作。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">清除所有数据</p>
                  <p className="text-sm text-muted-foreground">
                    删除您的所有偏好和待看清单数据
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                      清除数据
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>确定要清除吗？</AlertDialogTitle>
                      <AlertDialogDescription>
                        这将永久删除您的所有偏好、待看清单和评分历史。此操作无法撤销。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleClearData}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        确定，清除所有数据
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">退出登录</p>
                  <p className="text-sm text-muted-foreground">
                    退出当前账户
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  退出登录
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
