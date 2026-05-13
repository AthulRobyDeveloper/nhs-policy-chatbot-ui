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
  page:               number | string
  pathway:            string
  confidence_score?:  number
  confidence_percent: number
  confidence_label:   string
  pdf_url?:           string
  timestamp:          string
  disclaimer?:        string
}
