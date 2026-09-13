export type WorkspaceId = 'engineering' | 'pid' | 'topology' | 'document' | 'data' | 'evidence' | 'artifact';

export type AgentStep = {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'complete' | 'blocked';
};

export type EngineeringFinding = {
  assetId: string;
  claim: string;
  source: string;
  confidence: number;
  reviewState: 'observed' | 'review' | 'needs_verification';
};

export type WorkbenchTaskResult = {
  taskId: string;
  summary: string;
  workspace: WorkspaceId;
  steps: AgentStep[];
  findings: EngineeringFinding[];
  demo: boolean;
};

export interface HRIDAYAdapter {
  runTask(task: string): Promise<WorkbenchTaskResult>;
  getEvidence(assetId: string): Promise<EngineeringFinding[]>;
}
