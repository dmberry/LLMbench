"use client";

import { ProviderSettingsProvider } from "@/context/ProviderSettingsContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ProviderSettingsProvider>{children}</ProviderSettingsProvider>;
}
