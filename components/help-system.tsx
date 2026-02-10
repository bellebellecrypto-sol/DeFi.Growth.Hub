"use client"

import type React from "react"

import { useState } from "react"
import { useAppMode } from "@/hooks/use-app-mode"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  HelpCircle,
  Search,
  BookOpen,
  Code,
  Lightbulb,
  Settings,
  Zap,
  Users,
  BarChart3,
  ExternalLink,
  ChevronRight,
} from "lucide-react"

interface HelpArticle {
  id: string
  title: string
  category: string
  classicContent: string
  advancedContent: string
  tags: string[]
  icon: React.ComponentType<{ className?: string }>
}

const helpArticles: HelpArticle[] = [
  {
    id: "campaigns-overview",
    title: "Understanding Campaigns",
    category: "Getting Started",
    classicContent:
      "Campaigns are marketing activities that reward your users for specific actions. Think of them as promotional events where you give out prizes to encourage participation. You can create campaigns to attract new users, keep existing users engaged, or promote specific features of your product.",
    advancedContent:
      "Campaigns are structured incentive programs that utilize behavioral economics principles to drive user engagement through targeted reward mechanisms. They implement multi-tier distribution algorithms with configurable parameters including audience segmentation, reward allocation strategies, and performance tracking metrics. Campaigns support various trigger conditions, custom SQL queries for audience selection, and real-time analytics with statistical significance testing.",
    tags: ["campaigns", "basics", "rewards"],
    icon: Zap,
  },
  {
    id: "audience-targeting",
    title: "Targeting Your Audience",
    category: "Audience Management",
    classicContent:
      "Audience targeting helps you choose who receives your rewards. You can target users based on their activity, location, or other characteristics. For example, you might want to reward only new users, or users who haven't been active recently. This ensures your rewards go to the right people.",
    advancedContent:
      "Audience targeting utilizes advanced segmentation algorithms with support for complex Boolean logic, SQL-based filtering, and machine learning-powered cohort analysis. The system supports real-time audience evaluation using streaming data pipelines, with configurable refresh intervals and cache invalidation strategies. Advanced targeting includes behavioral scoring models, predictive analytics for churn prevention, and A/B testing frameworks for audience optimization.",
    tags: ["audience", "targeting", "segmentation"],
    icon: Users,
  },
  {
    id: "reward-distribution",
    title: "How Rewards Work",
    category: "Rewards",
    classicContent:
      "Rewards are the prizes you give to users when they complete certain actions. These can be tokens, NFTs, discounts, or special access to features. The system automatically distributes rewards when users meet your criteria, so you don't have to manually send them out.",
    advancedContent:
      "Reward distribution employs cryptographically secure random number generation using ChaCha20 CSPRNG for fair allocation. The system implements Merkle tree-based verification for gas-efficient batch distributions, with support for EIP-1559 fee optimization and custom gas strategies. Distribution mechanisms include immediate execution, scheduled batches, and event-driven triggers with configurable retry logic and failure handling.",
    tags: ["rewards", "distribution", "automation"],
    icon: Settings,
  },
  {
    id: "analytics-metrics",
    title: "Understanding Your Results",
    category: "Analytics",
    classicContent:
      "Analytics show you how well your campaigns are performing. You can see how many people participated, how many completed the required actions, and how much you've spent on rewards. These numbers help you understand what's working and what needs improvement.",
    advancedContent:
      "Analytics leverage advanced statistical methods including confidence intervals, p-value calculations, and multi-variate analysis. The system provides real-time data streaming with configurable aggregation windows, supports custom metric definitions using SQL expressions, and implements machine learning models for predictive analytics. Advanced features include cohort analysis, attribution modeling, and statistical significance testing with Bonferroni correction for multiple comparisons.",
    tags: ["analytics", "metrics", "performance"],
    icon: BarChart3,
  },
]

export function HelpButton() {
  const { mode } = useAppMode()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = ["all", ...Array.from(new Set(helpArticles.map((article) => article.category)))]

  const filteredArticles = helpArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <HelpCircle className="h-4 w-4" />
          <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs">?</Badge>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[600px] sm:w-[800px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Help & Documentation
            <Badge variant={mode === "advanced" ? "outline" : "secondary"}>
              {mode === "advanced" ? "Advanced Mode" : "Classic Mode"}
            </Badge>
          </SheetTitle>
          <SheetDescription>
            {mode === "classic"
              ? "Simple guides to help you get started with Torque"
              : "Comprehensive technical documentation and advanced configuration guides"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-4">
              {categories.slice(0, 4).map((category) => (
                <TabsTrigger key={category} value={category} className="text-xs">
                  {category === "all" ? "All" : category.split(" ")[0]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <HelpArticleCard key={article.id} article={article} />
              ))}

              {filteredArticles.length === 0 && (
                <Card>
                  <CardContent className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No articles found matching your search.</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <QuickStartGuide />
              <TechnicalResources />
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function HelpArticleCard({ article }: { article: HelpArticle }) {
  const { mode } = useAppMode()
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <article.icon className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-base">{article.title}</CardTitle>
              <CardDescription>{article.category}</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="gap-1">
            {expanded ? "Collapse" : "Expand"}
            <ChevronRight className={`h-3 w-3 transition-transform ${expanded ? "rotate-90" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            <p className="text-sm leading-relaxed">
              {mode === "classic" ? article.classicContent : article.advancedContent}
            </p>
            <div className="flex flex-wrap gap-1">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

function QuickStartGuide() {
  const { mode } = useAppMode()

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Quick Start Guide
        </CardTitle>
        <CardDescription>
          {mode === "classic"
            ? "Get up and running with your first campaign in minutes"
            : "Advanced setup and configuration for power users"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mode === "classic" ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                1
              </div>
              <span className="text-sm">Create your first campaign with our simple wizard</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                2
              </div>
              <span className="text-sm">Choose who should receive rewards</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                3
              </div>
              <span className="text-sm">Set up your rewards and launch!</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                1
              </div>
              <span className="text-sm">Configure data sources and RPC endpoints</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                2
              </div>
              <span className="text-sm">Set up advanced audience segmentation with SQL queries</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                3
              </div>
              <span className="text-sm">Configure distribution algorithms and gas optimization</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                4
              </div>
              <span className="text-sm">Deploy with monitoring and analytics integration</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TechnicalResources() {
  const { mode } = useAppMode()

  if (mode === "classic") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Additional Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start gap-2">
            <BookOpen className="h-4 w-4" />
            Video Tutorials
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2">
            <Users className="h-4 w-4" />
            Community Forum
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2">
            <HelpCircle className="h-4 w-4" />
            Contact Support
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Technical Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button variant="outline" className="w-full justify-start gap-2">
          <Code className="h-4 w-4" />
          API Documentation
        </Button>
        <Button variant="outline" className="w-full justify-start gap-2">
          <Settings className="h-4 w-4" />
          SDK Reference
        </Button>
        <Button variant="outline" className="w-full justify-start gap-2">
          <BookOpen className="h-4 w-4" />
          Architecture Guide
        </Button>
        <Button variant="outline" className="w-full justify-start gap-2">
          <ExternalLink className="h-4 w-4" />
          GitHub Repository
        </Button>
      </CardContent>
    </Card>
  )
}
