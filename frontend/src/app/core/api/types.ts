export type ProcessState = 'STARTING' | 'RUNNING' | 'STOPPED' | 'DEAD';
export type TurnState = 'IDLE' | 'PROMPTING' | 'CANCELLING';
export type PermissionPolicy = 'ask' | 'read-only' | 'auto-approve' | 'deny-all';

export interface Project {
  id: string;
  name: string;
  path: string;
  created_at: string;
  updated_at: string;
  chat_count?: number;
}

export interface Chat {
  id: string;
  project_id: string;
  agent: string;
  title: string;
  acp_session_id?: string | null;
  created_at: string;
  updated_at: string;
  archived: boolean;
  permission_policy: PermissionPolicy;
  config_values: Record<string, unknown>;
  title_overridden?: boolean;
  process_state?: ProcessState;
  turn_state?: TurnState;
}

export interface ConfigOptionSelectGroup {
  group: string;
  options: ConfigOptionSelectValue[];
}

export interface ConfigOptionSelectValue {
  value: unknown;
  name: string;
}

export interface ConfigOption {
  id: string;
  name: string;
  type: 'select' | 'boolean' | string;
  currentValue: unknown;
  description?: string;
  options?: Array<ConfigOptionSelectValue | ConfigOptionSelectGroup>;
}

export interface DirectoryEntry {
  name: string;
  path: string;
}

export interface Breadcrumb {
  name: string;
  path: string;
}

export interface DirectoryListing {
  current: string;
  name: string;
  parent: string | null;
  roots: string[];
  breadcrumbs: Breadcrumb[];
  directories: DirectoryEntry[];
}

export interface CloneProjectInput {
  url: string;
  parent_path: string;
  name?: string;
}

export interface PlanEntry {
  content: string;
  status: string;
}

export interface TurnEntryMessage {
  id: number;
  type: 'message_chunk';
  text: string;
}

export interface TurnEntryThought {
  id: number;
  type: 'thought_chunk';
  text: string;
}

export interface TurnEntryTool {
  id: number;
  type: 'tool_call';
  toolCallId: string;
  title: string;
  status: string;
  output?: string | null;
  kind?: string;
  parentId?: string;
}

export interface TurnEntryPlan {
  id: number;
  type: 'plan';
  entries: PlanEntry[];
}

export interface TurnEntryPermission {
  id: number;
  type: 'permission_request';
  requestId: string;
  method: string;
  description: string;
  responded?: boolean;
  decision?: string;
  title?: string;
  kind?: string;
}

export type TurnEntry =
  | TurnEntryMessage
  | TurnEntryThought
  | TurnEntryTool
  | TurnEntryPlan
  | TurnEntryPermission;

export interface DisplayTurn {
  id: number;
  type: 'turn';
  agent: string;
  timestamp: string;
  completedAt: string | null;
  status: 'in_progress' | 'complete';
  stopReason: string | null;
  entries: TurnEntry[];
}

export interface DisplayUserMessage {
  id: number;
  type: 'user_message';
  text: string;
  timestamp: string;
}

export interface DisplayError {
  id: number;
  type: 'error';
  message: string;
  timestamp: string;
}

export interface DisplayStateChange {
  id: number;
  type: 'state_change';
  process: string;
  turn: string;
  timestamp: string;
}

export type DisplayItem =
  | DisplayTurn
  | DisplayUserMessage
  | DisplayError
  | DisplayStateChange;

export interface SessionEvent {
  seq: number;
  session_id: string;
  agent: string;
  timestamp: string;
  payload: SessionPayload;
}

export interface SessionPayload {
  type:
    | 'user_message'
    | 'message_chunk'
    | 'thought_chunk'
    | 'tool_call'
    | 'tool_call_update'
    | 'plan'
    | 'permission_request'
    | 'permission_response'
    | 'turn_complete'
    | 'state_change'
    | 'config_options'
    | 'error'
    | 'metadata_changed';
  id?: unknown;
  text?: unknown;
  message?: unknown;
  title?: unknown;
  status?: unknown;
  output?: unknown;
  method?: unknown;
  description?: unknown;
  granted?: unknown;
  process?: unknown;
  turn?: unknown;
  stop_reason?: unknown;
  stopReason?: unknown;
  toolCallId?: unknown;
  tool_call_id?: unknown;
  options?: unknown;
  entries?: unknown;
  [key: string]: unknown;
}
