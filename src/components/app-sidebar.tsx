"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import {
  BookOpen,
  FileText,
  StickyNote,
  Plus,
  Search,
  ChevronDown,
  BookMarked,
} from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { getShortcutDisplay } from "@/hooks/use-keyboard-shortcuts"
import type { Post, Category, Difficulty } from "@/lib/types"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  posts: Post[]
  selectedPostId: string | null
  onSelectPost: (post: Post) => void
  onNewPost: () => void
}

interface CategoryConfig {
  id: Category
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
}

const categories: CategoryConfig[] = [
  { id: "blog", label: "Blog", icon: BookOpen, color: "text-foreground", bgColor: "bg-muted" },
  { id: "report", label: "Report", icon: FileText, color: "text-foreground", bgColor: "bg-muted" },
  { id: "note", label: "Note", icon: StickyNote, color: "text-foreground", bgColor: "bg-muted" },
]

const difficultyColors: Record<Difficulty, string> = {
  beginner: "bg-muted text-muted-foreground border-border",
  intermediate: "bg-muted text-muted-foreground border-border",
  advanced: "bg-muted text-muted-foreground border-border",
}

const difficultyLabels: Record<Difficulty, string> = {
  beginner: "B",
  intermediate: "I",
  advanced: "A",
}

export function AppSidebar({
  posts,
  selectedPostId,
  onSelectPost,
  onNewPost,
  ...props
}: AppSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return posts
    }
    const query = searchQuery.toLowerCase()
    return posts.filter((post) =>
      post.title.toLowerCase().includes(query)
    )
  }, [posts, searchQuery])

  const getPostsByCategory = (category: Category) => {
    return filteredPosts.filter((post) => post.category === category)
  }

  // Get shortcut display string for New Post
  const newPostShortcut = getShortcutDisplay({ key: 'n', ctrlOrCmd: true })

  return (
    <Sidebar collapsible="icon" className="border-r-0" {...props}>
      <SidebarHeader className="gap-3.5 border-b border-sidebar-border p-4 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:items-center">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <BookMarked className="size-4 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold text-foreground group-data-[collapsible=icon]:hidden">
            Writing Board
          </span>
        </div>
        <div className="relative group-data-[collapsible=icon]:hidden">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <SidebarInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts..."
            className="pl-8"
          />
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onNewPost}
              size="icon"
              className="w-full group-data-[collapsible=icon]:size-8"
            >
              <Plus className="size-4" />
              <span className="group-data-[collapsible=icon]:hidden">New Post</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <span>New Post ({newPostShortcut})</span>
          </TooltipContent>
        </Tooltip>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:items-center">
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Categories
          </SidebarGroupLabel>
          <SidebarGroupContent className="group-data-[collapsible=icon]:w-auto">
            <SidebarMenu className="group-data-[collapsible=icon]:items-center">
              {categories.map((category) => {
                const categoryPosts = getPostsByCategory(category.id)
                const Icon = category.icon

                return (
                  <Collapsible
                    key={category.id}
                    defaultOpen
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={category.label}
                          className="font-medium"
                        >
                          <Icon className="size-4" />
                          <span>{category.label}</span>
                          <span className="ml-auto text-[10px] text-muted-foreground">{categoryPosts.length}</span>
                          <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {categoryPosts.length === 0 ? (
                            <SidebarMenuSubItem>
                              <span className="text-xs text-muted-foreground italic py-1 px-2">
                                No posts yet
                              </span>
                            </SidebarMenuSubItem>
                          ) : (
                            categoryPosts.map((post) => (
                              <SidebarMenuSubItem key={post.id}>
                                <SidebarMenuSubButton
                                  onClick={() => onSelectPost(post)}
                                  isActive={post.id === selectedPostId}
                                  className="cursor-pointer group/post"
                                >
                                  <span className="flex-1 truncate">{post.title}</span>
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-[9px] px-1 py-0 h-4 font-semibold border shrink-0",
                                      difficultyColors[post.difficulty]
                                    )}
                                  >
                                    {difficultyLabels[post.difficulty]}
                                  </Badge>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))
                          )}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-2 p-2 text-xs text-muted-foreground group-data-[collapsible=icon]:justify-center">
          <span className="group-data-[collapsible=icon]:hidden">
            {posts.length} posts total
          </span>
          <span className="group-data-[collapsible=icon]:block hidden text-[10px]">
            {posts.length}
          </span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
