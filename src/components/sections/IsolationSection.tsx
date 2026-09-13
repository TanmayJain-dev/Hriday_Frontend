import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ISOLATION_CANDIDATES } from '@/data/pid-data';
import {
  ShieldCheck,
  Search,
  GitBranch,
  AlertTriangle,
  CheckCircle2,
  UserCheck,
  Lock,
} from 'lucide-react';

type Phase = 'idle' | 'traversing' | 'results';

export function IsolationSection() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [traversedNodes, setTraversedNodes] = useState<string[]>([]);

  const traversalPath = ['P-101', 'XV-101', 'XV-102', 'DV-201'];

  useEffect(() => {
    if (phase !== 'traversing') return;

    setTraversedNodes([]);
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < traversalPath.length) {
        setTraversedNodes((prev) => [...prev, traversalPath[idx]]);
        idx++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase('results'), 500);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [phase]);

  const handleInitiate = () => {
    setPhase('traversing');
  };

  const handleReset = () => {
    setPhase('idle');
    setTraversedNodes([]);
  };

  return (
    <section
      id="isolation"
      className="relative w-full bg-[hsl(210_20%_3%)] py-32"
    >
      <div className="absolute inset-0 eng-grid opacity-20" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p className="mb-3 font-mono text-xs tracking-[0.3em] text-[hsl(185_85%_50%)] uppercase">
            Section 05
          </p>
          <h2 className="text-3xl font-light tracking-tight text-white sm:text-4xl md:text-5xl">
            Isolation Intelligence
          </h2>
          <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-muted-foreground">
            The safety verification engine traverses the knowledge graph to
            identify all isolation points for a given asset. Every result is
            pending human engineer verification — HRIDAY never approves
            autonomously.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
          {/* Left: Workflow input and traversal */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-lg border border-border bg-[hsl(210_20%_5%)]"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[hsl(185_85%_50%)]" />
                <span className="font-mono text-xs text-muted-foreground">
                  Isolation Boundary Engine
                </span>
              </div>
              <span
                className={`font-mono text-[10px] ${
                  phase === 'traversing'
                    ? 'text-[hsl(185_85%_50%)]'
                    : phase === 'results'
                      ? 'text-[hsl(160_70%_42%)]'
                      : 'text-muted-foreground'
                }`}
              >
                {phase === 'idle' && 'Ready'}
                {phase === 'traversing' && 'Traversing...'}
                {phase === 'results' && 'Complete'}
              </span>
            </div>

            <div className="p-6">
              {/* Input instruction */}
              <div className="mb-6 rounded-md border border-border bg-[hsl(210_20%_6%)] p-4">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Isolation Request
                </p>
                <p className="font-mono text-sm text-white">
                  Prepare isolation boundary for{' '}
                  <span className="text-[hsl(185_85%_50%)]">P-101</span>
                </p>
              </div>

              {/* Action button */}
              {phase === 'idle' && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleInitiate}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-[hsl(185_85%_50%_/_0.3)] bg-[hsl(185_85%_50%_/_0.05)] py-3 text-sm font-medium text-white transition-all hover:border-[hsl(185_85%_50%_/_0.6)] hover:bg-[hsl(185_85%_50%_/_0.1)]"
                >
                  <Search className="h-4 w-4" />
                  Initiate Graph Traversal
                </motion.button>
              )}

              {/* Traversal visualization */}
              {phase !== 'idle' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-[hsl(185_85%_50%)]" />
                    <span className="font-mono text-xs text-muted-foreground">
                      Graph Traversal
                    </span>
                  </div>

                  {/* Traversal path */}
                  <div className="flex items-center justify-between">
                    {traversalPath.map((node, i) => {
                      const isTraversed = traversedNodes.includes(node);
                      const isCurrent =
                        phase === 'traversing' &&
                        traversedNodes[traversedNodes.length - 1] === node;

                      return (
                        <div
                          key={node}
                          className="flex flex-1 flex-col items-center"
                        >
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0.5 }}
                            animate={{
                              scale: isCurrent ? 1.15 : 1,
                              opacity: isTraversed ? 1 : 0.4,
                            }}
                            className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                              isTraversed
                                ? 'border-[hsl(185_85%_50%)] bg-[hsl(185_85%_50%_/_0.1)]'
                                : 'border-border bg-muted'
                            }`}
                          >
                            {isTraversed ? (
                              <CheckCircle2 className="h-5 w-5 text-[hsl(160_70%_42%)]" />
                            ) : (
                              <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                            )}
                          </motion.div>
                          <span
                            className={`mt-1.5 font-mono text-[10px] ${
                              isTraversed ? 'text-white' : 'text-muted-foreground'
                            }`}
                          >
                            {node}
                          </span>
                          {isCurrent && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="mt-0.5 font-mono text-[8px] text-[hsl(185_85%_50%)]"
                            >
                              scanning
                            </motion.span>
                          )}
                          {/* Connector line */}
                          {i < traversalPath.length - 1 && (
                            <div
                              className={`absolute h-px w-16 transition-colors duration-300 ${
                                traversedNodes.includes(node) &&
                                traversedNodes.includes(traversalPath[i + 1])
                                  ? 'bg-[hsl(185_85%_50%)]'
                                  : 'bg-border'
                              }`}
                              style={{
                                transform: `translate(30px, -28px)`,
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Status log */}
                  <div className="rounded-md border border-border bg-[hsl(210_20%_4%)] p-3">
                    <div className="space-y-1 font-mono text-[10px]">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-[hsl(185_85%_50%)]">$</span>
                        <span>traverse --asset P-101 --mode isolation</span>
                      </div>
                      {traversedNodes.map((node) => (
                        <motion.div
                          key={node}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2 text-[hsl(160_70%_42%)]"
                        >
                          <span>→</span>
                          <span>visited {node} — isolation candidate identified</span>
                        </motion.div>
                      ))}
                      {phase === 'results' && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2 text-white"
                        >
                          <span>✓</span>
                          <span>traversal complete — 3 candidates found</span>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {phase === 'results' && (
                    <button
                      onClick={handleReset}
                      className="w-full rounded-md border border-border py-2 text-xs text-muted-foreground transition-colors hover:border-[hsl(185_85%_50%_/_0.3)] hover:text-white"
                    >
                      Reset Traversal
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Isolation Candidates */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative overflow-hidden rounded-lg border border-border bg-[hsl(210_20%_5%)]"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="font-mono text-xs text-muted-foreground">
                Isolation Candidates
              </span>
              {phase === 'results' && (
                <span className="font-mono text-[10px] text-[hsl(160_70%_42%)]">
                  3 identified
                </span>
              )}
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                {phase !== 'results' ? (
                  <motion.div
                    key="waiting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-full min-h-[300px] flex-col items-center justify-center text-center"
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-muted">
                      {phase === 'traversing' ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        >
                          <GitBranch className="h-8 w-8 text-[hsl(185_85%_50%)]" />
                        </motion.div>
                      ) : (
                        <Lock className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <p className="max-w-xs text-sm font-light text-muted-foreground">
                      {phase === 'traversing'
                        ? 'Traversing knowledge graph to identify isolation points...'
                        : 'Initiate traversal to identify isolation candidates for P-101.'}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {ISOLATION_CANDIDATES.map((candidate, i) => (
                      <motion.div
                        key={candidate.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.15 }}
                        className="flex items-center gap-4 rounded-md border border-[hsl(160_70%_42%_/_0.2)] bg-[hsl(160_70%_42%_/_0.03)] p-4"
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-[hsl(160_70%_42%_/_0.3)] bg-[hsl(160_70%_42%_/_0.08)]">
                          <CheckCircle2 className="h-5 w-5 text-[hsl(160_70%_42%)]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-sm font-medium text-white">
                              {candidate.id}
                            </span>
                            <span className="rounded-sm border border-[hsl(160_70%_42%_/_0.3)] px-2 py-0.5 font-mono text-[10px] text-[hsl(160_70%_42%)]">
                              Verified
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {candidate.type} — {candidate.function}
                          </p>
                        </div>
                      </motion.div>
                    ))}

                    {/* Human verification banner */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="mt-6 rounded-md border border-[hsl(35_90%_55%_/_0.3)] bg-[hsl(35_90%_55%_/_0.05)] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[hsl(35_90%_55%)]" />
                        <div>
                          <p className="text-sm font-medium text-white">
                            Pending Human Engineer Verification
                          </p>
                          <p className="mt-1 text-xs font-light leading-relaxed text-muted-foreground">
                            HRIDAY has identified isolation candidates through
                            deterministic graph traversal. These candidates must
                            be verified and approved by a qualified engineer
                            before any isolation is executed.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Engineer sign-off indicator */}
                    <div className="flex items-center justify-between border-t border-border pt-4">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono text-xs text-muted-foreground">
                          Engineer Sign-Off
                        </span>
                      </div>
                      <span className="rounded-sm border border-[hsl(35_90%_55%_/_0.3)] px-3 py-1 font-mono text-[10px] text-[hsl(35_90%_55%)]">
                        Awaiting
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
