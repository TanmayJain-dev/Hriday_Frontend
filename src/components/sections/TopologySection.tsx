import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  GRAPH_NODES,
  GRAPH_EDGES,
  ASSET_EVIDENCE,
  type GraphNode,
} from '@/data/pid-data';
import { X, Crosshair, FileText, MapPin, Link2, Gauge } from 'lucide-react';

const NODE_STYLES: Record<
  GraphNode['type'],
  { fill: string; stroke: string; label: string; size: number }
> = {
  equipment: {
    fill: 'hsl(185 85% 50% / 0.15)',
    stroke: 'hsl(185 85% 50%)',
    label: 'Equipment',
    size: 28,
  },
  valve: {
    fill: 'hsl(160 70% 42% / 0.15)',
    stroke: 'hsl(160 70% 42%)',
    label: 'Valve',
    size: 22,
  },
  pipe: {
    fill: 'hsl(200 80% 60% / 0.1)',
    stroke: 'hsl(200 80% 60%)',
    label: 'Pipe',
    size: 20,
  },
  instrument: {
    fill: 'hsl(35 90% 55% / 0.15)',
    stroke: 'hsl(35 90% 55%)',
    label: 'Instrument',
    size: 18,
  },
};

export function TopologySection() {
  const [selectedNode, setSelectedNode] = useState<string | null>('P-101');
  const [hoveredNode, setSelectedHoveredNode] = useState<string | null>(null);

  const selectedEvidence = selectedNode ? ASSET_EVIDENCE[selectedNode] : null;

  const isConnectedToSelected = (nodeId: string) => {
    if (!selectedNode) return false;
    return GRAPH_EDGES.some(
      (e) =>
        (e.from === selectedNode && e.to === nodeId) ||
        (e.from === nodeId && e.to === selectedNode),
    );
  };

  return (
    <section
      id="topology"
      className="relative w-full bg-[hsl(210_20%_4%)] py-32"
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
            Section 04
          </p>
          <h2 className="text-3xl font-light tracking-tight text-white sm:text-4xl md:text-5xl">
            Topology Graph
          </h2>
          <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-muted-foreground">
            The knowledge graph maps every detected entity and its engineering
            connections. Click any node to inspect its evidence trail — source
            coordinates, confidence, and linked assets.
          </p>
        </motion.div>

        {/* Graph + Evidence Panel */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
          {/* Graph canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-lg border border-border bg-[hsl(210_20%_5%)]"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="font-mono text-xs text-muted-foreground">
                Knowledge Graph — PID-SIH26117-S04
              </span>
              <div className="flex items-center gap-3">
                {Object.entries(NODE_STYLES).map(([key, style]) => (
                  <span
                    key={key}
                    className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: style.stroke }}
                    />
                    {style.label}
                  </span>
                ))}
              </div>
            </div>

            {/* SVG Graph */}
            <div className="relative aspect-[4/3] bg-[hsl(210_25%_4%)]">
              <div className="absolute inset-0 eng-grid-fine opacity-30" />

              <svg
                viewBox="0 0 800 600"
                className="absolute inset-0 h-full w-full"
                fill="none"
              >
                {/* Edges */}
                {GRAPH_EDGES.map((edge, i) => {
                  const from = GRAPH_NODES.find((n) => n.id === edge.from)!;
                  const to = GRAPH_NODES.find((n) => n.id === edge.to)!;
                  const isActive =
                    selectedNode &&
                    (edge.from === selectedNode || edge.to === selectedNode);

                  return (
                    <g key={`${edge.from}-${edge.to}`}>
                      <motion.line
                        x1={from.x}
                        y1={from.y}
                        x2={to.x}
                        y2={to.y}
                        stroke={isActive ? 'hsl(185 85% 50%)' : 'hsl(200 12% 25%)'}
                        strokeWidth={isActive ? 2 : 1}
                        strokeOpacity={isActive ? 0.6 : 0.4}
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.15 }}
                      />
                      {isActive && (
                        <line
                          x1={from.x}
                          y1={from.y}
                          x2={to.x}
                          y2={to.y}
                          stroke="hsl(185 85% 50%)"
                          strokeWidth="2"
                          strokeDasharray="6 4"
                          className="dash-flow"
                          opacity="0.5"
                        />
                      )}
                      {/* Edge label */}
                      <text
                        x={(from.x + to.x) / 2}
                        y={(from.y + to.y) / 2 - 4}
                        fill="hsl(200 8% 50%)"
                        className="font-mono"
                        style={{ fontSize: '8px' }}
                        textAnchor="middle"
                      >
                        {edge.label}
                      </text>
                    </g>
                  );
                })}

                {/* Nodes */}
                {GRAPH_NODES.map((node, i) => {
                  const style = NODE_STYLES[node.type];
                  const isSelected = selectedNode === node.id;
                  const isHovered = hoveredNode === node.id;
                  const isConnected = isConnectedToSelected(node.id);
                  const dimmed =
                    selectedNode && !isSelected && !isConnected;

                  return (
                    <motion.g
                      key={node.id}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: 0.3 + i * 0.1,
                        type: 'spring',
                      }}
                      onClick={() => setSelectedNode(node.id)}
                      onMouseEnter={() => setSelectedHoveredNode(node.id)}
                      onMouseLeave={() => setSelectedHoveredNode(null)}
                      className="cursor-pointer"
                      style={{ opacity: dimmed ? 0.3 : 1 }}
                    >
                      {/* Outer ring for selected */}
                      {isSelected && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={style.size + 8}
                          stroke={style.stroke}
                          strokeWidth="1"
                          strokeOpacity="0.3"
                          fill="none"
                          className="node-pulse"
                        />
                      )}

                      {/* Node shape */}
                      {node.type === 'equipment' ? (
                        <rect
                          x={node.x - style.size}
                          y={node.y - style.size}
                          width={style.size * 2}
                          height={style.size * 2}
                          rx="4"
                          fill={style.fill}
                          stroke={style.stroke}
                          strokeWidth={isSelected || isHovered ? 2 : 1.5}
                        />
                      ) : (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={style.size}
                          fill={style.fill}
                          stroke={style.stroke}
                          strokeWidth={isSelected || isHovered ? 2 : 1.5}
                        />
                      )}

                      {/* Node label */}
                      <text
                        x={node.x}
                        y={node.y + 4}
                        fill="white"
                        className="font-mono"
                        style={{ fontSize: '10px', fontWeight: 500 }}
                        textAnchor="middle"
                      >
                        {node.label}
                      </text>
                    </motion.g>
                  );
                })}
              </svg>

              {/* Coordinate readout */}
              <div className="absolute bottom-2 left-3 font-mono text-[9px] text-muted-foreground/50">
                GRAPH VIEW | {GRAPH_NODES.length} nodes | {GRAPH_EDGES.length} edges
              </div>
            </div>
          </motion.div>

          {/* Asset Evidence Panel */}
          <div className="relative overflow-hidden rounded-lg border border-border bg-[hsl(210_20%_5%)]">
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="font-mono text-xs text-muted-foreground">
                Asset Evidence Panel
              </span>
              {selectedEvidence && (
                <span className="font-mono text-[10px] text-[hsl(185_85%_50%)]">
                  {selectedEvidence.assetId}
                </span>
              )}
            </div>

            <AnimatePresence mode="wait">
              {selectedEvidence ? (
                <motion.div
                  key={selectedEvidence.assetId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-5"
                >
                  {/* Asset ID header */}
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[hsl(185_85%_50%_/_0.3)] bg-[hsl(185_85%_50%_/_0.05)]">
                      <Crosshair className="h-5 w-5 text-[hsl(185_85%_50%)]" />
                    </div>
                    <div>
                      <h3 className="font-mono text-lg font-medium text-white">
                        {selectedEvidence.assetId}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {selectedEvidence.type}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mb-5 text-sm font-light leading-relaxed text-muted-foreground">
                    {selectedEvidence.description}
                  </p>

                  {/* Evidence fields */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 border-t border-border pt-3">
                      <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          Source Drawing
                        </p>
                        <p className="mt-0.5 font-mono text-xs text-white">
                          {selectedEvidence.sourceDrawing}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 border-t border-border pt-3">
                      <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          Coordinates
                        </p>
                        <p className="mt-0.5 font-mono text-xs text-white">
                          {selectedEvidence.coordinates}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 border-t border-border pt-3">
                      <Link2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          Connections
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {selectedEvidence.connections.map((conn) => (
                            <button
                              key={conn}
                              onClick={() => setSelectedNode(conn)}
                              className="rounded-sm border border-border bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors hover:border-[hsl(185_85%_50%_/_0.3)] hover:text-white"
                            >
                              {conn}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 border-t border-border pt-3">
                      <Gauge className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          Confidence
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-border">
                            <motion.div
                              className="h-full bg-[hsl(160_70%_42%)]"
                              initial={{ width: 0 }}
                              animate={{ width: `${selectedEvidence.confidence}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                            />
                          </div>
                          <span className="font-mono text-xs text-[hsl(160_70%_42%)]">
                            {selectedEvidence.confidence.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex h-full items-center justify-center p-8">
                  <div className="text-center">
                    <X className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Select a node to view evidence
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
