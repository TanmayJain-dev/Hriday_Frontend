import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowRight, Bot, Check, ChevronRight, Command, Database, Download, FileText, GitBranch, Maximize2, MessageSquare, Network, Search, ShieldCheck, Sparkles, X, ZoomIn, ZoomOut } from 'lucide-react';
import { getHRIDAYAdapter } from '@/adapters';
import type { EngineeringFinding, WorkspaceId, WorkbenchTaskResult } from '@/adapters/types';

type ViewId = 'overview' | WorkspaceId;

type DemoAsset = { id: string; x: number; y: number; type: string };

const ASSETS: DemoAsset[] = [
  { id: 'P-101', x: 22, y: 51, type: 'Pump' },
  { id: 'XV-201', x: 52, y: 51, type: 'Valve' },
  { id: 'V-202', x: 80, y: 51, type: 'Equipment' },
  { id: 'PT-301', x: 39, y: 27, type: 'Instrument' },
  { id: 'DV-101', x: 39, y: 75, type: 'Drain' },
];

const WORKSPACES: Array<{ id: ViewId; label: string; icon: typeof Network; description: string }> = [
  { id: 'engineering', label: 'Engineering', icon: GitBranch, description: 'Asset reasoning and maintenance context' },
  { id: 'pid', label: 'P&ID', icon: Network, description: 'Visual drawing and selected evidence' },
  { id: 'topology', label: 'Topology', icon: GitBranch, description: 'Governed connectivity and uncertainty' },
  { id: 'document', label: 'Documents', icon: FileText, description: 'Local document context' },
  { id: 'data', label: 'Data', icon: Database, description: 'Tables and analytical views' },
  { id: 'evidence', label: 'Evidence', icon: ShieldCheck, description: 'Claims, sources and review state' },
  { id: 'artifact', label: 'Artifact', icon: Download, description: 'Evidence-linked deliverable draft' },
];

const QUICK_TASKS = [
  'Analyze P-101 and prepare an isolation summary',
  'Find the relevant SOP and check for procedural conflicts',
  'Prepare an evidence-backed approval note',
];

function StatusPill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'good' | 'warn' }) {
  const toneClass = tone === 'good' ? 'border-emerald-400/20 bg-emerald-400/5 text-emerald-200' : tone === 'warn' ? 'border-amber-300/20 bg-amber-300/5 text-amber-200' : 'border-white/10 bg-white/[.03] text-zinc-400';
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider ${toneClass}`}>{children}</span>;
}

function WorkspaceNav({ active, onChange }: { active: ViewId; onChange: (id: ViewId) => void }) {
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
    <button onClick={() => onChange('overview')} className={`rounded-lg border px-3 py-2.5 text-left text-xs transition ${active === 'overview' ? 'border-cyan-300/30 bg-cyan-300/10 text-white' : 'border-white/10 bg-white/[.025] text-zinc-500 hover:text-white'}`}><span className="block font-medium">Overview</span><span className="mt-1 block text-[9px] text-zinc-600">Mission control</span></button>
    {WORKSPACES.map(({ id, label, icon: Icon, description }) => <button key={id} onClick={() => onChange(id)} className={`rounded-lg border px-3 py-2.5 text-left text-xs transition ${active === id ? 'border-cyan-300/30 bg-cyan-300/10 text-white' : 'border-white/10 bg-white/[.025] text-zinc-500 hover:border-white/20 hover:text-white'}`}><Icon size={13} className="mb-1" /><span className="block font-medium">{label}</span><span className="mt-1 hidden text-[9px] text-zinc-600 xl:block">{description}</span></button>)}
  </div>;
}

function PIDCanvas({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  return <div className="relative min-h-[440px] overflow-hidden rounded-xl border border-white/10 bg-[#071014]">
    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(90,220,220,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(90,220,220,.07) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
    <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-md border border-amber-300/20 bg-black/60 px-3 py-2 font-mono text-[9px] text-amber-100 backdrop-blur"><span className="h-1.5 w-1.5 rounded-full bg-amber-300" /> DEMO P&ID · SYNTHETIC VISUAL DATA</div>
    <div className="absolute right-4 top-4 z-10 flex gap-1"><button aria-label="Zoom out" className="rounded-md border border-white/10 bg-black/60 p-2 text-zinc-400 hover:text-white"><ZoomOut size={13} /></button><button aria-label="Zoom in" className="rounded-md border border-white/10 bg-black/60 p-2 text-zinc-400 hover:text-white"><ZoomIn size={13} /></button><button aria-label="Expand drawing" className="rounded-md border border-white/10 bg-black/60 p-2 text-zinc-400 hover:text-white"><Maximize2 size={13} /></button></div>
    <svg viewBox="0 0 900 500" className="absolute inset-0 h-full w-full p-12" aria-label="Synthetic P and ID drawing">
      <path d="M110 255 H790" fill="none" stroke="rgba(103,232,249,.42)" strokeWidth="5" />
      <path d="M350 255 V100 M350 255 V405" fill="none" stroke="rgba(103,232,249,.3)" strokeWidth="3" />
      <path d="M350 100 H530 M350 405 H530" fill="none" stroke="rgba(103,232,249,.3)" strokeWidth="3" />
      <path d="M250 255 H305 M410 255 H475 M580 255 H665" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="2" strokeDasharray="8 7" />
    </svg>
    {ASSETS.map((asset) => <button key={asset.id} onClick={() => onSelect(asset.id)} className="absolute z-20 -translate-x-1/2 -translate-y-1/2 text-left" style={{ left: `${asset.x}%`, top: `${asset.y}%` }} aria-label={`Select ${asset.id}`}><div className={`flex min-h-12 min-w-14 flex-col items-center justify-center rounded-lg border px-2 transition ${selected === asset.id ? 'scale-110 border-cyan-300 bg-cyan-300/15 text-cyan-100 shadow-[0_0_30px_rgba(103,232,249,.15)]' : 'border-white/15 bg-[#0b171b] text-zinc-300 hover:border-cyan-400/50'}`}><span className="font-mono text-[10px] font-semibold">{asset.id}</span><span className="text-[8px] uppercase tracking-wider text-zinc-600">{asset.type}</span></div></button>)}
    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 font-mono text-[9px] text-zinc-600"><span>Sheet 01 · viewport D-7</span><span>Selected asset: {selected}</span></div>
  </div>;
}

function TopologyCanvas({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  const nodes = [['P-101', '17%', '50%', 'Pump'], ['XV-201', '50%', '30%', 'Valve'], ['DV-101', '50%', '70%', 'Drain'], ['V-202', '82%', '50%', 'Equipment']] as const;
  return <div className="relative min-h-[440px] overflow-hidden rounded-xl border border-white/10 bg-[#071014] p-5">
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(103,232,249,.18), transparent 25%), radial-gradient(circle at 75% 70%, rgba(45,212,191,.12), transparent 25%)' }} />
    <div className="relative h-[360px]">
      <svg className="absolute inset-0 h-full w-full"><line x1="17%" y1="50%" x2="50%" y2="30%" stroke="rgba(103,232,249,.45)" strokeWidth="2" /><line x1="17%" y1="50%" x2="50%" y2="70%" stroke="rgba(245,158,11,.5)" strokeWidth="2" strokeDasharray="6 5" /><line x1="50%" y1="30%" x2="82%" y2="50%" stroke="rgba(103,232,249,.4)" strokeWidth="2" /><line x1="50%" y1="70%" x2="82%" y2="50%" stroke="rgba(103,232,249,.18)" strokeWidth="2" /></svg>
      {nodes.map(([id, x, y, type]) => <button key={id} onClick={() => onSelect(id)} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: x, top: y }}><div className={`flex h-16 w-28 flex-col items-center justify-center rounded-xl border transition ${selected === id ? 'border-cyan-300 bg-cyan-300/10 shadow-[0_0_30px_rgba(103,232,249,.12)]' : 'border-cyan-400/20 bg-[#0b171b] hover:border-cyan-400/40'}`}><span className="font-mono text-xs text-cyan-100">{id}</span><span className="text-[9px] uppercase tracking-wider text-zinc-600">{type}</span></div></button>)}
    </div>
    <div className="flex flex-wrap items-center gap-4 font-mono text-[9px] text-zinc-600"><span>━ accepted edge</span><span className="text-amber-200">┄ uncertainty retained</span><span>GraphStore view · read-only</span></div>
  </div>;
}

function FindingsTable({ findings }: { findings: EngineeringFinding[] }) {
  return <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[.02]"><div className="grid grid-cols-[1fr_2fr_1.4fr_.7fr_1fr] border-b border-white/10 px-4 py-3 font-mono text-[9px] uppercase tracking-wider text-zinc-600"><span>Type</span><span>Claim</span><span>Source</span><span>Confidence</span><span>Review</span></div>{findings.map((finding, i) => <div key={`${finding.assetId}-${i}`} className="grid grid-cols-[1fr_2fr_1.4fr_.7fr_1fr] items-center gap-2 border-b border-white/5 px-4 py-3 text-[10px] last:border-0"><span className="text-cyan-200">{finding.assetId}</span><span className="text-zinc-300">{finding.claim}</span><span className="text-zinc-500">{finding.source}</span><span className="font-mono text-zinc-400">{Math.round(finding.confidence * 100)}%</span><span><StatusPill tone={finding.reviewState === 'needs_verification' ? 'warn' : finding.reviewState === 'observed' ? 'good' : 'neutral'}>{finding.reviewState.replace('_', ' ')}</StatusPill></span></div>)}</div>;
}

function WorkspaceContent({ active, selected, onSelect, findings, result }: { active: ViewId; selected: string; onSelect: (id: string) => void; findings: EngineeringFinding[]; result: WorkbenchTaskResult | null }) {
  if (active === 'pid') return <PIDCanvas selected={selected} onSelect={onSelect} />;
  if (active === 'topology') return <TopologyCanvas selected={selected} onSelect={onSelect} />;
  if (active === 'evidence') return <div className="space-y-4"><div className="flex items-center justify-between"><div><h2 className="text-lg font-medium">Evidence ledger</h2><p className="mt-1 text-xs text-zinc-600">Claims remain tied to their source and review state.</p></div><StatusPill tone="good"><ShieldCheck size={11} /> Provenance visible</StatusPill></div><FindingsTable findings={findings} /></div>;
  if (active === 'artifact') return <div className="grid gap-4 lg:grid-cols-[1fr_320px]"><div className="rounded-xl border border-white/10 bg-white/[.02] p-6"><div className="mb-6 flex items-center justify-between"><div><div className="text-[9px] uppercase tracking-[.2em] text-cyan-300">Draft artifact</div><h2 className="mt-2 text-xl">P-101 Isolation Summary</h2></div><StatusPill tone="warn">Human review required</StatusPill></div><div className="space-y-3 text-sm text-zinc-400"><div className="rounded-lg border border-white/10 p-4"><b className="text-zinc-200">Finding</b><p className="mt-1">XV-201 is on the discharge path. Upstream suction isolation remains unresolved.</p></div><div className="rounded-lg border border-white/10 p-4"><b className="text-zinc-200">Evidence</b><p className="mt-1">{findings.length} evidence records are available for review.</p></div><div className="rounded-lg border border-amber-300/15 bg-amber-300/[.03] p-4 text-amber-100">This is a draft decision-support artifact, not a permit, certification, or actuation command.</div></div></div><div className="rounded-xl border border-white/10 bg-[#071014] p-5"><div className="mb-4 text-[9px] uppercase tracking-[.2em] text-zinc-600">Export</div><button className="flex w-full items-center justify-between rounded-lg border border-white/10 px-3 py-3 text-xs text-zinc-300 hover:border-cyan-300/30"><span>Prepare DOCX</span><Download size={14} /></button><p className="mt-3 text-[10px] leading-5 text-zinc-600">Artifact generation will use the connected backend when that adapter is implemented.</p></div></div>;
  if (active === 'document') return <div className="grid gap-3 md:grid-cols-2"><div className="rounded-xl border border-white/10 bg-white/[.02] p-5"><FileText size={16} className="text-cyan-300" /><h2 className="mt-4 text-base">Local document workspace</h2><p className="mt-2 text-xs leading-5 text-zinc-500">Search, inspect and ground answers in manuals, SOPs, inspection reports and correspondence without leaving the deployment boundary.</p></div><div className="rounded-xl border border-white/10 bg-white/[.02] p-5"><div className="font-mono text-[9px] uppercase tracking-wider text-zinc-600">Demo corpus</div><div className="mt-4 space-y-2"><div className="rounded-md border border-white/5 bg-black/20 px-3 py-2 text-xs text-zinc-400">SOP · Isolation Procedure · local</div><div className="rounded-md border border-white/5 bg-black/20 px-3 py-2 text-xs text-zinc-400">Inspection Report · P-101 · local</div><div className="rounded-md border border-white/5 bg-black/20 px-3 py-2 text-xs text-zinc-400">P&ID Sheet 01 · local</div></div></div></div>;
  if (active === 'data') return <div className="space-y-4"><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-white/10 p-4"><span className="text-[9px] uppercase tracking-wider text-zinc-600">Assets</span><strong className="mt-2 block text-2xl">5</strong></div><div className="rounded-xl border border-white/10 p-4"><span className="text-[9px] uppercase tracking-wider text-zinc-600">Evidence</span><strong className="mt-2 block text-2xl">{findings.length}</strong></div><div className="rounded-xl border border-white/10 p-4"><span className="text-[9px] uppercase tracking-wider text-zinc-600">Review flags</span><strong className="mt-2 block text-2xl text-amber-200">1</strong></div></div><FindingsTable findings={findings} /></div>;
  if (active === 'engineering') return <div className="grid gap-4 lg:grid-cols-[1.25fr_.75fr]"><div className="rounded-xl border border-white/10 bg-white/[.02] p-6"><div className="flex items-center gap-2 text-[9px] uppercase tracking-[.2em] text-cyan-300"><GitBranch size={12} /> Engineering reasoning</div><h2 className="mt-3 text-xl">{selected}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">Governed engineering tools can combine visual evidence, topology and local documents. The model plans the work; deterministic services remain the authority for structured engineering facts.</p><div className="mt-6 flex flex-wrap gap-2"><StatusPill tone="good"><Check size={10} /> Read-only</StatusPill><StatusPill>Evidence linked</StatusPill><StatusPill tone="warn">Verification retained</StatusPill></div></div><div className="rounded-xl border border-white/10 bg-[#071014] p-5"><div className="text-[9px] uppercase tracking-wider text-zinc-600">Current result</div><p className="mt-3 text-sm leading-6 text-zinc-300">{result?.summary ?? 'No task executed yet.'}</p></div></div>;
  return <div className="grid gap-4 lg:grid-cols-[1.3fr_.7fr]"><div className="rounded-xl border border-white/10 bg-white/[.02] p-6"><div className="flex items-center gap-2 text-[9px] uppercase tracking-[.2em] text-cyan-300"><Sparkles size={12} /> Workbench ready</div><h2 className="mt-3 text-2xl font-medium">What are you working on?</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">Use the agent for multi-step work, or open a workspace directly to inspect the evidence surface.</p><div className="mt-6 grid gap-2 sm:grid-cols-3">{['Engineering', 'P&ID', 'Evidence'].map((label) => <div key={label} className="rounded-lg border border-white/10 bg-black/20 p-4"><div className="font-mono text-[9px] text-zinc-600">WORKSPACE</div><div className="mt-2 text-xs text-zinc-300">{label}</div></div>)}</div></div><div className="rounded-xl border border-white/10 bg-[#071014] p-5"><div className="flex items-center gap-2 text-[9px] uppercase tracking-wider text-zinc-600"><Activity size={12} /> System boundary</div><div className="mt-4 space-y-3 text-xs text-zinc-400"><div className="flex justify-between"><span>Model</span><span className="text-zinc-300">Local / adapter-controlled</span></div><div className="flex justify-between"><span>Tools</span><span className="text-zinc-300">Governed</span></div><div className="flex justify-between"><span>Actuation</span><span className="text-emerald-200">None</span></div></div></div></div>;
}

export function WorkbenchV2({ onExit }: { onExit: () => void }) {
  const adapter = useMemo(() => getHRIDAYAdapter('demo'), []);
  const [active, setActive] = useState<ViewId>('overview');
  const [selected, setSelected] = useState('P-101');
  const [query, setQuery] = useState('');
  const [palette, setPalette] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<WorkbenchTaskResult | null>(null);
  const [findings, setFindings] = useState<EngineeringFinding[]>([]);
  const [task, setTask] = useState('');

  useEffect(() => {
    adapter.getEvidence(selected).then(setFindings).catch(() => setFindings([]));
  }, [adapter, selected]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setPalette(true); }
      if (event.key === 'Escape') setPalette(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const runTask = async (nextTask: string) => {
    setTask(nextTask); setQuery(''); setPalette(false); setRunning(true); setActive('engineering');
    try {
      const nextResult = await adapter.runTask(nextTask);
      setResult(nextResult);
      setFindings(nextResult.findings.filter((finding) => finding.assetId === selected));
      setActive(nextResult.workspace);
    } finally { setRunning(false); }
  };

  const execute = () => {
    const q = query.trim();
    if (!q) return;
    if (/analy|isola|prepare|check|trace|find sop|create/i.test(q)) void runTask(q);
    else {
      const normalized = q.toLowerCase();
      setActive(normalized.includes('topo') ? 'topology' : normalized.includes('pid') ? 'pid' : normalized.includes('evid') ? 'evidence' : normalized.includes('doc') ? 'document' : normalized.includes('data') ? 'data' : 'overview');
      setPalette(false);
    }
  };

  return <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-[#05090b] text-white">
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-[#070c0f]/95 px-4 backdrop-blur-xl"><div className="flex items-center gap-4"><button onClick={onExit} className="flex items-center gap-2" aria-label="Return to product story"><div className="flex h-7 w-7 items-center justify-center rounded-md border border-cyan-300/30 bg-cyan-300/5 font-mono text-xs font-bold text-cyan-200">H</div><span className="text-sm font-semibold tracking-[.16em]">HRIDAY</span></button><span className="hidden text-[10px] uppercase tracking-[.22em] text-zinc-600 sm:block">Sovereign Industrial AI Workbench</span></div><div className="flex items-center gap-2"><button onClick={() => setPalette(true)} className="hidden items-center gap-3 rounded-lg border border-white/10 bg-white/[.03] px-3 py-2 text-xs text-zinc-500 hover:text-zinc-200 md:flex"><Search size={13} /> Search or ask HRIDAY <kbd className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[9px]">⌘K</kbd></button><StatusPill tone="good"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Local demo mode</StatusPill></div></header>
    <div className="min-h-0 flex-1 overflow-y-auto"><div className="mx-auto max-w-[1500px] p-4 md:p-6"><div className="mb-5 flex items-end justify-between gap-4"><div><div className="mb-2 flex items-center gap-2 text-[9px] uppercase tracking-[.22em] text-cyan-300"><Sparkles size={12} /> Contextual workspace</div><h1 className="text-xl font-medium md:text-2xl">{active === 'overview' ? 'Mission control' : WORKSPACES.find((w) => w.id === active)?.label}</h1></div><div className="hidden font-mono text-[9px] text-zinc-600 md:block">ADAPTER: DEMO · READ-ONLY</div></div>
      <WorkspaceNav active={active} onChange={setActive} />
      <div className="mt-5 grid min-h-0 gap-5 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-xl border border-white/10 bg-[#070c0f] p-4 lg:sticky lg:top-0 lg:h-fit"><div className="mb-4 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[.2em] text-zinc-600"><MessageSquare size={12} /> Conversation</div><div className="rounded-xl border border-white/10 bg-white/[.025] p-4"><div className="mb-2 flex items-center gap-2 text-[10px] text-cyan-300"><Bot size={13} /> HRIDAY Agent</div><p className="text-sm leading-6 text-zinc-300">{running ? 'Working through the requested task and collecting governed evidence…' : result?.summary ?? 'Ask HRIDAY to analyze a document, trace equipment, inspect topology, or prepare an evidence-backed artifact.'}</p></div>{task && <div className="mt-3 rounded-lg border border-white/10 bg-black/20 p-3"><div className="mb-1 font-mono text-[8px] uppercase tracking-wider text-zinc-600">Current task</div><p className="text-xs text-zinc-400">{task}</p></div>}<div className="mt-4 space-y-2">{(result?.steps ?? []).map((step) => <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} key={step.id} className="flex items-center gap-2 text-[10px] text-zinc-400"><span className="flex h-5 w-5 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/5 text-emerald-200"><Check size={10} /></span>{step.label}<span className="ml-auto text-[8px] text-emerald-300">complete</span></motion.div>)}</div><div className="mt-5 space-y-2"><div className="mb-2 font-mono text-[8px] uppercase tracking-wider text-zinc-600">Quick tasks</div>{QUICK_TASKS.map((item) => <button key={item} disabled={running} onClick={() => void runTask(item)} className="group flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[.02] px-3 py-3 text-left text-[10px] text-zinc-300 hover:border-cyan-400/25 disabled:opacity-50"><span>{item}</span><ArrowRight size={12} className="text-zinc-600 group-hover:text-cyan-300" /></button>)}</div></aside>
        <main className="min-w-0"><AnimatePresence mode="wait"><motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .2 }}><WorkspaceContent active={active} selected={selected} onSelect={setSelected} findings={findings} result={result} /></motion.div></AnimatePresence></main>
      </div>
      <div className="mt-5 flex flex-col gap-3 rounded-xl border border-white/10 bg-[#070c0f] p-3 md:flex-row md:items-center"><div className="flex items-center gap-2 px-2 text-[9px] uppercase tracking-wider text-zinc-600"><Activity size={12} /> Agent loop</div><div className="flex flex-1 items-center gap-2 overflow-x-auto">{['Intent', 'Plan', 'Tools', 'Observe', 'Evidence', 'Answer'].map((step, i) => <div key={step} className={`flex shrink-0 items-center gap-2 rounded-md border px-2.5 py-2 text-[9px] ${running && i < 4 ? 'border-cyan-300/20 bg-cyan-300/5 text-cyan-200' : result && i >= 4 ? 'border-emerald-400/20 bg-emerald-400/5 text-emerald-200' : 'border-white/5 text-zinc-600'}`}><span className="font-mono">0{i + 1}</span>{step}{i < 5 && <ChevronRight size={10} />}</div>)}</div></div>
      <div className="mt-3 flex flex-col gap-2 rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-[9px] text-zinc-600 sm:flex-row sm:items-center sm:justify-between"><span><ShieldCheck size={11} className="mr-2 inline" />DEMO CLOUD INSTANCE — NOT AIR-GAPPED</span><span>Physical/network air-gapping remains an infrastructure control.</span></div>
    </div></div>
    <AnimatePresence>{palette && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] flex items-start justify-center bg-black/70 p-4 pt-[12vh] backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget) setPalette(false); }}><motion.div initial={{ opacity: 0, y: -12, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-[#0a1115] shadow-2xl"><div className="flex items-center gap-3 border-b border-white/10 px-4"><Command size={15} className="text-cyan-300" /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') execute(); }} placeholder="Search a workspace or ask HRIDAY to do something…" className="h-14 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600" /><button onClick={() => setPalette(false)} aria-label="Close command palette"><X size={15} className="text-zinc-600" /></button></div><div className="p-3"><div className="px-2 py-2 font-mono text-[8px] uppercase tracking-wider text-zinc-600">Suggested actions</div>{QUICK_TASKS.map((item) => <button key={item} onClick={() => void runTask(item)} className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-xs text-zinc-300 hover:bg-white/[.04]"><span>{item}</span><ArrowRight size={13} className="text-zinc-600" /></button>)}</div></motion.div></motion.div>}</AnimatePresence>
  </div>;
}
