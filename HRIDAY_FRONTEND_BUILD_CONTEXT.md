# HRIDAY Frontend — Version 2 Build Context

## Project
HRIDAY is a Sovereign Industrial AI Workbench for SIH26117. The broader product is a local-first multimodal agent/workbench for confidential industrial knowledge work. Deterministic Brownfield P&ID and maintenance intelligence is a flagship specialist capability, not the entire product.

## Current state
This repository started as Version 1: a cinematic sequential product-story page containing Hero, Pipeline, Workspace, Topology, Isolation, and Audit sections. Existing P&ID/topology content is demo data and must never be mistaken for live backend truth.

## Version 2 target
Two-layer experience:
1. Product Story — cinematic, editorial, industrial, explains the problem and architecture.
2. Workbench — actual interactive product shell entered through "Test HRIDAY".

## Workbench principle
The agent decides what work needs to happen. Specialized tools perform the work. Structured engineering data establishes technical truth. Evidence explains the result. Humans make the final decision.

## Target workbench
- persistent top bar with HRIDAY identity, global command/search, sovereignty status
- left conversation panel: user task, assistant response, operational activity trace
- right workspace canvas with contextual workspace tiles
- workspace types: Engineering, P&ID, Topology, Document, Data, Evidence, Artifact
- tiles expand into primary interactive views
- manual exploration must work without chat
- Cmd/Ctrl+K opens global search/command palette; navigation queries search, task queries launch HRIDAY
- agent activity shows only operational steps, never chain-of-thought

## Engineering truth boundary
LLM is an untrusted planner/reasoner. It must not be presented as the source of piping connectivity or engineering truth. P&ID perception feeds governed topology reconstruction; specialized tools query structured engineering data; evidence records explain claims.

## Safety
HRIDAY is read-only decision support. No valve actuation, DCS/SCADA writes, or industrial control operations. Human engineers retain final authorization. Do not claim production certification, zero hallucinations, 100% accuracy, guaranteed air-gapping, or autonomous LOTO.

## Sovereignty UX
Local deployment can be represented as sovereign/local. Cloud-hosted preview must visibly state that it is a demo/cloud instance and is not physically air-gapped. Application-level controls do not equal host/network air-gapping.

## Demo data boundary
Existing `src/data/pid-data.ts` is legacy visual/demo data. Any demo adapter must be explicitly named and isolated. Never silently pass fixture topology as if it were a real upload or backend result.

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
Dark industrial engineering workstation + aerospace mission control + Apple-level cleanliness. Use restraint, dense information only where useful, strong typography, subtle grid/scan/flow motion, cyan/teal accents, progressive disclosure. Avoid generic SaaS dashboard aesthetics and fake KPI cards.

## Implementation priority
1. Workbench shell — COMPLETE
2. Conversation + operational activity — COMPLETE (demo state machine)
3. Contextual workspace system — COMPLETE (Engineering/P&ID/Topology/Document/Data/Evidence/Artifact)
4. P&ID interaction — COMPLETE (selection + viewport controls in demo surface)
5. Topology interaction — COMPLETE (interactive workspace surface)
6. Evidence explorer — COMPLETE
7. Document/artifact/data workspaces — COMPLETE (demo surfaces)
8. Command palette — COMPLETE (Cmd/Ctrl+K + natural-language demo routing)
9. Demo adapter and deterministic demo flows — IN PROGRESS; must isolate legacy demo data and add adapter contracts
10. Story → Workbench integration — COMPLETE (Test HRIDAY navigation + #workbench mode)
11. polish/accessibility/performance — NEXT

## Implemented in Version 2 so far
- `src/components/workbench/HRIDAYWorkbench.tsx`: full-screen product workbench with conversation, activity trace, contextual workspace dock, P&ID, topology, evidence, document, data, and artifact surfaces.
- Cmd/Ctrl+K command palette with navigation/task routing.
- deterministic P-101 demonstration flow with explicit uncertainty/review language.
- visible synthetic/demo P&ID label to prevent benchmark data being mistaken for live engineering evidence.
- `App.tsx`: workbench overlay and shareable `#workbench` mode.
- `NavigationBar.tsx`: direct Test HRIDAY entry.

## Important limitation
The current workbench is a frontend product/demo layer, not yet connected to the HRIDAY backend. Demo data is intentionally visible. Do not present the frontend simulation as live OCR, live topology reconstruction, live local-model inference, or authoritative engineering output.

## Save protocol
After each stable milestone: typecheck/build where possible, commit, and push to `origin/main`. Update this file with the latest completed milestone and next step. If interrupted, leave the repository in a buildable state and record continuation instructions here.

## Next implementation step
Refactor demo state into an explicit `src/adapters/demo/` boundary, then add typed backend adapter interfaces without inventing endpoints. After that, polish the workbench visual hierarchy, mobile behavior, accessibility, and motion.
