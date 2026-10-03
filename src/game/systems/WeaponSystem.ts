import { Projectile } from '../entities/Projectile';
import { Vector2D } from '../utils/math';
import { GameConfig } from '../config/gameConfig';

export class WeaponSystem {
  private frontCooldownTimer = 0;
  private leftCooldownTimer = 0;
  private rightCooldownTimer = 0;

  public update(deltaTime: number): void {
    if (this.frontCooldownTimer > 0) this.frontCooldownTimer -= deltaTime;
    if (this.leftCooldownTimer > 0) this.leftCooldownTimer -= deltaTime;
    if (this.rightCooldownTimer > 0) this.rightCooldownTimer -= deltaTime;
  }

  public fireFront(
    position: Vector2D,
    shipAngle: number,
    config: GameConfig['weapons']['front']
  ): Projectile[] {
    if (this.frontCooldownTimer > 0) return [];
    this.frontCooldownTimer = config.cooldown;

    return [
      new Projectile(
        position,
        shipAngle,
        config.speed,
        config.damage,
        config.radius,
        config.lifeTime,
        true
      ),
    ];
  }

  public fireSide(
    position: Vector2D,
    shipAngle: number,
    side: 'left' | 'right',
    config: GameConfig['weapons']['side']
  ): Projectile[] {
    const timer = side === 'left' ? this.leftCooldownTimer : this.rightCooldownTimer;
    if (timer > 0) return [];

    if (side === 'left') this.leftCooldownTimer = config.cooldown;
    else this.rightCooldownTimer = config.cooldown;

    // Disparo perpendicular (90° para a esquerda ou direita)
    const baseAngle = side === 'left' ? shipAngle - Math.PI / 2 : shipAngle + Math.PI / 2;

    const angles = [
      baseAngle - config.spreadAngle,
      baseAngle,
      baseAngle + config.spreadAngle,
    ];

    return angles.map(
      (angle) =>
        new Projectile(
          position,
          angle,
          config.speed,
          config.damage,
          config.radius,
          config.lifeTime,
          true
        )
    );
  }
}