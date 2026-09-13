import type { HRIDAYAdapter } from './types';
import { backendAdapter } from './backend/backendAdapter';
import { demoAdapter } from './demo/demoAdapter';

export type AdapterMode = 'demo' | 'backend';

function resolveConfiguredMode(mode?: AdapterMode): AdapterMode {
  if (mode) return mode;

  const raw = import.meta.env.VITE_HRIDAY_ADAPTER_MODE;
  if (raw === undefined || raw === '') return 'demo';
  if (raw === 'demo' || raw === 'backend') return raw;

  // Fail closed: an unknown deployment mode must never silently expose the
  // synthetic adapter as if it were a real backend-connected deployment.
  throw new Error(
    `Invalid VITE_HRIDAY_ADAPTER_MODE="${raw}". Expected "demo" or "backend".`,
  );
}

/**
 * Resolve the adapter from an explicit deployment setting.
 *
 * Demo is the safe default for the public frontend preview. Backend mode must
 * be explicitly enabled; it never falls back to synthetic data when the
 * production adapter is unavailable.
 */
export function getHRIDAYAdapter(mode?: AdapterMode): HRIDAYAdapter {
  return resolveConfiguredMode(mode) === 'backend' ? backendAdapter : demoAdapter;
}

export function getAdapterMode(mode?: AdapterMode): AdapterMode {
  return resolveConfiguredMode(mode);
}
