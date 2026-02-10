"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Play,
  Pause,
  Download,
  Upload,
  Eye,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CustomEventBuilder } from "./custom-event-builder"
import { eventTemplates } from "./event-templates"
import type { CustomEventDefinition } from "./custom-events-types"

interface CustomEventsManagerProps {
  events: CustomEventDefinition[]
  onEventCreate: (event: CustomEventDefinition) => void
  onEventUpdate: (event: CustomEventDefinition) => void
  onEventDelete: (eventId: string) => void
  onEventTest: (event: CustomEventDefinition) => void
  onEventsExport: (events: CustomEventDefinition[]) => void
  onEventsImport: (events: CustomEventDefinition[]) => void
  className?: string
}

export function CustomEventsManager({
  events,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  onEventTest,
  onEventsExport,
  onEventsImport,
  className,
}: CustomEventsManagerProps) {
  const [activeTab, setActiveTab] = useState("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedEvent, setSelectedEvent] = useState<CustomEventDefinition | null>(null)
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null)

  // Filter events based on search and filters
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter

    const matchesStatus = statusFilter === "all" || (statusFilter === "enabled" ? event.enabled : !event.enabled)

    return matchesSearch && matchesCategory && matchesStatus
  })

  // Get unique categories
  const categories = Array.from(new Set(events.map((event) => event.category)))

  // Handle event creation
  const handleEventCreate = useCallback(
    (event: CustomEventDefinition) => {
      const newEvent = {
        ...event,
        id: `event_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      onEventCreate(newEvent)
      setActiveTab("list")
    },
    [onEventCreate],
  )

  // Handle event update
  const handleEventUpdate = useCallback(
    (event: CustomEventDefinition) => {
      onEventUpdate(event)
      setSelectedEvent(null)
      setActiveTab("list")
    },
    [onEventUpdate],
  )

  // Handle event duplication
  const handleEventDuplicate = useCallback(
    (event: CustomEventDefinition) => {
      const duplicatedEvent = {
        ...event,
        id: `event_${Date.now()}`,
        name: `${event.name}_copy`,
        displayName: `${event.displayName} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      }
      onEventCreate(duplicatedEvent)
    },
    [onEventCreate],
  )

  // Handle event status toggle
  const handleEventToggle = useCallback(
    (event: CustomEventDefinition) => {
      const updatedEvent = {
        ...event,
        enabled: !event.enabled,
        updatedAt: new Date().toISOString(),
      }
      onEventUpdate(updatedEvent)
    },
    [onEventUpdate],
  )

  // Handle file import
  const handleFileImport = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedEvents = JSON.parse(e.target?.result as string)
          onEventsImport(importedEvents)
        } catch (error) {
          console.error("Failed to import events:", error)
        }
      }
      reader.readAsText(file)
    },
    [onEventsImport],
  )

  // Render event list
  const renderEventList = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="enabled">Enabled</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => onEventsExport(events)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>

          <Button onClick={() => setActiveTab("create")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No events found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {events.length === 0
                ? "Get started by creating your first custom event"
                : "Try adjusting your search or filters"}
            </p>
            {events.length === 0 && (
              <Button onClick={() => setActiveTab("create")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Event
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{event.displayName}</CardTitle>
                    <p className="text-sm text-muted-foreground truncate">{event.name}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedEvent(event)
                          setActiveTab("edit")
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEventDuplicate(event)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEventTest(event)}>
                        <Play className="h-4 w-4 mr-2" />
                        Test
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEventToggle(event)}>
                        {event.enabled ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Disable
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Enable
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteEventId(event.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>

                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {event.category.replace(/_/g, " ")}
                  </Badge>
                  <Badge variant={event.enabled ? "default" : "secondary"} className="text-xs">
                    {event.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div className="text-center">
                    <div className="font-medium">{event.triggers.length}</div>
                    <div>Triggers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{event.properties.length}</div>
                    <div>Properties</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{event.actions.length}</div>
                    <div>Actions</div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  Updated {new Date(event.updatedAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Custom Events</h2>
          <p className="text-muted-foreground">Create and manage custom analytics events</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">{events.length} events</Badge>
          <Badge variant="default">{events.filter((e) => e.enabled).length} active</Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">
            <Eye className="h-4 w-4 mr-2" />
            Event List
          </TabsTrigger>
          <TabsTrigger value="create">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </TabsTrigger>
          {selectedEvent && (
            <TabsTrigger value="edit">
              <Edit className="h-4 w-4 mr-2" />
              Edit Event
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="list">{renderEventList()}</TabsContent>

        <TabsContent value="create">
          <CustomEventBuilder
            onSave={handleEventCreate}
            onTest={onEventTest}
            onExport={onEventsExport}
            onImport={onEventsImport}
            templates={eventTemplates}
          />
        </TabsContent>

        {selectedEvent && (
          <TabsContent value="edit">
            <CustomEventBuilder
              initialEvent={selectedEvent}
              onSave={handleEventUpdate}
              onTest={onEventTest}
              onExport={onEventsExport}
              onImport={onEventsImport}
              templates={eventTemplates}
            />
          </TabsContent>
        )}
      </Tabs>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteEventId} onOpenChange={() => setDeleteEventId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this custom event? This action cannot be undone and will stop all tracking
              for this event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteEventId) {
                  onEventDelete(deleteEventId)
                  setDeleteEventId(null)
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
