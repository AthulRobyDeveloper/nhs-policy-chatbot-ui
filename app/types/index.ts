export interface ChatMessage {
  id:        string
  role:      'user' | 'assistant'
  content:   string
  timestamp: string
  metadata?: PolicyResponse
}

export interface PolicyDocument {
  title:       string
  reference:   string
  version:     string
  pathway:     string
  review_date: string
}

export interface PolicyResponse {
  answer:             string
  source:             string
  reference:          string
  version:            string
  page:               string
  pathway:            string
  confidence_percent: number
  confidence_label:   string
  timestamp:          string
}
