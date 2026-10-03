import { Vector2D, Rectangle } from '../utils/math';
import { Projectile } from './Projectile';

export class EnemyShip {
  public id: string;
  public type: 'chaser' | 'shooter';
  public position: Vector2D;
  public rotation: number = 0;
  public radius: number = 30;
  public speed: number = 110;
  public health: number = 50;
  public isDead: boolean = false;
  public spriteKey: string;
  private shootCooldown: number = 0;

  private static shipVariants = [
    'enemyShip_1',
    'enemyShip_2',
    'enemyShip_4',
    'enemyShip_5',
    'enemyShip_6',
  ];

  constructor(type: 'chaser' | 'shooter', initialPosition: Vector2D, id?: string) {
    this.id = id || `enemy_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.type = type;
    this.position = { ...initialPosition };

    const randomIndex = Math.floor(Math.random() * EnemyShip.shipVariants.length);
    this.spriteKey = EnemyShip.shipVariants[randomIndex];

    this.shootCooldown = Math.random() * 2 + 1;
  }

  public update(deltaTime: number, playerPos: Vector2D, bounds: Rectangle, _islands: Rectangle[] = []): void {
    if (this.isDead) return;

    if (this.shootCooldown > 0) {
      this.shootCooldown -= deltaTime;
    }

    const dx = playerPos.x - this.position.x;
    const dy = playerPos.y - this.position.y;
    // Aponta a proa em direção ao jogador
    this.rotation = Math.atan2(dx, -dy);

    this.position.x += Math.sin(this.rotation) * this.speed * deltaTime;
    this.position.y -= Math.cos(this.rotation) * this.speed * deltaTime;

    this.position.x = Math.max(this.radius, Math.min(bounds.width - this.radius, this.position.x));
    this.position.y = Math.max(this.radius, Math.min(bounds.height - this.radius, this.position.y));
  }

  public shouldShoot(): boolean {
    return this.type === 'shooter' && this.shootCooldown <= 0;
  }

  public shoot(): Projectile | null {
    if (!this.shouldShoot()) return null;
    this.shootCooldown = 2.5;

    return new Projectile(
      { x: this.position.x, y: this.position.y },
      this.rotation,
      280,
      15,
      6,
      3.0,
      false
    );
  }

  public takeDamage(amount: number): void {
    this.health -= amount;
    if (this.health <= 0) {
      this.isDead = true;
    }
  }
}