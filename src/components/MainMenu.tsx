import React, { useState } from 'react';
import { GameConfig } from '../game/config/gameConfig';
import { useRanking, useMatchHistory } from '../api/useGameApi';

interface MainMenuProps {
  config: GameConfig;
  onStartGame: () => void;
  onUpdateConfig: (newConfig: Partial<GameConfig>) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ config, onStartGame, onUpdateConfig }) => {
  const [view, setView] = useState<'main' | 'options' | 'ranking' | 'history'>('main');
  const [rankingPage] = useState(1);
  const [historyPage] = useState(1);

  const { data: rankingData, isLoading: loadingRanking } = useRanking(rankingPage);
  const { data: historyData, isLoading: loadingHistory } = useMatchHistory(historyPage);

  return (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundImage: 'url("/assets/ui_scene_background.png")',
      backgroundSize: '100% 100%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Trebuchet MS', Arial, sans-serif",
      userSelect: 'none',
      overflow: 'hidden',
      margin: 0,
      padding: 0,
    }}
  >
    {/* PAINEL MOLDURA COM ASSET DE IMAGEM REAL DO PNG */}
    <div
      style={{
        width: 'min(92vw, 460px)',
        minHeight: 'min(85vh, 400px)',
        backgroundImage: 'url("/assets/png/default/ui/menu/panel_menu.png")',
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        padding: 'clamp(20px, 4vh, 40px) clamp(16px, 3vw, 35px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#ffffff',
        position: 'relative',
        filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.7))',
        boxSizing: 'border-box',
      }}
    >
        {/* BANNER DE TÍTULO PIRATE BATTLE COM IMAGEM PNG REAL */}
        <div style={{ textAlign: 'center', marginTop: '-15px' }}>
          <img
            src="/assets/png/default/ui/menu/title_pirate_battle.png"
            alt="Pirate Battle"
            style={{ width: '280px', height: 'auto' }}
            onError={(e) => {
              // Fallback visual caso o caminho relativo mude
              e.currentTarget.style.display = 'none';
            }}
          />
          <h1 style={{ margin: 0, fontSize: '28px', color: '#000000', textShadow: '2px 2px #78350f' }}>
           
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: '#cbd5e1', letterSpacing: '1.5px', fontWeight: 'bold' }}>
            {view === 'main' ? 'SET SAIL. TAKE COMMAND.' : "CAPTAIN'S LOG"}
          </p>
        </div>

        {/* CONTEÚDO DA TELA INICIAL */}
        {view === 'main' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', alignItems: 'center', margin: '10px 0' }}>
            {/* Botão PLAY */}
            <button
              onClick={onStartGame}
              style={{
                width: '62%',
                height: '64px',
                backgroundImage: 'url("/assets/png/default/ui/menu/button_primary_hover.png")',
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '16px',
                fontWeight: '900',
                color: '#451a03',
                cursor: 'pointer',
                letterSpacing: '1px',
                textShadow: '1px 1px 0px #fef08a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              PLAY
            </button>

            {/* Botão OPTIONS */}
            <button
              onClick={() => setView('options')}
              style={{
                width: '62%',
                height: '64px',
                backgroundImage: 'url("/assets/png/default/ui/menu/button_primary_hover.png")',
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '16px',
                fontWeight: '900',
                color: '#451a03',
                cursor: 'pointer',
                letterSpacing: '1px',
                textShadow: '1px 1px 0px #fef08a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              OPTIONS
            </button>
          </div>
        )}

        {/* CONTEÚDO DE OPÇÕES */}
        {view === 'options' && (
          <div style={{ width: '85%', display: 'flex', flexDirection: 'column', gap: '18px', margin: '20px 0', textAlign: 'center' }}>
            <div>
              <p style={{ margin: '0 0 6px 0', fontSize: '12px', fontWeight: 'bold', color: '#cbd5e1' }}>Game session time</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                <button onClick={() => onUpdateConfig({ sessionTime: Math.max(60, config.sessionTime - 10) })} style={circleBtnStyle}>-</button>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#fbbf24' }}>{config.sessionTime} s</span>
                <button onClick={() => onUpdateConfig({ sessionTime: Math.min(180, config.sessionTime + 10) })} style={circleBtnStyle}>+</button>
              </div>
            </div>

            <div>
              <p style={{ margin: '0 0 6px 0', fontSize: '12px', fontWeight: 'bold', color: '#cbd5e1' }}>Enemy spawn time</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                <button onClick={() => onUpdateConfig({ enemySpawnInterval: Math.max(1, config.enemySpawnInterval - 1) })} style={circleBtnStyle}>-</button>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#fbbf24' }}>{config.enemySpawnInterval} s</span>
                <button onClick={() => onUpdateConfig({ enemySpawnInterval: Math.min(10, config.enemySpawnInterval + 1) })} style={circleBtnStyle}>+</button>
              </div>
            </div>
          </div>
        )}

        {/* RANKING */}
        {view === 'ranking' && (
          <div style={{ width: '100%', maxHeight: '200px', overflowY: 'auto', margin: '10px 0' }}>
            {loadingRanking ? <p style={{ textAlign: 'center', fontSize: '12px' }}>Loading...</p> : (
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ color: '#fbbf24', borderBottom: '2px solid #475569' }}>
                    <th style={{ padding: '4px' }}>RANK</th>
                    <th style={{ padding: '4px' }}>CAPTAIN</th>
                    <th style={{ padding: '4px' }}>POINTS</th>
                  </tr>
                </thead>
                <tbody>
                  {rankingData?.data.map((item: { id: React.Key | null | undefined; playerName: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; score: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: number) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={{ padding: '4px', color: '#fbbf24' }}>{String(index + 1).padStart(2, '0')}</td>
                      <td style={{ padding: '4px' }}>{item.playerName}</td>
                      <td style={{ padding: '4px' }}>{item.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* HISTÓRICO */}
        {view === 'history' && (
          <div style={{ width: '100%', maxHeight: '200px', overflowY: 'auto', margin: '10px 0' }}>
            {loadingHistory ? <p style={{ textAlign: 'center', fontSize: '12px' }}>Loading...</p> : (
              <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ color: '#fbbf24', borderBottom: '2px solid #475569' }}>
                    <th style={{ padding: '4px' }}>DATE</th>
                    <th style={{ padding: '4px' }}>POINTS</th>
                    <th style={{ padding: '4px' }}>RESULT</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData?.data.map((item: { id: React.Key | null | undefined; date: string | number | Date; score: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; reason: string; }) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={{ padding: '4px' }}>{new Date(item.date).toLocaleDateString()}</td>
                      <td style={{ padding: '4px' }}>{item.score}</td>
                      <td style={{ padding: '4px' }}>{item.reason === 'died' ? '☠️ DIED' : '⏱️ TIME'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ÍCONE CENTRAL PNG DO NAVIO */}
        {view === 'main' && (
          <img
            src="/assets/png/default/ships/ship_8.png"
            alt="Ship"
            style={{ width: '38px', height: 'auto', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }}
          />
        )}
       
        {/* BOTÕES INFERIORES */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 'auto' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '10px', color: '#cbd5e1', textAlign: 'center', fontWeight: '600' }}>
            Navigate the islands. Survive the battle.
          </p>

          {view === 'main' ? (
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', width: '85%' }}>
              <button onClick={() => setView('ranking')} style={smallWoodenBtnStyle}>
                RANKING
              </button>
              <button onClick={() => setView('history')} style={smallWoodenBtnStyle}>
                MATCH HISTORY
              </button>
            </div>
          ) : (
            <button onClick={() => setView('main')} style={mainMenuBackBtnStyle}>
              MAIN MENU
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ESTILOS PARA OS BOTÕES INFERIORES FIDEDIGNOS AO MODELO
const smallWoodenBtnStyle: React.CSSProperties = {
  flex: 1,
  height: '36px',
  backgroundImage: 'url("/assets/png/default/ui/menu/button_secondary_normal.png")',
  backgroundSize: '100% 100%',
  backgroundRepeat: 'no-repeat',
  backgroundColor: 'transparent',
  border: 'none',
  fontSize: '11px',
  fontWeight: '900',
  color: '#ffffff', // Letras brancas conforme o modelo
  cursor: 'pointer',
  letterSpacing: '0.5px',
  textShadow: '1px 1px 2px #000000', // Sombra escura para destacar o texto branco
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 6px',
};

const mainMenuBackBtnStyle: React.CSSProperties = {
  width: '62%',
  height: '42px',
  backgroundImage: 'url("/assets/png/default/ui/menu/button_primary_hover.png")',
  backgroundSize: '100% 100%',
  backgroundRepeat: 'no-repeat',
  backgroundColor: 'transparent',
  border: 'none',
  fontSize: '15px',
  fontWeight: '900',
  color: '#451a03',
  cursor: 'pointer',
  letterSpacing: '1px',
  textShadow: '1px 1px 0px #fef08a',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  
};

         
   


// Estilização com a Imagem PNG do Botão Amarelo de Madeira
const woodenBtnPngStyle: React.CSSProperties = {
  width: '100%',
  height: '48px',
  backgroundImage: 'url("/assets/png/default/ui/menu/button_yellow.png")',
  backgroundSize: '100% 100%',
  backgroundColor: 'transparent',
  border: 'none',
  fontSize: '18px',
  fontWeight: '900',
  color: '#421a04',
  cursor: 'pointer',
  letterSpacing: '1px',
  textShadow: '1px 1px 0 #fef08a',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const subBtnPngStyle: React.CSSProperties = {
  flex: 1,
  height: '36px',
  backgroundImage: 'url("/assets/png/default/ui/menu/button_small.png")',
  backgroundSize: '100% 100%',
  backgroundColor: 'transparent',
  border: 'none',
  fontSize: '11px',
  fontWeight: 'bold',
  color: '#ffffff',
  cursor: 'pointer',
  textShadow: '1px 1px 0 #000',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const circleBtnStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: '#f59e0b',
  border: '2px solid #fef3c7',
  color: '#451a03',
  fontSize: '18px',
  fontWeight: 'bold',
  cursor: 'pointer',
};