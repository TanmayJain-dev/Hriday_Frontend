import type { HRIDAYAdapter } from './types';
import { backendAdapter } from './backend/backendAdapter';
import { demoAdapter } from './demo/demoAdapter';

export type AdapterMode = 'demo' | 'backend';

/** Explicit selection only: production must never silently fall back to demo data. */
export function getHRIDAYAdapter(mode: AdapterMode = 'demo'): HRIDAYAdapter {
  return mode === 'backend' ? backendAdapter : demoAdapter;
}
