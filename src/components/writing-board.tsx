"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Editor } from "@/components/editor/Editor"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"
import type { Post, CreatePostInput, UpdatePostInput } from "@/lib/types"

export function WritingBoard() {
  const [posts, setPosts] = React.useState<Post[]>([])
  const [selectedPost, setSelectedPost] = React.useState<Post | null>(null)
  const [isCreating, setIsCreating] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  // Fetch posts on mount
  React.useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts")
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    }
  }

  const handleNewPost = () => {
    setSelectedPost(null)
    setIsCreating(true)
  }

  const handleSelectPost = (post: Post) => {
    setSelectedPost(post)
    setIsCreating(false)
  }

  const handleSave = async (data: CreatePostInput | UpdatePostInput) => {
    setIsLoading(true)
    try {
      if (selectedPost) {
        // Update existing post
        const response = await fetch(`/api/posts/${selectedPost.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        if (response.ok) {
          const updatedPost = await response.json()
          setPosts((prev) =>
            prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
          )
          setSelectedPost(updatedPost)
        }
      } else {
        // Create new post
        const response = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        if (response.ok) {
          const newPost = await response.json()
          setPosts((prev) => [newPost, ...prev])
          setSelectedPost(newPost)
          setIsCreating(false)
        }
      }
    } catch (error) {
      console.error("Failed to save post:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedPost) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/posts/${selectedPost.id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== selectedPost.id))
        setSelectedPost(null)
      }
    } catch (error) {
      console.error("Failed to delete post:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const showEditor = selectedPost || isCreating

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider defaultOpen>
        <AppSidebar
          posts={posts}
          selectedPostId={selectedPost?.id ?? null}
          onSelectPost={handleSelectPost}
          onNewPost={handleNewPost}
        />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-medium">
                  {selectedPost ? selectedPost.title : isCreating ? "New Post" : "Welcome"}
                </h1>
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-hidden">
            {showEditor ? (
              <Editor
                post={selectedPost}
                onSave={handleSave}
                onDelete={selectedPost ? handleDelete : undefined}
                isLoading={isLoading}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="flex size-20 items-center justify-center rounded-2xl bg-muted border border-border">
                  <svg
                    className="size-10 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                    />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-foreground">
                    Start Writing
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Select a post from the sidebar or create a new one to begin your writing journey.
                  </p>
                </div>
              </div>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
