import { Vector2D, Rectangle } from '../utils/math';

export class Projectile {
  public id: string;
  public position: Vector2D;
  public angle: number;
  public speed: number;
  public damage: number;
  public radius: number;
  public lifetime: number;
  public isPlayer: boolean;
  public isExpired: boolean = false;

  constructor(
    position: Vector2D,
    angle: number,
    speed: number,
    damage: number,
    radius: number,
    lifetime: number,
    isPlayer: boolean,
    id?: string
  ) {
    this.id = id || `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.position = { ...position };
    this.angle = angle;
    this.speed = speed;
    this.damage = damage;
    this.radius = radius;
    this.lifetime = lifetime;
    this.isPlayer = isPlayer;
  }

  public update(deltaTime: number, bounds: Rectangle, _islands: Rectangle[] = []): void {
    if (this.isExpired) return;

    this.lifetime -= deltaTime;
    if (this.lifetime <= 0) {
      this.isExpired = true;
      return;
    }

    // Avança na direção correta do ângulo
    this.position.x += Math.sin(this.angle) * this.speed * deltaTime;
    this.position.y -= Math.cos(this.angle) * this.speed * deltaTime;

    // Expira se sair do mapa
    if (
      this.position.x < -20 ||
      this.position.x > bounds.width + 20 ||
      this.position.y < -20 ||
      this.position.y > bounds.height + 20
    ) {
      this.isExpired = true;
    }
  }
}