import { ModelProvider } from "."

export type LLMID =
  | OpenAILLMID
  | GoogleLLMID
  | AnthropicLLMID
  | MistralLLMID
  | PerplexityLLMID

// OpenAI Models (UPDATED 1/29/24)
export type OpenAILLMID =
  | "gpt-4-turbo-preview" // GPT-4 Turbo
  | "gpt-4-vision-preview" // GPT-4 Vision
  | "gpt-4" // GPT-4
  | "gpt-3.5-turbo" // Updated GPT-3.5 Turbo

// Google Models
export type GoogleLLMID =
  | "gemini-pro" // Gemini Pro
  | "gemini-pro-vision" // Gemini Pro Vision

// Anthropic Models
export type AnthropicLLMID =
  | "claude-2.1" // Claude 2
  | "claude-instant-1.2" // Claude Instant
  | "claude-3-sonnet-20240229" // Claude 3 Sonnet
  | "claude-3-opus-20240229" // Claude 3 Opus
  | "claude-3-haiku-20240307" // Claude 3 Haiku

// Mistral Models
export type MistralLLMID =
  | "mistral-tiny" // Mistral Tiny
  | "mistral-small" // Mistral Small
  | "mistral-medium" // Mistral Medium

// Perplexity Models
export type PerplexityLLMID =
  | "pplx-7b-online" // Perplexity Online 7B
  | "pplx-70b-online" // Perplexity Online 70B

export interface LLM {
  modelId: LLMID
  modelName: string
  provider: ModelProvider
  hostedId: string
  platformLink: string
  imageInput: boolean
}

export interface OpenRouterLLM extends LLM {
  maxContext: number
}
