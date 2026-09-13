export interface PipelineStage {
  id: string;
  label: string;
  description: string;
  term: string;
  icon: string;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'input',
    label: 'Document Input',
    description: 'Ingest brownfield P&ID drawings in raster or vector format.',
    term: 'Multi-format ingestion',
    icon: 'FileInput',
  },
  {
    id: 'perception',
    label: 'Perception Engine',
    description: 'Computer vision detects lines, symbols, and text regions.',
    term: 'Document perception + OCR extraction',
    icon: 'ScanLine',
  },
  {
    id: 'geometry',
    label: 'Geometry Truth Engine',
    description: 'Deterministic topology reconstruction from detected primitives.',
    term: 'Deterministic topology reconstruction',
    icon: 'Ruler',
  },
  {
    id: 'graph',
    label: 'Knowledge Graph',
    description: 'Entities and connections structured into a queryable graph.',
    term: 'Knowledge graph creation',
    icon: 'Share2',
  },
  {
    id: 'safety',
    label: 'Safety Verification',
    description: 'Isolation boundary verification against engineering rules.',
    term: 'Isolation boundary verification',
    icon: 'ShieldCheck',
  },
  {
    id: 'approval',
    label: 'Human Approval',
    description: 'Engineer reviews evidence and signs off on the package.',
    term: 'Human-in-the-loop approval',
    icon: 'UserCheck',
  },
];

export interface DetectedEntity {
  id: string;
  type: 'Equipment' | 'Valve' | 'Pipe' | 'Instrument';
  label: string;
  confidence: number;
  topology: 'Verified' | 'Pending' | 'Review';
  connectedAssets: string[];
  coordinates: { x: number; y: number };
}

export const DETECTED_ENTITIES: DetectedEntity[] = [
  {
    id: 'P-101',
    type: 'Equipment',
    label: 'Centrifugal Pump',
    confidence: 98.7,
    topology: 'Verified',
    connectedAssets: ['XV-201', 'V-202', 'PI-101'],
    coordinates: { x: 35, y: 42 },
  },
  {
    id: 'XV-201',
    type: 'Valve',
    label: 'Isolation Valve',
    confidence: 96.2,
    topology: 'Verified',
    connectedAssets: ['P-101', 'V-202'],
    coordinates: { x: 58, y: 35 },
  },
  {
    id: 'V-202',
    type: 'Valve',
    label: 'Control Valve',
    confidence: 94.8,
    topology: 'Verified',
    connectedAssets: ['P-101', 'XV-201', 'TI-204'],
    coordinates: { x: 62, y: 58 },
  },
  {
    id: 'PI-101',
    type: 'Instrument',
    label: 'Pressure Indicator',
    confidence: 91.3,
    topology: 'Verified',
    connectedAssets: ['P-101'],
    coordinates: { x: 28, y: 28 },
  },
  {
    id: 'TI-204',
    type: 'Instrument',
    label: 'Temperature Indicator',
    confidence: 89.5,
    topology: 'Pending',
    connectedAssets: ['V-202'],
    coordinates: { x: 75, y: 62 },
  },
  {
    id: 'PIPE-A1',
    type: 'Pipe',
    label: '6" Carbon Steel Pipe',
    confidence: 97.1,
    topology: 'Verified',
    connectedAssets: ['P-101', 'XV-201'],
    coordinates: { x: 48, y: 38 },
  },
];

export interface GraphNode {
  id: string;
  label: string;
  type: 'equipment' | 'valve' | 'pipe' | 'instrument';
  x: number;
  y: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  label: string;
}

export const GRAPH_NODES: GraphNode[] = [
  { id: 'P-101', label: 'P-101', type: 'equipment', x: 300, y: 250 },
  { id: 'XV-201', label: 'XV-201', type: 'valve', x: 520, y: 180 },
  { id: 'V-202', label: 'V-202', type: 'valve', x: 560, y: 340 },
  { id: 'PI-101', label: 'PI-101', type: 'instrument', x: 140, y: 160 },
  { id: 'TI-204', label: 'TI-204', type: 'instrument', x: 680, y: 400 },
  { id: 'PIPE-A1', label: 'PIPE-A1', type: 'pipe', x: 420, y: 280 },
  { id: 'DV-201', label: 'DV-201', type: 'valve', x: 200, y: 380 },
];

export const GRAPH_EDGES: GraphEdge[] = [
  { from: 'P-101', to: 'XV-201', label: '6" pipe' },
  { from: 'P-101', to: 'V-202', label: '6" pipe' },
  { from: 'P-101', to: 'PI-101', label: 'tap' },
  { from: 'P-101', to: 'PIPE-A1', label: 'main' },
  { from: 'XV-201', to: 'V-202', label: 'branch' },
  { from: 'V-202', to: 'TI-204', label: 'tap' },
  { from: 'P-101', to: 'DV-201', label: 'drain' },
];

export interface AssetEvidence {
  assetId: string;
  type: string;
  connections: string[];
  sourceDrawing: string;
  coordinates: string;
  confidence: number;
  description: string;
}

export const ASSET_EVIDENCE: Record<string, AssetEvidence> = {
  'P-101': {
    assetId: 'P-101',
    type: 'Centrifugal Pump',
    connections: ['XV-201', 'V-202', 'PI-101', 'PIPE-A1', 'DV-201'],
    sourceDrawing: 'PID-SIH26117-Sheet-04.dwg',
    coordinates: 'Grid D-7, (340, 420)',
    confidence: 98.7,
    description: 'Primary centrifugal pump identified via symbol recognition with 98.7% confidence. Suction and discharge nozzles mapped to connected pipe segments.',
  },
  'XV-201': {
    assetId: 'XV-201',
    type: 'Isolation Valve',
    connections: ['P-101', 'V-202'],
    sourceDrawing: 'PID-SIH26117-Sheet-04.dwg',
    coordinates: 'Grid E-7, (580, 350)',
    confidence: 96.2,
    description: 'Gate valve symbol matched against ISO 10628 symbol library. Isolation function confirmed by line topology tracing.',
  },
  'V-202': {
    assetId: 'V-202',
    type: 'Control Valve',
    connections: ['P-101', 'XV-201', 'TI-204'],
    sourceDrawing: 'PID-SIH26117-Sheet-04.dwg',
    coordinates: 'Grid E-8, (620, 580)',
    confidence: 94.8,
    description: 'Control valve with actuator symbol identified. Fail-position annotation detected via OCR at 94.8% confidence.',
  },
  'PI-101': {
    assetId: 'PI-101',
    type: 'Pressure Indicator',
    connections: ['P-101'],
    sourceDrawing: 'PID-SIH26117-Sheet-04.dwg',
    coordinates: 'Grid C-6, (140, 280)',
    confidence: 91.3,
    description: 'Pressure instrument circle symbol recognized. Tag PI-101 extracted via OCR with 91.3% confidence.',
  },
  'TI-204': {
    assetId: 'TI-204',
    type: 'Temperature Indicator',
    connections: ['V-202'],
    sourceDrawing: 'PID-SIH26117-Sheet-04.dwg',
    coordinates: 'Grid F-8, (760, 620)',
    confidence: 89.5,
    description: 'Temperature instrument detected. Topology link to V-202 pending verification — partial line trace.',
  },
  'PIPE-A1': {
    assetId: 'PIPE-A1',
    type: '6" Carbon Steel Pipe',
    connections: ['P-101', 'XV-201'],
    sourceDrawing: 'PID-SIH26117-Sheet-04.dwg',
    coordinates: 'Grid D-E/7, (420-580, 350)',
    confidence: 97.1,
    description: 'Pipe segment traced from pump discharge to isolation valve. Line number and spec annotation extracted via OCR.',
  },
  'DV-201': {
    assetId: 'DV-201',
    type: 'Drain Valve',
    connections: ['P-101'],
    sourceDrawing: 'PID-SIH26117-Sheet-04.dwg',
    coordinates: 'Grid D-9, (200, 760)',
    confidence: 93.4,
    description: 'Drain valve at pump casing low point. Identified as isolation candidate for boundary preparation.',
  },
};

export interface IsolationCandidate {
  id: string;
  type: string;
  function: string;
  status: 'identified' | 'traversed' | 'verified';
}

export const ISOLATION_CANDIDATES: IsolationCandidate[] = [
  { id: 'XV-101', type: 'Isolation Valve', function: 'Suction isolation', status: 'verified' },
  { id: 'XV-102', type: 'Isolation Valve', function: 'Discharge isolation', status: 'verified' },
  { id: 'DV-201', type: 'Drain Valve', function: 'Casing drain', status: 'verified' },
];

export interface AuditDocument {
  name: string;
  format: string;
  description: string;
  size: string;
  status: 'ready';
}

export const AUDIT_DOCUMENTS: AuditDocument[] = [
  {
    name: 'Isolation Package',
    format: 'DOCX',
    description: 'Engineer-ready isolation procedure with boundary diagrams, safety tags, and sign-off fields.',
    size: '2.4 MB',
    status: 'ready',
  },
  {
    name: 'JSON Payload',
    format: 'JSON',
    description: 'Machine-readable isolation topology, entity graph, and confidence metadata for downstream systems.',
    size: '184 KB',
    status: 'ready',
  },
  {
    name: 'Evidence Manifest',
    format: 'PDF',
    description: 'Per-asset evidence trail: source coordinates, OCR snippets, symbol matches, and confidence scores.',
    size: '6.1 MB',
    status: 'ready',
  },
];
