import * as PIXI from 'pixi.js';
import { GameSimulation } from './GameSimulation';
import { GameConfig } from '../config/gameConfig';
import { AssetLoader } from './AssetLoader';

export class GameEngine {
  public app: PIXI.Application;
  public simulation: GameSimulation;
  public isPaused: boolean = false;
  private isInitialized = false;

  private bgSprite?: PIXI.Sprite;
  private playerContainer?: PIXI.Container;
  private playerShipSprite?: PIXI.Sprite;
  private playerHealthFillGraphics?: PIXI.Graphics;
  private playerHealthText?: PIXI.Text;

  private enemyContainers: Map<string, PIXI.Container> = new Map();
  private projectileSprites: Map<string, PIXI.Container> = new Map();
  private keysPressed: Record<string, boolean> = {};

  constructor(config: GameConfig, width = 1280, height = 720) {
    this.app = new PIXI.Application();
    this.simulation = new GameSimulation(config, width, height);
  }

  public async initialize(container: HTMLDivElement): Promise<void> {
    if (this.isInitialized) return;

    await AssetLoader.loadAssets();

    await this.app.init({
      width: this.simulation.arenaBounds.width,
      height: this.simulation.arenaBounds.height,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    if (container) {
      container.appendChild(this.app.canvas);
    }

    this.isInitialized = true;

    this.renderBackground();
    this.createPlayerSprite();
    this.createPlayerHUDInPixi();

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);

    this.app.ticker.add(this.gameLoop, this);
  }

  public setPaused(paused: boolean): void {
    this.isPaused = paused;
    this.simulation.isPaused = paused;
    if (paused) {
      this.keysPressed = {};
    }
  }

  public setKeyStatus(code: string, isPressed: boolean): void {
    if (this.isPaused) return;
    this.keysPressed[code] = isPressed;
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (this.isPaused) return;

    this.keysPressed[e.code] = true;

    if (e.code === 'Space') {
      this.simulation.firePlayerWeapon('front');
    } else if (e.code === 'KeyQ') {
      this.simulation.firePlayerWeapon('left');
    } else if (e.code === 'KeyE') {
      this.simulation.firePlayerWeapon('right');
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keysPressed[e.code] = false;
  };

  private getTexture(alias: string): PIXI.Texture {
    try {
      if (PIXI.Assets.cache.has(alias)) {
        return PIXI.Assets.get(alias);
      }
    } catch {}
    return PIXI.Texture.from(alias);
  }

  // RENDERIZAÇÃO DO FUNDO COM MANTIMENTO ESTRITO DE ASPECT RATIO (SEM DISTORÇÃO)
  private renderBackground(): void {
    const bgTexture = this.getTexture('background');
    const bgSprite = new PIXI.Sprite(bgTexture);

    bgSprite.anchor.set(0.5);
    this.bgSprite = bgSprite;

    this.resizeBackground();
    this.app.stage.addChildAt(bgSprite, 0);
  }

  public resizeBackground(): void {
    if (!this.bgSprite || !this.bgSprite.texture) return;

    const screenWidth = this.app.renderer.width;
    const screenHeight = this.app.renderer.height;
    const texWidth = this.bgSprite.texture.width || 1280;
    const texHeight = this.bgSprite.texture.height || 720;

    // Aplica o algoritmo de cálculo "COVER" proporcional
    const scale = Math.max(screenWidth / texWidth, screenHeight / texHeight);

    this.bgSprite.scale.set(scale);
    this.bgSprite.x = screenWidth / 2;
    this.bgSprite.y = screenHeight / 2;
  }

  private createPlayerSprite(): void {
    const container = new PIXI.Container();
    const texture = this.getTexture('playerShip');
    const sprite = new PIXI.Sprite(texture);
    
    sprite.anchor.set(0.5);
    sprite.width = 70;
    sprite.height = 90;
    container.addChild(sprite);

    this.playerShipSprite = sprite;
    this.playerContainer = container;
    this.app.stage.addChild(container);
  }

  private createPlayerHUDInPixi(): void {
    const hudContainer = new PIXI.Container();
    hudContainer.x = 10;
    hudContainer.y = 10;

    const bg = new PIXI.Graphics();
    bg.roundRect(12, 5, 140, 22, 6);
    bg.fill({ color: 0x0f172a });
    hudContainer.addChild(bg);

    const healthFill = new PIXI.Graphics();
    hudContainer.addChild(healthFill);
    this.playerHealthFillGraphics = healthFill;

    const frameTexture = this.getTexture('healthFrame') || PIXI.Texture.from('/assets/png/default/ui/hud/health_frame.png');
    const frameSprite = new PIXI.Sprite(frameTexture);
    frameSprite.width = 170;
    frameSprite.height = 34;
    hudContainer.addChild(frameSprite);

    const healthText = new PIXI.Text({
      text: '100 / 100',
      style: {
        fontFamily: 'Arial',
        fontSize: 11,
        fontWeight: '900',
        fill: 0xffffff,
        stroke: { color: 0x000000, width: 2 },
      },
    });
    healthText.x = 85 - healthText.width / 2;
    healthText.y = 10;
    hudContainer.addChild(healthText);
    this.playerHealthText = healthText;

    this.app.stage.addChild(hudContainer);
  }

  private createEnemyContainer(spriteKey: string): PIXI.Container {
    const container = new PIXI.Container();

    const shipTexture = this.getTexture(spriteKey);
    const shipSprite = new PIXI.Sprite(shipTexture);
    shipSprite.anchor.set(0.5);
    shipSprite.width = 68;
    shipSprite.height = 88;
    shipSprite.label = 'shipSprite';
    container.addChild(shipSprite);

    const healthBarContainer = new PIXI.Container();
    healthBarContainer.label = 'healthBar';
    healthBarContainer.y = -52;

    const bg = new PIXI.Graphics();
    bg.roundRect(-22, -4, 44, 8, 3);
    bg.fill({ color: 0x0f172a });
    healthBarContainer.addChild(bg);

    const fillGraphics = new PIXI.Graphics();
    fillGraphics.label = 'healthFill';
    healthBarContainer.addChild(fillGraphics);

    const frameTexture = this.getTexture('enemyHealthFrame') || PIXI.Texture.from('/assets/png/default/ui/hud/enemy_health_frame.png');
    const frameSprite = new PIXI.Sprite(frameTexture);
    frameSprite.anchor.set(0.5);
    frameSprite.width = 48;
    frameSprite.height = 10;
    healthBarContainer.addChild(frameSprite);

    container.addChild(healthBarContainer);
    return container;
  }

  private createCannonBallContainer(): PIXI.Container {
    const texture = this.getTexture('cannonBall');
    if (texture && texture !== PIXI.Texture.WHITE) {
      const sprite = new PIXI.Sprite(texture);
      sprite.anchor.set(0.5);
      sprite.width = 16;
      sprite.height = 16;
      return sprite;
    }

    const graphics = new PIXI.Graphics();
    graphics.circle(0, 0, 7);
    graphics.fill({ color: 0x1c1917 });
    graphics.stroke({ width: 1, color: 0x000000 });
    return graphics;
  }

  private gameLoop(ticker: PIXI.Ticker): void {
    if (this.isPaused) return;

    const deltaSeconds = ticker.deltaTime / 60;

    if (this.keysPressed['KeyW'] || this.keysPressed['ArrowUp']) {
      this.simulation.player.move('forward', deltaSeconds);
    }
    if (this.keysPressed['KeyS'] || this.keysPressed['ArrowDown']) {
      this.simulation.player.move('backward', deltaSeconds);
    }
    if (this.keysPressed['KeyA'] || this.keysPressed['ArrowLeft']) {
      this.simulation.player.rotate('left', deltaSeconds);
    }
    if (this.keysPressed['KeyD'] || this.keysPressed['ArrowRight']) {
      this.simulation.player.rotate('right', deltaSeconds);
    }

    this.simulation.update(deltaSeconds);
    this.syncViews();
  }

  private syncViews(): void {
    if (this.isPaused) return;

    if (this.playerContainer && this.playerShipSprite) {
      this.playerContainer.x = this.simulation.player.position.x;
      this.playerContainer.y = this.simulation.player.position.y;
      this.playerShipSprite.rotation = this.simulation.player.rotation + Math.PI;
    }

    if (this.playerHealthFillGraphics && this.playerHealthText) {
      const currentHp = Math.max(0, this.simulation.player.health);
      const ratio = Math.max(0, Math.min(1, currentHp / 100));
      const widthPx = Math.floor(140 * ratio);

      this.playerHealthFillGraphics.clear();
      if (widthPx > 0) {
        this.playerHealthFillGraphics.roundRect(12, 5, widthPx, 22, 5);
        this.playerHealthFillGraphics.fill({ color: 0x22c55e });
      }

      this.playerHealthText.text = `${Math.ceil(currentHp)} / 100`;
      this.playerHealthText.x = 85 - this.playerHealthText.width / 2;
    }

    for (const enemy of this.simulation.enemies) {
      let container = this.enemyContainers.get(enemy.id);
      if (!container) {
        const textureKey = enemy.spriteKey || 'enemyShip_1';
        container = this.createEnemyContainer(textureKey);
        this.app.stage.addChild(container);
        this.enemyContainers.set(enemy.id, container);
      }

      container.x = enemy.position.x;
      container.y = enemy.position.y;

      const shipSprite = container.getChildByLabel('shipSprite') as PIXI.Sprite;
      if (shipSprite) {
        shipSprite.rotation = enemy.rotation + Math.PI;
      }

      const healthBar = container.getChildByLabel('healthBar') as PIXI.Container;
      if (healthBar) {
        const healthFill = healthBar.getChildByLabel('healthFill') as PIXI.Graphics;
        if (healthFill) {
          const hpRatio = Math.max(0, Math.min(1, enemy.health / 50));
          const fillWidth = Math.floor(40 * hpRatio);

          healthFill.clear();
          if (fillWidth > 0) {
            healthFill.roundRect(-20, -3, fillWidth, 6, 2);
            healthFill.fill({ color: 0xef4444 });
          }
        }
      }
    }

    for (const [id, container] of this.enemyContainers.entries()) {
      if (!this.simulation.enemies.some((e) => e.id === id)) {
        this.triggerExplosion(container.x, container.y);
        this.app.stage.removeChild(container);
        container.destroy();
        this.enemyContainers.delete(id);
      }
    }

    for (const proj of this.simulation.projectiles) {
      let container = this.projectileSprites.get(proj.id);
      if (!container) {
        container = this.createCannonBallContainer();
        this.app.stage.addChild(container);
        this.projectileSprites.set(proj.id, container);
      }
      container.x = proj.position.x;
      container.y = proj.position.y;
    }

    for (const [id, container] of this.projectileSprites.entries()) {
      if (!this.simulation.projectiles.some((p) => p.id === id)) {
        this.app.stage.removeChild(container);
        container.destroy();
        this.projectileSprites.delete(id);
      }
    }
  }

  public triggerExplosion(x: number, y: number): void {
    const expTexture = this.getTexture('explosion');
    const expSprite = new PIXI.Sprite(expTexture);
    expSprite.anchor.set(0.5);
    expSprite.x = x;
    expSprite.y = y;
    expSprite.width = 75;
    expSprite.height = 75;

    this.app.stage.addChild(expSprite);

    let alpha = 1.0;
    const fadeTicker = (ticker: PIXI.Ticker) => {
      if (this.isPaused) return;
      alpha -= ticker.deltaTime * 0.05;
      expSprite.alpha = alpha;
      expSprite.scale.x += 0.02;
      expSprite.scale.y += 0.02;

      if (alpha <= 0) {
        this.app.ticker.remove(fadeTicker);
        this.app.stage.removeChild(expSprite);
        expSprite.destroy();
      }
    };

    this.app.ticker.add(fadeTicker);
  }

  public destroy(): void {
    if (!this.isInitialized) return;

    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);

    this.app.ticker.remove(this.gameLoop, this);
    if (this.app.canvas && this.app.canvas.parentNode) {
      this.app.canvas.parentNode.removeChild(this.app.canvas);
    }
    this.app.destroy(true, { children: true, context: true });
    this.isInitialized = false;
  }
}