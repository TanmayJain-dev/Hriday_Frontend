import type { EngineeringFinding, HRIDAYAdapter, WorkspaceId } from '../types';

const findings: EngineeringFinding[] = [
  { assetId: 'P-101', claim: 'P-101 identified as pump', source: 'P&ID · page 1 · region 43,37', confidence: 0.9, reviewState: 'observed' },
  { assetId: 'XV-201', claim: 'XV-201 is on the discharge path', source: 'P&ID · page 1 · topology edge', confidence: 0.86, reviewState: 'review' },
  { assetId: 'P-101', claim: 'Upstream suction isolation is unresolved', source: 'Engineering analysis · P-101', confidence: 0.65, reviewState: 'needs_verification' },
];

function routeTask(task: string): WorkspaceId {
  const value = task.toLowerCase();
  if (/p&id|pid|drawing|visual/.test(value)) return 'pid';
  if (/topology|connect|path|graph/.test(value)) return 'topology';
  if (/evidence|source|provenance|verify/.test(value)) return 'evidence';
  if (/document|sop|report|approval note/.test(value)) return 'document';
  if (/data|csv|table|trend/.test(value)) return 'data';
  if (/artifact|deliver|export|docx|xlsx|pptx/.test(value)) return 'artifact';
  return 'engineering';
}

export const demoAdapter: HRIDAYAdapter = {
  async runTask(task) {
    await new Promise((resolve) => setTimeout(resolve, 900));
    const workspace = routeTask(task);
    return {
      taskId: `demo-${Date.now()}`,
      summary: `Synthetic workbench trace for: ${task}`,
      workspace,
      steps: [
        { id: 'task', label: 'Task received', status: 'complete' },
        { id: 'route', label: `Context routed → ${workspace}`, status: 'complete' },
        { id: 'tool', label: 'Specialist tool activated', status: 'complete' },
        { id: 'topology', label: 'Structured evidence queried', status: 'complete' },
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
