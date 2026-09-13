import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { DETECTED_ENTITIES, type DetectedEntity } from '@/data/pid-data';
import { CheckCircle2, Circle, Clock, Crosshair, FileSearch } from 'lucide-react';

function ConfidenceBar({ value }: { value: number }) {
  const color =
    value >= 95
      ? 'bg-[hsl(160_70%_42%)]'
      : value >= 90
        ? 'bg-[hsl(185_85%_50%)]'
        : 'bg-[hsl(35_90%_55%)]';

  return (
    <div className="flex items-center gap-2">
      <div className="h-1 w-16 overflow-hidden rounded-full bg-border">
        <motion.div
          className={`h-full ${color}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      <span className="font-mono text-xs text-muted-foreground">{value.toFixed(1)}%</span>
    </div>
  );
}

function TopologyBadge({ status }: { status: DetectedEntity['topology'] }) {
  if (status === 'Verified') {
    return (
      <span className="flex items-center gap-1 rounded-sm border border-[hsl(160_70%_42%_/_0.3)] bg-[hsl(160_70%_42%_/_0.08)] px-2 py-0.5 font-mono text-[10px] text-[hsl(160_70%_42%)]">
        <CheckCircle2 className="h-3 w-3" />
        Verified
      </span>
    );
  }
  if (status === 'Pending') {
    return (
      <span className="flex items-center gap-1 rounded-sm border border-[hsl(35_90%_55%_/_0.3)] bg-[hsl(35_90%_55%_/_0.08)] px-2 py-0.5 font-mono text-[10px] text-[hsl(35_90%_55%)]">
        <Clock className="h-3 w-3" />
        Pending
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 rounded-sm border border-border bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
      <Circle className="h-3 w-3" />
      Review
    </span>
  );
}

function EntityTypeColor({ type }: { type: DetectedEntity['type'] }) {
  const colors: Record<DetectedEntity['type'], string> = {
    Equipment: 'text-[hsl(185_85%_50%)]',
    Valve: 'text-[hsl(160_70%_42%)]',
    Pipe: 'text-[hsl(200_80%_60%)]',
    Instrument: 'text-[hsl(35_90%_55%)]',
  };
  return <span className={`font-mono text-xs ${colors[type]}`}>{type}</span>;
}

export function WorkspaceSection() {
  const [activeEntity, setActiveEntity] = useState<DetectedEntity | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="workspace"
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
            Section 03
          </p>
          <h2 className="text-3xl font-light tracking-tight text-white sm:text-4xl md:text-5xl">
            P&ID Reconstruction Workspace
          </h2>
          <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-muted-foreground">
            The perception engine traces lines, identifies symbols, and
            extracts text from the source drawing. Every detected entity is
            backed by coordinate evidence and confidence scoring.
          </p>
        </motion.div>

        {/* Workspace layout */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.2fr_1fr]">
          {/* Left: Source Drawing */}
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
                <FileSearch className="h-4 w-4 text-[hsl(185_85%_50%)]" />
                <span className="font-mono text-xs text-muted-foreground">
                  Source Drawing
                </span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">
                PID-SIH26117-S04
              </span>
            </div>

            {/* Blueprint canvas */}
            <div className="relative aspect-[3/4] bg-[hsl(210_25%_6%)]">
              {/* Grid overlay */}
              <div className="absolute inset-0 eng-grid-fine opacity-50" />

              {/* Simulated P&ID drawing */}
              <svg
                viewBox="0 0 300 400"
                className="absolute inset-0 h-full w-full"
                fill="none"
              >
                {/* Pipe lines */}
                <g
                  stroke="hsl(200_30%_60%)"
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                >
                  <line x1="50" y1="80" x2="250" y2="80" />
                  <line x1="250" y1="80" x2="250" y2="320" />
                  <line x1="50" y1="80" x2="50" y2="320" />
                  <line x1="50" y1="320" x2="250" y2="320" />
                  <line x1="150" y1="80" x2="150" y2="180" />
                  <line x1="150" y1="240" x2="150" y2="320" />
                </g>

                {/* Equipment symbols */}
                <g
                  stroke="hsl(185_85%_50%)"
                  strokeWidth="1.5"
                  strokeOpacity="0.5"
                  fill="none"
                >
                  {/* Pump circle */}
                  <circle cx="150" cy="210" r="24" />
                  <line x1="138" y1="198" x2="162" y2="222" />
                  <line x1="162" y1="198" x2="138" y2="222" />
                  {/* Valve symbols */}
                  <g>
                    <path d="M 100 80 L 110 72 L 110 88 Z" />
                    <path d="M 120 80 L 110 72 L 110 88 Z" />
                  </g>
                  <g>
                    <path d="M 200 320 L 210 312 L 210 328 Z" />
                    <path d="M 220 320 L 210 312 L 210 328 Z" />
                  </g>
                  {/* Instrument circles */}
                  <circle cx="50" cy="60" r="10" />
                  <circle cx="260" cy="340" r="10" />
                </g>

                {/* Text annotations */}
                <g
                  fill="hsl(200_30%_70%)"
                  fillOpacity="0.3"
                  className="font-mono"
                  style={{ fontSize: '6px' }}
                >
                  <text x="140" y="245">P-101</text>
                  <text x="95" y="72">XV-201</text>
                  <text x="195" y="335">V-202</text>
                  <text x="38" y="58">PI-101</text>
                  <text x="248" y="355">TI-204</text>
                </g>
              </svg>

              {/* Scanning overlay */}
              <motion.div
                className="absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent via-[hsl(185_85%_50%_/_0.08)] to-transparent"
                style={{
                  top: `${scanProgress}%`,
                  borderTop: '1px solid hsl(185 85% 50% / 0.5)',
                  boxShadow: '0 0 20px hsl(185 85% 50% / 0.2)',
                }}
              />

              {/* Coordinate annotations */}
              <div className="absolute bottom-2 left-2 font-mono text-[9px] text-muted-foreground/60">
                GRID: D-7 | SCALE: 1:100
              </div>
              <div className="absolute right-2 top-2 font-mono text-[9px] text-muted-foreground/60">
                REV: B
              </div>
            </div>
          </motion.div>

          {/* Center: Animated Tracing */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative overflow-hidden rounded-lg border border-border bg-[hsl(210_20%_5%)]"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <Crosshair className="h-4 w-4 text-[hsl(185_85%_50%)]" />
                <span className="font-mono text-xs text-muted-foreground">
                  Perception Engine — Live Trace
                </span>
              </div>
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-[hsl(160_70%_42%)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[hsl(160_70%_42%)] animate-pulse" />
                Processing
              </span>
            </div>

            {/* Tracing canvas */}
            <div className="relative aspect-[3/4] bg-[hsl(210_25%_4%)]">
              <div className="absolute inset-0 eng-grid-fine opacity-30" />

              <svg
                viewBox="0 0 300 400"
                className="absolute inset-0 h-full w-full"
                fill="none"
              >
                {/* Animated trace lines */}
                <g
                  stroke="hsl(185 85% 50%)"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <motion.line
                    x1="50"
                    y1="80"
                    x2="250"
                    y2="80"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.3 }}
                  />
                  <motion.line
                    x1="150"
                    y1="80"
                    x2="150"
                    y2="186"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.8 }}
                  />
                  <motion.line
                    x1="150"
                    y1="234"
                    x2="150"
                    y2="320"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 1.2 }}
                  />
                </g>

                {/* Detected nodes */}
                {DETECTED_ENTITIES.map((entity, i) => (
                  <motion.g
                    key={entity.id}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.2 }}
                    onClick={() => setActiveEntity(entity)}
                    className="cursor-pointer"
                  >
                    {/* Bounding box */}
                    <rect
                      x={(entity.coordinates.x / 100) * 300 - 12}
                      y={(entity.coordinates.y / 100) * 400 - 12}
                      width="24"
                      height="24"
                      stroke={
                        entity.topology === 'Verified'
                          ? 'hsl(160 70% 42%)'
                          : 'hsl(35 90% 55%)'
                      }
                      strokeWidth="0.5"
                      strokeOpacity="0.6"
                      strokeDasharray="2 2"
                      fill="none"
                    />
                    {/* Center dot */}
                    <circle
                      cx={(entity.coordinates.x / 100) * 300}
                      cy={(entity.coordinates.y / 100) * 400}
                      r="2"
                      fill={
                        entity.type === 'Equipment'
                          ? 'hsl(185 85% 50%)'
                          : entity.type === 'Valve'
                            ? 'hsl(160 70% 42%)'
                            : entity.type === 'Instrument'
                              ? 'hsl(35 90% 55%)'
                              : 'hsl(200 80% 60%)'
                      }
                    />
                    {/* Label */}
                    <text
                      x={(entity.coordinates.x / 100) * 300 + 16}
                      y={(entity.coordinates.y / 100) * 400 + 4}
                      fill="hsl(180 10% 80%)"
                      fillOpacity="0.7"
                      className="font-mono"
                      style={{ fontSize: '5px' }}
                    >
                      {entity.id}
                    </text>
                  </motion.g>
                ))}

                {/* Confidence highlight on active entity */}
                {activeEntity && (
                  <motion.rect
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    x={(activeEntity.coordinates.x / 100) * 300 - 16}
                    y={(activeEntity.coordinates.y / 100) * 400 - 16}
                    width="32"
                    height="32"
                    stroke="hsl(185 85% 50%)"
                    strokeWidth="1"
                    fill="none"
                  />
                )}
              </svg>

              {/* Status bar */}
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-border bg-[hsl(210_20%_5%_/_0.9)] px-4 py-2 backdrop-blur-sm">
                <span className="font-mono text-[10px] text-muted-foreground">
                  {DETECTED_ENTITIES.length} entities detected
                </span>
                <span className="font-mono text-[10px] text-[hsl(160_70%_42%)]">
                  {DETECTED_ENTITIES.filter((e) => e.topology === 'Verified').length} verified
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right: Detected Entities */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative overflow-hidden rounded-lg border border-border bg-[hsl(210_20%_5%)]"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="font-mono text-xs text-muted-foreground">
                Detected Entities
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {DETECTED_ENTITIES.length} found
              </span>
            </div>

            {/* Entity list */}
            <div className="max-h-[500px] overflow-y-auto p-3">
              {DETECTED_ENTITIES.map((entity, i) => (
                <motion.button
                  key={entity.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  onClick={() => setActiveEntity(entity)}
                  className={`mb-2 w-full rounded-md border p-3 text-left transition-all ${
                    activeEntity?.id === entity.id
                      ? 'border-[hsl(185_85%_50%_/_0.4)] bg-[hsl(185_85%_50%_/_0.05)]'
                      : 'border-border bg-[hsl(210_20%_6%)] hover:border-[hsl(185_85%_50%_/_0.2)]'
                  }`}
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-sm font-medium text-white">
                      {entity.id}
                    </span>
                    <TopologyBadge status={entity.topology} />
                  </div>

                  {/* Type and label */}
                  <div className="mb-2 flex items-center gap-2">
                    <EntityTypeColor type={entity.type} />
                    <span className="text-xs text-muted-foreground">
                      {entity.label}
                    </span>
                  </div>

                  {/* Confidence */}
                  <ConfidenceBar value={entity.confidence} />

                  {/* Connected assets (for primary equipment) */}
                  {entity.type === 'Equipment' && (
                    <div className="mt-2 border-t border-border pt-2">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        Connected Assets:
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {entity.connectedAssets.map((asset) => (
                          <span
                            key={asset}
                            className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                          >
                            {asset}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Active entity detail */}
            {activeEntity && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="border-t border-border bg-[hsl(210_20%_4%)] p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Crosshair className="h-3 w-3 text-[hsl(185_85%_50%)]" />
                  <span className="font-mono text-xs text-white">
                    {activeEntity.id} — Evidence
                  </span>
                </div>
                <div className="space-y-1 font-mono text-[10px] text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Coordinates</span>
                    <span className="text-white">
                      ({activeEntity.coordinates.x}, {activeEntity.coordinates.y})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Confidence</span>
                    <span className="text-[hsl(160_70%_42%)]">
                      {activeEntity.confidence.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Topology</span>
                    <span className="text-white">{activeEntity.topology}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
