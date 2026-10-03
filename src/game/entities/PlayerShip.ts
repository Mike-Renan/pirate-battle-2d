import { Vector2D, Rectangle } from '../utils/math';
import { Projectile } from './Projectile';

export class PlayerShip {
  public position: Vector2D;
  public rotation: number = 0; // 0 radianos = Apontado para Cima (Proa)
  public radius: number = 32;
  public speed: number = 180;
  public turnSpeed: number = 2.8;
  public health: number = 100;
  public maxHealth: number = 100;

  constructor(initialPosition: Vector2D) {
    this.position = { ...initialPosition };
  }

  public move(direction: 'forward' | 'backward', deltaTime: number): void {
    const factor = direction === 'forward' ? 1 : -0.5;
    // Movimento direto no vetor da proa
    this.position.x += Math.sin(this.rotation) * this.speed * factor * deltaTime;
    this.position.y -= Math.cos(this.rotation) * this.speed * factor * deltaTime;
  }

  public rotate(direction: 'left' | 'right', deltaTime: number): void {
    const factor = direction === 'right' ? 1 : -1;
    this.rotation += this.turnSpeed * factor * deltaTime;
  }

  public update(_deltaTime: number, bounds: Rectangle, _islands: Rectangle[] = []): void {
    this.position.x = Math.max(this.radius, Math.min(bounds.width - this.radius, this.position.x));
    this.position.y = Math.max(this.radius, Math.min(bounds.height - this.radius, this.position.y));
  }

  public fire(type: 'front' | 'left' | 'right'): Projectile[] {
    const projectiles: Projectile[] = [];

    if (type === 'front') {
      // Tiro direto pela Proa (Frente)
      const spawnX = this.position.x + Math.sin(this.rotation) * 25;
      const spawnY = this.position.y - Math.cos(this.rotation) * 25;

      projectiles.push(
        new Projectile(
          { x: spawnX, y: spawnY },
          this.rotation,
          400,
          25,
          8,
          2.5,
          true
        )
      );
    } else if (type === 'left') {
      // Bombordo (Lateral Esquerda)
      const angle = this.rotation - Math.PI / 2;
      const spawnX = this.position.x + Math.sin(angle) * 15;
      const spawnY = this.position.y - Math.cos(angle) * 15;

      projectiles.push(
        new Projectile({ x: spawnX, y: spawnY }, angle - 0.08, 360, 20, 7, 2.5, true),
        new Projectile({ x: spawnX, y: spawnY }, angle + 0.08, 360, 20, 7, 2.5, true)
      );
    } else if (type === 'right') {
      // Estibordo (Lateral Direita)
      const angle = this.rotation + Math.PI / 2;
      const spawnX = this.position.x + Math.sin(angle) * 15;
      const spawnY = this.position.y - Math.cos(angle) * 15;

      projectiles.push(
        new Projectile({ x: spawnX, y: spawnY }, angle - 0.08, 360, 20, 7, 2.5, true),
        new Projectile({ x: spawnX, y: spawnY }, angle + 0.08, 360, 20, 7, 2.5, true)
      );
    }

    return projectiles;
  }

  public takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
  }
}