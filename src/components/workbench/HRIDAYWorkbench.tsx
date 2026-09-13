import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowRight, Bot, Box, ChevronRight, Command, Database, Download, FileText, GitBranch, Maximize2, MessageSquare, Network, Search, ShieldCheck, Sparkles, X, ZoomIn, ZoomOut } from 'lucide-react';

type Workspace = 'overview' | 'engineering' | 'pid' | 'topology' | 'evidence' | 'document' | 'artifact' | 'data';

type DemoState = {
  task: string;
  running: boolean;
  completed: boolean;
  active: Workspace;
  steps: string[];
};

const DEMO_PIDS = [
  { id: 'P-101', x: 25, y: 48, kind: 'equipment' },
  { id: 'XV-201', x: 53, y: 48, kind: 'valve' },
  { id: 'V-202', x: 75, y: 48, kind: 'valve' },
  { id: 'PT-301', x: 40, y: 27, kind: 'instrument' },
  { id: 'DV-101', x: 39, y: 72, kind: 'valve' },
];

const EVIDENCE = [
  ['Claim', 'P-101 identified as pump', 'P&ID · page 1 · region 43,37', '0.90', 'Observed'],
  ['Claim', 'XV-201 is on the discharge path', 'P&ID · page 1 · topology edge', '0.86', 'Review'],
  ['Finding', 'Upstream suction isolation is unresolved', 'Engineering analysis · P-101', '0.65', 'Needs verification'],
];

const ACTIVITY = ['Task received', 'Engineering Tool activated', 'Topology queried', 'Evidence collected'];

function WorkspaceChip({ icon: Icon, label, active, onClick }: { icon: typeof Box; label: string; active?: boolean; onClick: () => void }) {
  return <button onClick={onClick} className={`group flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-all ${active ? 'border-cyan-400/40 bg-cyan-400/10 text-white' : 'border-white/10 bg-white/[0.025] text-zinc-400 hover:border-white/20 hover:bg-white/[0.05] hover:text-white'}`}><Icon size={14} /><span>{label}</span>{active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300" />}</button>;
}

function PIDView({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  return <div className="relative h-full min-h-[410px] overflow-hidden rounded-xl border border-white/10 bg-[#071014]">
    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(90,220,220,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(90,220,220,.08) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
    <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-md border border-white/10 bg-black/50 px-3 py-2 font-mono text-[10px] text-zinc-400 backdrop-blur"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300" /> DEMO P&ID · SYNTHETIC VISUAL DATA</div>
    <div className="absolute right-4 top-4 z-10 flex gap-1"><button className="rounded-md border border-white/10 bg-black/50 p-2 text-zinc-400"><ZoomOut size={13} /></button><button className="rounded-md border border-white/10 bg-black/50 p-2 text-zinc-400"><ZoomIn size={13} /></button></div>
    <svg viewBox="0 0 900 500" className="absolute inset-0 h-full w-full p-12">
      <path d="M120 250 H760" fill="none" stroke="rgba(103,232,249,.48)" strokeWidth="5" />
      <path d="M360 250 V105 M360 250 V395" fill="none" stroke="rgba(103,232,249,.35)" strokeWidth="3" />
      <path d="M360 105 H520 M360 395 H520" fill="none" stroke="rgba(103,232,249,.35)" strokeWidth="3" />
      <path d="M245 250 H315 M405 250 H475 M575 250 H650" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="2" strokeDasharray="8 7" />
    </svg>
    {DEMO_PIDS.map((item) => <button key={item.id} onClick={() => onSelect(item.id)} className="absolute z-20 -translate-x-1/2 -translate-y-1/2" style={{ left: `${item.x}%`, top: `${item.y}%` }}><div className={`flex h-12 min-w-12 items-center justify-center rounded-lg border px-2 font-mono text-[10px] font-semibold transition-all ${selected === item.id ? 'scale-110 border-cyan-300 bg-cyan-300/15 text-cyan-100 shadow-[0_0_30px_rgba(103,232,249,.18)]' : 'border-white/15 bg-[#0b171b] text-zinc-300 hover:border-cyan-400/50'}`}>{item.id}</div></button>)}
    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] text-zinc-500"><span>Sheet 01 · viewport D-7</span><span>Selection: {selected}</span></div>
  </div>;
}

function TopologyView() {
  return <div className="relative min-h-[410px] overflow-hidden rounded-xl border border-white/10 bg-[#071014] p-6">
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(103,232,249,.18), transparent 25%), radial-gradient(circle at 75% 70%, rgba(45,212,191,.12), transparent 25%)' }} />
    <div className="relative h-[350px]">
      <svg className="absolute inset-0 h-full w-full"><line x1="17%" y1="50%" x2="50%" y2="30%" stroke="rgba(103,232,249,.4)" strokeWidth="2" /><line x1="17%" y1="50%" x2="50%" y2="70%" stroke="rgba(103,232,249,.25)" strokeWidth="2" /><line x1="50%" y1="30%" x2="82%" y2="50%" stroke="rgba(103,232,249,.4)" strokeWidth="2" /><line x1="50%" y1="70%" x2="82%" y2="50%" stroke="rgba(103,232,249,.2)" strokeWidth="2" /></svg>
      {[['P-101','17%','50%','Pump'],['XV-201','50%','30%','Valve'],['DV-101','50%','70%','Drain'],['V-202','82%','50%','Equipment']].map(([id,x,y,type]) => <div key={id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left:x, top:y }}><div className="flex h-16 w-24 flex-col items-center justify-center rounded-xl border border-cyan-400/25 bg-[#0b171b] shadow-[0_10px_35px_rgba(0,0,0,.3)]"><span className="font-mono text-xs text-cyan-100">{id}</span><span className="text-[9px] uppercase tracking-wider text-zinc-500">{type}</span></div></div>)}
    </div>
    <div className="absolute bottom-4 left-5 flex items-center gap-4 font-mono text-[10px] text-zinc-500"><span>● accepted edge</span><span>△ uncertainty retained</span></div>
  </div>;
}

export function HRIDAYWorkbench({ onExit }: { onExit: () => void }) {
  const [workspace, setWorkspace] = useState<Workspace>('overview');
  const [selected, setSelected] = useState('P-101');
  const [query, setQuery] = useState('');
  const [palette, setPalette] = useState(false);
  const [demo, setDemo] = useState<DemoState>({ task: '', running: false, completed: false, active: 'overview', steps: [] });

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setPalette(true); }
      if (event.key === 'Escape') setPalette(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const runTask = (task: string) => {
    setQuery(''); setPalette(false);
    setDemo({ task, running: true, completed: false, active: 'engineering', steps: [] });
    ACTIVITY.forEach((step, index) => setTimeout(() => setDemo((current) => ({ ...current, steps: [...current.steps, step] })), 500 * (index + 1)));
    setTimeout(() => setDemo((current) => ({ ...current, running: false, completed: true, active: 'evidence' })), 2400);
  };

  const answer = useMemo(() => demo.completed ? `I found the engineering path for ${selected}. XV-201 is on the discharge path. The upstream suction isolation is unresolved, so the result remains review-required rather than being presented as a certified isolation.` : 'Ask HRIDAY to analyze a document, trace equipment, inspect topology, or prepare an evidence-backed artifact.', [demo.completed, selected]);

  const executeSearch = () => {
    const q = query.trim();
    if (!q) return;
    if (/analy|isola|prepare|check|trace|find sop|create/i.test(q)) runTask(q);
    else { setPalette(false); setWorkspace(q.toUpperCase().includes('TOPO') ? 'topology' : q.toUpperCase().includes('EVID') ? 'evidence' : 'overview'); }
  };

  return <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-[#05090b] text-white">
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-[#070c0f]/95 px-4 backdrop-blur-xl">
      <div className="flex items-center gap-4"><button onClick={onExit} className="flex items-center gap-2" title="Return to product story"><div className="flex h-7 w-7 items-center justify-center rounded-md border border-cyan-300/30 bg-cyan-300/5 font-mono text-xs font-bold text-cyan-200">H</div><span className="text-sm font-semibold tracking-[.16em]">HRIDAY</span></button><span className="hidden text-[10px] uppercase tracking-[.22em] text-zinc-600 sm:block">Sovereign Industrial AI Workbench</span></div>
      <div className="flex items-center gap-2"><button onClick={() => setPalette(true)} className="hidden items-center gap-3 rounded-lg border border-white/10 bg-white/[.03] px-3 py-2 text-xs text-zinc-500 transition hover:border-white/20 hover:text-zinc-300 md:flex"><Search size={13} /> Search or ask HRIDAY <kbd className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[9px]">⌘K</kbd></button><div className="flex items-center gap-2 rounded-lg border border-emerald-400/15 bg-emerald-400/5 px-3 py-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /><span className="hidden font-mono text-[9px] uppercase tracking-wider text-emerald-200 sm:block">Local mode</span></div></div>
    </header>

    <div className="flex min-h-0 flex-1 flex-col md:flex-row">
      <aside className="flex w-full shrink-0 flex-col border-b border-white/10 bg-[#070c0f] md:w-[360px] md:border-b-0 md:border-r">
        <div className="flex-1 overflow-y-auto p-5">
          <div className="mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.2em] text-zinc-500"><MessageSquare size={13} /> Conversation</div>
          <div className="mb-5 rounded-xl border border-white/10 bg-white/[.025] p-4"><div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-wider text-cyan-300"><Bot size={13} /> HRIDAY Agent</div><p className="text-sm leading-6 text-zinc-300">{answer}</p></div>
          {demo.task && <div className="mb-4 rounded-lg border border-white/10 bg-black/20 p-3"><div className="mb-1 text-[9px] uppercase tracking-wider text-zinc-600">Current task</div><p className="text-xs text-zinc-400">{demo.task}</p></div>}
          <div className="mb-6 space-y-2">{demo.steps.map((step, i) => <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} key={step} className="flex items-center gap-2 text-xs text-zinc-400"><span className="flex h-5 w-5 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/5 text-[9px] text-cyan-200">{i + 1}</span>{step}<span className="ml-auto text-[9px] text-emerald-300">done</span></motion.div>)}</div>
          <div className="space-y-2"><button onClick={() => runTask('Analyze P-101 and prepare an isolation summary')} className="group flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[.025] px-3 py-3 text-left text-xs text-zinc-300 transition hover:border-cyan-400/25 hover:bg-cyan-400/5"><span>Analyze P-101</span><ArrowRight size={13} className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-cyan-300" /></button><button onClick={() => runTask('Find the relevant SOP and check for procedural conflicts')} className="group flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[.025] px-3 py-3 text-left text-xs text-zinc-300 transition hover:border-cyan-400/25 hover:bg-cyan-400/5"><span>Check relevant SOP</span><ArrowRight size={13} className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-cyan-300" /></button><button onClick={() => runTask('Prepare an evidence-backed approval note')} className="group flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[.025] px-3 py-3 text-left text-xs text-zinc-300 transition hover:border-cyan-400/25 hover:bg-cyan-400/5"><span>Create approval note</span><ArrowRight size={13} className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-cyan-300" /></button></div>
        </div>
        <div className="border-t border-white/10 p-4"><div className="mb-2 flex items-center gap-2 text-[9px] uppercase tracking-wider text-zinc-600"><ShieldCheck size={12} /> Sovereignty</div><p className="text-[10px] leading-4 text-zinc-500">Local-mode UI. Physical air-gapping remains an infrastructure control.</p></div>
      </aside>

      <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-5 flex items-end justify-between gap-4"><div><div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-cyan-300"><Sparkles size={12} /> Contextual workspace</div><h1 className="text-xl font-medium tracking-tight md:text-2xl">{workspace === 'overview' ? 'What are you working on?' : workspace[0].toUpperCase() + workspace.slice(1)}</h1></div><div className="hidden font-mono text-[9px] uppercase tracking-wider text-zinc-600 sm:block">{demo.running ? 'Agent executing' : demo.completed ? 'Review required' : 'Ready'}</div></div>
          <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7"><WorkspaceChip icon={Box} label="Engineering" active={workspace === 'engineering'} onClick={() => setWorkspace('engineering')} /><WorkspaceChip icon={Network} label="P&ID" active={workspace === 'pid'} onClick={() => setWorkspace('pid')} /><WorkspaceChip icon={GitBranch} label="Topology" active={workspace === 'topology'} onClick={() => setWorkspace('topology')} /><WorkspaceChip icon={FileText} label="Documents" active={workspace === 'document'} onClick={() => setWorkspace('document')} /><WorkspaceChip icon={Database} label="Data" active={workspace === 'data'} onClick={() => setWorkspace('data')} /><WorkspaceChip icon={Activity} label="Evidence" active={workspace === 'evidence'} onClick={() => setWorkspace('evidence')} /><WorkspaceChip icon={Download} label="Artifact" active={workspace === 'artifact'} onClick={() => setWorkspace('artifact')} /></div>

          <AnimatePresence mode="wait"><motion.div key={workspace} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .2 }}>
            {workspace === 'pid' || workspace === 'engineering' || (workspace === 'overview' && demo.completed) ? <PIDView selected={selected} onSelect={setSelected} /> : workspace === 'topology' ? <TopologyView /> : workspace === 'evidence' ? <div className="overflow-hidden rounded-xl border border-white/10 bg-[#071014]"><div className="border-b border-white/10 p-5"><div className="text-xs font-medium">Evidence explorer</div><div className="mt-1 text-[10px] text-zinc-500">Every important claim should point back to a source and review state.</div></div><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-xs"><thead className="bg-white/[.025] text-[9px] uppercase tracking-wider text-zinc-600"><tr>{EVIDENCE[0].map((h) => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}</tr></thead><tbody>{EVIDENCE.slice(1).map((row, i) => <tr key={i} className="border-t border-white/5 text-zinc-400"><td className="px-5 py-4 text-zinc-300">{row[0]}</td><td className="px-5 py-4">{row[1]}</td><td className="px-5 py-4 font-mono text-[10px]">{row[2]}</td><td className="px-5 py-4 font-mono text-cyan-200">{row[3]}</td><td className="px-5 py-4"><span className="rounded-full border border-amber-300/20 bg-amber-300/5 px-2 py-1 text-[9px] text-amber-200">{row[4]}</span></td></tr>)}</tbody></table></div></div> : workspace === 'artifact' ? <div className="grid gap-4 lg:grid-cols-[1fr_320px]"><div className="min-h-[410px] rounded-xl border border-white/10 bg-[#f4f1ea] p-8 text-zinc-800 shadow-2xl"><div className="mx-auto max-w-2xl"><div className="mb-8 border-b border-zinc-300 pb-4"><div className="text-[9px] uppercase tracking-[.2em] text-zinc-500">HRIDAY · DRAFT ARTIFACT</div><h2 className="mt-2 text-2xl font-semibold">Isolation Summary — P-101</h2><p className="mt-1 text-xs text-zinc-500">Evidence-backed draft · Human verification required</p></div><div className="space-y-5 text-sm"><p>Engineering findings have been assembled from the selected document and governed topology result.</p><div className="rounded-lg border border-zinc-300 p-4"><div className="mb-2 text-xs font-semibold">Boundary findings</div><div className="space-y-2 text-xs"><div className="flex justify-between"><span>Discharge</span><span className="font-mono">XV-201 · identified</span></div><div className="flex justify-between"><span>Drain</span><span className="font-mono">DV-101 · identified</span></div><div className="flex justify-between"><span>Suction isolation</span><span className="font-mono text-amber-700">unresolved</span></div></div></div></div></div></div><div className="rounded-xl border border-white/10 bg-[#071014] p-5"><div className="mb-4 text-xs font-medium">Artifact controls</div><button className="mb-2 flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-300 px-4 py-3 text-xs font-semibold text-[#041014]"><Download size={14} /> Export draft DOCX</button><p className="text-[10px] leading-4 text-zinc-600">Demo preview. Final artifacts come from the backend artifact engine.</p></div></div> : workspace === 'document' ? <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-white/10 bg-[#071014] p-5"><FileText className="mb-4 text-cyan-300" size={18} /><div className="text-sm">Inspection report</div><div className="mt-1 text-[10px] text-zinc-600">Local document · 14 pages · OCR available</div></div><div className="rounded-xl border border-white/10 bg-[#071014] p-5"><FileText className="mb-4 text-cyan-300" size={18} /><div className="text-sm">Relevant SOP</div><div className="mt-1 text-[10px] text-zinc-600">Governed revision · review state tracked</div></div></div> : workspace === 'data' ? <div className="min-h-[410px] rounded-xl border border-white/10 bg-[#071014] p-6"><div className="mb-5 flex items-center justify-between"><div><div className="text-sm">Engineering data</div><div className="text-[10px] text-zinc-600">Structured records surfaced by the active task</div></div><Database size={18} className="text-cyan-300" /></div><div className="grid gap-2 sm:grid-cols-3">{[['Asset','P-101','Pump'],['Path edge','P-101 → XV-201','Discharge'],['Review','Suction isolation','Unresolved']].map(([a,b,c]) => <div key={a} className="rounded-lg border border-white/10 bg-white/[.02] p-4"><div className="text-[9px] uppercase tracking-wider text-zinc-600">{a}</div><div className="mt-2 font-mono text-sm text-zinc-200">{b}</div><div className="mt-1 text-[10px] text-zinc-500">{c}</div></div>)}</div></div> : <div className="grid gap-4 lg:grid-cols-[1fr_320px]"><div className="rounded-xl border border-white/10 bg-[#071014] p-6"><div className="flex h-[360px] flex-col items-center justify-center text-center"><div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/5"><Bot className="text-cyan-200" /></div><h2 className="text-lg font-medium">Start with a task</h2><p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">Ask HRIDAY to inspect engineering documents, trace an asset, retrieve evidence, or prepare a draft deliverable. The workspace will adapt to the task.</p><button onClick={() => runTask('Analyze P-101 and prepare an isolation summary')} className="mt-6 flex items-center gap-2 rounded-lg border border-cyan-300/25 bg-cyan-300/5 px-4 py-2.5 text-xs text-cyan-100 transition hover:bg-cyan-300/10">Try the P-101 flow <ArrowRight size={13} /></button></div></div><div className="space-y-3"><div className="rounded-xl border border-white/10 bg-[#071014] p-5"><div className="mb-4 text-[9px] uppercase tracking-[.18em] text-zinc-600">Available surfaces</div>{[['P&ID','Visual engineering evidence'],['Topology','Governed connectivity'],['Evidence','Claims + provenance'],['Artifact','Draft deliverables']].map(([a,b]) => <button onClick={() => setWorkspace(a === 'P&ID' ? 'pid' : a === 'Topology' ? 'topology' : a === 'Evidence' ? 'evidence' : 'artifact')} key={a} className="mb-2 flex w-full items-center justify-between rounded-lg border border-white/5 px-3 py-3 text-left hover:bg-white/[.03]"><div><div className="text-xs text-zinc-300">{a}</div><div className="text-[9px] text-zinc-600">{b}</div></div><ChevronRight size={13} className="text-zinc-700" /></button>)}</div></div></div>}
          </motion.div></AnimatePresence>
        </div>
      </main>
    </div>

    {palette && <div className="fixed inset-0 z-[120] flex items-start justify-center bg-black/70 p-4 pt-[12vh] backdrop-blur-sm" onMouseDown={() => setPalette(false)}><div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#0a1013] shadow-2xl" onMouseDown={(e) => e.stopPropagation()}><div className="flex items-center gap-3 border-b border-white/10 px-4"><Command size={16} className="text-cyan-300" /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && executeSearch()} placeholder="Search HRIDAY or describe a task…" className="h-14 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600" /><button onClick={() => setPalette(false)}><X size={16} className="text-zinc-600" /></button></div><div className="p-3">{query ? <button onClick={executeSearch} className="flex w-full items-center gap-3 rounded-lg p-3 text-left hover:bg-white/[.04]"><Sparkles size={15} className="text-cyan-300" /><div><div className="text-xs text-zinc-200">Ask HRIDAY</div><div className="text-[10px] text-zinc-600">Run: {query}</div></div></button> : <><div className="px-3 pb-2 text-[9px] uppercase tracking-wider text-zinc-600">Quick actions</div>{[['Analyze P-101','engineering'],['Open topology','topology'],['Review evidence','evidence'],['Open P&ID','pid']].map(([label,target]) => <button key={label} onClick={() => { setWorkspace(target as Workspace); setPalette(false); }} className="flex w-full items-center gap-3 rounded-lg p-3 text-left hover:bg-white/[.04]"><Search size={14} className="text-zinc-600" /><span className="text-xs text-zinc-300">{label}</span></button>)}</>}</div></div></div>}
  </div>;
}
