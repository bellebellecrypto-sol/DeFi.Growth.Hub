"use client"

import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Plus,
  Trash2,
  Play,
  Save,
  Eye,
  Code,
  Settings,
  Zap,
  Target,
  Filter,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type {
  CustomEventDefinition,
  EventTrigger,
  EventProperty,
  EventCondition,
  EventAction,
  TriggerType,
  PropertyType,
  PropertySource,
  ConditionType,
  ConditionOperator,
  ActionType,
  EventTemplate,
  EventValidationResult,
} from "./custom-events-types"

interface CustomEventBuilderProps {
  onSave: (event: CustomEventDefinition) => void
  onTest: (event: CustomEventDefinition) => void
  onExport: (events: CustomEventDefinition[]) => void
  onImport: (events: CustomEventDefinition[]) => void
  initialEvent?: CustomEventDefinition
  templates?: EventTemplate[]
  className?: string
}

export function CustomEventBuilder({
  onSave,
  onTest,
  onExport,
  onImport,
  initialEvent,
  templates = [],
  className,
}: CustomEventBuilderProps) {
  const [event, setEvent] = useState<CustomEventDefinition>(
    initialEvent || {
      id: "",
      name: "",
      displayName: "",
      description: "",
      category: "custom",
      enabled: true,
      triggers: [],
      properties: [],
      conditions: [],
      actions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "user",
      version: 1,
    },
  )

  const [activeTab, setActiveTab] = useState("basic")
  const [validation, setValidation] = useState<EventValidationResult>({
    isValid: true,
    errors: [],
    warnings: [],
  })
  const [showPreview, setShowPreview] = useState(false)

  // Validate the event configuration
  const validateEvent = useCallback((eventData: CustomEventDefinition): EventValidationResult => {
    const errors: any[] = []
    const warnings: any[] = []

    // Basic validation
    if (!eventData.name.trim()) {
      errors.push({ field: "name", message: "Event name is required", code: "REQUIRED" })
    }

    if (!eventData.displayName.trim()) {
      errors.push({ field: "displayName", message: "Display name is required", code: "REQUIRED" })
    }

    if (eventData.triggers.length === 0) {
      errors.push({ field: "triggers", message: "At least one trigger is required", code: "REQUIRED" })
    }

    // Validate triggers
    eventData.triggers.forEach((trigger, index) => {
      if (!trigger.type) {
        errors.push({
          field: `triggers.${index}.type`,
          message: "Trigger type is required",
          code: "REQUIRED",
        })
      }

      if (trigger.type === TriggerType.CLICK && !trigger.selector) {
        errors.push({
          field: `triggers.${index}.selector`,
          message: "Selector is required for click triggers",
          code: "REQUIRED",
        })
      }
    })

    // Validate properties
    eventData.properties.forEach((property, index) => {
      if (!property.name.trim()) {
        errors.push({
          field: `properties.${index}.name`,
          message: "Property name is required",
          code: "REQUIRED",
        })
      }

      if (!property.type) {
        errors.push({
          field: `properties.${index}.type`,
          message: "Property type is required",
          code: "REQUIRED",
        })
      }
    })

    // Validate conditions
    eventData.conditions.forEach((condition, index) => {
      if (!condition.property) {
        errors.push({
          field: `conditions.${index}.property`,
          message: "Condition property is required",
          code: "REQUIRED",
        })
      }

      if (!condition.operator) {
        errors.push({
          field: `conditions.${index}.operator`,
          message: "Condition operator is required",
          code: "REQUIRED",
        })
      }
    })

    // Warnings
    if (eventData.properties.length === 0) {
      warnings.push({
        field: "properties",
        message: "Consider adding properties to capture additional data",
        code: "SUGGESTION",
      })
    }

    if (eventData.actions.length === 0) {
      warnings.push({
        field: "actions",
        message: "Consider adding actions to respond to this event",
        code: "SUGGESTION",
      })
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }, [])

  // Update event and validate
  const updateEvent = useCallback(
    (updates: Partial<CustomEventDefinition>) => {
      const updatedEvent = { ...event, ...updates, updatedAt: new Date().toISOString() }
      setEvent(updatedEvent)
      setValidation(validateEvent(updatedEvent))
    },
    [event, validateEvent],
  )

  // Add new trigger
  const addTrigger = useCallback(() => {
    const newTrigger: EventTrigger = {
      id: `trigger_${Date.now()}`,
      type: TriggerType.CLICK,
      element: "",
      selector: "",
    }
    updateEvent({ triggers: [...event.triggers, newTrigger] })
  }, [event.triggers, updateEvent])

  // Update trigger
  const updateTrigger = useCallback(
    (index: number, updates: Partial<EventTrigger>) => {
      const updatedTriggers = [...event.triggers]
      updatedTriggers[index] = { ...updatedTriggers[index], ...updates }
      updateEvent({ triggers: updatedTriggers })
    },
    [event.triggers, updateEvent],
  )

  // Remove trigger
  const removeTrigger = useCallback(
    (index: number) => {
      const updatedTriggers = event.triggers.filter((_, i) => i !== index)
      updateEvent({ triggers: updatedTriggers })
    },
    [event.triggers, updateEvent],
  )

  // Add new property
  const addProperty = useCallback(() => {
    const newProperty: EventProperty = {
      id: `property_${Date.now()}`,
      name: "",
      displayName: "",
      type: PropertyType.STRING,
      required: false,
      source: PropertySource.USER_INPUT,
    }
    updateEvent({ properties: [...event.properties, newProperty] })
  }, [event.properties, updateEvent])

  // Update property
  const updateProperty = useCallback(
    (index: number, updates: Partial<EventProperty>) => {
      const updatedProperties = [...event.properties]
      updatedProperties[index] = { ...updatedProperties[index], ...updates }
      updateEvent({ properties: updatedProperties })
    },
    [event.properties, updateEvent],
  )

  // Remove property
  const removeProperty = useCallback(
    (index: number) => {
      const updatedProperties = event.properties.filter((_, i) => i !== index)
      updateEvent({ properties: updatedProperties })
    },
    [event.properties, updateEvent],
  )

  // Add new condition
  const addCondition = useCallback(() => {
    const newCondition: EventCondition = {
      id: `condition_${Date.now()}`,
      type: ConditionType.PROPERTY,
      property: "",
      operator: ConditionOperator.EQUALS,
      value: "",
    }
    updateEvent({ conditions: [...event.conditions, newCondition] })
  }, [event.conditions, updateEvent])

  // Update condition
  const updateCondition = useCallback(
    (index: number, updates: Partial<EventCondition>) => {
      const updatedConditions = [...event.conditions]
      updatedConditions[index] = { ...updatedConditions[index], ...updates }
      updateEvent({ conditions: updatedConditions })
    },
    [event.conditions, updateEvent],
  )

  // Remove condition
  const removeCondition = useCallback(
    (index: number) => {
      const updatedConditions = event.conditions.filter((_, i) => i !== index)
      updateEvent({ conditions: updatedConditions })
    },
    [event.conditions, updateEvent],
  )

  // Add new action
  const addAction = useCallback(() => {
    const newAction: EventAction = {
      id: `action_${Date.now()}`,
      type: ActionType.TRACK_EVENT,
      config: {},
      enabled: true,
    }
    updateEvent({ actions: [...event.actions, newAction] })
  }, [event.actions, updateEvent])

  // Update action
  const updateAction = useCallback(
    (index: number, updates: Partial<EventAction>) => {
      const updatedActions = [...event.actions]
      updatedActions[index] = { ...updatedActions[index], ...updates }
      updateEvent({ actions: updatedActions })
    },
    [event.actions, updateEvent],
  )

  // Remove action
  const removeAction = useCallback(
    (index: number) => {
      const updatedActions = event.actions.filter((_, i) => i !== index)
      updateEvent({ actions: updatedActions })
    },
    [event.actions, updateEvent],
  )

  // Load template
  const loadTemplate = useCallback(
    (template: EventTemplate) => {
      const templateEvent: CustomEventDefinition = {
        ...event,
        ...template.template,
        id: `${template.id}_${Date.now()}`,
        name: template.name,
        displayName: template.name,
        description: template.description,
        category: template.category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setEvent(templateEvent)
      setValidation(validateEvent(templateEvent))
    },
    [event, validateEvent],
  )

  // Generate event code
  const generateCode = useMemo(() => {
    return `// Custom Event: ${event.displayName}
// Generated on: ${new Date().toISOString()}

const customEvent = {
  name: "${event.name}",
  displayName: "${event.displayName}",
  description: "${event.description}",
  category: "${event.category}",
  
  // Triggers
  triggers: ${JSON.stringify(event.triggers, null, 2)},
  
  // Properties
  properties: ${JSON.stringify(event.properties, null, 2)},
  
  // Conditions
  conditions: ${JSON.stringify(event.conditions, null, 2)},
  
  // Actions
  actions: ${JSON.stringify(event.actions, null, 2)}
};

// Usage example:
analytics.defineCustomEvent(customEvent);`
  }, [event])

  // Render basic configuration
  const renderBasicConfig = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="event-name">Event Name *</Label>
          <Input
            id="event-name"
            value={event.name}
            onChange={(e) => updateEvent({ name: e.target.value })}
            placeholder="e.g., button_click"
            className={validation.errors.some((e) => e.field === "name") ? "border-red-500" : ""}
          />
          {validation.errors
            .filter((e) => e.field === "name")
            .map((error, i) => (
              <p key={i} className="text-sm text-red-500">
                {error.message}
              </p>
            ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="display-name">Display Name *</Label>
          <Input
            id="display-name"
            value={event.displayName}
            onChange={(e) => updateEvent({ displayName: e.target.value })}
            placeholder="e.g., Button Click"
            className={validation.errors.some((e) => e.field === "displayName") ? "border-red-500" : ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={event.category} onValueChange={(value) => updateEvent({ category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user_interaction">User Interaction</SelectItem>
              <SelectItem value="navigation">Navigation</SelectItem>
              <SelectItem value="conversion">Conversion</SelectItem>
              <SelectItem value="engagement">Engagement</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="enabled" checked={event.enabled} onCheckedChange={(enabled) => updateEvent({ enabled })} />
          <Label htmlFor="enabled">Enabled</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={event.description}
          onChange={(e) => updateEvent({ description: e.target.value })}
          placeholder="Describe what this event tracks..."
          rows={3}
        />
      </div>

      {templates.length > 0 && (
        <div className="space-y-4">
          <Separator />
          <div>
            <h4 className="text-sm font-medium mb-3">Quick Start Templates</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {templates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4" onClick={() => loadTemplate(template)}>
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{template.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium truncate">{template.name}</h5>
                        <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {template.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // Render triggers configuration
  const renderTriggersConfig = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Event Triggers</h3>
          <p className="text-sm text-muted-foreground">Define when this event should be fired</p>
        </div>
        <Button onClick={addTrigger} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Trigger
        </Button>
      </div>

      {event.triggers.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Target className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No triggers defined</p>
            <p className="text-sm text-muted-foreground">Add a trigger to specify when this event should fire</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {event.triggers.map((trigger, index) => (
            <Card key={trigger.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Trigger {index + 1}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => removeTrigger(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Trigger Type</Label>
                    <Select
                      value={trigger.type}
                      onValueChange={(value) => updateTrigger(index, { type: value as TriggerType })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TriggerType.CLICK}>Click</SelectItem>
                        <SelectItem value={TriggerType.HOVER}>Hover</SelectItem>
                        <SelectItem value={TriggerType.SCROLL}>Scroll</SelectItem>
                        <SelectItem value={TriggerType.TIME_BASED}>Time Based</SelectItem>
                        <SelectItem value={TriggerType.PAGE_LOAD}>Page Load</SelectItem>
                        <SelectItem value={TriggerType.FORM_SUBMIT}>Form Submit</SelectItem>
                        <SelectItem value={TriggerType.CUSTOM_EVENT}>Custom Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(trigger.type === TriggerType.CLICK || trigger.type === TriggerType.HOVER) && (
                    <div className="space-y-2">
                      <Label>CSS Selector</Label>
                      <Input
                        value={trigger.selector || ""}
                        onChange={(e) => updateTrigger(index, { selector: e.target.value })}
                        placeholder="e.g., .button, #submit-btn"
                      />
                    </div>
                  )}

                  {trigger.type === TriggerType.TIME_BASED && (
                    <div className="space-y-2">
                      <Label>Delay (ms)</Label>
                      <Input
                        type="number"
                        value={trigger.delay || 0}
                        onChange={(e) => updateTrigger(index, { delay: Number.parseInt(e.target.value) })}
                        placeholder="5000"
                      />
                    </div>
                  )}

                  {trigger.type === TriggerType.CUSTOM_EVENT && (
                    <div className="space-y-2">
                      <Label>Event Name</Label>
                      <Input
                        value={trigger.event || ""}
                        onChange={(e) => updateTrigger(index, { event: e.target.value })}
                        placeholder="customEventName"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  // Render properties configuration
  const renderPropertiesConfig = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Event Properties</h3>
          <p className="text-sm text-muted-foreground">Define data to capture when the event fires</p>
        </div>
        <Button onClick={addProperty} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      {event.properties.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Settings className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No properties defined</p>
            <p className="text-sm text-muted-foreground">Add properties to capture additional event data</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {event.properties.map((property, index) => (
            <Card key={property.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Property {index + 1}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => removeProperty(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Property Name</Label>
                    <Input
                      value={property.name}
                      onChange={(e) => updateProperty(index, { name: e.target.value })}
                      placeholder="e.g., button_text"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Display Name</Label>
                    <Input
                      value={property.displayName}
                      onChange={(e) => updateProperty(index, { displayName: e.target.value })}
                      placeholder="e.g., Button Text"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={property.type}
                      onValueChange={(value) => updateProperty(index, { type: value as PropertyType })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={PropertyType.STRING}>String</SelectItem>
                        <SelectItem value={PropertyType.NUMBER}>Number</SelectItem>
                        <SelectItem value={PropertyType.BOOLEAN}>Boolean</SelectItem>
                        <SelectItem value={PropertyType.DATE}>Date</SelectItem>
                        <SelectItem value={PropertyType.URL}>URL</SelectItem>
                        <SelectItem value={PropertyType.EMAIL}>Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Source</Label>
                    <Select
                      value={property.source}
                      onValueChange={(value) => updateProperty(index, { source: value as PropertySource })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={PropertySource.USER_INPUT}>User Input</SelectItem>
                        <SelectItem value={PropertySource.DOM_ELEMENT}>DOM Element</SelectItem>
                        <SelectItem value={PropertySource.LOCAL_STORAGE}>Local Storage</SelectItem>
                        <SelectItem value={PropertySource.URL_PARAM}>URL Parameter</SelectItem>
                        <SelectItem value={PropertySource.TIMESTAMP}>Timestamp</SelectItem>
                        <SelectItem value={PropertySource.USER_AGENT}>User Agent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`required-${index}`}
                      checked={property.required}
                      onCheckedChange={(required) => updateProperty(index, { required })}
                    />
                    <Label htmlFor={`required-${index}`}>Required</Label>
                  </div>

                  <div className="space-y-2">
                    <Label>Default Value</Label>
                    <Input
                      value={property.defaultValue || ""}
                      onChange={(e) => updateProperty(index, { defaultValue: e.target.value })}
                      placeholder="Optional default value"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  // Render conditions configuration
  const renderConditionsConfig = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Event Conditions</h3>
          <p className="text-sm text-muted-foreground">Define when this event should be tracked</p>
        </div>
        <Button onClick={addCondition} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Condition
        </Button>
      </div>

      {event.conditions.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Filter className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No conditions defined</p>
            <p className="text-sm text-muted-foreground">Add conditions to control when events are tracked</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {event.conditions.map((condition, index) => (
            <Card key={condition.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Condition {index + 1}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => removeCondition(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={condition.type}
                      onValueChange={(value) => updateCondition(index, { type: value as ConditionType })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ConditionType.PROPERTY}>Property</SelectItem>
                        <SelectItem value={ConditionType.USER}>User</SelectItem>
                        <SelectItem value={ConditionType.SESSION}>Session</SelectItem>
                        <SelectItem value={ConditionType.TIME}>Time</SelectItem>
                        <SelectItem value={ConditionType.DEVICE}>Device</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Property</Label>
                    <Input
                      value={condition.property}
                      onChange={(e) => updateCondition(index, { property: e.target.value })}
                      placeholder="e.g., user.role"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Operator</Label>
                    <Select
                      value={condition.operator}
                      onValueChange={(value) => updateCondition(index, { operator: value as ConditionOperator })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ConditionOperator.EQUALS}>Equals</SelectItem>
                        <SelectItem value={ConditionOperator.NOT_EQUALS}>Not Equals</SelectItem>
                        <SelectItem value={ConditionOperator.GREATER_THAN}>Greater Than</SelectItem>
                        <SelectItem value={ConditionOperator.LESS_THAN}>Less Than</SelectItem>
                        <SelectItem value={ConditionOperator.CONTAINS}>Contains</SelectItem>
                        <SelectItem value={ConditionOperator.NOT_CONTAINS}>Not Contains</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Value</Label>
                    <Input
                      value={condition.value}
                      onChange={(e) => updateCondition(index, { value: e.target.value })}
                      placeholder="Comparison value"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  // Render actions configuration
  const renderActionsConfig = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Event Actions</h3>
          <p className="text-sm text-muted-foreground">Define what happens when this event is triggered</p>
        </div>
        <Button onClick={addAction} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Action
        </Button>
      </div>

      {event.actions.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Zap className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No actions defined</p>
            <p className="text-sm text-muted-foreground">Add actions to specify what happens when the event fires</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {event.actions.map((action, index) => (
            <Card key={action.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Action {index + 1}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Switch checked={action.enabled} onCheckedChange={(enabled) => updateAction(index, { enabled })} />
                    <Button variant="ghost" size="sm" onClick={() => removeAction(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Action Type</Label>
                  <Select
                    value={action.type}
                    onValueChange={(value) => updateAction(index, { type: value as ActionType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ActionType.TRACK_EVENT}>Track Event</SelectItem>
                      <SelectItem value={ActionType.SET_PROPERTY}>Set Property</SelectItem>
                      <SelectItem value={ActionType.SEND_NOTIFICATION}>Send Notification</SelectItem>
                      <SelectItem value={ActionType.SHOW_MODAL}>Show Modal</SelectItem>
                      <SelectItem value={ActionType.CUSTOM_FUNCTION}>Custom Function</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {action.type === ActionType.TRACK_EVENT && (
                  <div className="space-y-2">
                    <Label>Event Name</Label>
                    <Input
                      value={action.config.eventName || ""}
                      onChange={(e) => updateAction(index, { config: { ...action.config, eventName: e.target.value } })}
                      placeholder="custom_event_name"
                    />
                  </div>
                )}

                {action.type === ActionType.SEND_NOTIFICATION && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={action.config.title || ""}
                        onChange={(e) => updateAction(index, { config: { ...action.config, title: e.target.value } })}
                        placeholder="Notification title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Message</Label>
                      <Input
                        value={action.config.message || ""}
                        onChange={(e) => updateAction(index, { config: { ...action.config, message: e.target.value } })}
                        placeholder="Notification message"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  // Render preview
  const renderPreview = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Event Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Event Name</Label>
                <p className="text-sm text-muted-foreground">{event.name || "Not set"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Display Name</Label>
                <p className="text-sm text-muted-foreground">{event.displayName || "Not set"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Category</Label>
                <p className="text-sm text-muted-foreground">{event.category}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <Badge variant={event.enabled ? "default" : "secondary"}>
                  {event.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-sm font-medium">Description</Label>
              <p className="text-sm text-muted-foreground">{event.description || "No description provided"}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">Triggers</Label>
                <p className="text-2xl font-bold">{event.triggers.length}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Properties</Label>
                <p className="text-2xl font-bold">{event.properties.length}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Conditions</Label>
                <p className="text-2xl font-bold">{event.conditions.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Generated Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <pre className="text-sm bg-muted p-4 rounded-md overflow-x-auto">
              <code>{generateCode}</code>
            </pre>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )

  // Render validation status
  const renderValidationStatus = () => {
    if (validation.errors.length === 0 && validation.warnings.length === 0) {
      return (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">Event configuration is valid</span>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {validation.errors.map((error, index) => (
          <div key={index} className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">{error.message}</span>
          </div>
        ))}
        {validation.warnings.map((warning, index) => (
          <div key={index} className="flex items-center gap-2 text-yellow-600">
            <Info className="h-4 w-4" />
            <span className="text-sm">{warning.message}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Custom Event Builder</h2>
          <p className="text-muted-foreground">Create and configure custom analytics events</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? "Hide" : "Show"} Preview
          </Button>
          <Button variant="outline" onClick={() => onTest(event)} disabled={!validation.isValid}>
            <Play className="h-4 w-4 mr-2" />
            Test Event
          </Button>
          <Button onClick={() => onSave(event)} disabled={!validation.isValid}>
            <Save className="h-4 w-4 mr-2" />
            Save Event
          </Button>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">{renderValidationStatus()}</div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="triggers">Triggers</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="conditions">Conditions</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">{renderBasicConfig()}</TabsContent>
            <TabsContent value="triggers">{renderTriggersConfig()}</TabsContent>
            <TabsContent value="properties">{renderPropertiesConfig()}</TabsContent>
            <TabsContent value="conditions">{renderConditionsConfig()}</TabsContent>
            <TabsContent value="actions">{renderActionsConfig()}</TabsContent>
          </Tabs>
        </div>

        {showPreview && <div className="lg:col-span-1">{renderPreview()}</div>}
      </div>
    </div>
  )
}
