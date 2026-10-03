export class SoundManager {
  private static instance: SoundManager;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private ambienceAudio?: HTMLAudioElement;
  private isMuted: boolean = false;
  private isInitialized: boolean = false;

  private soundFiles: Record<string, string> = {
    cannon_fire_1: '/assets/sounds/cannon_fire_1.wav',
    cannon_fire_2: '/assets/sounds/cannon_fire_2.wav',
    cannon_broadside: '/assets/sounds/cannon_broadside.wav',
    wood_hit_1: '/assets/sounds/ship_wood_hit_1.wav',
    wood_hit_2: '/assets/sounds/ship_wood_hit_2.wav',
    explosion_1: '/assets/sounds/ship_explosion_1.wav',
    score_point: '/assets/sounds/score_point.wav',
    ship_sinking: '/assets/sounds/ship_sinking.wav',
    ui_click: '/assets/sounds/ui_click.wav',
    game_start: '/assets/sounds/game_start.wav',
    game_pause: '/assets/sounds/game_pause.wav',
    game_resume: '/assets/sounds/game_resume.wav',
    game_over: '/assets/sounds/game_over.wav',
  };

  private constructor() {
    this.preloadSounds();
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private preloadSounds(): void {
    Object.entries(this.soundFiles).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      this.sounds.set(key, audio);
    });
  }

  // Inicializa a música / som ambiente após o primeiro clique do jogador
  public initialize(): void {
    if (this.isInitialized) {
      if (this.ambienceAudio && this.ambienceAudio.paused && !this.isMuted) {
        this.ambienceAudio.play().catch(() => {});
      }
      return;
    }

    this.isInitialized = true;

    // Carrega o som ambiente do oceano
    const ocean = new Audio('/assets/sounds/ocean_ambience_loop.wav');
    ocean.loop = true;
    ocean.volume = 0.25;
    this.ambienceAudio = ocean;

    // Tenta reproduzir (desbloqueado pela interação do clique do menu/jogo)
    ocean.play().catch(() => {
      // Caso o navegador bloqueie, aguarda o próximo clique na tela
      const unlockAudio = () => {
        ocean.play().catch(() => {});
        window.removeEventListener('click', unlockAudio);
      };
      window.addEventListener('click', unlockAudio);
    });
  }

  public play(soundKey: string, volume = 0.6): void {
    if (this.isMuted) return;

    // Garante que o som ambiente esteja rodando se ainda não iniciou
    if (!this.isInitialized) {
      this.initialize();
    }

    const sound = this.sounds.get(soundKey);
    if (sound) {
      const soundClone = sound.cloneNode(true) as HTMLAudioElement;
      soundClone.volume = volume;
      soundClone.play().catch(() => {});
    }
  }

  public pauseAmbience(): void {
    if (this.ambienceAudio) {
      this.ambienceAudio.pause();
    }
  }

  public resumeAmbience(): void {
    if (this.ambienceAudio && !this.isMuted) {
      this.ambienceAudio.play().catch(() => {});
    }
  }

  public stopAmbience(): void {
    if (this.ambienceAudio) {
      this.ambienceAudio.pause();
      this.ambienceAudio.currentTime = 0;
    }
    this.isInitialized = false;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ambienceAudio) {
      if (this.isMuted) {
        this.ambienceAudio.pause();
      } else {
        this.ambienceAudio.play().catch(() => {});
      }
    }
    return this.isMuted;
  }
}

export const soundManager = SoundManager.getInstance();