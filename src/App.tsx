import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { NavigationBar } from '@/components/NavigationBar';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { PipelineSection } from '@/components/sections/PipelineSection';
import { WorkspaceSection } from '@/components/sections/WorkspaceSection';
import { TopologySection } from '@/components/sections/TopologySection';
import { IsolationSection } from '@/components/sections/IsolationSection';
import { AuditSection } from '@/components/sections/AuditSection';
import { WorkbenchV3 } from '@/components/workbench/WorkbenchV3';

function App() {
  const [workbenchOpen, setWorkbenchOpen] = useState(false);

  useEffect(() => {
    const syncHash = () => setWorkbenchOpen(window.location.hash === '#workbench');
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  const openWorkbench = () => {
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
      {!workbenchOpen && <motion.button initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.5 }} onClick={openWorkbench} className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full border border-cyan-300/30 bg-[#081114]/90 px-5 py-3 text-xs font-semibold tracking-wide text-cyan-100 shadow-[0_12px_50px_rgba(0,0,0,.45)] backdrop-blur-xl transition hover:border-cyan-300/50 hover:bg-[#0b171b]">Test HRIDAY <ArrowRight size={14} /></motion.button>}
      <AnimatePresence>{workbenchOpen && <WorkbenchV3 onExit={closeWorkbench} />}</AnimatePresence>
    </div>
  );
}

export default App;
