import type { HRIDAYAdapter } from './types';
import { backendAdapter } from './backend/backendAdapter';
import { demoAdapter } from './demo/demoAdapter';

export type AdapterMode = 'demo' | 'backend';

/**
 * Resolve the adapter from an explicit deployment setting.
 *
 * Demo is the safe default for the public frontend preview. Backend mode must
 * be explicitly enabled; it never falls back to synthetic data when the
 * production adapter is unavailable.
 */
export function getHRIDAYAdapter(mode?: AdapterMode): HRIDAYAdapter {
  const configuredMode = mode ?? (import.meta.env.VITE_HRIDAY_ADAPTER_MODE as AdapterMode | undefined) ?? 'demo';
  return configuredMode === 'backend' ? backendAdapter : demoAdapter;
}

export function getAdapterMode(mode?: AdapterMode): AdapterMode {
  const configuredMode = mode ?? (import.meta.env.VITE_HRIDAY_ADAPTER_MODE as AdapterMode | undefined) ?? 'demo';
  return configuredMode === 'backend' ? 'backend' : 'demo';
}
