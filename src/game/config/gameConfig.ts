// --- 1. INTERFACES (CONTRATOS DE TIPAGEM) ---

// Define as propriedades de uma arma frontal
export interface FrontWeaponConfig {
  cooldown: number;   // Tempo de espera entre tiros (em segundos)
  damage: number;     // Dano que cada tiro causa
  speed: number;      // Velocidade do projétil (pixels/segundo)
  lifeTime: number;   // Quanto tempo o tiro dura antes de sumir (em segundos)
  radius: number;     // Tamanho do raio de colisão do tiro
}

// Define a arma lateral (herda a frontal e adiciona o ângulo de espalhamento dos 3 tiros)
export interface SideWeaponConfig extends FrontWeaponConfig {
  spreadAngle: number; // Ângulo entre os 3 disparos em radianos (~8.5 graus)
}

// Configurações do inimigo persegue e explode (Chaser)
export interface ChaserEnemyConfig {
  moveSpeed: number;
  rotationSpeed: number;
  maxHealth: number;
  radius: number;
  collisionDamage: number; // Dano ao bater direto no navio do jogador
}

// Configurações do inimigo que atira à distância (Shooter)
export interface ShooterEnemyConfig {
  moveSpeed: number;
  rotationSpeed: number;
  maxHealth: number;
  radius: number;
  attackRange: number; // Distância mínima para começar a disparar
  cooldown: number;
  projectileSpeed: number;
  projectileDamage: number;
  projectileLifeTime: number;
  projectileRadius: number;
}

// Configuração completa do combate e da partida
export interface GameConfig {
  sessionTime: number;        // Duração da partida em segundos (60 a 180s)
  enemySpawnInterval: number; // Intervalo entre o surgimento de novos inimigos
  player: {
    moveSpeed: number;
    rotationSpeed: number;
    maxHealth: number;
    radius: number;
  };
  weapons: {
    front: FrontWeaponConfig;
    side: SideWeaponConfig;
  };
  enemies: {
    chaser: ChaserEnemyConfig;
    shooter: ShooterEnemyConfig;
  };
}

// --- 2. VALORES DEFAULT DE BALANCEAMENTO ---

export const DEFAULT_GAME_CONFIG: Readonly<GameConfig> = {
  sessionTime: 90,            // 90 segundos por padrão
  enemySpawnInterval: 3,      // Novo inimigo a cada 3 segundos
  player: {
    moveSpeed: 180,           // 180 pixels/segundo
    rotationSpeed: 2.5,       // Radianos por segundo
    maxHealth: 100,
    radius: 20,
  },
  weapons: {
    front: {
      cooldown: 0.4,          // Pode atirar a cada 0.4s
      damage: 25,
      speed: 400,
      lifeTime: 2.5,
      radius: 4,
    },
    side: {
      cooldown: 0.8,          // Pode atirar nas laterais a cada 0.8s
      damage: 15,
      speed: 350,
      lifeTime: 2.0,
      radius: 4,
      spreadAngle: 0.15,      // Leve abertura em leque dos 3 tiros
    },
  },
  enemies: {
    chaser: {
      moveSpeed: 140,
      rotationSpeed: 2.0,
      maxHealth: 30,
      radius: 18,
      collisionDamage: 30,    // Perde 30 de vida se o Chaser bater em você
    },
    shooter: {
      moveSpeed: 90,
      rotationSpeed: 1.5,
      maxHealth: 40,
      radius: 22,
      attackRange: 280,       // Começa a atirar a 280 pixels de distância
      cooldown: 1.5,
      projectileSpeed: 250,
      projectileDamage: 10,
      projectileLifeTime: 3.0,
      projectileRadius: 4,
    },
  },
};

// --- 3. CRIAÇÃO DE SNAPSHOT IMUTÁVEL ---

/**
 * Cria uma cópia profunda (deep clone) isolada das configurações.
 * Garante que mudanças nas Opções não alterem a partida em andamento.
 */
export function createConfigSnapshot(customConfig?: Partial<GameConfig>): GameConfig {
  const merged = { ...DEFAULT_GAME_CONFIG, ...customConfig };
  return JSON.parse(JSON.stringify(merged));
}