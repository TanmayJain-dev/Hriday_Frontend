# HRIDAY Frontend — Build Context

## Project
HRIDAY is a Sovereign Industrial AI Workbench for SIH26117. The broader product is a local-first multimodal agent/workbench for confidential industrial knowledge work. Deterministic Brownfield P&ID and maintenance intelligence is a flagship specialist capability, not the entire product.

## Current state
The frontend has two layers: a cinematic product story and a full-screen contextual workbench entered through `Test HRIDAY`.

## Workbench principle
The agent decides what work needs to happen. Specialized tools perform the work. Structured engineering data establishes technical truth. Evidence explains the result. Humans make the final decision.

## Current implementation
- `src/components/workbench/WorkbenchV3.tsx` is the mounted workbench.
- Workspaces: Engineering, P&ID, Topology, Documents, Data, Evidence, Artifact.
- Overview tiles now navigate to real workspace views instead of merely changing selection state.
- P&ID: selectable synthetic assets, explicit demo boundary, zoom/reset controls and selected-asset inspector.
- Topology: selectable nodes, accepted/uncertain edge visualization, read-only GraphStore framing and selected-node inspector.
- Evidence: filterable findings ledger; clicking a finding can move to the P&ID evidence surface.
- Data: derived counts plus the same typed findings ledger; review flags are calculated rather than hard-coded.
- Artifact: draft isolation-summary surface with human-review warning; backend export is intentionally not simulated.
- Documents: local-first demo corpus with explicit demo framing.
- Cmd/Ctrl+K command palette supports workspace navigation and task execution.
- Agent state is explicit: ready, running, complete, or blocked; blocked tasks do not silently substitute synthetic output.
- Agent loop exposes operational stages only, never hidden chain-of-thought.
- Mobile workspace navigation is provided as a bottom switcher.
- Adapter mode is read from `VITE_HRIDAY_ADAPTER_MODE`; the workbench no longer forces demo mode in code.
- `src/adapters/types.ts`: typed adapter contract.
- `src/adapters/demo/demoAdapter.ts`: deterministic, explicit demo adapter.
- `src/adapters/backend/backendAdapter.ts`: production boundary with no invented API routes.
- `src/adapters/index.ts`: explicit adapter selector; no silent production→demo fallback.
- `App.tsx`: mounts `WorkbenchV3`.
- `NavigationBar.tsx`: Test HRIDAY entry.
- `.github/workflows/frontend.yml`: npm CI typecheck/build workflow.

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
4. P&ID interaction — COMPLETE (demo surface)
5. Topology interaction — COMPLETE (demo surface)
6. Evidence explorer — COMPLETE
7. Document/artifact/data workspaces — COMPLETE (demo surfaces)
8. Command palette — COMPLETE
9. Explicit demo/backend adapter boundary — COMPLETE
10. Story → Workbench integration — COMPLETE
11. Responsive/mobile behavior — COMPLETE (baseline)
12. Accessibility/polish/performance — IN PROGRESS
13. Backend wiring — BLOCKED until the real backend API contract is confirmed; do not invent routes.

## Important limitation
The workbench is still a frontend product/demo layer and is not yet connected to the HRIDAY backend. Do not present its synthetic P&ID, topology, evidence, or artifact as live OCR, live topology reconstruction, live local-model inference, or authoritative engineering output.

## Verification status
GitHub Actions is configured for pushes and pull requests to `main`. The latest workbench commit did not yet expose a workflow run through the connected GitHub view, so CI has not been claimed as passing. Agy remains the planned independent verification pass after the frontend is coherent and stable.

## Save protocol
After each stable milestone: typecheck/build where possible, commit, and push to `origin/main`. If local runtime is unavailable, rely on GitHub Actions/Agy for verification and record that limitation here.

## Next implementation step
Finish the remaining accessibility/performance polish and then hand the coherent frontend to Agy for independent testing/review. Backend integration begins only from a verified backend contract.
