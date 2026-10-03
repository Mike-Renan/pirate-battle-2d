import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../game/engine/GameEngine';
import { GameConfig } from '../game/config/gameConfig';
import { soundManager } from '../game/utils/SoundManager';

interface GameCanvasProps {
  config: GameConfig;
  onGameOver: (score: number, reason: string, timePlayed: number) => void;
  onReturnToMenu: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ config, onGameOver, onReturnToMenu }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.sessionTime);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseView, setPauseView] = useState<'main' | 'options'>('main');

  useEffect(() => {
    if (!containerRef.current) return;

    soundManager.initialize();
    soundManager.play('game_start', 0.7);

    const width = window.innerWidth;
    const height = window.innerHeight;

    const engine = new GameEngine(config, width, height);
    engineRef.current = engine;

    engine.initialize(containerRef.current).then(() => {
      const timerInterval = setInterval(() => {
        if (engine.simulation && !engine.isPaused) {
          setScore(engine.simulation.score);
          setTimeLeft(Math.max(0, Math.ceil(engine.simulation.timeLeft)));

          if (engine.simulation.isGameOver) {
            clearInterval(timerInterval);
            soundManager.stopAmbience();
            const timePlayed = config.sessionTime - engine.simulation.timeLeft;
            onGameOver(engine.simulation.score, engine.simulation.state, timePlayed);
          }
        }
      }, 250);

      return () => clearInterval(timerInterval);
    });

    const handleResize = () => {
      if (engineRef.current && engineRef.current.app) {
        engineRef.current.app.renderer.resize(window.innerWidth, window.innerHeight);
        engineRef.current.simulation.arenaBounds = {
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
        engineRef.current.resizeBackground();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      soundManager.stopAmbience();
      engine.destroy();
    };
  }, [config, onGameOver]);

  const togglePause = () => {
    setIsPaused((prev) => {
      const nextPausedState = !prev;

      if (engineRef.current) {
        engineRef.current.setPaused(nextPausedState);
      }

      if (nextPausedState) {
        soundManager.play('game_pause');
        soundManager.pauseAmbience();
      } else {
        soundManager.play('game_resume');
        soundManager.resumeAmbience();
      }

      setPauseView('main');
      return nextPausedState;
    });
  };

  const handleBackToMenuClick = () => {
    soundManager.play('ui_click');
    soundManager.stopAmbience();
    if (engineRef.current) {
      engineRef.current.destroy();
    }
    onReturnToMenu();
  };

  const handleTouchControl = (key: string, isPress: boolean) => {
    if (engineRef.current) {
      engineRef.current.setKeyStatus(key, isPress);
    }
  };

  const handleTouchFire = (type: 'front' | 'left' | 'right') => {
    if (engineRef.current && !engineRef.current.isPaused) {
      engineRef.current.simulation.firePlayerWeapon(type);
    }
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = Math.floor(timeLeft % 60).toString().padStart(2, '0');
  const formattedTime = `${minutes}:${seconds}`;

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#000000', overflow: 'hidden' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', alignItems: 'center', gap: '6px', zIndex: 10 }}>
        <div style={{ position: 'relative', width: '90px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/assets/png/default/ui/hud/counter_panel.png" alt="" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'fill' }} />
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <img src="/assets/png/default/ui/hud/icon_score.png" alt="Score" style={{ width: '16px', height: '16px' }} />
            <span style={{ color: '#ffffff', fontWeight: '900', fontSize: '13px' }}>{score}</span>
          </div>
        </div>

        <div style={{ position: 'relative', width: '98px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/assets/png/default/ui/hud/counter_panel.png" alt="" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'fill' }} />
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <img src="/assets/png/default/ui/hud/icon_time.png" alt="Time" style={{ width: '16px', height: '16px' }} />
            <span style={{ color: '#ffffff', fontWeight: '900', fontSize: '13px' }}>{formattedTime}</span>
          </div>
        </div>

        <button onClick={togglePause} style={{ width: '36px', height: '36px', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
          <img src="/assets/png/default/ui/controls/icon_pause.png" alt="Pause" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </button>
      </div>

      {/* D-PAD VIRTUAL TOUCH OFICIAL (CANTO INFERIOR ESQUERDO) */}
      <div style={{ position: 'absolute', bottom: '16px', left: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', zIndex: 12 }}>
        <button
          onTouchStart={() => handleTouchControl('KeyW', true)}
          onTouchEnd={() => handleTouchControl('KeyW', false)}
          onMouseDown={() => handleTouchControl('KeyW', true)}
          onMouseUp={() => handleTouchControl('KeyW', false)}
          style={dpadBtnStyle}
        >
          <img src="/assets/png/default/ui/controls/icon_forward.png" alt="Frente" style={{ width: '22px', height: '22px' }} />
        </button>
        <div style={{ display: 'flex', gap: '18px' }}>
          <button
            onTouchStart={() => handleTouchControl('KeyA', true)}
            onTouchEnd={() => handleTouchControl('KeyA', false)}
            onMouseDown={() => handleTouchControl('KeyA', true)}
            onMouseUp={() => handleTouchControl('KeyA', false)}
            style={dpadBtnStyle}
          >
            <img src="/assets/png/default/ui/controls/icon_turn_left.png" alt="Esquerda" style={{ width: '22px', height: '22px' }} />
          </button>
          <button
            onTouchStart={() => handleTouchControl('KeyD', true)}
            onTouchEnd={() => handleTouchControl('KeyD', false)}
            onMouseDown={() => handleTouchControl('KeyD', true)}
            onMouseUp={() => handleTouchControl('KeyD', false)}
            style={dpadBtnStyle}
          >
            <img src="/assets/png/default/ui/controls/icon_turn_right.png" alt="Direita" style={{ width: '22px', height: '22px' }} />
          </button>
        </div>
        <button
          onTouchStart={() => handleTouchControl('KeyS', true)}
          onTouchEnd={() => handleTouchControl('KeyS', false)}
          onMouseDown={() => handleTouchControl('KeyS', true)}
          onMouseUp={() => handleTouchControl('KeyS', false)}
          style={dpadBtnStyle}
        >
          <img src="/assets/png/default/ui/controls/icon_forward.png" alt="Ré" style={{ width: '22px', height: '22px', transform: 'rotate(180deg)' }} />
        </button>
      </div>

      {/* BOTÕES TOUCH OFICIAIS DE TIRO (CANTO INFERIOR DIREITO) */}
      <div style={{ position: 'absolute', bottom: '16px', right: '16px', display: 'flex', gap: '10px', alignItems: 'center', zIndex: 12 }}>
        <button onClick={() => handleTouchFire('left')} style={dpadBtnStyle} title="Bordada Esquerda (Q)">
          <img src="/assets/png/default/ui/controls/icon_fire_left.png" alt="Tiro Esquerda" style={{ width: '26px', height: '26px' }} />
        </button>
        <button onClick={() => handleTouchFire('front')} style={{ ...dpadBtnStyle, width: '58px', height: '58px' }} title="Tiro Frontal (Espaço)">
          <img src="/assets/png/default/ui/controls/icon_fire_front.png" alt="Tiro Frontal" style={{ width: '32px', height: '32px' }} />
        </button>
        <button onClick={() => handleTouchFire('right')} style={dpadBtnStyle} title="Bordada Direita (E)">
          <img src="/assets/png/default/ui/controls/icon_fire_right.png" alt="Tiro Direita" style={{ width: '26px', height: '26px' }} />
        </button>
      </div>

      {/* OVERLAY DE PAUSA */}
      {isPaused && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 30 }}>
          <div style={{ position: 'relative', width: '360px', maxWidth: '90vw', height: '340px', backgroundImage: 'url("/assets/png/default/ui/menu/panel_menu.png")', backgroundSize: '100% 100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 20px', boxSizing: 'border-box' }}>
            
            <h2 style={{ color: '#ffffff', margin: '0 0 2px 0', fontSize: '22px', fontWeight: '900', letterSpacing: '1px' }}>PAUSED</h2>
            <p style={{ margin: '0 0 24px 0', fontSize: '11px', color: '#cbd5e1', fontWeight: 'bold' }}>Ready when you are.</p>

            {pauseView === 'main' ? (
              <div style={{ width: '80%', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                <button onClick={togglePause} style={pauseBtnStyle}>
                  RESUME
                </button>
                <button onClick={() => { soundManager.play('ui_click'); setPauseView('options'); }} style={pauseBtnStyle}>
                  OPTIONS
                </button>
                <button onClick={handleBackToMenuClick} style={pauseBtnStyle}>
                  MAIN MENU
                </button>
              </div>
            ) : (
              <div style={{ width: '80%', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                <h3 style={{ color: '#fbbf24', margin: 0, fontSize: '15px' }}>AUDIO & CONTROLS</h3>
                <button
                  onClick={() => {
                    soundManager.toggleMute();
                    soundManager.play('ui_click');
                  }}
                  style={pauseBtnStyle}
                >
                  TOGGLE AUDIO
                </button>
                <button onClick={() => { soundManager.play('ui_click'); setPauseView('main'); }} style={pauseBtnStyle}>
                  BACK
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const dpadBtnStyle: React.CSSProperties = {
  width: '48px',
  height: '48px',
  backgroundImage: 'url("/assets/png/default/ui/controls/button_round_normal.png")',
  backgroundSize: '100% 100%',
  backgroundColor: 'transparent',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  touchAction: 'none',
};

const pauseBtnStyle: React.CSSProperties = {
  width: '100%',
  height: '40px',
  backgroundImage: 'url("/assets/png/default/ui/menu/button_primary_hover.png")',
  backgroundSize: '100% 100%',
  backgroundColor: 'transparent',
  border: 'none',
  fontSize: '14px',
  fontWeight: '900',
  color: '#451a03',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default GameCanvas;