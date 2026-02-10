"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Gift, Clock, Trophy } from "lucide-react"

export function DrawerPreview() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      {/* Simulated website background */}
      <div className="w-[500px] h-[400px] bg-card border rounded-lg p-6 flex flex-col items-center justify-center">
        <div className="w-full mb-4">
          <div className="w-full h-8 bg-muted/80 rounded-lg mb-4"></div>
          <div className="flex gap-4">
            <div className="w-24 h-24 bg-muted/80 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="w-full h-6 bg-muted/80 rounded-lg"></div>
              <div className="w-3/4 h-4 bg-muted/80 rounded-lg"></div>
              <div className="w-1/2 h-4 bg-muted/80 rounded-lg"></div>
            </div>
          </div>
        </div>

        <div className="space-y-2 w-full mt-4">
          <div className="w-full h-4 bg-muted/80 rounded-lg"></div>
          <div className="w-full h-4 bg-muted/80 rounded-lg"></div>
          <div className="w-3/4 h-4 bg-muted/80 rounded-lg"></div>
        </div>

        <Button className="mt-6" onClick={() => setIsOpen(true)}>
          View Rewards
        </Button>
      </div>

      {/* Drawer component */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end">
          <div className="fixed inset-0 bg-black/40" onClick={() => setIsOpen(false)}></div>
          <div className="bg-background border shadow-lg rounded-l-lg w-[350px] h-full flex flex-col z-10 animate-in slide-in-from-right">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Ra Rewards</h3>
                <p className="text-sm text-muted-foreground">Your Raydium rewards</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                ×
              </Button>
            </div>

            <div className="flex-1 overflow-auto">
              <Tabs defaultValue="active" className="h-full">
                <TabsList className="grid w-full grid-cols-2 m-4">
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="px-4 pb-4 space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Creator Rewards</CardTitle>
                        <Badge>Active</Badge>
                      </div>
                      <CardDescription>Daily rewards for content creators</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Your Score</span>
                        <span className="font-medium">1,240 pts</span>
                      </div>
                      <Progress value={68} className="h-2" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Rank #42</span>
                        <span className="text-green-600">+120 pts today</span>
                      </div>
                      <Button size="sm" className="w-full">
                        <Gift className="h-4 w-4 mr-2" />
                        Claim 25 RAY
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Trading Rewards</CardTitle>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                      <CardDescription>Weekly trading volume rewards</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Volume This Week</span>
                        <span className="font-medium">$12,450</span>
                      </div>
                      <Progress value={42} className="h-2" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Rank #156</span>
                        <span className="flex items-center text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />3 days left
                        </span>
                      </div>
                      <Button size="sm" variant="outline" className="w-full" disabled>
                        <Clock className="h-4 w-4 mr-2" />
                        Pending Distribution
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Raffle Entry</CardTitle>
                        <Badge variant="secondary">Entered</Badge>
                      </div>
                      <CardDescription>Daily raffle for active users</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Your Entries</span>
                        <span className="font-medium">3 tickets</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Prize Pool</span>
                        <span className="font-medium">5,000 RAY</span>
                      </div>
                      <Button size="sm" variant="outline" className="w-full" disabled>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Already Entered
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="leaderboard" className="px-4 pb-4 space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center">
                        <Trophy className="h-4 w-4 mr-2" />
                        Top Creators
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { rank: 1, name: "CryptoCreator", score: "4,250", reward: "500 RAY" },
                        { rank: 2, name: "DeFiExplorer", score: "3,890", reward: "300 RAY" },
                        { rank: 3, name: "RayTrader", score: "3,420", reward: "200 RAY" },
                        { rank: 42, name: "You", score: "1,240", reward: "25 RAY", isUser: true },
                      ].map((user, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between p-2 rounded ${user.isUser ? "bg-primary/10" : ""}`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                              {user.rank}
                            </div>
                            <div>
                              <div className={`font-medium text-sm ${user.isUser ? "text-primary" : ""}`}>
                                {user.name}
                              </div>
                              <div className="text-xs text-muted-foreground">{user.score} pts</div>
                            </div>
                          </div>
                          <div className="text-sm font-medium">{user.reward}</div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
