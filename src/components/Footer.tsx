import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="relative w-full border-t border-border bg-[hsl(210_20%_3%)] py-16">
      <div className="absolute inset-0 eng-grid opacity-10" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-between gap-8 md:flex-row"
        >
          {/* Logo + tagline */}
          <div className="flex flex-col items-center gap-3 md:items-start">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[hsl(185_85%_50%_/_0.3)] bg-[hsl(185_85%_50%_/_0.05)]">
                <span className="font-mono text-sm font-bold text-[hsl(185_85%_50%)]">
                  H
                </span>
              </div>
              <span className="text-sm font-semibold tracking-wide text-white">
                HRIDAY
              </span>
            </div>
            <p className="max-w-xs text-center text-xs font-light leading-relaxed text-muted-foreground md:text-left">
              Sovereign Industrial AI Workbench for deterministic process
              topology reconstruction from brownfield P&ID drawings.
            </p>
          </div>

          {/* Identification */}
          <div className="flex flex-col items-center gap-4 md:items-end">
            <div className="flex items-center gap-6 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              <span>SIH26117</span>
              <span className="text-border">|</span>
              <span>Team GARUD</span>
              <span className="text-border">|</span>
              <span>Sovereign Industrial AI Workbench</span>
            </div>
            <p className="font-mono text-[10px] text-muted-foreground/60">
              Deterministic. Explainable. Human-in-the-Loop.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
