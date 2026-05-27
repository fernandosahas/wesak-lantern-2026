// ─── Core Data Models ─────────────────────────────────────────────

export interface Lantern {
  id: string
  name: string
  team_name: string
  description: string
  image_url: string | null
  vote_count: number
  created_at: string
}

export interface Vote {
  id: string
  lantern_id: string
  ip_hash: string
  device_hash: string
  fingerprint: string | null
  created_at: string
}

export interface Settings {
  id: string
  voting_enabled: boolean
  voting_start: string | null
  voting_end: string | null
  updated_at: string
}

export interface AdminLog {
  id: string
  action: string
  details: Record<string, unknown> | null
  admin_id: string | null
  created_at: string
}

// ─── Request / Response Shapes ────────────────────────────────────

export interface VoteRequest {
  lantern_id: string
  turnstile_token: string
  fingerprint: string
  device_hash: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface VoteResponse {
  lantern_id: string
  new_vote_count: number
}

// ─── Admin ────────────────────────────────────────────────────────

export interface AdminStats {
  total_votes: number
  total_lanterns: number
  votes_today: number
  most_voted: Lantern | null
  recent_votes: VoteWithLantern[]
}

export interface VoteWithLantern extends Vote {
  lanterns: Pick<Lantern, 'id' | 'name' | 'team_name'>
}

// ─── UI State ─────────────────────────────────────────────────────

export type VoteStatus = 'idle' | 'loading' | 'success' | 'error' | 'already_voted'

export interface VotingState {
  hasVoted: boolean
  votedLanternId: string | null
  status: VoteStatus
}

export interface CountdownState {
  days: number
  hours: number
  minutes: number
  seconds: number
  isOver: boolean
}

// ─── Form Types ───────────────────────────────────────────────────

export interface LanternFormData {
  name: string
  team_name: string
  description: string
  image_url?: string
}

export interface AdminLoginData {
  email: string
  password: string
}

// ─── Leaderboard ─────────────────────────────────────────────────

export interface LeaderboardEntry extends Lantern {
  rank: number
  percentage: number
}
