"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Filter, FileCode, Layers, Gift, Settings, Plus, Minus, Link, Unlink } from "lucide-react"

// This is a simplified visual representation - in a real application,
// you would use a proper flow visualization library like ReactFlow

export function CampaignFlowDesigner() {
  const [zoom, setZoom] = useState(100)

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10 flex items-center space-x-2 bg-background/80 backdrop-blur p-1 rounded border">
        <Button variant="ghost" size="icon" onClick={() => setZoom(zoom - 10)} disabled={zoom <= 50}>
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-xs">{zoom}%</span>
        <Button variant="ghost" size="icon" onClick={() => setZoom(zoom + 10)} disabled={zoom >= 150}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div
        className="h-[500px] overflow-auto border rounded-lg bg-muted/30 p-6"
        style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left" }}
      >
        <div className="flex flex-col items-center relative w-[900px]">
          {/* Source Node */}
          <div className="w-64 rounded-md p-4 bg-background border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span className="font-medium">User Database</span>
              </div>
              <Badge>Source</Badge>
            </div>
            <div className="text-xs text-muted-foreground mb-2">All registered users on Raydium</div>
            <div className="text-xs bg-muted p-1 rounded">Users: ~120,000</div>
          </div>

          {/* Connector Line */}
          <div className="w-1 h-8 bg-border"></div>

          {/* SQL Filter */}
          <div className="w-64 rounded-md p-4 bg-background border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <FileCode className="h-4 w-4 mr-2" />
                <span className="font-medium">Active Users Filter</span>
              </div>
              <Badge variant="outline">SQL</Badge>
            </div>
            <div className="text-xs text-muted-foreground mb-2">Filter for active wallets only</div>
            <div className="text-xs bg-muted p-1 rounded font-mono">
              WHERE last_active &gt; now() - interval '30 days'
            </div>
          </div>

          {/* Connector Line */}
          <div className="w-1 h-8 bg-border"></div>

          {/* Splitter Node */}
          <div className="w-64 rounded-md p-4 bg-background border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Layers className="h-4 w-4 mr-2" />
                <span className="font-medium">Segment Splitter</span>
              </div>
              <Badge variant="secondary">Split</Badge>
            </div>
            <div className="text-xs text-muted-foreground mb-2">Split users into three tiers</div>
            <div className="text-xs bg-muted p-1 rounded">Output: 3 segments</div>
          </div>

          {/* Branching */}
          <div className="relative w-full my-6">
            <div className="absolute left-0 right-0 top-0 flex justify-center">
              <div className="w-1 h-8 bg-border"></div>
            </div>
            <div className="absolute left-0 right-0 top-8 h-1 bg-border"></div>
            <div className="absolute left-1/4 top-8 w-1 h-8 bg-border"></div>
            <div className="absolute left-1/2 top-8 w-1 h-8 bg-border"></div>
            <div className="absolute left-3/4 top-8 w-1 h-8 bg-border"></div>
          </div>

          {/* Three Branches */}
          <div className="grid grid-cols-3 gap-12 w-full">
            {/* Creator Branch */}
            <div className="flex flex-col items-center">
              <div className="w-full rounded-md p-4 bg-background border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <FileCode className="h-4 w-4 mr-2" />
                    <span className="font-medium">Creator Query</span>
                  </div>
                  <Badge>Tier 1</Badge>
                </div>
                <div className="text-xs text-muted-foreground mb-2">Identify creator accounts</div>
                <div className="text-xs bg-muted p-1 rounded font-mono truncate">
                  SELECT * FROM users WHERE role = 'creator'
                </div>
              </div>

              <div className="w-1 h-8 bg-border"></div>

              <div className="w-full rounded-md p-4 bg-background border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Gift className="h-4 w-4 mr-2" />
                    <span className="font-medium">Creator Rewards</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mb-2">15,000 RAY total</div>
                <div className="text-xs bg-muted p-1 rounded">500 recipients, daily distribution</div>
              </div>
            </div>

            {/* Trader Branch */}
            <div className="flex flex-col items-center">
              <div className="w-full rounded-md p-4 bg-background border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <span className="font-medium">Volume Filter</span>
                  </div>
                  <Badge>Tier 2</Badge>
                </div>
                <div className="text-xs text-muted-foreground mb-2">High volume traders</div>
                <div className="text-xs bg-muted p-1 rounded font-mono truncate">
                  volume &gt; 10000 AND tx_count &gt; 50
                </div>
              </div>

              <div className="w-1 h-8 bg-border"></div>

              <div className="w-full rounded-md p-4 bg-background border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Gift className="h-4 w-4 mr-2" />
                    <span className="font-medium">Leaderboard Rewards</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mb-2">14,000 RAY total</div>
                <div className="text-xs bg-muted p-1 rounded">100 top traders, tiered allocation</div>
              </div>
            </div>

            {/* Raffle Branch */}
            <div className="flex flex-col items-center">
              <div className="w-full rounded-md p-4 bg-background border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    <span className="font-medium">Exclusion Logic</span>
                  </div>
                  <Badge>Tier 3</Badge>
                </div>
                <div className="text-xs text-muted-foreground mb-2">Exclude winners from Tier 1 & 2</div>
                <div className="text-xs bg-muted p-1 rounded font-mono truncate">
                  NOT IN (SELECT wallet FROM tier1_winners UNION tier2_winners)
                </div>
              </div>

              <div className="w-1 h-8 bg-border"></div>

              <div className="w-full rounded-md p-4 bg-background border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Gift className="h-4 w-4 mr-2" />
                    <span className="font-medium">Raffle Rewards</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mb-2">5,000 RAY total</div>
                <div className="text-xs bg-muted p-1 rounded">250 random winners, 3 prize tiers</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
        <div className="flex items-center mr-4">
          <Link className="h-4 w-4 mr-1" />
          <span>Click and drag to connect nodes</span>
        </div>
        <div className="flex items-center">
          <Unlink className="h-4 w-4 mr-1" />
          <span>Right-click to remove connections</span>
        </div>
      </div>
    </div>
  )
}
