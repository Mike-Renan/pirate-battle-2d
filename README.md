# 🏴‍☠️ Pirate Battle 2D — React & PixiJS Technical Challenge

A 2D top-down naval shooter game built with **React**, **TypeScript**, and **PixiJS v8**. Navigate your pirate ship through dangerous waters, dodge islands, destroy incoming enemy ships (Chasers & Shooters), and record your highest scores on a persistent local leaderboard and match history backed by MSW.

🔗 **Live Public Demo**: [https://your-project-name.vercel.app](https://your-project-name.vercel.app)

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

Performance & Profiling Reports
Target FPS: 60 FPS on reference baseline hardware.

Profiling data, frame time percentiles (95th percentile < 16.6ms), and memory leak analysis after 5 consecutive gameplay cycles are documented in ARCHITECTURE.md and archived under ./docs/profiling-reports/.
