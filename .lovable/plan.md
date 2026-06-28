# SPM ECO System – 3D Smart Parking Simulation

A single-page TanStack Start app with a Three.js scene, story-mode walkthrough, live operator dashboard, and presentation auto-play mode designed for screen recording.

## Pages & Routes
- `/` Home — hero, features, technology, contact sections + entry to simulation
- `/simulation` Full-screen 3D simulation with dashboard and controls
- `/features`, `/technology`, `/contact` — separate routes with own SEO metadata

## 3D Scene (Three.js / R3F / drei)
Smart-city parking facility in Sri Lanka style:
- Asphalt road, lane markings, curbs, palm trees, light poles with glow
- Entry gate + Exit gate, animated barrier arms
- Two ANPR camera poles with scanning cone + glow shader
- 24 parking slots (color-coded: green/blue/red), numbered
- Cars (instanced low-poly sedans/SUVs/vans, distinct colors per class)
- Retail supermarket building beside lot
- Floating holographic mobile phone showing "SPM ECO" app UI (HTML via drei `Html`)
- Floating cloud-server icon + dashed glowing connection lines (TubeGeometry with emissive scroll)
- QR payment panel that appears at exit

## Story Mode (11 steps)
State machine driving camera + actors + overlay captions:
1. Problem intro (cars queued)
2. Mobile booking UI animates → QR confirm
3. Car arrives → ANPR scan beam → "Plate Detected / Booking Verified" → gate opens
4. Vehicle classification labels float above different cars; unauthorized triggers red alert + gate stays closed
5. Slot assignment with glowing arrow path; slot turns blue→red on park
6. Dashboard counters tween in real time
7. Dynamic pricing panel calculation
8. QR payment success animation
9. Retail overstay: orange warning above car, dashboard alert
10. Exit: ANPR scan → payment confirm → gate opens → car leaves
11. Top-down overview with all glowing connections + final title

## Controls
Sidebar buttons: Start, Pause, Reset, Add Vehicle, Trigger Unauthorized, Trigger Overstay, Switch Camera, Story Mode, **Presentation Mode** (auto-plays full story with smooth cinematic camera tween + caption overlays).

Camera presets (CameraControls from drei with tweened transitions):
Top, Entrance, Slot, Dashboard, Exit, Cinematic.

## Operator Dashboard (right panel)
Live tiles: Total / Available / Occupied / Reserved slots, Vehicles Inside, Daily Count, Revenue, Security Alerts, mini live map (2D canvas mirror of slots). Counter tweening via framer-motion.

## Design System
Defined in `src/styles.css` via `@theme`:
- `--color-bg` white, `--color-navy` deep navy, `--color-sky` light blue, `--color-cyan-glow`, `--color-available` green, `--color-occupied` red, `--color-reserved` blue, `--color-warn` orange
- Display font: Space Grotesk; Body: Inter (loaded via `<link>` in `__root.tsx`)
- Glassmorphism panels, subtle gradients, neon cyan edge glow accents — premium, not cartoonish

## Tech / Files
- `bun add three @react-three/fiber @react-three/drei framer-motion zustand`
- Zustand store `src/lib/simulation-store.ts` — slots, vehicles, step, camera, dashboard metrics, story timeline
- `src/components/scene/` — `ParkingScene.tsx`, `Ground.tsx`, `Gate.tsx`, `ANPRCamera.tsx`, `ParkingSlot.tsx`, `Vehicle.tsx`, `RetailBuilding.tsx`, `ConnectionLines.tsx`, `MobileAppHologram.tsx`, `CloudIcon.tsx`, `CameraRig.tsx`
- `src/components/sim/` — `ControlPanel.tsx`, `Dashboard.tsx`, `StoryOverlay.tsx`, `PricingPanel.tsx`, `QRPaymentPanel.tsx`, `LoadingScreen.tsx`
- `src/components/site/` — `Header.tsx`, `Hero.tsx`, `FeaturesGrid.tsx`, `TechStack.tsx`, `Footer.tsx`
- Routes: `src/routes/__root.tsx`, `index.tsx`, `simulation.tsx`, `features.tsx`, `technology.tsx`, `contact.tsx`
- Suspense fallback loading screen for the Canvas
- Responsive: full experience on ≥1024px; mobile shows hero + a static preview image + message recommending desktop for full sim

## Out of Scope (for this build)
- No backend / DB / auth (pure frontend simulation; no Lovable Cloud needed)
- No real ANPR / payment integration — visuals only

## Quick Clarifications
1. OK to keep this **frontend-only** (no Lovable Cloud)? — recommended for a demo.
2. Use **low-poly stylized-but-realistic** cars/buildings (procedurally built with primitives + PBR materials), or should I attempt to load external GLB models? Low-poly procedural is faster, reliable, and still looks premium.
3. Should Presentation Mode include **voice-over narration** (browser TTS) or **text captions only**?
