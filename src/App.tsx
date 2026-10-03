import React, { useState } from 'react';
import { DEFAULT_GAME_CONFIG, GameConfig } from './game/config/gameConfig';
import { GameCanvas } from './components/GameCanvas';
import { MainMenu } from './components/MainMenu';
import { useSaveMatch } from './api/useGameApi';

export const App: React.FC = () => {
  const [inGame, setInGame] = useState(false);
  const [config, setConfig] = useState<GameConfig>(DEFAULT_GAME_CONFIG);
  const [activeConfig, setActiveConfig] = useState<GameConfig>(DEFAULT_GAME_CONFIG);

  const saveMatchMutation = useSaveMatch();

  const handleStartGame = () => {
    setActiveConfig({ ...config });
    setInGame(true);
  };

  const handleReturnToMenu = () => {
    setInGame(false);
  };

  const handleGameOver = (finalScore: number, reason: string, timePlayed: number) => {
    setInGame(false);

    saveMatchMutation.mutate({
      id: `match_${Date.now()}`,
      playerId: 'player_1',
      playerName: 'Capitão Pirata',
      date: new Date().toISOString(),
      score: finalScore,
      duration: timePlayed,
      reason,
      config: activeConfig,
    });
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
      {inGame ? (
        <GameCanvas
          config={activeConfig}
          onGameOver={handleGameOver}
          onReturnToMenu={handleReturnToMenu}
        />
      ) : (
        <MainMenu
          config={config}
          onStartGame={handleStartGame}
          onUpdateConfig={(newConf) => setConfig((prev) => ({ ...prev, ...newConf }))}
        />
      )}
    </div>
  );
};

export default App;