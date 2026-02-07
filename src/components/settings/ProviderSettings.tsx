"use client";

import React from "react";
import { X, Eye, EyeOff, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useProviderSettings } from "@/context/ProviderSettingsContext";
import { PROVIDER_CONFIGS } from "@/lib/ai/config";
import type { AIProvider, ProviderSlot } from "@/types/ai-settings";

function SlotEditor({
  panel,
  slot,
  onUpdate,
}: {
  panel: "A" | "B";
  slot: ProviderSlot;
  onUpdate: (updates: Partial<ProviderSlot>) => void;
}) {
  const [showKey, setShowKey] = useState(false);
  const providerConfig = PROVIDER_CONFIGS[slot.provider];
  const providers = Object.values(PROVIDER_CONFIGS);

  return (
    <div className="space-y-3">
      <h3 className="font-display text-display-sm font-semibold text-foreground">
        Panel {panel}
      </h3>

      {/* Provider select */}
      <div>
        <label className="block text-caption text-muted-foreground mb-1">
          Provider
        </label>
        <select
          value={slot.provider}
          onChange={(e) => {
            const provider = e.target.value as AIProvider;
            const config = PROVIDER_CONFIGS[provider];
            onUpdate({
              provider,
              model: config.models[0]?.id || "custom",
              apiKey: "",
              baseUrl: config.defaultBaseUrl || "",
              customModelId: "",
            });
          }}
          className="input-editorial w-full"
        >
          {providers.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Model select */}
      <div>
        <label className="block text-caption text-muted-foreground mb-1">
          Model
        </label>
        <select
          value={slot.model}
          onChange={(e) => onUpdate({ model: e.target.value })}
          className="input-editorial w-full"
        >
          {providerConfig.models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {/* Custom model ID */}
      {slot.model === "custom" && (
        <div>
          <label className="block text-caption text-muted-foreground mb-1">
            Custom Model ID
          </label>
          <input
            type="text"
            value={slot.customModelId || ""}
            onChange={(e) => onUpdate({ customModelId: e.target.value })}
            placeholder="e.g. claude-opus-4-20250514"
            className="input-editorial w-full"
          />
        </div>
      )}

      {/* API Key */}
      {providerConfig.requiresApiKey && (
        <div>
          <label className="block text-caption text-muted-foreground mb-1">
            API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={slot.apiKey}
              onChange={(e) => onUpdate({ apiKey: e.target.value })}
              placeholder={`Enter ${providerConfig.name} API key`}
              className="input-editorial w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showKey ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Base URL (for Ollama, OpenAI-compatible) */}
      {providerConfig.baseUrlConfigurable && (
        <div>
          <label className="block text-caption text-muted-foreground mb-1">
            Base URL
          </label>
          <input
            type="text"
            value={slot.baseUrl || ""}
            onChange={(e) => onUpdate({ baseUrl: e.target.value })}
            placeholder={providerConfig.defaultBaseUrl || "https://api.example.com"}
            className="input-editorial w-full"
          />
        </div>
      )}

      {/* Temperature */}
      <div>
        <label className="block text-caption text-muted-foreground mb-1">
          Temperature: {slot.temperature.toFixed(1)}
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={slot.temperature}
          onChange={(e) =>
            onUpdate({ temperature: parseFloat(e.target.value) })
          }
          className="w-full"
        />
        <div className="flex justify-between text-caption text-muted-foreground/60">
          <span>Deterministic</span>
          <span>Creative</span>
        </div>
      </div>

      {/* System Prompt */}
      <div>
        <label className="block text-caption text-muted-foreground mb-1">
          System Prompt (optional)
        </label>
        <textarea
          value={slot.systemPrompt}
          onChange={(e) => onUpdate({ systemPrompt: e.target.value })}
          placeholder="Optional system instructions for this model..."
          className="input-editorial w-full resize-none"
          rows={3}
        />
      </div>
    </div>
  );
}

export default function ProviderSettings({
  isDark,
  onToggleDark,
}: {
  isDark?: boolean;
  onToggleDark?: () => void;
}) {
  const { slots, updateSlot, showSettings, setShowSettings } =
    useProviderSettings();

  if (!showSettings) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/40">
      <div className="bg-card border border-border rounded-lg shadow-editorial-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-display text-display-md font-bold text-foreground">
            Provider Settings
          </h2>
          <button
            onClick={() => setShowSettings(false)}
            className="btn-editorial-ghost p-1.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body: two slot editors side by side */}
        <div className="p-6 flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <SlotEditor
              panel="A"
              slot={slots.A}
              onUpdate={(updates) => updateSlot("A", updates)}
            />
          </div>
          <div className="hidden md:block w-px bg-border shrink-0" />
          <div className="md:hidden h-px bg-border" />
          <div className="flex-1">
            <SlotEditor
              panel="B"
              slot={slots.B}
              onUpdate={(updates) => updateSlot("B", updates)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border flex items-center justify-between">
          <span className="text-caption text-muted-foreground">
            API keys are stored in your browser only.
          </span>
          {onToggleDark && (
            <button
              onClick={onToggleDark}
              className="flex items-center gap-1.5 text-caption text-muted-foreground hover:text-foreground"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{isDark ? "Light mode" : "Dark mode"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
