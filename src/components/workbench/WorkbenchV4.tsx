import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Activity, ArrowLeft, Bot, Check, ChevronRight, Command, Database, Download,
  FileText, GitBranch, Layers3, Maximize2, Minimize2, MousePointer2, Network,
  PanelRight, Search, ShieldCheck, SlidersHorizontal, Sparkles, Upload, X,
  ZoomIn, ZoomOut, Crosshair, AlertTriangle, CheckCircle2, LockKeyhole,
} from 'lucide-react';
import { getAdapterMode, getHRIDAYAdapter } from '@/adapters';
import type { EngineeringFinding, WorkspaceId, WorkbenchTaskResult } from '@/adapters/types';

type ViewId = 'overview' | WorkspaceId | 'verification' | 'isolation';
type TaskState = 'idle' | 'running' | 'complete' | 'blocked';
type Asset = { id: string; x: number; y: number; type: string };

type Props = { onExit: () => void };

const ASSETS: Asset[] = [
  { id: 'P-101', x: 18, y: 52, type: 'Pump' },
  { id: 'XV-201', x: 48, y: 52, type: 'Valve' },
  { id: 'V-202', x: 80, y: 52, type: 'Vessel' },
  { id: 'PT-301', x: 35, y: 28, type: 'Instrument' },
  { id: 'DV-101', x: 35, y: 76, type: 'Drain' },
];

const WORKSPACES: Array<{ id: WorkspaceId; label: string; icon: typeof Network; description: string }> = [
  { id: 'engineering', label: 'Engineering', icon: GitBranch, description: 'Reasoning and maintenance context' },
  { id: 'pid', label: 'P&ID', icon: Network, description: 'CAD-style drawing evidence' },
  { id: 'topology', label: 'Topology', icon: GitBranch, description: 'Governed connectivity graph' },
  { id: 'document', label: 'Documents', icon: FileText, description: 'Local document context' },
  { id: 'data', label: 'Data', icon: Database, description: 'Tables and analysis' },
  { id: 'evidence', label: 'Evidence', icon: ShieldCheck, description: 'Claims and provenance' },
  { id: 'artifact', label: 'Artifact', icon: Download, description: 'Deliverable draft' },
];

const QUICK_TASKS = [
  'Analyze P-101 and prepare an isolation summary',
  'Find the relevant SOP and check for procedural conflicts',
  'Prepare an evidence-backed approval note',
];

function Pill({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'good' | 'warn' }) {
  const c = tone === 'good'
    ? 'border-emerald-400/20 bg-emerald-400/5 text-emerald-200'
    : tone === 'warn'
      ? 'border-amber-300/20 bg-amber-300/5 text-amber-200'
      : 'border-white/10 bg-white/[.03] text-zinc-400';
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider ${c}`}>{children}</span>;
}

function IconButton({ label, onClick, children, active = false }: { label: string; onClick: () => void; children: ReactNode; active?: boolean }) {
  return <button aria-label={label} title={label} onClick={onClick} className={`rounded-md border p-2 transition ${active ? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100' : 'border-white/10 bg-black/55 text-zinc-500 hover:border-white/20 hover:text-white'}`}>{children}</button>;
}

function WorkflowBar({ active, onChange }: { active: ViewId; onChange: (v: ViewId) => void }) {
  const items: Array<{ id: ViewId; label: string; compact?: boolean }> = [
    { id: 'overview', label: 'Mission' },
    { id: 'engineering', label: 'Reason' },
    { id: 'pid', label: 'P&ID' },
    { id: 'topology', label: 'Graph' },
    { id: 'evidence', label: 'Evidence' },
    { id: 'verification', label: 'Verify' },
    { id: 'isolation', label: 'Isolation' },
    { id: 'artifact', label: 'Deliver' },
  ];
  return <div className="flex min-w-max items-center gap-1 overflow-x-auto border-b border-white/8 bg-[#070b0e]/90 px-3 py-2 backdrop-blur-xl">
    {items.map((item, index) => <div key={item.id} className="flex items-center gap-1">
      <button onClick={() => onChange(item.id)} aria-current={active === item.id ? 'step' : undefined} className={`rounded-md px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-wider transition ${active === item.id ? 'bg-cyan-300/10 text-cyan-100' : 'text-zinc-600 hover:text-zinc-300'}`}>
        <span className="mr-1.5 opacity-40">0{index + 1}</span>{item.label}
      </button>
      {index < items.length - 1 && <ChevronRight size={10} className="text-zinc-800" />}
    </div>)}
  </div>;
}

function AssetInspector({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  const role = ASSETS.find(a => a.id === selected)?.type ?? 'Asset';
  const observation = selected === 'P-101'
    ? 'Upstream suction isolation is unresolved.'
    : selected === 'XV-201'
      ? 'XV-201 is on the discharge path.'
      : 'No additional demo finding.';
  return <aside className="rounded-xl border border-white/10 bg-[#070c0f] p-4">
    <div className="mb-4 flex items-start justify-between gap-3"><div><div className="font-mono text-[8px] uppercase tracking-[.2em] text-zinc-600">Selected entity</div><div className="mt-1 font-mono text-sm text-cyan-100">{selected}</div></div><Pill tone={selected === 'P-101' ? 'warn' : 'neutral'}>{role}</Pill></div>
    <div className="space-y-3 text-[10px] leading-5 text-zinc-500">
      <div className="flex justify-between"><span>Class</span><span className="text-zinc-300">{role}</span></div>
      <div><span>Observation</span><p className="mt-1 text-zinc-400">{observation}</p></div>
      <div className="border-t border-white/5 pt-3"><span>Truth boundary</span><p className="mt-1 text-zinc-600">Selection is read-only. Structured engineering truth remains outside the model.</p></div>
    </div>
    {selected !== 'P-101' && <button onClick={() => onSelect('P-101')} className="mt-4 rounded-md border border-white/10 px-2.5 py-1.5 text-[9px] text-zinc-400 hover:text-white">Focus P-101</button>}
  </aside>;
}

function PIDWorkspace({ selected, onSelect, expanded, onExpand }: { selected: string; onSelect: (id: string) => void; expanded: boolean; onExpand: () => void }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [showUncertainty, setShowUncertainty] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => { setPan({ x: 0, y: 0 }); }, [zoom]);
  const zoomBy = (delta: number) => setZoom(z => Math.min(2.4, Math.max(.55, +(z + delta).toFixed(2))));
  const fit = () => { setZoom(1); setPan({ x: 0, y: 0 }); };
  const onPointerDown = (e: React.PointerEvent) => { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); setDrag({ x: e.clientX - pan.x, y: e.clientY - pan.y }); };
  const onPointerMove = (e: React.PointerEvent) => { if (drag) setPan({ x: e.clientX - drag.x, y: e.clientY - drag.y }); };
  const onPointerUp = () => setDrag(null);

  return <div className={`grid min-h-0 gap-3 ${expanded ? 'h-full xl:grid-cols-[1fr_290px]' : 'xl:grid-cols-[1fr_270px]'}`}>
    <div className="relative min-h-[500px] overflow-hidden rounded-xl border border-white/10 bg-[#071014] select-none" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
      {showGrid && <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(90,220,220,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(90,220,220,.07) 1px, transparent 1px)', backgroundSize: `${32 / zoom}px ${32 / zoom}px`, backgroundPosition: `${pan.x}px ${pan.y}px` }} />}
      <div className="absolute left-4 top-4 z-30 flex flex-wrap items-center gap-2"><Pill tone="warn">DEMO P&ID · SYNTHETIC VISUAL DATA</Pill><Pill>Sheet 01 · D-7</Pill></div>
      <div className="absolute right-4 top-4 z-30 flex gap-1">
        <IconButton label="Toggle grid" onClick={() => setShowGrid(v => !v)} active={showGrid}><Layers3 size={13}/></IconButton>
        <IconButton label="Toggle uncertainty" onClick={() => setShowUncertainty(v => !v)} active={showUncertainty}><AlertTriangle size={13}/></IconButton>
        <IconButton label="Zoom out" onClick={() => zoomBy(-.1)}><ZoomOut size={13}/></IconButton>
        <IconButton label="Zoom in" onClick={() => zoomBy(.1)}><ZoomIn size={13}/></IconButton>
        <IconButton label="Fit drawing" onClick={fit}><Crosshair size={13}/></IconButton>
        <IconButton label={expanded ? 'Exit focused view' : 'Focus viewer'} onClick={onExpand}>{expanded ? <Minimize2 size={13}/> : <Maximize2 size={13}/>}</IconButton>
      </div>
      <div className="absolute bottom-4 left-4 z-20 rounded-md border border-white/8 bg-black/55 px-3 py-2 font-mono text-[8px] text-zinc-600 backdrop-blur">PAN {Math.round(pan.x)}:{Math.round(pan.y)} · Z {Math.round(zoom * 100)}% · READ ONLY</div>
      <svg ref={svgRef} viewBox="0 0 900 500" className="absolute inset-0 h-full w-full p-12" style={{ transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})`, transformOrigin: 'center' }} aria-label="Synthetic CAD-style P and ID drawing">
        <rect x="25" y="25" width="850" height="450" fill="none" stroke="rgba(255,255,255,.06)" />
        <path d="M90 255 H790 M350 255 V105 M350 255 V405 M350 105 H535 M350 405 H535" fill="none" stroke="rgba(103,232,249,.48)" strokeWidth="4"/>
        <path d="M230 255 H300 M405 255 H475 M575 255 H675" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="2" strokeDasharray="8 7"/>
        <circle cx="350" cy="255" r="7" fill="none" stroke="rgba(103,232,249,.55)" strokeWidth="2"/>
        <path d="M175 215 v80 l42 -40z" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="2"/>
        <circle cx="505" cy="255" r="27" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="2"/>
        <path d="M492 255h26 M505 242v26" stroke="rgba(255,255,255,.2)" />
        {showUncertainty && <g><circle cx="270" cy="255" r="10" fill="rgba(245,158,11,.1)" stroke="rgba(245,158,11,.7)" strokeDasharray="3 3"/><text x="248" y="225" fill="rgba(245,158,11,.75)" fontSize="11" fontFamily="monospace">UNRESOLVED</text></g>}
      </svg>
      {ASSETS.map(a => <button key={a.id} aria-label={`Select ${a.id}`} onClick={(e) => { e.stopPropagation(); onSelect(a.id); }} className="absolute z-20 -translate-x-1/2 -translate-y-1/2" style={{ left: `${50 + (a.x - 50) * zoom + pan.x / 10}%`, top: `${50 + (a.y - 50) * zoom + pan.y / 10}%` }}>
        <div className={`min-w-16 rounded-lg border px-2 py-2 text-center transition ${selected === a.id ? 'scale-110 border-cyan-300 bg-cyan-300/15 text-cyan-100 shadow-[0_0_30px_rgba(103,232,249,.16)]' : 'border-white/15 bg-[#0b171b] text-zinc-300 hover:border-cyan-400/50'}`}><div className="font-mono text-[10px] font-semibold">{a.id}</div><div className="text-[7px] uppercase tracking-wider text-zinc-600">{a.type}</div></div>
      </button>)}
    </div>
    <AssetInspector selected={selected} onSelect={onSelect}/>
  </div>;
}

function TopologyWorkspace({ selected, onSelect, expanded, onExpand }: { selected: string; onSelect: (id: string) => void; expanded: boolean; onExpand: () => void }) {
  const [layout, setLayout] = useState<'pfd' | 'spatial'>('pfd');
  const [showMini, setShowMini] = useState(true);
  const nodes = layout === 'pfd'
    ? [['P-101', 18, 50, 'Pump'], ['XV-201', 50, 50, 'Valve'], ['V-202', 82, 50, 'Vessel'], ['DV-101', 50, 76, 'Drain']] as const
    : [['P-101', 25, 55, 'Pump'], ['XV-201', 55, 35, 'Valve'], ['V-202', 78, 58, 'Vessel'], ['DV-101', 45, 78, 'Drain']] as const;
  const selectedIndex = nodes.findIndex(n => n[0] === selected);
  const pathIds = selected === 'P-101' ? ['P-101', 'XV-201', 'V-202'] : selected === 'XV-201' ? ['P-101', 'XV-201', 'V-202'] : [];
  return <div className={`relative min-h-0 ${expanded ? 'h-full' : ''}`}>
    <div className="relative min-h-[500px] overflow-hidden rounded-xl border border-white/10 bg-[#071014]">
      <div className="absolute left-4 top-4 z-30 flex flex-wrap gap-2"><Pill>GRAPHSTORE VIEW · READ ONLY</Pill><Pill tone="good">DETERMINISTIC LAYOUT</Pill></div>
      <div className="absolute right-4 top-4 z-30 flex gap-1">
        <button onClick={() => setLayout(m => m === 'pfd' ? 'spatial' : 'pfd')} className="rounded-md border border-white/10 bg-black/55 px-3 py-2 font-mono text-[8px] uppercase tracking-wider text-zinc-400 hover:text-white">{layout === 'pfd' ? 'Spatial' : 'PFD'} layout</button>
        <IconButton label={showMini ? 'Hide minimap' : 'Show minimap'} onClick={() => setShowMini(v => !v)} active={showMini}><Network size={13}/></IconButton>
        <IconButton label={expanded ? 'Exit focused view' : 'Focus graph'} onClick={onExpand}>{expanded ? <Minimize2 size={13}/> : <Maximize2 size={13}/>}</IconButton>
      </div>
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.16) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        <line x1="18%" y1="50%" x2="50%" y2={layout === 'pfd' ? '50%' : '35%'} stroke={pathIds.includes('P-101') ? 'rgba(103,232,249,.75)' : 'rgba(103,232,249,.35)'} strokeWidth={pathIds.includes('P-101') ? 4 : 2}/>
        <line x1="50%" y1={layout === 'pfd' ? '50%' : '35%'} x2="82%" y2={layout === 'pfd' ? '50%' : '58%'} stroke={pathIds.includes('XV-201') ? 'rgba(103,232,249,.75)' : 'rgba(103,232,249,.35)'} strokeWidth={pathIds.includes('XV-201') ? 4 : 2}/>
        <line x1="50%" y1={layout === 'pfd' ? '50%' : '35%'} x2="45%" y2="78%" stroke="rgba(245,158,11,.58)" strokeWidth="2" strokeDasharray="7 6"/>
      </svg>
      {nodes.map(([id, x, y, type]) => <button key={id} onClick={() => onSelect(id)} aria-label={`Select topology node ${id}`} className="absolute z-20 -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
        <div className={`relative flex h-16 w-28 flex-col items-center justify-center rounded-xl border transition ${selected === id ? 'border-cyan-300 bg-cyan-300/10 shadow-[0_0_35px_rgba(103,232,249,.14)]' : pathIds.includes(id) ? 'border-cyan-400/40 bg-cyan-300/5' : 'border-white/12 bg-[#0b171b] hover:border-cyan-400/40'}`}>
          {pathIds.includes(id) && <span className="absolute -top-2 right-2 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,.8)]"/>}
          <span className="font-mono text-xs text-cyan-100">{id}</span><span className="text-[9px] uppercase tracking-wider text-zinc-600">{type}</span>
        </div>
      </button>)}
      {showMini && <div className="absolute bottom-4 right-4 z-30 h-24 w-36 rounded-lg border border-white/10 bg-[#05090b]/90 p-2 backdrop-blur"><div className="mb-1 font-mono text-[7px] uppercase tracking-widest text-zinc-700">Minimap</div><div className="relative h-[70px] w-full rounded bg-white/[.02]"><span className="absolute left-[15%] top-[45%] h-2 w-2 rounded-full bg-cyan-300"/><span className="absolute left-[48%] top-[45%] h-2 w-2 rounded-full bg-cyan-300"/><span className="absolute left-[78%] top-[45%] h-2 w-2 rounded-full bg-cyan-300"/><span className="absolute left-[45%] top-[73%] h-2 w-2 rounded-full bg-amber-300"/></div></div>}
      <div className="absolute bottom-4 left-4 z-20 flex flex-wrap gap-4 font-mono text-[8px] text-zinc-600"><span>━ accepted relationship</span><span className="text-amber-200">┄ uncertainty retained</span><span>nodes {nodes.length}</span>{selectedIndex >= 0 && <span>selected {selected}</span>}</div>
    </div>
    <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_270px]"><div className="rounded-xl border border-white/10 bg-white/[.02] p-4"><div className="flex items-center gap-2"><GitBranch size={13} className="text-cyan-300"/><span className="text-xs font-medium">Highlighted engineering path</span></div><div className="mt-3 flex flex-wrap items-center gap-2">{pathIds.length ? pathIds.map((id, i) => <span key={id} className="flex items-center gap-2">{i > 0 && <ChevronRight size={11} className="text-zinc-700"/>}<button onClick={() => onSelect(id)} className="rounded-md border border-cyan-300/20 bg-cyan-300/5 px-2.5 py-1.5 font-mono text-[9px] text-cyan-100">{id}</button></span>) : <span className="text-[10px] text-zinc-600">Select P-101 or XV-201 to highlight a connected path.</span>}</div></div><AssetInspector selected={selected} onSelect={onSelect}/></div>
  </div>;
}

function Findings({ findings, onSelect }: { findings: EngineeringFinding[]; onSelect?: (id: string) => void }) {
  const [filter, setFilter] = useState<'all' | 'flags' | 'observed'>('all');
  const visible = findings.filter(f => filter === 'all' || (filter === 'flags' ? f.reviewState !== 'observed' : f.reviewState === 'observed'));
  return <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[.02]"><div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3"><div className="flex gap-1">{(['all','flags','observed'] as const).map(f => <button key={f} onClick={() => setFilter(f)} className={`rounded-md px-2.5 py-1.5 font-mono text-[8px] uppercase ${filter === f ? 'bg-cyan-300/10 text-cyan-200' : 'text-zinc-600 hover:text-zinc-300'}`}>{f}</button>)}</div><span className="font-mono text-[9px] text-zinc-600">{visible.length} records</span></div><div className="hidden grid-cols-[1fr_2fr_1.4fr_.7fr_1fr] border-b border-white/10 px-4 py-3 font-mono text-[9px] uppercase tracking-wider text-zinc-600 md:grid"><span>Asset</span><span>Claim</span><span>Source</span><span>Confidence</span><span>Review</span></div>{visible.map((f, i) => <button key={`${f.assetId}-${i}`} onClick={() => onSelect?.(f.assetId)} className="grid w-full gap-2 border-b border-white/5 px-4 py-3 text-left last:border-0 hover:bg-white/[.025] md:grid-cols-[1fr_2fr_1.4fr_.7fr_1fr] md:items-center"><span className="font-mono text-[10px] text-cyan-200">{f.assetId}</span><span className="text-[10px] text-zinc-300">{f.claim}</span><span className="text-[10px] text-zinc-500">{f.source}</span><span className="font-mono text-[10px] text-zinc-400">{Math.round(f.confidence * 100)}%</span><Pill tone={f.reviewState === 'needs_verification' ? 'warn' : f.reviewState === 'observed' ? 'good' : 'neutral'}>{f.reviewState.replace('_', ' ')}</Pill></button>)}</div>;
}

function VerificationWorkspace({ findings, onSelect, onDone }: { findings: EngineeringFinding[]; onSelect: (id: string) => void; onDone: () => void }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const flags = findings.filter(f => f.reviewState !== 'observed');
  const allDone = flags.length > 0 && flags.every(f => checked[f.assetId]);
  return <div className="space-y-4"><div className="flex flex-wrap items-end justify-between gap-3"><div><Pill tone="warn"><LockKeyhole size={10}/> Human verification required</Pill><h2 className="mt-2 text-xl font-medium">Verification Desk</h2><p className="mt-1 max-w-2xl text-xs leading-5 text-zinc-600">Review flagged claims against the source drawing. This demo never turns a finding into verified engineering truth automatically.</p></div><div className="font-mono text-[9px] text-zinc-600">{Object.values(checked).filter(Boolean).length}/{flags.length} reviewed</div></div><div className="grid gap-3 lg:grid-cols-2">{flags.map(f => <div key={f.assetId} className="rounded-xl border border-amber-300/15 bg-amber-300/[.025] p-4"><div className="flex items-start justify-between gap-3"><div><div className="font-mono text-[10px] text-cyan-200">{f.assetId}</div><div className="mt-2 text-sm text-zinc-300">{f.claim}</div></div><Pill tone="warn">{Math.round(f.confidence * 100)}%</Pill></div><div className="mt-3 text-[10px] text-zinc-600">Source: {f.source}</div><div className="mt-4 flex gap-2"><button onClick={() => onSelect(f.assetId)} className="rounded-md border border-white/10 px-3 py-2 text-[9px] text-zinc-400 hover:text-white"><MousePointer2 size={11} className="mr-1 inline"/>Open source</button><button onClick={() => setChecked(v => ({ ...v, [f.assetId]: !v[f.assetId] }))} className={`rounded-md border px-3 py-2 text-[9px] ${checked[f.assetId] ? 'border-emerald-300/20 bg-emerald-300/5 text-emerald-200' : 'border-white/10 text-zinc-400 hover:text-white'}`}>{checked[f.assetId] ? <CheckCircle2 size={11} className="mr-1 inline"/> : <Check size={11} className="mr-1 inline"/>}{checked[f.assetId] ? 'Reviewed' : 'Mark reviewed'}</button></div></div>)}{!flags.length && <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/[.03] p-6 text-sm text-emerald-100">No flagged findings in the current evidence set.</div>}</div><button disabled={!allDone} onClick={onDone} className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-4 py-2.5 text-xs font-medium text-cyan-100 disabled:cursor-not-allowed disabled:opacity-30">Continue to isolation</button></div>;
}

function IsolationWorkspace({ findings, selected, onSelect }: { findings: EngineeringFinding[]; selected: string; onSelect: (id: string) => void }) {
  const items = [
    { tag: 'XV-201', role: 'Discharge isolation', state: 'candidate', evidence: 'topology + P&ID' },
    { tag: 'DV-101', role: 'Drain / depressurization', state: 'candidate', evidence: 'P&ID' },
    { tag: 'PT-301', role: 'Pressure indication', state: 'verification point', evidence: 'instrument tag' },
  ];
  const unresolved = findings.some(f => f.assetId === 'P-101' && f.reviewState !== 'observed');
  return <div className="space-y-4"><div><Pill tone="warn"><AlertTriangle size={10}/> Decision support only</Pill><h2 className="mt-2 text-xl font-medium">Isolation Workspace</h2><p className="mt-1 max-w-2xl text-xs leading-5 text-zinc-600">Candidate controls are surfaced from the demo evidence. HRIDAY does not execute LOTO, actuate plant equipment, or authorize work.</p></div><div className="rounded-xl border border-white/10 bg-white/[.02] p-4"><div className="grid gap-2">{items.map(item => <button key={item.tag} onClick={() => onSelect(item.tag)} className={`grid gap-3 rounded-lg border p-3 text-left transition sm:grid-cols-[120px_1fr_150px] ${selected === item.tag ? 'border-cyan-300/30 bg-cyan-300/5' : 'border-white/7 hover:border-white/15'}`}><span className="font-mono text-[10px] text-cyan-200">{item.tag}</span><span><span className="block text-xs text-zinc-300">{item.role}</span><span className="mt-1 block text-[9px] text-zinc-600">{item.evidence}</span></span><Pill tone={item.state === 'candidate' ? 'neutral' : 'warn'}>{item.state}</Pill></button>)}</div>{unresolved && <div className="mt-4 flex gap-3 rounded-lg border border-amber-300/15 bg-amber-300/[.025] p-3 text-[10px] leading-5 text-amber-100"><AlertTriangle size={14} className="mt-0.5 shrink-0"/><span>Upstream suction isolation remains unresolved. Do not treat this workspace as a complete isolation procedure.</span></div>}</div></div>;
}

function GenericWorkspace({ active }: { active: ViewId }) {
  const copy: Record<string, { title: string; text: string; icon: typeof Database }> = {
    engineering: { title: 'Engineering context', text: 'A unified reasoning surface for local documents, structured engineering data and specialist tools.', icon: GitBranch },
    document: { title: 'Local document corpus', text: 'Search, inspect and ground work in manuals, SOPs, reports and correspondence without making the model the source of truth.', icon: FileText },
    data: { title: 'Data workspace', text: 'Structured tables and analysis can become their own specialist surface when a task calls for computation or inspection.', icon: Database },
  };
  const item = copy[active] ?? copy.engineering;
  const Icon = item.icon;
  return <div className="grid gap-4 lg:grid-cols-[1fr_320px]"><div className="rounded-xl border border-white/10 bg-white/[.02] p-6"><div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/5 text-cyan-200"><Icon size={20}/></div><h2 className="mt-5 text-xl font-medium">{item.title}</h2><p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">{item.text}</p><div className="mt-6 grid gap-2 sm:grid-cols-3">{['Local-first', 'Evidence-linked', 'Human verified'].map(x => <div key={x} className="rounded-lg border border-white/7 bg-black/10 p-3 font-mono text-[9px] uppercase tracking-wider text-zinc-600">{x}</div>)}</div></div><div className="rounded-xl border border-white/10 bg-[#070c0f] p-5"><div className="font-mono text-[8px] uppercase tracking-[.2em] text-zinc-600">Workspace principle</div><div className="mt-3 text-xs leading-5 text-zinc-400">The agent chooses tools and workspaces; deterministic systems retain authority over structured facts.</div></div></div>;
}

function EvidenceWorkspace({ findings, onSelect }: { findings: EngineeringFinding[]; onSelect: (id: string) => void }) {
  return <div className="space-y-4"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-xl font-medium">Evidence ledger</h2><p className="mt-1 text-xs text-zinc-600">Every surfaced claim stays tied to a source, confidence and review state.</p></div><Pill tone="good"><ShieldCheck size={11}/> Provenance visible</Pill></div><Findings findings={findings} onSelect={onSelect}/></div>;
}

function ArtifactWorkspace({ result }: { result: WorkbenchTaskResult | null }) {
  return <div className="grid gap-4 lg:grid-cols-[1fr_320px]"><div className="rounded-xl border border-white/10 bg-white/[.02] p-6"><div className="flex items-center justify-between gap-3"><div><div className="font-mono text-[9px] uppercase tracking-[.2em] text-cyan-300">Draft artifact</div><h2 className="mt-2 text-xl font-medium">P-101 isolation summary</h2></div><Pill tone="warn">Human review required</Pill></div><div className="mt-6 space-y-3">{['Asset: P-101 pump', 'Discharge isolation: XV-201', 'Drain / depressurization: DV-101', 'Pressure indication: PT-301', 'Upstream suction isolation: unresolved'].map((row, i) => <div key={row} className={`flex gap-3 rounded-lg border p-3 text-xs ${i === 4 ? 'border-amber-300/15 bg-amber-300/[.025] text-amber-100' : 'border-white/7 text-zinc-400'}`}><span className="font-mono text-[9px] text-zinc-700">0{i + 1}</span>{row}</div>)}</div></div><div className="rounded-xl border border-white/10 bg-[#070c0f] p-5"><div className="font-mono text-[8px] uppercase tracking-[.2em] text-zinc-600">Export status</div><div className="mt-3 flex items-center gap-2 text-xs text-zinc-400"><Download size={13}/> Backend export not simulated</div><p className="mt-3 text-[10px] leading-5 text-zinc-600">{result?.demo ? 'Demo artifact only. No file was generated by the frontend.' : 'No artifact result available.'}</p></div></div>;
}

function Overview({ findings, onChange, result }: { findings: EngineeringFinding[]; onChange: (v: ViewId) => void; result: WorkbenchTaskResult | null }) {
  const cards: Array<{ id: ViewId; label: string; value: string; note: string; icon: typeof Network }> = [
    { id: 'pid', label: 'P&ID Viewer', value: 'CAD / visual', note: 'Pan · zoom · uncertainty', icon: Network },
    { id: 'topology', label: 'Topology', value: 'GraphStore', note: 'PFD · spatial · path', icon: GitBranch },
    { id: 'evidence', label: 'Evidence', value: `${findings.length} findings`, note: 'Source · confidence · state', icon: ShieldCheck },
    { id: 'verification', label: 'Verification', value: 'Human gate', note: 'Review before decisions', icon: CheckCircle2 },
    { id: 'isolation', label: 'Isolation', value: 'Decision support', note: 'No actuation', icon: LockKeyhole },
    { id: 'artifact', label: 'Artifact', value: 'Draft', note: 'Evidence-linked deliverable', icon: Download },
  ];
  return <div className="space-y-5"><div className="grid gap-4 lg:grid-cols-[1.4fr_.6fr]"><div className="rounded-xl border border-white/10 bg-gradient-to-br from-cyan-300/[.07] to-white/[.02] p-6"><Pill tone="good"><Activity size={10}/> Local-first workbench</Pill><h1 className="mt-4 max-w-3xl text-2xl font-medium tracking-tight sm:text-3xl">One agent. Multiple specialist workspaces.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">Ask HRIDAY to investigate a task, then inspect the exact visual, topology, evidence and deliverable surfaces involved. The P&ID viewer and topology graph are engineering surfaces—not decorative dashboard cards.</p><div className="mt-5 flex flex-wrap gap-2"><Pill>SIH26117</Pill><Pill>Team GARUD</Pill><Pill>Human verified</Pill></div></div><div className="rounded-xl border border-white/10 bg-[#070c0f] p-5"><div className="font-mono text-[8px] uppercase tracking-[.2em] text-zinc-600">Current run</div><div className="mt-3 text-sm text-zinc-300">{result ? result.summary : 'No task executed yet.'}</div><div className="mt-4 flex gap-2"><Pill tone={result ? 'good' : 'neutral'}>{result ? 'result available' : 'idle'}</Pill><Pill>544 tests verified</Pill></div></div></div><div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">{cards.map(({ id, label, value, note, icon: Icon }) => <button key={id} onClick={() => onChange(id)} className="group rounded-xl border border-white/8 bg-white/[.02] p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-300/20 hover:bg-cyan-300/[.025]"><div className="flex items-start justify-between"><Icon size={15} className="text-cyan-300/70"/><ChevronRight size={14} className="text-zinc-700 transition group-hover:translate-x-0.5 group-hover:text-zinc-300"/></div><div className="mt-6 text-sm font-medium text-zinc-200">{label}</div><div className="mt-1 font-mono text-[10px] text-cyan-200/70">{value}</div><div className="mt-2 text-[10px] text-zinc-600">{note}</div></button>)}</div></div>;
}

export function WorkbenchV4({ onExit }: Props) {
  const [active, setActive] = useState<ViewId>('overview');
  const [selected, setSelected] = useState('P-101');
  const [expanded, setExpanded] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [taskState, setTaskState] = useState<TaskState>('idle');
  const [result, setResult] = useState<WorkbenchTaskResult | null>(null);
  const [findings, setFindings] = useState<EngineeringFinding[]>([]);
  const [message, setMessage] = useState('');
  const adapterMode = getAdapterMode();
  const adapter = useMemo(() => getHRIDAYAdapter(), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCommandOpen(true); }
      if (e.key === 'Escape') { if (commandOpen) setCommandOpen(false); else if (expanded) setExpanded(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [commandOpen, expanded]);

  const runTask = async (task: string) => {
    if (!task.trim() || taskState === 'running') return;
    setMessage(task); setQuery(''); setTaskState('running'); setActive('engineering');
    try {
      const next = await adapter.runTask(task);
      setResult(next); setFindings(next.findings); setTaskState('complete');
      setActive(next.workspace);
    } catch (error) {
      setTaskState('blocked');
      setResult(null);
      setFindings([]);
    }
  };

  const submit = () => { void runTask(query || 'Analyze P-101 and prepare an isolation summary'); };
  const go = (view: ViewId) => { setExpanded(false); setActive(view); };

  const content = active === 'overview'
    ? <Overview findings={findings} onChange={go} result={result}/>
    : active === 'pid'
      ? <PIDWorkspace selected={selected} onSelect={setSelected} expanded={expanded} onExpand={() => setExpanded(v => !v)}/>
      : active === 'topology'
        ? <TopologyWorkspace selected={selected} onSelect={setSelected} expanded={expanded} onExpand={() => setExpanded(v => !v)}/>
        : active === 'evidence'
          ? <EvidenceWorkspace findings={findings} onSelect={id => { setSelected(id); go('pid'); }}/>
          : active === 'verification'
            ? <VerificationWorkspace findings={findings} onSelect={id => { setSelected(id); go('pid'); }} onDone={() => go('isolation')}/>
            : active === 'isolation'
              ? <IsolationWorkspace findings={findings} selected={selected} onSelect={setSelected}/>
              : active === 'artifact'
                ? <ArtifactWorkspace result={result}/>
                : <GenericWorkspace active={active}/>;

  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col bg-[#05090b] text-zinc-200">
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/8 bg-[#070b0e]/95 px-3 backdrop-blur-xl sm:px-5">
      <div className="flex min-w-0 items-center gap-3"><button onClick={onExit} aria-label="Exit HRIDAY workbench" className="rounded-md border border-white/8 p-2 text-zinc-500 hover:text-white"><ArrowLeft size={15}/></button><div className="h-5 w-px bg-white/10"/><div className="min-w-0"><div className="font-mono text-[9px] uppercase tracking-[.22em] text-cyan-300">HRIDAY</div><div className="truncate text-[10px] text-zinc-600">Sovereign Industrial AI Workbench</div></div></div>
      <div className="hidden items-center gap-2 md:flex"><Pill tone={adapterMode === 'backend' ? 'good' : 'warn'}>{adapterMode === 'backend' ? 'BACKEND ADAPTER' : 'DEMO ADAPTER'}</Pill><Pill>{adapterMode === 'backend' ? 'local integration' : 'synthetic data'}</Pill></div>
      <div className="flex items-center gap-1"><button onClick={() => setCommandOpen(true)} className="hidden items-center gap-2 rounded-md border border-white/8 bg-white/[.02] px-3 py-2 text-[9px] text-zinc-600 hover:text-zinc-300 sm:flex"><Command size={12}/> Search / task <kbd className="rounded border border-white/10 px-1 text-[8px]">⌘K</kbd></button><button onClick={() => setCommandOpen(true)} aria-label="Open command palette" className="rounded-md border border-white/8 p-2 text-zinc-500 hover:text-white sm:hidden"><Search size={14}/></button></div>
    </header>
    <WorkflowBar active={active} onChange={go}/>
    <div className="flex min-h-0 flex-1">
      <aside className="hidden w-[290px] shrink-0 flex-col border-r border-white/8 bg-[#060a0d] lg:flex">
        <div className="flex-1 overflow-y-auto p-4"><div className="mb-4"><div className="font-mono text-[8px] uppercase tracking-[.2em] text-zinc-700">Agent console</div><div className="mt-1 text-xs text-zinc-500">Tell HRIDAY what you need. Inspect the resulting workspaces on the right.</div></div><div className="relative"><Sparkles size={13} className="absolute left-3 top-3 text-cyan-300/60"/><textarea value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }} placeholder="Ask HRIDAY to investigate..." className="h-24 w-full resize-none rounded-xl border border-white/10 bg-white/[.025] p-3 pl-9 text-xs text-zinc-300 outline-none placeholder:text-zinc-700 focus:border-cyan-300/30"/><button onClick={submit} disabled={taskState === 'running'} className="absolute bottom-2 right-2 rounded-md bg-cyan-300/10 px-2.5 py-1.5 text-[9px] text-cyan-100 disabled:opacity-40">Run</button></div><div className="mt-5"><div className="mb-2 flex items-center justify-between"><span className="font-mono text-[8px] uppercase tracking-wider text-zinc-700">Quick tasks</span><button onClick={() => setCommandOpen(true)} className="text-zinc-700 hover:text-zinc-400"><Search size={11}/></button></div><div className="space-y-1.5">{QUICK_TASKS.map(task => <button key={task} onClick={() => void runTask(task)} className="w-full rounded-lg border border-white/7 bg-white/[.015] px-3 py-2.5 text-left text-[10px] leading-4 text-zinc-500 hover:border-cyan-300/15 hover:text-zinc-300">{task}</button>)}</div></div><div className="mt-5 rounded-xl border border-white/8 bg-white/[.015] p-4"><div className="flex items-center gap-2"><Bot size={13} className="text-cyan-300/70"/><span className="text-[10px] font-medium">Operational trace</span></div><div className="mt-3 space-y-2">{['Interpret request', 'Select specialist tools', 'Gather evidence', 'Return result'].map((step, i) => <div key={step} className="flex items-center gap-2 text-[9px] text-zinc-600"><span className={`h-1.5 w-1.5 rounded-full ${taskState === 'running' && i === 1 ? 'bg-cyan-300 animate-pulse' : taskState === 'complete' ? 'bg-emerald-300' : 'bg-zinc-800'}`}/>{step}</div>)}</div></div></div>
        <div className="border-t border-white/8 p-4"><div className="flex items-center justify-between"><Pill tone="good"><ShieldCheck size={10}/> Sovereignty posture</Pill><SlidersHorizontal size={12} className="text-zinc-700"/></div><p className="mt-2 text-[9px] leading-4 text-zinc-700">Local deployment can enforce application-level loopback boundaries. Physical/network air-gapping remains an infrastructure control.</p></div>
      </aside>
      <main className={`min-w-0 flex-1 overflow-y-auto ${expanded ? 'p-0' : 'p-3 sm:p-5'}`}>
        {!expanded && <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><div><div className="font-mono text-[8px] uppercase tracking-[.2em] text-zinc-700">Workspace / {active}</div><div className="mt-1 text-[10px] text-zinc-600">{active === 'pid' ? 'Visual evidence surface' : active === 'topology' ? 'Deterministic connectivity surface' : 'Contextual specialist surface'}</div></div><div className="flex items-center gap-2"><Pill>{taskState === 'running' ? 'processing' : taskState === 'blocked' ? 'blocked' : taskState === 'complete' ? 'complete' : 'ready'}</Pill><button onClick={() => setExpanded(true)} className="rounded-md border border-white/8 p-2 text-zinc-600 hover:text-white" title="Focus workspace"><Maximize2 size={13}/></button></div></div>}
        {active === 'pid' || active === 'topology' ? content : <AnimatePresence mode="wait"><motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .2 }}>{content}</motion.div></AnimatePresence>}
      </main>
    </div>
    <footer className="flex shrink-0 items-center justify-between border-t border-white/8 bg-[#060a0d] px-3 py-2 font-mono text-[8px] text-zinc-700 sm:px-5"><div className="flex items-center gap-3"><span>544 tests · 13/13 contracts</span><span className="hidden sm:inline">25 MB upload gate</span></div><div className="flex items-center gap-2"><Upload size={10}/> <span>Files stay within the configured deployment boundary</span></div></footer>
    <AnimatePresence>{commandOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-start justify-center bg-black/70 p-4 pt-[12vh] backdrop-blur-sm" onMouseDown={() => setCommandOpen(false)}><motion.div initial={{ opacity: 0, y: -10, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: .98 }} onMouseDown={e => e.stopPropagation()} className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#080d10] shadow-2xl"><div className="flex items-center gap-3 border-b border-white/8 p-4"><Search size={16} className="text-cyan-300/60"/><input autoFocus value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { setCommandOpen(false); submit(); } }} placeholder="Search workspaces or describe a task..." className="min-w-0 flex-1 bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-700"/><button onClick={() => setCommandOpen(false)} aria-label="Close command palette"><X size={15} className="text-zinc-600 hover:text-white"/></button></div><div className="p-2">{[['pid','Open P&ID viewer'],['topology','Open topology graph'],['evidence','Open evidence ledger'],['verification','Open human verification desk'],['isolation','Open isolation workspace']].filter(([id,label]) => !query || label.toLowerCase().includes(query.toLowerCase())).map(([id,label]) => <button key={id} onClick={() => { setCommandOpen(false); go(id as ViewId); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-xs text-zinc-400 hover:bg-white/[.04] hover:text-white"><Network size={13} className="text-cyan-300/50"/>{label}<ChevronRight size={12} className="ml-auto text-zinc-700"/></button>)}<button onClick={() => { setCommandOpen(false); void runTask(query || 'Analyze P-101 and prepare an isolation summary'); }} className="flex w-full items-center gap-3 rounded-lg bg-cyan-300/[.05] px-3 py-3 text-left text-xs text-cyan-100 hover:bg-cyan-300/10"><Sparkles size={13}/><span>Ask HRIDAY: <span className="text-cyan-200/60">{query || 'analyze P-101'}</span></span><ChevronRight size={12} className="ml-auto"/></button></div></motion.div></motion.div>}</AnimatePresence>
  </motion.div>;
}
