export type WorkspaceId = 'engineering' | 'pid' | 'topology' | 'document' | 'data' | 'evidence' | 'artifact' | 'verification' | 'isolation';

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

export type AdapterError = {
  code: 'BACKEND_NOT_CONNECTED' | 'TASK_UNSUPPORTED' | 'UNAVAILABLE';
  message: string;
};

export interface HRIDAYAdapter {
  runTask(task: string): Promise<WorkbenchTaskResult>;
  getEvidence(assetId: string): Promise<EngineeringFinding[]>;
}
