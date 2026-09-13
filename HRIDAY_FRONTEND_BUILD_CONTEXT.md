# HRIDAY Frontend — Build Context

## Project
HRIDAY is a Sovereign Industrial AI Workbench for SIH26117. The broader product is a local-first multimodal agent/workbench for confidential industrial knowledge work. Deterministic Brownfield P&ID and maintenance intelligence is a flagship specialist capability, not the entire product.

## Current state
The frontend has two layers: a cinematic product story and a full-screen contextual workbench entered through `Test HRIDAY`.

## Workbench principle
The agent decides what work needs to happen. Specialized tools perform the work. Structured engineering data establishes technical truth. Evidence explains the result. Humans make the final decision.

## Current implementation
- `src/components/workbench/WorkbenchV4.tsx` is now the mounted workbench.
- The V4 workbench deliberately fuses the strongest parts of the separate product shell with concepts from the current engineering-grade HRIDAY frontend.
- Workspaces: Engineering, P&ID, Topology, Documents, Data, Evidence, Artifact, plus dedicated Verification and Isolation views.
- Workflow bar makes the engineering journey visible: Mission → Reason → P&ID → Graph → Evidence → Verify → Isolation → Deliver.
- P&ID viewer now has a CAD-inspired interaction model: pan, zoom, fit/reset, grid toggle, uncertainty toggle, coordinate/zoom readout, selectable assets, inspector, and focused/enlarged viewer mode. Synthetic data remains explicitly labelled.
- Topology viewer now exposes PFD/spatial layout switching, deterministic path highlighting, accepted vs uncertainty-retained relationships, selected-node inspection and a minimap. It is intentionally implemented without adding a new graph dependency; real backend topology remains authoritative later.
- Verification Desk provides an explicit human review gate for flagged findings.
- Isolation Workspace surfaces candidate controls as decision support only and keeps unresolved suction isolation visible; it does not simulate authorization or actuation.
- Evidence: filterable findings ledger; clicking a finding can move to the P&ID evidence surface.
- Artifact: draft isolation-summary surface with human-review warning; backend export is intentionally not simulated.
- Documents/Data/Engineering remain broader specialist surfaces so HRIDAY is not reduced to a P&ID application.
- Cmd/Ctrl+K command palette supports workspace navigation and task execution.
- Agent state is explicit: ready, running, complete, or blocked; blocked tasks do not silently substitute synthetic output.
- Agent loop exposes operational stages only, never hidden chain-of-thought.
- Mobile workspace navigation is provided by the horizontal workflow bar and responsive shell.
- Adapter mode is read from `VITE_HRIDAY_ADAPTER_MODE`; the workbench no longer forces demo mode in code.
- `src/adapters/types.ts`: typed adapter contract.
- `src/adapters/demo/demoAdapter.ts`: deterministic, explicit demo adapter.
- `src/adapters/backend/backendAdapter.ts`: production boundary with no invented API routes.
- `src/adapters/index.ts`: explicit adapter selector; no silent production→demo fallback.
- `App.tsx`: mounts `WorkbenchV4`.
- `NavigationBar.tsx`: Test HRIDAY entry.
- `.github/workflows/frontend.yml`: npm CI typecheck/build workflow.

## Engineering reference comparison
The current `TanmayJain-dev/Hriday` frontend remains the reference for engineering interaction quality: its P&ID surface provides CAD-style pan/zoom/minimap/layers/uncertainty/coordinates, while its topology surface uses governed graph semantics, deterministic PFD/spatial layout, custom nodes/edges, path highlighting, provenance and an inspector. The separate `Hriday_Frontend` now adopts those interaction concepts at the UX layer while preserving its stronger cinematic product story, contextual workspaces and expandable/focused workbench.

The hybrid intentionally does NOT copy the actual project's backend/state contract. It recreates only interaction patterns that can be honestly demonstrated with isolated synthetic data.

## Engineering truth boundary
LLM is an untrusted planner/reasoner. It must not be presented as the source of piping connectivity or engineering truth. P&ID perception feeds governed topology reconstruction; specialized tools query structured engineering data; evidence records explain claims.

## Safety
HRIDAY is read-only decision support. No valve actuation, DCS/SCADA writes, or industrial control operations. Human engineers retain final authorization. Do not claim production certification, zero hallucinations, 100% accuracy, guaranteed air-gapping, or autonomous LOTO.

## Sovereignty UX
Cloud-hosted preview visibly states that it is a demo/cloud instance and is not physically air-gapped. Application-level controls do not equal host/network air-gapping. Backend/local mode is labelled as requiring sovereignty telemetry rather than claiming physical air-gapping from the frontend alone.

## Demo data boundary
Synthetic workbench content is visual/demo data only. Demo content must remain explicitly labelled and isolated from production adapter paths. The frontend must never silently turn a backend failure into a demo success.

## Backend concepts available for later integration
- document ingestion
- local model planner
- bounded agent execution loop
- DocumentSearchTool
- EngineeringTool: equipment_lookup, topology_query, isolation_analysis
- evidence records
- artifact generation
- sovereignty state

Frontend should use adapter interfaces rather than inventing production APIs.

## Visual direction
Dark industrial engineering workstation + aerospace mission control + Apple-level cleanliness. Strong typography, restrained cyan/teal accents, useful density, subtle motion. Avoid generic SaaS dashboards and fake KPI cards.

## Implementation priority
1. Workbench shell — COMPLETE
2. Conversation + operational activity — COMPLETE
3. Contextual workspace system — COMPLETE
4. P&ID interaction — COMPLETE (hybrid demo surface)
5. Topology interaction — COMPLETE (hybrid demo surface)
6. Evidence explorer — COMPLETE
7. Verification/isolation workflow surfaces — COMPLETE (demo decision-support surfaces)
8. Document/artifact/data workspaces — COMPLETE (demo surfaces)
9. Command palette — COMPLETE
10. Explicit demo/backend adapter boundary — COMPLETE
11. Story → Workbench integration — COMPLETE
12. Responsive/mobile behavior — COMPLETE (baseline)
13. Accessibility/polish/performance — IN PROGRESS
14. Backend wiring — BLOCKED until the real backend API contract is confirmed; do not invent routes.

## Important limitation
The workbench is still a frontend product/demo layer and is not yet connected to the HRIDAY backend. Do not present its synthetic P&ID, topology, evidence, or artifact as live OCR, live topology reconstruction, live local-model inference, or authoritative engineering output.

## Verification status
GitHub Actions is configured for pushes and pull requests to `main`. The latest workbench commit has not yet been independently verified by Agy, and the connected GitHub view has not exposed a passing workflow run. Do not claim CI as passing until a run is observed.

## Save protocol
After each stable milestone: typecheck/build where possible, commit, and push to `origin/main`. If local runtime is unavailable, rely on GitHub Actions/Agy for verification and record that limitation here.

## Next implementation step
Review the hybrid workbench in a real browser, then use Agy for independent typecheck/build/interaction verification. Backend integration begins only from a verified backend contract.
