# 🏴‍☠️ Pirate Battle 2D — React & PixiJS Technical Challenge

A 2D top-down naval shooter game built with **React**, **TypeScript**, and **PixiJS v8**. Navigate your pirate ship through dangerous waters, dodge islands, destroy incoming enemy ships (Chasers & Shooters), and record your highest scores on a persistent local leaderboard and match history backed by MSW.

🔗 **Live Public Demo**: [[https://your-project-name.vercel.app](https://pirate-battle-2d.vercel.app/))

---

## 🛠️ Stack & Technologies

* **UI & Shell**: React 18 / 19, TypeScript (Strict Mode)
* **Rendering Engine**: PixiJS v8 (`PIXI.Application`, `PIXI.Assets`, `PIXI.Graphics`)
* **Remote State & Data Fetching**: TanStack Query (React Query)
* **HTTP Client**: Axios
* **API Mocking & Network Simulation**: MSW (Mock Service Worker v2)
* **Testing & Visual Regression**: Playwright (E2E testing for Desktop & Mobile Chromium)
* **Build Tooling**: Vite

---

## 🚀 Quick Start & Local Setup


# 🏴‍☠️ Pirate Battle 2D - Solução Técnica

Jogo 2D de batalha naval interativo desenvolvido em React, TypeScript e PixiJS v8.

## 🚀 Setup e Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Executar em ambiente de desenvolvimento
npm run dev

# 3. Executar verificação de tipos (TypeScript)
npm run type-check

# 4. Executar Linter
npm run lint

# 5. Gerar build de produção
npm run build

# 6. Preview do build local
npm run preview

⌨️ Controls & Gameplay GuideThe application supports both Keyboard and Touch Screen Controls. Controls are captured exclusively while the gameplay context is active.Keyboard & Touch Controls MappingActionKeyboard InputTouch / Mobile UIMove ForwardW / Up ArrowOn-screen Joystick / Up arrowRotate Left / RightA / D or Left / Right ArrowSteer Dial / Directional buttonsFront Cannon (1 Shot)Spacebar / JFront Fire ButtonLeft Broadside (3 Shots)Q / ULeft Cannons ButtonRight Broadside (3 Shots)E / IRight Cannons ButtonPause GameP / EscapePause Button OverlayEnemies & MechanicsChaser: Fast red vessel that directly pursues the player and explodes on collision, dealing heavy damage. Self-destruction against the player does not grant score points.Shooter: Tactical vessel that keeps distance and fires single cannonballs when in attack range.Islands: Collidable terrain obstacles that block both ships and cannonballs.Auto-Pause: Switching browser tabs or losing window focus automatically pauses simulation timers, physics, and weapon cooldowns without accumulating movement or shots.🎛️ Gameplay ConfigurationAll balance parameters are centralized in src/config/gameConfig.ts.The Options Screen exposes two user-adjustable parameters (persisted locally via localStorage):Game Session Time: Configurable between 60 and 180 seconds (Default: 120s).Enemy Spawn Interval: Positive interval bounded between 2s and 10s (Default: 4s).Note: Changes made in Options apply a snapshot upon starting a new match and do not alter an ongoing session.🌐 Network Scenario Selection & Failure SimulationThe application uses MSW (Mock Service Worker) to simulate network conditions for Ranking and Match History REST APIs.Available ScenariosThrough the Options / Network Settings panel, you can select:Success (Default): Standard operation returning populated fixtures.Empty State: Simulates 0 records for Ranking and Match History.Slow Network / Latency: Introduces high latency and variable delays.Network Failures (500 / Timeout): Returns HTTP 500 errors or request timeouts.Post-Match Submission Timeout: Drops network response after completing a match to test background queue recovery.Resetting Network StateClick "Reset Network Scenarios & Cache" in the Options screen to purge local pending queues, reset MSW network handlers, and restore initial fixtures.🧪 Instructions to Reproduce Pending Failures & RecoveryOpen the Options Screen and set the Network Scenario to "Network Failures / Timeout".Start and finish a match (or let the timer expire).On the Result Screen, observe the notification: "Match saved locally. Submission pending..."Return to the Options Screen and switch the scenario back to "Success" (or reload the page).The TanStack Query retry worker will automatically sync the pending match record in the background without duplicating entries in either Ranking or Match History.📜 Available NPM CommandsCommandDescriptionnpm run devRuns dev server with HMR and MSW active.npm run buildRuns TypeScript typecheck and compiles production assets to /dist.npm run previewServes the production /dist build locally.npm run lintRuns ESLint code quality checks.npm run typecheckExecutes strict TypeScript checking (tsc --noEmit).npm run testRuns unit and integration test suites using Vitest.npm run test:e2eExecutes Playwright E2E and visual regression tests.npm run test:e2e:uiLaunches Playwright Interactive UI Mode.🎭 Playwright E2E & Visual Regression TestingPlaywright tests run against isolated browser contexts with seeded RNG and controlled timers.Bash# Install Chromium binaries for Playwright (First time setup)
npx playwright install chromium

# Run full E2E test suite
npm run test:e2e

# View test execution report and traces
npx playwright show-report
📊 Performance & Profiling ReportsTarget FPS: 60 FPS on reference baseline hardware.Architecture & Profiling Details: Detailed analysis of frame time percentiles (95th percentile < 16.6ms), memory cleanup across 5 gameplay cycles, PixiJS tick management, and offline recovery contracts are documented in ARCHITECTURE.md.
