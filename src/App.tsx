import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ShieldAlert, ShieldCheck } from 'lucide-react';
import { NavigationBar } from '@/components/NavigationBar';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { PipelineSection } from '@/components/sections/PipelineSection';
import { WorkspaceSection } from '@/components/sections/WorkspaceSection';
import { TopologySection } from '@/components/sections/TopologySection';
import { IsolationSection } from '@/components/sections/IsolationSection';
import { AuditSection } from '@/components/sections/AuditSection';
import { WorkbenchV4 } from '@/components/workbench/WorkbenchV4';

function App() {
  const [workbenchOpen, setWorkbenchOpen] = useState(false);
  const configuredMode = import.meta.env.VITE_HRIDAY_ADAPTER_MODE;
  const isBackendMode = configuredMode === 'backend';
  const isDemoMode = configuredMode === undefined || configuredMode === '' || configuredMode === 'demo';
  const isInvalidMode = !isBackendMode && !isDemoMode;

  useEffect(() => {
    const syncHash = () => setWorkbenchOpen(window.location.hash === '#workbench' && !isInvalidMode);
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, [isInvalidMode]);

  const openWorkbench = () => {
    if (isInvalidMode) return;
    window.history.replaceState(null, '', '#workbench');
    setWorkbenchOpen(true);
  };

  const closeWorkbench = () => {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    setWorkbenchOpen(false);
  };

  return (
    <div className="relative min-h-screen w-full bg-[hsl(210_20%_4%)] text-foreground">
      <NavigationBar />
      <main>
        <HeroSection />
        <PipelineSection />
        <WorkspaceSection />
        <TopologySection />
        <IsolationSection />
        <AuditSection />
      </main>
      <Footer />

      {!workbenchOpen && (
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          onClick={openWorkbench}
          disabled={isInvalidMode}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full border border-cyan-300/30 bg-[#081114]/90 px-5 py-3 text-xs font-semibold tracking-wide text-cyan-100 shadow-[0_12px_50px_rgba(0,0,0,.45)] backdrop-blur-xl transition hover:border-cyan-300/50 hover:bg-[#0b171b] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isInvalidMode ? 'Configuration error' : 'Test HRIDAY'} <ArrowRight size={14} />
        </motion.button>
      )}

      {workbenchOpen && (
        <div className="fixed left-1/2 top-3 z-[70] -translate-x-1/2">
          <div className={`flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[.14em] shadow-2xl backdrop-blur-xl ${
            isBackendMode
              ? 'border-amber-300/25 bg-amber-950/80 text-amber-200'
              : 'border-amber-300/25 bg-amber-950/80 text-amber-200'
          }`}>
            {isBackendMode ? <ShieldAlert size={12} /> : <ShieldAlert size={12} />}
            {isBackendMode ? 'Backend adapter · integration contract pending' : 'Demo adapter · synthetic data · not air-gapped'}
          </div>
        </div>
      )}

      {isInvalidMode && (
        <div className="fixed bottom-6 left-6 z-40 max-w-sm rounded-xl border border-red-300/20 bg-[#160b0d]/95 p-4 shadow-2xl backdrop-blur-xl">
          <div className="font-mono text-[9px] uppercase tracking-[.18em] text-red-200">Deployment configuration blocked</div>
          <p className="mt-2 text-[11px] leading-5 text-zinc-400">
            VITE_HRIDAY_ADAPTER_MODE is invalid. Use only <span className="text-zinc-200">demo</span> or <span className="text-zinc-200">backend</span>. Synthetic data is not exposed as a fallback.
          </p>
        </div>
      )}

      <AnimatePresence>{workbenchOpen && <WorkbenchV4 onExit={closeWorkbench} />}</AnimatePresence>
    </div>
  );
}

export default App;
