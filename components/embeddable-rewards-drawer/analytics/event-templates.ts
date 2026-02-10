import type { EventTemplate } from "./custom-events-types"
import { TriggerType, PropertyType, PropertySource, ActionType } from "./custom-events-types"

export const eventTemplates: EventTemplate[] = [
  {
    id: "button_click",
    name: "Button Click",
    description: "Track when users click on specific buttons",
    category: "user_interaction",
    icon: "🖱️",
    tags: ["click", "button", "interaction"],
    template: {
      name: "button_click",
      displayName: "Button Click",
      description: "Tracks when users click on buttons",
      category: "user_interaction",
      enabled: true,
      triggers: [
        {
          id: "trigger_1",
          type: TriggerType.CLICK,
          selector: "button, .btn, [role='button']",
        },
      ],
      properties: [
        {
          id: "prop_1",
          name: "button_text",
          displayName: "Button Text",
          type: PropertyType.STRING,
          required: true,
          source: PropertySource.DOM_ELEMENT,
        },
        {
          id: "prop_2",
          name: "button_id",
          displayName: "Button ID",
          type: PropertyType.STRING,
          required: false,
          source: PropertySource.DOM_ELEMENT,
        },
      ],
      conditions: [],
      actions: [
        {
          id: "action_1",
          type: ActionType.TRACK_EVENT,
          config: {
            eventName: "button_clicked",
          },
          enabled: true,
        },
      ],
    },
  },
  {
    id: "form_submission",
    name: "Form Submission",
    description: "Track form submissions and capture form data",
    category: "conversion",
    icon: "📝",
    tags: ["form", "submit", "conversion"],
    template: {
      name: "form_submission",
      displayName: "Form Submission",
      description: "Tracks when users submit forms",
      category: "conversion",
      enabled: true,
      triggers: [
        {
          id: "trigger_1",
          type: TriggerType.FORM_SUBMIT,
          selector: "form",
        },
      ],
      properties: [
        {
          id: "prop_1",
          name: "form_id",
          displayName: "Form ID",
          type: PropertyType.STRING,
          required: true,
          source: PropertySource.DOM_ELEMENT,
        },
        {
          id: "prop_2",
          name: "form_fields",
          displayName: "Form Fields",
          type: PropertyType.OBJECT,
          required: false,
          source: PropertySource.DOM_ELEMENT,
        },
      ],
      conditions: [],
      actions: [
        {
          id: "action_1",
          type: ActionType.TRACK_EVENT,
          config: {
            eventName: "form_submitted",
          },
          enabled: true,
        },
      ],
    },
  },
  {
    id: "page_scroll",
    name: "Page Scroll",
    description: "Track how far users scroll on pages",
    category: "engagement",
    icon: "📜",
    tags: ["scroll", "engagement", "reading"],
    template: {
      name: "page_scroll",
      displayName: "Page Scroll",
      description: "Tracks user scroll behavior",
      category: "engagement",
      enabled: true,
      triggers: [
        {
          id: "trigger_1",
          type: TriggerType.SCROLL,
        },
      ],
      properties: [
        {
          id: "prop_1",
          name: "scroll_percentage",
          displayName: "Scroll Percentage",
          type: PropertyType.NUMBER,
          required: true,
          source: PropertySource.COMPUTED,
        },
        {
          id: "prop_2",
          name: "page_url",
          displayName: "Page URL",
          type: PropertyType.URL,
          required: true,
          source: PropertySource.URL_PARAM,
        },
      ],
      conditions: [],
      actions: [
        {
          id: "action_1",
          type: ActionType.TRACK_EVENT,
          config: {
            eventName: "page_scrolled",
          },
          enabled: true,
        },
      ],
    },
  },
  {
    id: "video_play",
    name: "Video Play",
    description: "Track when users play videos",
    category: "engagement",
    icon: "🎥",
    tags: ["video", "play", "media"],
    template: {
      name: "video_play",
      displayName: "Video Play",
      description: "Tracks when users play videos",
      category: "engagement",
      enabled: true,
      triggers: [
        {
          id: "trigger_1",
          type: TriggerType.CUSTOM_EVENT,
          event: "play",
          selector: "video",
        },
      ],
      properties: [
        {
          id: "prop_1",
          name: "video_title",
          displayName: "Video Title",
          type: PropertyType.STRING,
          required: false,
          source: PropertySource.DOM_ELEMENT,
        },
        {
          id: "prop_2",
          name: "video_duration",
          displayName: "Video Duration",
          type: PropertyType.NUMBER,
          required: false,
          source: PropertySource.DOM_ELEMENT,
        },
      ],
      conditions: [],
      actions: [
        {
          id: "action_1",
          type: ActionType.TRACK_EVENT,
          config: {
            eventName: "video_played",
          },
          enabled: true,
        },
      ],
    },
  },
  {
    id: "download_click",
    name: "Download Click",
    description: "Track when users click download links",
    category: "conversion",
    icon: "⬇️",
    tags: ["download", "file", "conversion"],
    template: {
      name: "download_click",
      displayName: "Download Click",
      description: "Tracks when users click download links",
      category: "conversion",
      enabled: true,
      triggers: [
        {
          id: "trigger_1",
          type: TriggerType.CLICK,
          selector: "a[download], .download-link",
        },
      ],
      properties: [
        {
          id: "prop_1",
          name: "file_name",
          displayName: "File Name",
          type: PropertyType.STRING,
          required: true,
          source: PropertySource.DOM_ELEMENT,
        },
        {
          id: "prop_2",
          name: "file_type",
          displayName: "File Type",
          type: PropertyType.STRING,
          required: false,
          source: PropertySource.DOM_ELEMENT,
        },
      ],
      conditions: [],
      actions: [
        {
          id: "action_1",
          type: ActionType.TRACK_EVENT,
          config: {
            eventName: "file_downloaded",
          },
          enabled: true,
        },
      ],
    },
  },
  {
    id: "error_tracking",
    name: "Error Tracking",
    description: "Track JavaScript errors and exceptions",
    category: "performance",
    icon: "⚠️",
    tags: ["error", "exception", "debugging"],
    template: {
      name: "error_tracking",
      displayName: "Error Tracking",
      description: "Tracks JavaScript errors and exceptions",
      category: "performance",
      enabled: true,
      triggers: [
        {
          id: "trigger_1",
          type: TriggerType.CUSTOM_EVENT,
          event: "error",
        },
      ],
      properties: [
        {
          id: "prop_1",
          name: "error_message",
          displayName: "Error Message",
          type: PropertyType.STRING,
          required: true,
          source: PropertySource.USER_INPUT,
        },
        {
          id: "prop_2",
          name: "error_stack",
          displayName: "Error Stack",
          type: PropertyType.STRING,
          required: false,
          source: PropertySource.USER_INPUT,
        },
        {
          id: "prop_3",
          name: "page_url",
          displayName: "Page URL",
          type: PropertyType.URL,
          required: true,
          source: PropertySource.URL_PARAM,
        },
      ],
      conditions: [],
      actions: [
        {
          id: "action_1",
          type: ActionType.TRACK_EVENT,
          config: {
            eventName: "javascript_error",
          },
          enabled: true,
        },
      ],
    },
  },
  {
    id: "search_query",
    name: "Search Query",
    description: "Track search queries and results",
    category: "user_interaction",
    icon: "🔍",
    tags: ["search", "query", "results"],
    template: {
      name: "search_query",
      displayName: "Search Query",
      description: "Tracks search queries and results",
      category: "user_interaction",
      enabled: true,
      triggers: [
        {
          id: "trigger_1",
          type: TriggerType.FORM_SUBMIT,
          selector: ".search-form, [role='search']",
        },
      ],
      properties: [
        {
          id: "prop_1",
          name: "search_query",
          displayName: "Search Query",
          type: PropertyType.STRING,
          required: true,
          source: PropertySource.DOM_ELEMENT,
        },
        {
          id: "prop_2",
          name: "results_count",
          displayName: "Results Count",
          type: PropertyType.NUMBER,
          required: false,
          source: PropertySource.DOM_ELEMENT,
        },
      ],
      conditions: [],
      actions: [
        {
          id: "action_1",
          type: ActionType.TRACK_EVENT,
          config: {
            eventName: "search_performed",
          },
          enabled: true,
        },
      ],
    },
  },
  {
    id: "social_share",
    name: "Social Share",
    description: "Track when users share content on social media",
    category: "engagement",
    icon: "📤",
    tags: ["social", "share", "viral"],
    template: {
      name: "social_share",
      displayName: "Social Share",
      description: "Tracks social media sharing",
      category: "engagement",
      enabled: true,
      triggers: [
        {
          id: "trigger_1",
          type: TriggerType.CLICK,
          selector: ".social-share, .share-button",
        },
      ],
      properties: [
        {
          id: "prop_1",
          name: "platform",
          displayName: "Social Platform",
          type: PropertyType.STRING,
          required: true,
          source: PropertySource.DOM_ELEMENT,
        },
        {
          id: "prop_2",
          name: "content_url",
          displayName: "Content URL",
          type: PropertyType.URL,
          required: true,
          source: PropertySource.URL_PARAM,
        },
      ],
      conditions: [],
      actions: [
        {
          id: "action_1",
          type: ActionType.TRACK_EVENT,
          config: {
            eventName: "content_shared",
          },
          enabled: true,
        },
      ],
    },
  },
]
