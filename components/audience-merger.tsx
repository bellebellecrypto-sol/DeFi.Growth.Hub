"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Merge, Users, ArrowRight, Plus } from "lucide-react"

interface Segment {
  id: string
  name: string
  recipientCount: number
  totalAllocation: number
  createdDate: string
}

interface AudienceMergerProps {
  audiences: Segment[]
  onMerge: (sourceIds: string[], targetName: string, mergeStrategy: string) => void
}

export function AudienceMerger({ audiences, onMerge }: AudienceMergerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedSegments, setSelectedSegments] = useState<string[]>([])
  const [newSegmentName, setNewSegmentName] = useState("")
  const [mergeStrategy, setMergeStrategy] = useState<string>("sum")

  const handleSegmentSelect = (segmentId: string) => {
    if (selectedSegments.includes(segmentId)) {
      setSelectedSegments(selectedSegments.filter((id) => id !== segmentId))
    } else if (selectedSegments.length < 2) {
      setSelectedSegments([...selectedSegments, segmentId])
    }
  }

  const handleMerge = () => {
    if (selectedSegments.length === 2 && newSegmentName.trim()) {
      onMerge(selectedSegments, newSegmentName, mergeStrategy)
      setSelectedSegments([])
      setNewSegmentName("")
      setIsDialogOpen(false)
    }
  }

  const getSelectedSegmentData = () => {
    return selectedSegments.map((id) => audiences.find((a) => a.id === id)!).filter(Boolean)
  }

  const calculateMergePreview = () => {
    const selectedData = getSelectedSegmentData()
    if (selectedData.length !== 2) return null

    const totalRecipients = selectedData.reduce((sum, a) => sum + a.recipientCount, 0)
    const totalAllocation = selectedData.reduce((sum, a) => sum + a.totalAllocation, 0)

    return {
      estimatedRecipients: totalRecipients, // This would be less if there are duplicate wallets
      totalAllocation,
      segments: selectedData,
    }
  }

  const mergePreview = calculateMergePreview()

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Merge className="h-4 w-4" />
          Merge Audiences
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Merge className="h-5 w-5" />
            Merge Audiences
          </DialogTitle>
          <DialogDescription>
            Combine two existing audiences into a new audience. Duplicate wallets will be handled according to your
            merge strategy.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Segment Selection */}
          <div>
            <Label className="text-base font-medium">Select Audiences to Merge</Label>
            <p className="text-sm text-muted-foreground mb-3">Choose exactly 2 audiences to merge</p>
            <div className="grid gap-3 max-h-60 overflow-y-auto">
              {audiences.map((segment) => (
                <Card
                  key={segment.id}
                  className={`cursor-pointer transition-colors ${
                    selectedSegments.includes(segment.id) ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
                  } ${selectedSegments.length === 2 && !selectedSegments.includes(segment.id) ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => handleSegmentSelect(segment.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">{segment.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {segment.recipientCount} recipients • {segment.totalAllocation} total allocation
                          </p>
                        </div>
                      </div>
                      {selectedSegments.includes(segment.id) && <Badge>Selected</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Merge Preview */}
          {mergePreview && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Merge Preview</Label>
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{mergePreview.segments[0].name}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {mergePreview.segments[0].recipientCount} recipients
                  </span>
                </div>
                <Plus className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{mergePreview.segments[1].name}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {mergePreview.segments[1].recipientCount} recipients
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-2">
                  <Badge>New Audience</Badge>
                  <span className="text-sm text-muted-foreground">~{mergePreview.estimatedRecipients} recipients</span>
                </div>
              </div>
            </div>
          )}

          {/* New Segment Name */}
          <div>
            <Label htmlFor="segment-name">New Audience Name</Label>
            <Input
              id="segment-name"
              placeholder="Enter name for merged audience"
              value={newSegmentName}
              onChange={(e) => setNewSegmentName(e.target.value)}
            />
          </div>

          {/* Merge Strategy */}
          <div>
            <Label htmlFor="merge-strategy">Duplicate Handling Strategy</Label>
            <Select value={mergeStrategy} onValueChange={setMergeStrategy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sum">Sum Allocations - Add allocations together for duplicate wallets</SelectItem>
                <SelectItem value="max">Maximum Allocation - Keep the highest allocation for duplicates</SelectItem>
                <SelectItem value="first">First Occurrence - Keep allocation from first audience</SelectItem>
                <SelectItem value="average">Average Allocation - Use average of allocations for duplicates</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedSegments.length === 2 && (
            <Alert>
              <AlertDescription>
                The merge will create a new audience. Original audiences will remain unchanged.
                {mergeStrategy === "sum" && " Duplicate wallets will have their allocations added together."}
                {mergeStrategy === "max" && " Duplicate wallets will keep their highest allocation."}
                {mergeStrategy === "first" &&
                  " Duplicate wallets will keep the allocation from the first selected audience."}
                {mergeStrategy === "average" && " Duplicate wallets will receive the average of their allocations."}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleMerge}
            disabled={selectedSegments.length !== 2 || !newSegmentName.trim()}
            className="gap-2"
          >
            <Merge className="h-4 w-4" />
            Merge Audiences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
