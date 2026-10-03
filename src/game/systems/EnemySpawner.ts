import { EnemyShip } from '../entities/EnemyShip';
import { Vector2D, Rectangle, Circle, checkCircleRectCollision } from '../utils/math';

export class EnemySpawner {
  private enemyIdCounter: number = 0;

  public spawnEnemy(
    type: 'chaser' | 'shooter',
    arenaBounds: Rectangle,
    playerPosition: Vector2D,
    islands: Rectangle[]
  ): EnemyShip {
    const enemyRadius = 30;
    const MIN_DISTANCE_FROM_PLAYER = 250;
    const MAX_ATTEMPTS = 20;
    let attempts = 0;
    let validPosition: Vector2D | null = null;

    while (!validPosition && attempts < MAX_ATTEMPTS) {
      attempts++;

      const randomX = arenaBounds.x + enemyRadius + Math.random() * (arenaBounds.width - enemyRadius * 2);
      const randomY = arenaBounds.y + enemyRadius + Math.random() * (arenaBounds.height - enemyRadius * 2);

      const dx = randomX - playerPosition.x;
      const dy = randomY - playerPosition.y;
      const distToPlayerSq = dx * dx + dy * dy;

      if (distToPlayerSq < MIN_DISTANCE_FROM_PLAYER * MIN_DISTANCE_FROM_PLAYER) {
        continue;
      }

      const candidateCircle: Circle = { x: randomX, y: randomY, radius: enemyRadius };
      if (!islands.some((island) => checkCircleRectCollision(candidateCircle, island))) {
        validPosition = { x: randomX, y: randomY };
      }
    }

    if (!validPosition) {
      validPosition = { x: arenaBounds.x + 50, y: arenaBounds.y + 50 };
    }

    this.enemyIdCounter++;
    const id = `enemy_${this.enemyIdCounter}_${Date.now()}`;

    // Passa na ordem exata: (type, initialPosition, id)
    return new EnemyShip(type, validPosition, id);
  }
}