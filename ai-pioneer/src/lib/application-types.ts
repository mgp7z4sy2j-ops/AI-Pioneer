import type { ApplicationData } from './schema'

/** Manual review scores for open questions (0–5). */
export interface ManualScores {
  q22?: number
  q25?: number
  q27?: number
  q30?: number
}

export interface ApplicationRecord extends ApplicationData {
  id: string
  created_at: string
  manual_scores?: ManualScores
}
