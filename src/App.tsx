import { NavigationBar } from '@/components/NavigationBar';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { PipelineSection } from '@/components/sections/PipelineSection';
import { WorkspaceSection } from '@/components/sections/WorkspaceSection';
import { TopologySection } from '@/components/sections/TopologySection';
import { IsolationSection } from '@/components/sections/IsolationSection';
import { AuditSection } from '@/components/sections/AuditSection';

function App() {
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
    </div>
  );
}

export default App;
