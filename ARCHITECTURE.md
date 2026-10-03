```markdown
# 🏛️ Documentação de Arquitetura - Pirate Battle 2D

## 1. Integração React + PixiJS v8
- **Camada de Renderização (PixiJS)**: O `GameEngine` inicializa a `PIXI.Application` e gerencia a arvore de cena (`stage`), sprites, texturas dinâmicas (`PIXI.Assets`) e gráficos de HUD nativos GPU (`PIXI.Graphics`).
- **Camada de UI / Overlay (React)**: O `GameCanvas.tsx` atua como bridge declarativa, renderizando o canvas e provendo overlays responsivas de controle e menus sem interferir no ticker a 60 FPS.

## 2. Ciclo da Simulação e Colisões
- **GameSimulation**: Isola a física matemática. Atualiza vetores de posição baseados em velocidade angular e tempo delta (`deltaTime`).
- **Algoritmo de Colisão**: Colisão por circulo delimitador (*Bounding Circles*) entre projéteis e navios via fórmula da distância euclidiana.

## 3. Gerenciamento de Áudio e Recursos
- **SoundManager**: Singleton baseado na Web Audio API com clones dinâmicos de nós `HTMLAudioElement`, permitindo efeitos sonoros simultâneos sem interrupções e gerenciando restrições de *Autoplay* dos navegadores.

## 4. Persistência e Integração de APIs
- **TanStack Query / Axios**: Gerencia requisições de ranking e histórico com estratégias de cache `staleTime: 5000` e mutações assíncronas atreladas ao MSW.

## 5. Limitações e Decisões de Balanceamento
- **Fundo Adaptativo (Cover Ratio)**: O cenário calcula dinamicamente o aspect ratio para preencher a tela mantendo as proporções sem distorcer o artefato gráfico original.
- **Congelamento na Pausa**: A flag `isPaused` paralisa 100% dos cálculos de velocidade, recarga de armas, colições e contagem de tempo.