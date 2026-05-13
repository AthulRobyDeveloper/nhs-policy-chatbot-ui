export interface PolicyResponse {
  answer:             string
  source:             string
  reference:          string
  page:               number | string
  version:            string
  confidence_score:   number
  confidence_percent: number
  confidence_label:   string
  pathway:            string
  timestamp:          string
  disclaimer:         string
}

export interface PolicyDocument {
  title:       string
  reference:   string
  version:     string
  issue_date:  string
  review_date: string
  department:  string
  pathway:     string
}

export interface PoliciesResponse {
  total_documents: number
  documents:       PolicyDocument[]
  last_updated:    string
}

export interface ChatMessage {
  id:        string
  role:      'user' | 'assistant'
  content:   string
  timestamp: string
  metadata?: PolicyResponse
}

export interface AuditEntry {
  question:   string
  source:     string
  confidence: number
  timestamp:  string
}
