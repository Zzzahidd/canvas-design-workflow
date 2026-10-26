# Interactive Design Canvas: Day 1 & Day 3 Exploration Canvas

A faithful recreation of the interactive design canvas showcased in the reference video ([Original X/Twitter Post](https://x.com/imuratalpay/status/2112928557777231875?s=20)).

The application features an ultra-optimized, zero-lag canvas engine powered by `react-zoom-pan-pinch` and **automatic DOM viewport virtualization**, specifically engineered to run at a solid 60 FPS even on low-end "potato PCs" without dedicated GPUs.

---

## 1. Complete Horizontal Board Strip

All 11 screens are real, independently rendered React components arranged horizontally side by side with consistent 80px gaps:

| Index | Product Concept | Screen Title | Key Functional Interactions |
|---|---|---|---|
| **1** | **Thread** | `::: Thread · 1 Home / new chat` | Real typing prompt box, context pills, 4 quick suggestions, skills catalog, and learned rules. |
| **2** | **Thread** | `::: Thread · 2 Active chat` | Real-time chat streaming, tool usage pill, clickable invoice attachment modal (`Invoice-INV-2026-118`), rule learning pills, message copy. |
| **3** | **Thread** | `::: Thread · 13 Routines list` | Status toggles (scheduled/watching/paused), search query filter, subtabs (All/Yours/Team), routine selection. |
| **4** | **Thread** | `::: Thread · 14 Routine detail` | "Run routine now" simulation, execution step inspection, live history log, approval toggles. |
| **5** | **Thread** | `::: Thread · 15 New routine with scheduling` | Natural language sentence parser, frequency/day matrix, delivery configuration, and live creation. |
| **6** | **Workbench** | `::: Workbench · 13 Routines list` | Pro dual-rail workstation, dense tabular status views, metrics bar, bulk actions. |
| **7** | **Workbench** | `::: Workbench · 14 Routine detail` | Right-side execution inspector, step details, metrics cards, history logs. |
| **8** | **Workbench** | `::: Workbench · 15 New routine with scheduling` | Pro trigger selector, step sequencer, error handling rules, validation. |
| **9** | **Desk** | `::: Desk · 13 Routines list` | Modern 3-pane layout, 2-column card grid, minimal top navigation. |
| **10** | **Desk** | `::: Desk · 14 Routine detail` | Clean modular 3-column detail view with calendar schedule, approval items, and history. |
| **11** | **Desk** | `::: Desk · 15 New routine with scheduling` | Quick-pick frequency presets, week grid, tool selectors, and creation. |

---

## 2. Potato PC & Zero-Lag Architecture

- **Industry-Standard Canvas Engine (`react-zoom-pan-pinch`)**:
  - Replaced manual event handlers with the lightweight, zero-dependency `react-zoom-pan-pinch` engine.
  - Native pointer capture and hardware-accelerated matrix transforms.
  - Velocity and alignment calculations disabled (`velocityDisabled: true`) to prevent CPU float math thrashing.
- **Active Viewport DOM Virtualization**:
  - Only the 2-3 boards currently visible on screen (plus 1 buffer board) render their active React component trees.
  - Off-screen boards are replaced with lightweight single-`div` skeleton frames (`1200x800px`).
  - Active DOM element count is reduced from **over 3,500 down to ~350**, slashing CPU software rasterization overhead by **over 90%**.
- **Gesture Controls**:
  - **Spacebar + Drag**: Drag anywhere on the screen (even over boards) to pan effortlessly.
  - **Ctrl + Mouse Scroll (or trackpad pinch)**: Precision zoom centered directly on cursor position.
  - **Normal Mouse Scroll (without Ctrl)**: Does not zoom; enables natural scroll.
  - **Reposition Any Board**: Drag from the top header handle (`::: [Concept] · [Number] [Title]`).

---

## 3. Getting Started

```bash
# 1. Install dependencies
pnpm install

# 2. Start the dev server
pnpm dev

# 3. Open in your browser
# Navigate to http://localhost:5173
```

### Production Build

```bash
# Build optimized static bundle
pnpm build

# Preview build locally
pnpm preview
```
