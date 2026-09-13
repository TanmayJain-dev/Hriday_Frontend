import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 1.1]);

  return (
    <section ref={ref} className="relative min-h-screen w-full overflow-hidden bg-[hsl(210_20%_4%)]" id="hero">
      <div className="absolute inset-0 eng-grid opacity-60" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, hsl(210 20% 8%) 0%, hsl(210 20% 4%) 60%, hsl(210 20% 3%) 100%)' }} />

      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 1440 900" fill="none">
        {[150, 300, 600, 750].map((y, i) => <motion.line key={`h-${i}`} x1="0" y1={y} x2="1440" y2={y} stroke="hsl(185 85% 50%)" strokeWidth="0.5" strokeOpacity="0.15" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: i * 0.3, ease: 'easeInOut' }} />)}
        {[200, 500, 900, 1200].map((x, i) => <motion.line key={`v-${i}`} x1={x} y1="0" x2={x} y2="900" stroke="hsl(185 85% 50%)" strokeWidth="0.5" strokeOpacity="0.1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.5, delay: i * 0.2, ease: 'easeInOut' }} />)}
        <motion.path d="M 100 750 Q 300 600 500 650 T 900 550" stroke="hsl(185 85% 50%)" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="4 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, delay: 0.5 }} />
        <motion.path d="M 1200 200 Q 1000 350 800 300 T 400 400" stroke="hsl(160 70% 42%)" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="4 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, delay: 1 }} />
        <g stroke="hsl(185 85% 50%)" strokeWidth="1.5" strokeOpacity="0.3" fill="none"><path d="M 40 40 L 40 80 L 80 80" /><path d="M 1400 40 L 1400 80 L 1360 80" /><path d="M 40 860 L 40 820 L 80 820" /><path d="M 1400 860 L 1400 820 L 1360 820" /></g>
      </svg>

      <div className="pointer-events-none absolute inset-0 overflow-hidden"><div className="scan-line absolute left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, hsl(185 85% 50% / 0.6), transparent)', boxShadow: '0 0 20px hsl(185 85% 50% / 0.4)' }} /></div>

      <motion.div style={{ opacity, scale }} className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="absolute top-8 left-1/2 flex -translate-x-1/2 items-center gap-6 whitespace-nowrap font-mono text-xs tracking-widest text-muted-foreground uppercase">
          <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(185_85%_50%)]" />SIH26117</span><span className="text-border">|</span><span>Team GARUD</span><span className="text-border">|</span><span>Sovereign Industrial AI Workbench</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.5 }} className="max-w-5xl text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }} className="mb-6 font-mono text-xs tracking-[0.3em] text-[hsl(185_85%_50%)] uppercase">Sovereign industrial intelligence</motion.p>
          <h1 className="text-4xl font-light leading-[1.15] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">AI that works <span className="font-medium text-glow-cyan text-[hsl(185_85%_50%)]">inside the boundary.</span></h1>
          <p className="mx-auto mt-8 max-w-2xl text-base font-light leading-relaxed text-muted-foreground sm:text-lg">HRIDAY is a local-first multimodal AI workbench for confidential industrial knowledge work — with deterministic Brownfield P&amp;ID and maintenance intelligence as its flagship capability.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1 }} className="mt-16 flex flex-col items-center gap-6">
          <div className="flex items-center gap-4"><a href="#pipeline" className="group flex items-center gap-3 rounded-md border border-[hsl(185_85%_50%_/_0.3)] bg-[hsl(185_85%_50%_/_0.05)] px-6 py-3 text-sm font-medium text-white transition-all hover:border-[hsl(185_85%_50%_/_0.6)] hover:bg-[hsl(185_85%_50%_/_0.1)]">Explore the system <span className="transition-transform group-hover:translate-x-1">→</span></a></div>
          <div className="flex items-center gap-6 font-mono text-xs text-muted-foreground"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[hsl(160_70%_42%)]" />System Ready</span><span>Local-first</span><span>Human verified</span></div>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.5 }} className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"><span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Scroll</span><div className="h-12 w-px bg-gradient-to-b from-[hsl(185_85%_50%)] to-transparent" /></motion.div>
    </section>
  );
}
