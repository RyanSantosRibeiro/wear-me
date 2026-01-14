export type UserRole = "admin" | "member" | "owner"
export type MemberStatus = "active" | "inactive" | "pending"
export type SubscriptionStatus = "active" | "cancelled" | "expired" | "pending"
export type PlanRecurrence = "monthly" | "quarterly" | "yearly"

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Company {
  id: string
  name: string
  slug: string
  logo_url: string | null
  owner_id: string
  created_at: string
  updated_at: string
}

export interface CompanyMember {
  id: string
  company_id: string
  user_id: string
  role: UserRole
  status: MemberStatus
  invited_by: string | null
  created_at: string
  updated_at: string
  profile?: Profile
}

export interface Plan {
  id: string
  name: string
  description: string | null
  price: number
  currency: string
  recurrence: PlanRecurrence
  metadata: {
    max_users?: number
    features?: string[]
    [key: string]: any
  }
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  company_id: string
  plan_id: string
  status: SubscriptionStatus
  mercado_pago_subscription_id: string | null
  current_period_start: string | null
  current_period_end: string | null
  cancel_at: string | null
  cancelled_at: string | null
  metadata: Record<string, any>
  created_at: string
  updated_at: string
  plan?: Plan
}

// --- BOT CONFIGURATION ---
export interface BotMenuOption {
  key: string
  label: string
  next?: string // next node id
  action?: "schedule" | "assign_agent" | "message" | "custom"
  payload?: {
    service?: string
    target_agent_id?: string
    [key: string]: any
  }
  collect_data?: {
    enabled: boolean
    field_name: string // Ex: "service", "time_preference", etc.
  }
}

export interface BotNode {
  type: "menu" | "message" | "custom"
  message?: string
  options?: BotMenuOption[]
  next?: string // for message nodes that auto-advance
  action?: string
  payload?: any
}

export interface BotFlowConfig {
  type: "manual" | "auto"
  start_node: string
  nodes: Record<string, BotNode>
}

export interface BotConfig {
  company_id: string
  welcome_message: string
  menu_options: BotFlowConfig
}

export interface Contact {
  id: string
  bot_stage: string
  name: string
  customer_number: string
  assigned_member_id: string
  created_at: string
  updated_at: string
}

export interface App {
  id: string
  name: string
  slug: string
  logo_url: string | null
  company_id: string
  created_at: string
  updated_at: string
}


export interface JSONSchema {
  $schema?: string;
  title?: string;
  type: string;
  required?: string[];
  properties?: Record<string, JSONSchema>;
  items?: JSONSchema; // For arrays
  description?: string;
  minLength?: number;
  minItems?: number;
  additionalProperties?: boolean;
  widget?: string;
}

// --- Database Entities (Matching Supabase Tables) ---

export interface SectionDefinition {
  id: string;
  project_id?: string;
  name: string;
  description: string;
  schema: JSONSchema;
  created_at?: string;
}

export interface PageSection {
  id: string;
  version_id?: string;
  section_definition_id: string; // Changed from sectionDefinitionId to match DB
  order_index: number;
  content: any; // Changed from 'data' to 'content' to match DB JSONB column
}

export interface AppAsset {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: string;
  uploadedAt: string;
}

export interface PageVersion {
  id: string;
  page_id?: string;
  name: string; // e.g., "v1.0", "Summer Sale Draft"
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  updated_at: string; // snake_case from DB
  created_at?: string;
  sections: PageSection[];
}

export interface AppPage {
  id: string;
  project_id?: string;
  title: string;
  slug: string;
  versions: PageVersion[];
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo_url: string;
  theme: {
    colors: {
      base: string;
      primary: string;
      secondary: string;
      accent: string;
      neutral: string;
    };
    buttonStyle: {
      borderWidth: string;
      radius: string;
      scaleOnClick: number;
      animationDuration: string;
    };
    fontFamily: string;
  };
  menus: {
    horizontal: {
      items: Array<{ label: string; href: string; icon?: string }>;
    };
    drawer: {
      items: Array<{ label: string; href: string; icon?: string }>;
    };
  };
  pages: AppPage[];
  sectionDefinitions: SectionDefinition[]; // Defined by Devs
  assets: AppAsset[];
}

// --- Supabase Response Types (Optional helper types) ---

export interface DbPage {
  id: string;
  project_id: string;
  title: string;
  slug: string;
  created_at: string;
}

export interface DbPageVersion {
  id: string;
  page_id: string;
  name: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  updated_at: string;
  created_at: string;
}

export interface DbSectionInstance {
  id: string;
  version_id: string;
  section_definition_id: string;
  order_index: number;
  content: any;
}
