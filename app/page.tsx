'use client';

import { useState } from 'react';
import StartScreen from '@/components/StartScreen';
import TeamSetup from '@/components/TeamSetup';
import GameBoard from '@/components/GameBoard';
import EndScreen from '@/components/EndScreen';
import { categories, Team } from '@/lib/questions';

export default function Home() {
  const [gameState, setGameState] = useState<'start' | 'setup' | 'playing' | 'end'>('start');
  const [teams, setTeams] = useState<Team[]>([]);

  const handleStart = () => {
    setGameState('setup');
  };

  const handleSetupComplete = (newTeams: Team[]) => {
    setTeams(newTeams);
    setGameState('playing');
  };

  const handleGameEnd = (finalTeams: Team[]) => {
    setTeams(finalTeams);
    setGameState('end');
  };

  const handleRestart = () => {
    setGameState('start');
    setTeams([]);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-navy-light via-navy to-black overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-gold/10 rounded-full blur-[150px]" />
      </div>

      <div className="z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {gameState === 'start' && <StartScreen onStart={handleStart} />}
        {gameState === 'setup' && <TeamSetup onSetupComplete={handleSetupComplete} />}
        {gameState === 'playing' && <GameBoard categories={categories} teams={teams} onGameEnd={handleGameEnd} />}
        {gameState === 'end' && <EndScreen teams={teams} onRestart={handleRestart} />}
      </div>
    </main>
  );
}
