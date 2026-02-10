"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Line, LineChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  rewardsOptimizationService,
  type OptimizationTarget,
  type SimulationParams,
  type OptimizationResult,
} from "@/lib/rewards-optimization-service"
import { orcaDataService } from "@/lib/orca-data-service"
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  Save,
  Download,
  Target,
  Sliders,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Zap,
} from "lucide-react"

export function RewardsOptimizationSimulator() {
  const [loading, setLoading] = useState(true)
  const [targets, setTargets] = useState<OptimizationTarget[]>([])
  const [constraints, setConstraints] = useState<SimulationParams["constraints"]>({
    maxPoolAllocation: 0.15,
    minPoolAllocation: 0.001,
    maxChangePercent: 50,
    preserveTopPerformers: true,
    focusUnderperforming: false,
  })
  const [totalEmissions, setTotalEmissions] = useState(0)
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null)
  const [comparisonResults, setComparisonResults] = useState<OptimizationResult[]>([])
  const [selectedPoolIndex, setSelectedPoolIndex] = useState<number | null>(null)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
    key: "score",
    direction: "desc",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        await orcaDataService.fetchData()
        const processedData = orcaDataService.getProcessedData()

        if (processedData) {
          setTotalEmissions(processedData.totalWeeklyEmissions)
          setTargets(rewardsOptimizationService.getDefaultTargets())
          setConstraints(rewardsOptimizationService.getDefaultConstraints())

          // Run initial optimization
          runOptimization()
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const runOptimization = () => {
    if (totalEmissions <= 0) return

    setLoading(true)

    try {
      const params: SimulationParams = {
        totalEmissions,
        targets,
        constraints,
      }

      const result = rewardsOptimizationService.optimizeRewards(params)
      setOptimizationResult(result)

      // Run comparison simulations
      const variations: Partial<SimulationParams>[] = [
        {
          targets: [{ type: "tvl", weight: 100 }],
          constraints: { ...constraints, preserveTopPerformers: false },
        },
        {
          targets: [{ type: "users", weight: 100 }],
          constraints: { ...constraints, preserveTopPerformers: false },
        },
        {
          targets: [{ type: "balanced", weight: 100 }],
          constraints: { ...constraints, maxChangePercent: 100 },
        },
      ]

      const comparisonResults = rewardsOptimizationService.runSimulations(params, variations)
      setComparisonResults(comparisonResults)
    } catch (error) {
      console.error("Optimization failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTargetChange = (index: number, field: keyof OptimizationTarget, value: any) => {
    const newTargets = [...targets]
    newTargets[index] = { ...newTargets[index], [field]: value }
    setTargets(newTargets)
  }

  const handleConstraintChange = (field: keyof SimulationParams["constraints"], value: any) => {
    setConstraints({ ...constraints, [field]: value })
  }

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "desc" ? "asc" : "desc",
    }))
  }

  const getSortedPools = () => {
    if (!optimizationResult) return []

    return [...optimizationResult.pools].sort((a, b) => {
      let aValue: any = a[sortConfig.key as keyof typeof a]
      let bValue: any = b[sortConfig.key as keyof typeof b]

      // Handle nested properties
      if (sortConfig.key.includes(".")) {
        const [parent, child] = sortConfig.key.split(".")
        aValue = a[parent as keyof typeof a]?.[child]
        bValue = b[parent as keyof typeof b]?.[child]
      }

      if (aValue === bValue) return 0

      const direction = sortConfig.direction === "asc" ? 1 : -1
      return aValue > bValue ? direction : -direction
    })
  }

  const formatPercent = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`
  }

  const formatNumber = (value: number) => {
    return value.toLocaleString(undefined, { maximumFractionDigits: 0 })
  }

  if (loading && !optimizationResult) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Initializing optimization engine...</span>
      </div>
    )
  }

  const sortedPools = getSortedPools()
  const selectedPool = selectedPoolIndex !== null ? sortedPools[selectedPoolIndex] : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Rewards Optimization Simulator</h2>
          <p className="text-muted-foreground">Optimize reward distribution for maximum impact</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => runOptimization()} disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Run Simulation
              </>
            )}
          </Button>
          <Button disabled={!optimizationResult}>
            <Save className="h-4 w-4 mr-2" />
            Save Strategy
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Optimization Parameters</CardTitle>
            <CardDescription>Configure targets and constraints for the optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="targets">
              <TabsList className="mb-4">
                <TabsTrigger value="targets">
                  <Target className="h-4 w-4 mr-2" />
                  Optimization Targets
                </TabsTrigger>
                <TabsTrigger value="constraints">
                  <Sliders className="h-4 w-4 mr-2" />
                  Constraints
                </TabsTrigger>
              </TabsList>

              <TabsContent value="targets" className="space-y-4">
                <div>
                  <Label>Total Weekly Emissions</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="number"
                      value={totalEmissions}
                      onChange={(e) => setTotalEmissions(Number(e.target.value))}
                      className="max-w-xs"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const processedData = orcaDataService.getProcessedData()
                        if (processedData) {
                          setTotalEmissions(processedData.totalWeeklyEmissions)
                        }
                      }}
                    >
                      Reset to Current
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Optimization Targets</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setTargets(rewardsOptimizationService.getDefaultTargets())}
                    >
                      Reset to Default
                    </Button>
                  </div>

                  {targets.map((target, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 items-center">
                      <div className="col-span-1">
                        <Label htmlFor={`target-${index}`}>Target</Label>
                        <select
                          id={`target-${index}`}
                          value={target.type}
                          onChange={(e) => handleTargetChange(index, "type", e.target.value)}
                          className="w-full mt-1 p-2 border rounded-md"
                        >
                          <option value="tvl">TVL</option>
                          <option value="volume">Volume</option>
                          <option value="users">Users</option>
                          <option value="retention">Retention</option>
                          <option value="engagement">Engagement</option>
                          <option value="balanced">Balanced</option>
                        </select>
                      </div>
                      <div className="col-span-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`weight-${index}`}>Weight: {target.weight}%</Label>
                          <span className="text-xs text-muted-foreground">
                            {target.weight === 0
                              ? "Not considered"
                              : target.weight < 25
                                ? "Low priority"
                                : target.weight < 50
                                  ? "Medium priority"
                                  : target.weight < 75
                                    ? "High priority"
                                    : "Critical priority"}
                          </span>
                        </div>
                        <Slider
                          id={`weight-${index}`}
                          value={[target.weight]}
                          min={0}
                          max={100}
                          step={5}
                          onValueChange={(value) => handleTargetChange(index, "weight", value[0])}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="constraints" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label>Maximum Pool Allocation</Label>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-muted-foreground">
                        {(constraints.maxPoolAllocation * 100).toFixed(1)}% of total emissions
                      </span>
                    </div>
                    <Slider
                      value={[constraints.maxPoolAllocation * 100]}
                      min={1}
                      max={50}
                      step={1}
                      onValueChange={(value) => handleConstraintChange("maxPoolAllocation", value[0] / 100)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Minimum Pool Allocation</Label>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-muted-foreground">
                        {(constraints.minPoolAllocation * 100).toFixed(2)}% of total emissions
                      </span>
                    </div>
                    <Slider
                      value={[constraints.minPoolAllocation * 100]}
                      min={0}
                      max={1}
                      step={0.05}
                      onValueChange={(value) => handleConstraintChange("minPoolAllocation", value[0] / 100)}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label>Maximum Change Percent</Label>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-muted-foreground">
                      {constraints.maxChangePercent}% maximum change (up or down)
                    </span>
                  </div>
                  <Slider
                    value={[constraints.maxChangePercent]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(value) => handleConstraintChange("maxChangePercent", value[0])}
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="preserve-top"
                      checked={constraints.preserveTopPerformers}
                      onCheckedChange={(checked) => handleConstraintChange("preserveTopPerformers", checked)}
                    />
                    <Label htmlFor="preserve-top">Preserve Top Performers</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="focus-underperforming"
                      checked={constraints.focusUnderperforming}
                      onCheckedChange={(checked) => handleConstraintChange("focusUnderperforming", checked)}
                    />
                    <Label htmlFor="focus-underperforming">Reduce Underperforming Pools</Label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-end">
            <Button onClick={() => runOptimization()} disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Optimize Rewards
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {optimizationResult && (
          <Card>
            <CardHeader>
              <CardTitle>Optimization Summary</CardTitle>
              <CardDescription>Projected impact of optimized distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Total Emissions</div>
                  <div className="text-2xl font-bold">{formatNumber(optimizationResult.totalSuggestedEmissions)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Redistributed</div>
                  <div className="text-2xl font-bold">
                    {formatNumber(optimizationResult.summary.redistributedEmissions)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pools with increased rewards</span>
                  <span className="font-medium">{optimizationResult.summary.increasedPools}</span>
                </div>
                <Progress
                  value={(optimizationResult.summary.increasedPools / optimizationResult.pools.length) * 100}
                  className="h-1"
                />

                <div className="flex justify-between text-sm">
                  <span>Pools with decreased rewards</span>
                  <span className="font-medium">{optimizationResult.summary.decreasedPools}</span>
                </div>
                <Progress
                  value={(optimizationResult.summary.decreasedPools / optimizationResult.pools.length) * 100}
                  className="h-1"
                />
              </div>

              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Projected Impact</h4>
                <div className="space-y-3">
                  {[
                    {
                      label: "TVL",
                      value: optimizationResult.projectedImpact.tvl,
                      current: optimizationResult.pools.reduce((sum, p) => sum + p.impact.tvl, 0),
                    },
                    {
                      label: "Volume",
                      value: optimizationResult.projectedImpact.volume,
                      current: optimizationResult.pools.reduce((sum, p) => sum + p.impact.volume, 0),
                    },
                    {
                      label: "Users",
                      value: optimizationResult.projectedImpact.users,
                      current: optimizationResult.pools.reduce((sum, p) => sum + p.impact.users, 0),
                    },
                  ].map((metric) => {
                    const change = (metric.value / metric.current - 1) * 100
                    return (
                      <div key={metric.label} className="flex items-center justify-between">
                        <span className="text-sm">{metric.label}</span>
                        <div className="flex items-center">
                          <span className="font-medium mr-2">{formatNumber(metric.value)}</span>
                          <span className={`text-xs ${change >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {change >= 0 ? (
                              <ArrowUpRight className="h-3 w-3 inline" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 inline" />
                            )}
                            {formatPercent(change)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {optimizationResult && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Optimization Results</CardTitle>
              <CardDescription>
                Suggested reward distribution across {optimizationResult.pools.length} pools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]" onClick={() => handleSort("name")} role="button">
                        Pool Name
                        {sortConfig.key === "name" &&
                          (sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-4 w-4 inline ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 inline ml-1" />
                          ))}
                      </TableHead>
                      <TableHead onClick={() => handleSort("currentEmissions")} role="button">
                        Current
                        {sortConfig.key === "currentEmissions" &&
                          (sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-4 w-4 inline ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 inline ml-1" />
                          ))}
                      </TableHead>
                      <TableHead onClick={() => handleSort("suggestedEmissions")} role="button">
                        Suggested
                        {sortConfig.key === "suggestedEmissions" &&
                          (sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-4 w-4 inline ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 inline ml-1" />
                          ))}
                      </TableHead>
                      <TableHead onClick={() => handleSort("changePercent")} role="button">
                        Change
                        {sortConfig.key === "changePercent" &&
                          (sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-4 w-4 inline ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 inline ml-1" />
                          ))}
                      </TableHead>
                      <TableHead onClick={() => handleSort("score")} role="button">
                        Score
                        {sortConfig.key === "score" &&
                          (sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-4 w-4 inline ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 inline ml-1" />
                          ))}
                      </TableHead>
                      <TableHead onClick={() => handleSort("impact.tvl")} role="button">
                        Impact
                        {sortConfig.key === "impact.tvl" &&
                          (sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-4 w-4 inline ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 inline ml-1" />
                          ))}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedPools.slice(0, 10).map((pool, index) => (
                      <TableRow
                        key={pool.name}
                        className={selectedPoolIndex === index ? "bg-muted" : ""}
                        onClick={() => setSelectedPoolIndex(selectedPoolIndex === index ? null : index)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <span className="mr-2">{pool.name}</span>
                            <Badge variant="outline">{pool.feeTier}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>{formatNumber(pool.currentEmissions)}</TableCell>
                        <TableCell>{formatNumber(pool.suggestedEmissions)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {pool.change > 0 ? (
                              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                            ) : pool.change < 0 ? (
                              <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                            ) : (
                              <Minus className="h-4 w-4 mr-1" />
                            )}
                            <span
                              className={pool.change > 0 ? "text-green-500" : pool.change < 0 ? "text-red-500" : ""}
                            >
                              {formatPercent(pool.changePercent)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${Math.min(100, (pool.score / 10) * 100)}%` }}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-500">
                              {formatPercent((pool.impact.tvl / (pool.impact.tvl - pool.change) - 1) * 100)}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {sortedPools.length > 10 && (
                <div className="text-center text-sm text-muted-foreground mt-2">
                  Showing 10 of {sortedPools.length} pools. Export full results for complete data.
                </div>
              )}
            </CardContent>
          </Card>

          {selectedPool && (
            <Card>
              <CardHeader>
                <CardTitle>Pool Details: {selectedPool.name}</CardTitle>
                <CardDescription>Detailed analysis and optimization for this pool</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium mb-4">Reward Distribution</h4>
                    <ChartContainer
                      config={{
                        current: { label: "Current", color: "hsl(var(--chart-1))" },
                        suggested: { label: "Suggested", color: "hsl(var(--chart-2))" },
                      }}
                      className="h-[200px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            {
                              name: "Emissions",
                              current: selectedPool.currentEmissions,
                              suggested: selectedPool.suggestedEmissions,
                            },
                          ]}
                        >
                          <XAxis dataKey="name" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="current" fill="var(--color-current)" />
                          <Bar dataKey="suggested" fill="var(--color-suggested)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>

                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Emissions</span>
                        <span className="font-medium">{formatNumber(selectedPool.currentEmissions)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Suggested Emissions</span>
                        <span className="font-medium">{formatNumber(selectedPool.suggestedEmissions)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Change</span>
                        <span
                          className={`font-medium ${selectedPool.change > 0 ? "text-green-500" : selectedPool.change < 0 ? "text-red-500" : ""}`}
                        >
                          {selectedPool.change > 0 ? "+" : ""}
                          {formatNumber(selectedPool.change)} ({formatPercent(selectedPool.changePercent)})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-4">Projected Impact</h4>
                    <ChartContainer
                      config={{
                        tvl: { label: "TVL", color: "hsl(var(--chart-1))" },
                        volume: { label: "Volume", color: "hsl(var(--chart-2))" },
                        users: { label: "Users", color: "hsl(var(--chart-3))" },
                      }}
                      className="h-[200px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            {
                              name: "Current",
                              tvl:
                                selectedPool.impact.tvl -
                                (selectedPool.impact.tvl * selectedPool.change) / selectedPool.currentEmissions,
                              volume:
                                selectedPool.impact.volume -
                                (selectedPool.impact.volume * selectedPool.change) / selectedPool.currentEmissions,
                              users:
                                selectedPool.impact.users -
                                (selectedPool.impact.users * selectedPool.change) / selectedPool.currentEmissions,
                            },
                            {
                              name: "Projected",
                              tvl: selectedPool.impact.tvl,
                              volume: selectedPool.impact.volume,
                              users: selectedPool.impact.users,
                            },
                          ]}
                        >
                          <XAxis dataKey="name" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line type="monotone" dataKey="tvl" stroke="var(--color-tvl)" strokeWidth={2} />
                          <Line type="monotone" dataKey="volume" stroke="var(--color-volume)" strokeWidth={2} />
                          <Line type="monotone" dataKey="users" stroke="var(--color-users)" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>

                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Pool Score</span>
                        <span className="font-medium">{selectedPool.score.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Fee Tier</span>
                        <span className="font-medium">{selectedPool.feeTier}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Reward Tokens</span>
                        <div>
                          {selectedPool.rewardTokens.map((token, i) => (
                            <Badge key={i} variant="secondary" className="mr-1">
                              {token}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Strategy Comparison</CardTitle>
              <CardDescription>Compare different optimization strategies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <ChartContainer
                  config={{
                    tvl: { label: "TVL Impact", color: "hsl(var(--chart-1))" },
                    volume: { label: "Volume Impact", color: "hsl(var(--chart-2))" },
                    users: { label: "User Impact", color: "hsl(var(--chart-3))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: "Current Strategy",
                          tvl: 100,
                          volume: 100,
                          users: 100,
                        },
                        {
                          name: "Optimized (Balanced)",
                          tvl:
                            (optimizationResult.projectedImpact.tvl /
                              optimizationResult.pools.reduce((sum, p) => sum + (p.impact.tvl - p.change), 0)) *
                            100,
                          volume:
                            (optimizationResult.projectedImpact.volume /
                              optimizationResult.pools.reduce((sum, p) => sum + (p.impact.volume - p.change), 0)) *
                            100,
                          users:
                            (optimizationResult.projectedImpact.users /
                              optimizationResult.pools.reduce((sum, p) => sum + (p.impact.users - p.change), 0)) *
                            100,
                        },
                        ...comparisonResults.map((result, index) => ({
                          name: index === 0 ? "TVL Focused" : index === 1 ? "User Focused" : "Aggressive Balanced",
                          tvl:
                            (result.projectedImpact.tvl /
                              optimizationResult.pools.reduce((sum, p) => sum + (p.impact.tvl - p.change), 0)) *
                            100,
                          volume:
                            (result.projectedImpact.volume /
                              optimizationResult.pools.reduce((sum, p) => sum + (p.impact.volume - p.change), 0)) *
                            100,
                          users:
                            (result.projectedImpact.users /
                              optimizationResult.pools.reduce((sum, p) => sum + (p.impact.users - p.change), 0)) *
                            100,
                        })),
                      ]}
                    >
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, "dataMax + 10"]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="tvl" fill="var(--color-tvl)" />
                      <Bar dataKey="volume" fill="var(--color-volume)" />
                      <Bar dataKey="users" fill="var(--color-users)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>

                <div className="grid gap-4 md:grid-cols-4">
                  {[
                    { name: "Current Strategy", description: "Baseline performance" },
                    { name: "Optimized (Balanced)", description: "Your configured strategy" },
                    { name: "TVL Focused", description: "Prioritizes liquidity depth" },
                    { name: "User Focused", description: "Prioritizes user acquisition" },
                    { name: "Aggressive Balanced", description: "Balanced with larger changes" },
                  ].map((strategy) => (
                    <Card key={strategy.name} className="overflow-hidden">
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">{strategy.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-xs text-muted-foreground">{strategy.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" className="ml-auto">
                <Download className="h-4 w-4 mr-2" />
                Export Comparison
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  )
}
