export interface Vector2D {
  x: number;
  y: number;
}

export interface Circle {
  x: number;
  y: number;
  radius: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Normaliza um ângulo em radianos para mantê-lo no intervalo [-PI, PI].
 * Impede que rotações contínuas acumulem valores gigantescos.
 */
export function normalizeAngle(angle: number): number {
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
}

/**
 * Checa colisão entre dois Círculos (Ex: Projétil vs Navio).
 * Utiliza distância quadrática para eliminar Math.sqrt e garantir 60 FPS.
 */
export function checkCircleCollision(a: Circle, b: Circle): boolean {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distanceSq = dx * dx + dy * dy;
  const radiiSum = a.radius + b.radius;
  return distanceSq < radiiSum * radiiSum;
}

/**
 * Checa colisão entre um Círculo (Navio/Tiro) e um Retângulo (Ilha/Limites).
 */
export function checkCircleRectCollision(circle: Circle, rect: Rectangle): boolean {
  // Encontra o ponto dentro do retângulo mais próximo do centro do círculo
  const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
  const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

  // Calcula a distância do centro do círculo até esse ponto
  const dx = circle.x - closestX;
  const dy = circle.y - closestY;

  return dx * dx + dy * dy < circle.radius * circle.radius;
}