import * as PIXI from 'pixi.js';

export class AssetLoader {
  private static isLoaded = false;

  public static async loadAssets(): Promise<void> {
    if (this.isLoaded) return;

    const assetsToLoad = [
      { alias: 'background', src: '/assets/ui_scene_background.png' },
      { alias: 'cannonBall', src: '/assets/png/default/ship_parts/cannon_ball.png' },
      { alias: 'explosion', src: '/assets/png/default/effects/explosion_1.png' },
      { alias: 'playerShip', src: '/assets/png/default/ships/ship_8.png' },
      
      // Navios Inimigos
      { alias: 'enemyShip_1', src: '/assets/png/default/ships/ship_1.png' },
      { alias: 'enemyShip_2', src: '/assets/png/default/ships/ship_2.png' },
      { alias: 'enemyShip_4', src: '/assets/png/default/ships/ship_4.png' },
      { alias: 'enemyShip_5', src: '/assets/png/default/ships/ship_5.png' },
      { alias: 'enemyShip_6', src: '/assets/png/default/ships/ship_6.png' },

      // Texturas do HUD
      { alias: 'healthFrame', src: '/assets/png/default/effects/ui/hud/health_frame.png' },
      { alias: 'enemyHealthFrame', src: '/assets/png/default/effects/ui/hud/enemy_health_frame.png' },
    ];

    for (const asset of assetsToLoad) {
      try {
        await PIXI.Assets.load({ alias: asset.alias, src: asset.src });
      } catch {
        // Fallback
      }
    }

    this.isLoaded = true;
  }
}