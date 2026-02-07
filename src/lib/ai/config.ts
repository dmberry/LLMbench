// Provider configurations and model definitions for LLMbench
// Adapted from CCS-WB (stripped dynamic model loading)

import type { AIProvider, ProviderConfig } from "@/types/ai-settings";

export const PROVIDER_CONFIGS: Record<AIProvider, ProviderConfig> = {
  anthropic: {
    id: "anthropic",
    name: "Anthropic (Claude)",
    description: "Claude models from Anthropic",
    requiresApiKey: true,
    baseUrlConfigurable: false,
    models: [
      {
        id: "claude-sonnet-4-20250514",
        name: "Claude Sonnet 4",
        contextWindow: 200000,
        maxOutputTokens: 8192,
      },
      {
        id: "claude-3-5-haiku-20241022",
        name: "Claude 3.5 Haiku",
        contextWindow: 200000,
        maxOutputTokens: 8192,
      },
    ],
  },
  openai: {
    id: "openai",
    name: "OpenAI",
    description: "GPT models from OpenAI",
    requiresApiKey: true,
    baseUrlConfigurable: false,
    models: [
      {
        id: "gpt-4o",
        name: "GPT-4o",
        contextWindow: 128000,
        maxOutputTokens: 4096,
      },
      {
        id: "gpt-4o-mini",
        name: "GPT-4o Mini",
        contextWindow: 128000,
        maxOutputTokens: 16384,
      },
      {
        id: "o1",
        name: "o1",
        contextWindow: 200000,
        maxOutputTokens: 100000,
      },
      {
        id: "o1-mini",
        name: "o1-mini",
        contextWindow: 128000,
        maxOutputTokens: 65536,
      },
    ],
  },
  google: {
    id: "google",
    name: "Google (Gemini)",
    description: "Gemini models from Google",
    requiresApiKey: true,
    baseUrlConfigurable: false,
    models: [
      {
        id: "gemini-2.5-pro",
        name: "Gemini 2.5 Pro",
        contextWindow: 1048576,
        maxOutputTokens: 65536,
      },
      {
        id: "gemini-2.5-flash",
        name: "Gemini 2.5 Flash",
        contextWindow: 1048576,
        maxOutputTokens: 65536,
      },
    ],
  },
  ollama: {
    id: "ollama",
    name: "Ollama (Local)",
    description: "Run models locally with Ollama",
    requiresApiKey: false,
    baseUrlConfigurable: true,
    defaultBaseUrl: "http://localhost:11434",
    models: [
      {
        id: "llama3.2",
        name: "Llama 3.2",
        contextWindow: 128000,
        maxOutputTokens: 4096,
      },
      {
        id: "llama3.1",
        name: "Llama 3.1",
        contextWindow: 128000,
        maxOutputTokens: 4096,
      },
      {
        id: "mistral",
        name: "Mistral",
        contextWindow: 32000,
        maxOutputTokens: 4096,
      },
    ],
  },
  "openai-compatible": {
    id: "openai-compatible",
    name: "OpenAI-Compatible API",
    description: "Any API compatible with OpenAI format (Together, Groq, etc.)",
    requiresApiKey: true,
    baseUrlConfigurable: true,
    models: [
      {
        id: "custom",
        name: "Custom Model",
        contextWindow: 32000,
        maxOutputTokens: 4096,
      },
    ],
  },
};

export function getDefaultModel(provider: AIProvider): string {
  return PROVIDER_CONFIGS[provider].models[0]?.id || "custom";
}

export function getModelDisplayName(
  provider: AIProvider,
  modelId: string
): string {
  const config = PROVIDER_CONFIGS[provider];
  const model = config.models.find((m) => m.id === modelId);
  return model?.name || modelId;
}

export function getAllProviders(): ProviderConfig[] {
  return Object.values(PROVIDER_CONFIGS);
}
