import type { HRIDAYAdapter, WorkbenchTaskResult, EngineeringFinding } from '../types';

/**
 * Production adapter boundary.
 *
 * Deliberately contains no guessed API routes. The backend contract should be
 * wired here only after the real HRIDAY service exposes a stable interface.
 */
export const backendAdapter: HRIDAYAdapter = {
  async runTask(_task): Promise<WorkbenchTaskResult> {
    throw new Error('HRIDAY backend adapter is not connected yet. Select an explicit demo adapter for local UI testing.');
  },

  async getEvidence(_assetId): Promise<EngineeringFinding[]> {
    throw new Error('HRIDAY backend adapter is not connected yet.');
  },
};
