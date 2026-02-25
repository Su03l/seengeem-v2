'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Plus, Minus, Play } from 'lucide-react';
import { Team } from '@/lib/questions';

interface TeamSetupProps {
  onSetupComplete: (teams: Team[]) => void;
}

export default function TeamSetup({ onSetupComplete }: TeamSetupProps) {
  const [teamCount, setTeamCount] = useState(2);
  const [teamNames, setTeamNames] = useState<string[]>(['الفريق الأول', 'الفريق الثاني']);

  const handleAddTeam = () => {
    if (teamCount < 4) {
      setTeamCount(prev => prev + 1);
      setTeamNames(prev => [...prev, `الفريق ${getOrdinal(teamCount + 1)}`]);
    }
  };

  const handleRemoveTeam = () => {
    if (teamCount > 2) {
      setTeamCount(prev => prev - 1);
      setTeamNames(prev => prev.slice(0, -1));
    }
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...teamNames];
    newNames[index] = name;
    setTeamNames(newNames);
  };

  const handleStart = () => {
    const teams: Team[] = teamNames.map((name, index) => ({
      id: `team-${index}`,
      name: name.trim() || `الفريق ${getOrdinal(index + 1)}`,
      score: 0,
      lifelines: {
        fiftyFifty: true,
        askAudience: true,
        skip: true,
      }
    }));
    onSetupComplete(teams);
  };

  const getOrdinal = (num: number) => {
    const ordinals = ['الأول', 'الثاني', 'الثالث', 'الرابع'];
    return ordinals[num - 1] || num.toString();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 max-w-2xl mx-auto w-full relative overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" 
           style={{ backgroundImage: 'radial-gradient(#d4af37 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-navy-900/0 via-navy-900/50 to-navy-900/80 z-0" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center relative z-10"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-gold-light to-gold-dark mb-4 drop-shadow-md">
          إعداد الفرق
        </h2>
        <p className="text-gold-light/80 text-lg">حدد عدد الفرق وأسمائها للبدء</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full bg-navy-light/40 border border-gold/30 rounded-3xl p-8 backdrop-blur-sm shadow-[0_0_30px_rgba(0,0,0,0.5)] relative z-10"
      >
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gold/20">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-gold" />
            <span className="text-2xl font-bold text-white">عدد الفرق</span>
          </div>
          <div className="flex items-center gap-4 bg-navy p-2 rounded-full border border-gold/40">
            <button
              onClick={handleRemoveTeam}
              disabled={teamCount <= 2}
              className="p-2 rounded-full bg-navy-light text-gold hover:bg-gold hover:text-navy disabled:opacity-50 disabled:hover:bg-navy-light disabled:hover:text-gold transition-colors"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-2xl font-bold w-8 text-center text-white">{teamCount}</span>
            <button
              onClick={handleAddTeam}
              disabled={teamCount >= 4}
              className="p-2 rounded-full bg-navy-light text-gold hover:bg-gold hover:text-navy disabled:opacity-50 disabled:hover:bg-navy-light disabled:hover:text-gold transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4 mb-10">
          {teamNames.map((name, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center text-gold font-bold">
                {index + 1}
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                className="flex-1 bg-navy/50 border border-gold/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                placeholder={`اسم الفريق ${getOrdinal(index + 1)}`}
                dir="rtl"
              />
            </motion.div>
          ))}
        </div>

        <button
          onClick={handleStart}
          className="w-full group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-dark text-navy-900 font-bold text-2xl rounded-2xl overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
          <span>التالي</span>
          <Play className="w-6 h-6 fill-navy-900" />
        </button>
      </motion.div>
    </div>
  );
}
