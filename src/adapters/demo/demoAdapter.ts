import type { EngineeringFinding, HRIDAYAdapter } from '../types';

const findings: EngineeringFinding[] = [
  { assetId: 'P-101', claim: 'P-101 identified as pump', source: 'P&ID · page 1 · region 43,37', confidence: 0.9, reviewState: 'observed' },
  { assetId: 'XV-201', claim: 'XV-201 is on the discharge path', source: 'P&ID · page 1 · topology edge', confidence: 0.86, reviewState: 'review' },
  { assetId: 'P-101', claim: 'Upstream suction isolation is unresolved', source: 'Engineering analysis · P-101', confidence: 0.65, reviewState: 'needs_verification' },
];

export const demoAdapter: HRIDAYAdapter = {
  async runTask(task) {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return {
      taskId: `demo-${Date.now()}`,
      summary: `Demo result for: ${task}`,
      workspace: /p&id|pid|pump|isola/i.test(task) ? 'engineering' : 'evidence',
      steps: [
        { id: 'task', label: 'Task received', status: 'complete' },
        { id: 'tool', label: 'Engineering Tool activated', status: 'complete' },
        { id: 'topology', label: 'Topology queried', status: 'complete' },
        { id: 'evidence', label: 'Evidence collected', status: 'complete' },
      ],
      findings,
      demo: true,
    };
  },

  async getEvidence(assetId) {
    return findings.filter((finding) => finding.assetId === assetId);
  },
};
