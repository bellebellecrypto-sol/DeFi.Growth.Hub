export interface CustomEventDefinition {
  id: string
  name: string
  displayName: string
  description: string
  category: string
  enabled: boolean
  triggers: EventTrigger[]
  properties: EventProperty[]
  conditions: EventCondition[]
  actions: EventAction[]
  createdAt: string
  updatedAt: string
  createdBy: string
  version: number
}

export interface EventTrigger {
  id: string
  type: TriggerType
  element?: string
  event?: string
  selector?: string
  url?: string
  delay?: number
  frequency?: TriggerFrequency
  conditions?: TriggerCondition[]
}

export interface EventProperty {
  id: string
  name: string
  displayName: string
  type: PropertyType
  required: boolean
  defaultValue?: any
  validation?: PropertyValidation
  source: PropertySource
  transform?: PropertyTransform
}

export interface EventCondition {
  id: string
  type: ConditionType
  property: string
  operator: ConditionOperator
  value: any
  logicalOperator?: LogicalOperator
}

export interface EventAction {
  id: string
  type: ActionType
  config: Record<string, any>
  enabled: boolean
}

export enum TriggerType {
  CLICK = "click",
  HOVER = "hover",
  SCROLL = "scroll",
  TIME_BASED = "time_based",
  PAGE_LOAD = "page_load",
  FORM_SUBMIT = "form_submit",
  CUSTOM_EVENT = "custom_event",
  API_CALL = "api_call",
  USER_ACTION = "user_action",
}

export enum TriggerFrequency {
  ONCE = "once",
  EVERY_TIME = "every_time",
  ONCE_PER_SESSION = "once_per_session",
  ONCE_PER_DAY = "once_per_day",
  THROTTLED = "throttled",
}

export interface TriggerCondition {
  property: string
  operator: ConditionOperator
  value: any
}

export enum PropertyType {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
  DATE = "date",
  OBJECT = "object",
  ARRAY = "array",
  URL = "url",
  EMAIL = "email",
}

export enum PropertySource {
  USER_INPUT = "user_input",
  DOM_ELEMENT = "dom_element",
  LOCAL_STORAGE = "local_storage",
  SESSION_STORAGE = "session_storage",
  URL_PARAM = "url_param",
  COOKIE = "cookie",
  USER_AGENT = "user_agent",
  TIMESTAMP = "timestamp",
  RANDOM = "random",
  COMPUTED = "computed",
}

export interface PropertyValidation {
  min?: number
  max?: number
  pattern?: string
  required?: boolean
  custom?: string
}

export interface PropertyTransform {
  type: TransformType
  config: Record<string, any>
}

export enum TransformType {
  UPPERCASE = "uppercase",
  LOWERCASE = "lowercase",
  TRIM = "trim",
  REPLACE = "replace",
  EXTRACT = "extract",
  FORMAT_DATE = "format_date",
  ROUND = "round",
  CUSTOM = "custom",
}

export enum ConditionType {
  PROPERTY = "property",
  USER = "user",
  SESSION = "session",
  TIME = "time",
  DEVICE = "device",
  LOCATION = "location",
}

export enum ConditionOperator {
  EQUALS = "equals",
  NOT_EQUALS = "not_equals",
  GREATER_THAN = "greater_than",
  LESS_THAN = "less_than",
  GREATER_THAN_OR_EQUAL = "greater_than_or_equal",
  LESS_THAN_OR_EQUAL = "less_than_or_equal",
  CONTAINS = "contains",
  NOT_CONTAINS = "not_contains",
  STARTS_WITH = "starts_with",
  ENDS_WITH = "ends_with",
  REGEX = "regex",
  IN = "in",
  NOT_IN = "not_in",
  EXISTS = "exists",
  NOT_EXISTS = "not_exists",
}

export enum LogicalOperator {
  AND = "and",
  OR = "or",
  NOT = "not",
}

export enum ActionType {
  TRACK_EVENT = "track_event",
  SET_PROPERTY = "set_property",
  SEND_NOTIFICATION = "send_notification",
  REDIRECT = "redirect",
  SHOW_MODAL = "show_modal",
  CUSTOM_FUNCTION = "custom_function",
}

export interface EventTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: string
  template: Partial<CustomEventDefinition>
  tags: string[]
}

export interface EventValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ValidationWarning {
  field: string
  message: string
  code: string
}
