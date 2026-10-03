import { GameConfig } from '../config/gameConfig';
import { PlayerShip } from '../entities/PlayerShip';
import { EnemyShip } from '../entities/EnemyShip';
import { Projectile } from '../entities/Projectile';
import { Rectangle, checkCircleCollision } from '../utils/math';
import { soundManager } from '../utils/SoundManager';

export class GameSimulation {
  public config: GameConfig;
  public player: PlayerShip;
  public enemies: EnemyShip[] = [];
  public projectiles: Projectile[] = [];
  public islands: Rectangle[] = [];
  public arenaBounds: Rectangle;

  public score: number = 0;
  public timeRemaining: number;
  public state: 'playing' | 'time_up' | 'died' = 'playing';
  public isPaused: boolean = false;
  private enemySpawnTimer: number = 0;

  public get timeLeft(): number {
    return this.timeRemaining;
  }

  public get isGameOver(): boolean {
    return this.state !== 'playing' || this.player.health <= 0;
  }

  constructor(config: GameConfig, arenaWidth = 1280, arenaHeight = 720) {
    this.config = config;
    this.timeRemaining = config.sessionTime;
    this.arenaBounds = { x: 0, y: 0, width: arenaWidth, height: arenaHeight };

    this.islands = [];
    this.player = new PlayerShip({ x: arenaWidth / 2, y: arenaHeight / 2 });

    this.spawnEnemy();
    this.spawnEnemy();
  }

  public update(deltaTime: number): void {
    // SE ESTIVER PAUSADO, PARALISA TOTALMENTE A SIMULAÇÃO (DANOS, TIROS, MOVIMENTO)
    if (this.state !== 'playing' || this.isPaused) return;

    this.timeRemaining -= deltaTime;
    if (this.timeRemaining <= 0) {
      this.timeRemaining = 0;
      this.state = 'time_up';
      soundManager.play('game_over');
      return;
    }

    if (this.player.health <= 0) {
      this.state = 'died';
      soundManager.play('ship_sinking');
      soundManager.play('game_over');
      return;
    }

    this.player.update(deltaTime, this.arenaBounds, []);

    this.enemySpawnTimer += deltaTime;
    if (this.enemySpawnTimer >= this.config.enemySpawnInterval) {
      this.enemySpawnTimer = 0;
      this.spawnEnemy();
    }

    for (const enemy of this.enemies) {
      enemy.update(deltaTime, this.player.position, this.arenaBounds, []);
      if (enemy.shouldShoot()) {
        const proj = enemy.shoot();
        if (proj) {
          this.projectiles.push(proj);
          soundManager.play('cannon_fire_2', 0.5);
        }
      }
    }

    for (const proj of this.projectiles) {
      proj.update(deltaTime, this.arenaBounds, []);
    }

    // PROCESSAMENTO DE COLISÕES E DANOS (TOTALMENTE CONGELADO SE PAUSADO)
    for (const proj of this.projectiles) {
      if (proj.isExpired) continue;

      if (proj.isPlayer) {
        for (const enemy of this.enemies) {
          if (enemy.isDead) continue;
          if (
            checkCircleCollision(
              { x: proj.position.x, y: proj.position.y, radius: proj.radius },
              { x: enemy.position.x, y: enemy.position.y, radius: enemy.radius }
            )
          ) {
            enemy.takeDamage(proj.damage);
            proj.isExpired = true;
            soundManager.play('wood_hit_1', 0.6);

            if (enemy.isDead) {
              this.score += 10;
              soundManager.play('explosion_1', 0.8);
              soundManager.play('score_point', 0.7);
            }
            break;
          }
        }
      } else {
        if (
          checkCircleCollision(
            { x: proj.position.x, y: proj.position.y, radius: proj.radius },
            { x: this.player.position.x, y: this.player.position.y, radius: this.player.radius }
          )
        ) {
          this.player.takeDamage(proj.damage);
          proj.isExpired = true;
          soundManager.play('wood_hit_2', 0.8);
        }
      }
    }

    this.projectiles = this.projectiles.filter((p) => !p.isExpired);
    this.enemies = this.enemies.filter((e) => !e.isDead);
  }

  public firePlayerWeapon(type: 'front' | 'left' | 'right'): void {
    if (this.state !== 'playing' || this.isPaused) return; // Impede atirar durante a pausa
    const newProjectiles = this.player.fire(type);
    if (newProjectiles.length > 0) {
      this.projectiles.push(...newProjectiles);
      soundManager.play(type === 'front' ? 'cannon_fire_1' : 'cannon_broadside', 0.8);
    }
  }

  public spawnEnemy(): void {
    if (this.enemies.length >= 6 || this.isPaused) return;
    const type = Math.random() > 0.4 ? 'chaser' : 'shooter';
    const x = Math.random() > 0.5 ? 60 : this.arenaBounds.width - 60;
    const y = Math.random() * (this.arenaBounds.height - 120) + 60;
    this.enemies.push(new EnemyShip(type, { x, y }));
  }
}