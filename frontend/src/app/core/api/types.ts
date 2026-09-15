export type ProcessState = 'STARTING' | 'RUNNING' | 'STOPPED' | 'DEAD';
export type TurnState = 'IDLE' | 'PROMPTING' | 'CANCELLING';
export type PermissionPolicy = 'ask' | 'read-only' | 'auto-approve' | 'deny-all';
export type AgentSource = 'builtin' | 'file' | 'pueblo_managed' | 'registry' | 'declarative';
export type AgentAvailability = 'available' | 'unavailable';

export interface AgentSummary {
  id: string;
  display_name: string;
  source: AgentSource;
  availability: AgentAvailability;
  usage_provider?: string | null;
  metadata: unknown;
}

export interface Project {
  id: string;
  name: string;
  path: string;
  created_at: string;
  updated_at: string;
  chat_count?: number;
}

export type WorkspaceMode = 'managed_worktree' | 'project_checkout';

export interface WorkspaceBranch {
  name: string;
  sha: string;
  current: boolean;
}

export interface WorkspaceOptions {
  is_git: boolean;
  current_branch: string | null;
  head_sha: string | null;
  dirty: boolean;
  branches: WorkspaceBranch[];
}

export interface ChatWorkspaceSelection {
  mode: WorkspaceMode;
  branch: string;
}

export interface ChatWorkspaceSummary {
  mode: WorkspaceMode;
  branch: string | null;
  base_commit: string | null;
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
  turn_started_at?: string | null;
  process_state?: ProcessState;
  turn_state?: TurnState;
  workspace?: ChatWorkspaceSummary | null;
  active_tasks?: number;
}

export type TerminalTaskState = "running" | "completed" | "failed" | "stopped";

export interface TerminalTaskSummary {
  id: string;
  chat_id: string;
  command: string;
  cwd: string;
  state: TerminalTaskState;
  exit_code?: number | null;
  started_at: string;
  completed_at?: string | null;
}

export interface TerminalTaskDetails extends TerminalTaskSummary {
  output: string;
  truncated: boolean;
}

export interface BlockedEnvironmentError {
  path: string;
  message: string;
}

export interface ConfigOptionSelectGroup {
  group: string;
  options: ConfigOptionSelectValue[];
}

export interface ConfigOptionSelectValue {
  value: unknown;
  name: string;
  description?: string;
}

export interface ConfigOption {
  id: string;
  name: string;
  type: 'select' | 'boolean' | string;
  currentValue: unknown;
  description?: string;
  category?: string;
  options?: Array<ConfigOptionSelectValue | ConfigOptionSelectGroup>;
}

export interface AvailableCommand {
  name: string;
  description: string;
  input?: { hint: string } | null;
}

export interface SessionMode {
  id: string;
  name: string;
  description?: string | null;
}

export interface SessionModes {
  current_mode_id: string;
  available_modes: SessionMode[];
}

export interface UsageInfo {
  used: number;
  size: number;
  cost_amount?: number | null;
  cost_currency?: string | null;
}

export interface ElicitationInfo {
  id: string;
  mode: string;
  message: string;
  schema?: unknown;
  url?: string | null;
  elicitation_id?: string | null;
  tool_call_id?: string | null;
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
  locations?: Array<{ path: string; line?: number | null }> | null;
}

export interface TurnEntryElicitation {
  id: number;
  type: 'elicitation_request';
  requestId: string;
  mode: string;
  message: string;
  schema?: unknown;
  url?: string | null;
  toolCallId?: string;
  responded?: boolean;
  decision?: string;
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
  | TurnEntryPermission
  | TurnEntryElicitation;

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

export type DisplayItem =
  | DisplayTurn
  | DisplayUserMessage
  | DisplayError;

export interface SessionEvent {
  seq: number;
  session_id: string;
  agent: string;
  timestamp: string;
  payload: SessionPayload;
}

export interface ChatHistoryPage {
  events: SessionEvent[];
  next_cursor: number | null;
  has_older: boolean;
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
    | 'available_commands'
    | 'session_modes'
    | 'usage_update'
    | 'session_info'
    | 'elicitation_request'
    | 'elicitation_response'
    | 'elicitation_complete'
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
