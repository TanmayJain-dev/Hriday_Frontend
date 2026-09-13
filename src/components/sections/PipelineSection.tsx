import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import {
  FileInput,
  ScanLine,
  Ruler,
  Share2,
  ShieldCheck,
  UserCheck,
  type LucideIcon,
} from 'lucide-react';
import { PIPELINE_STAGES } from '@/data/pid-data';

const ICONS: Record<string, LucideIcon> = {
  FileInput,
  ScanLine,
  Ruler,
  Share2,
  ShieldCheck,
  UserCheck,
};

export function PipelineSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const lineHeight = useTransform(scrollYProgress, [0.1, 0.7], ['0%', '100%']);

  return (
    <section
      ref={ref}
      id="pipeline"
      className="relative w-full bg-[hsl(210_20%_4%)] py-32"
    >
      <div className="absolute inset-0 eng-grid opacity-30" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <p className="mb-3 font-mono text-xs tracking-[0.3em] text-[hsl(185_85%_50%)] uppercase">
            Section 02
          </p>
          <h2 className="text-3xl font-light tracking-tight text-white sm:text-4xl md:text-5xl">
            The Pipeline
          </h2>
          <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-muted-foreground">
            Six deterministic stages transform a legacy P&ID drawing into a
            verified, audit-ready isolation package. Every step is explainable
            and evidence-backed.
          </p>
        </motion.div>

        {/* Pipeline */}
        <div className="relative">
          {/* Horizontal progress line */}
          <div className="absolute left-0 right-0 top-[3.5rem] hidden h-px bg-border md:block">
            <motion.div
              className="h-full bg-gradient-to-r from-[hsl(185_85%_50%)] to-[hsl(160_70%_42%)]"
              style={{ width: lineHeight }}
            />
          </div>

          {/* Stages */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-6 md:gap-0">
            {PIPELINE_STAGES.map((stage, index) => {
              const Icon = ICONS[stage.icon];
              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="relative flex flex-col items-center md:px-3"
                >
                  {/* Node dot on the line */}
                  <div className="relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-[hsl(210_20%_6%)]">
                    <Icon className="h-6 w-6 text-[hsl(185_85%_50%)]" />
                    {/* Pulsing ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full border border-[hsl(185_85%_50%)]"
                      animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                    />
                  </div>

                  {/* Stage number */}
                  <span className="mb-2 font-mono text-[10px] tracking-widest text-muted-foreground">
                    0{index + 1}
                  </span>

                  {/* Label */}
                  <h3 className="mb-2 text-center text-sm font-medium text-white">
                    {stage.label}
                  </h3>

                  {/* Description */}
                  <p className="mb-3 text-center text-xs font-light leading-relaxed text-muted-foreground">
                    {stage.description}
                  </p>

                  {/* Engineering term */}
                  <span className="rounded-sm border border-border bg-[hsl(210_20%_6%)] px-2 py-1 font-mono text-[10px] text-[hsl(160_70%_42%)]">
                    {stage.term}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom annotations */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 flex flex-col items-center gap-2 border-t border-border pt-8 text-center"
        >
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Deterministic Topology Reconstruction → Evidence-Backed Decisions →
            Human-in-the-Loop Approval
          </p>
        </motion.div>
      </div>
    </section>
  );
}
