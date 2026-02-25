'use client';

import { motion } from 'motion/react';
import { RotateCcw, Trophy, Medal } from 'lucide-react';
import { Team } from '@/lib/questions';

interface EndScreenProps {
  teams: Team[];
  onRestart: () => void;
}

export default function EndScreen({ teams, onRestart }: EndScreenProps) {
  // Sort teams by score descending
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const winner = sortedTeams[0];
  const isTie = sortedTeams.length > 1 && sortedTeams[0].score === sortedTeams[1].score;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 max-w-4xl mx-auto w-full relative overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" 
           style={{ backgroundImage: 'radial-gradient(#d4af37 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-navy-900/0 via-navy-900/50 to-navy-900/80 z-0" />

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="mb-8 relative"
      >
        <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full" />
        <Trophy className="w-32 h-32 md:w-40 md:h-40 text-gold drop-shadow-[0_0_30px_rgba(212,175,55,0.8)] relative z-10" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mb-12 text-center w-full"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
          {isTie ? 'تعادل!' : 'الفريق الفائز'}
        </h2>
        
        {!isTie && (
          <div className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gold-light via-gold to-gold-dark drop-shadow-[0_0_20px_rgba(212,175,55,0.6)] mb-2">
            {winner.name}
          </div>
        )}
        
        <p className="text-2xl text-gold-light/90 font-medium mb-12">
          برصيد {winner.score} نقطة
        </p>

        {/* Leaderboard */}
        <div className="w-full max-w-2xl mx-auto bg-navy-light/40 border border-gold/30 rounded-3xl p-6 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-gold mb-6 border-b border-gold/20 pb-4">الترتيب النهائي</h3>
          <div className="space-y-4">
            {sortedTeams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.2 }}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 ${
                  index === 0 && !isTie
                    ? 'bg-gold/10 border-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                    : 'bg-navy/50 border-navy-light/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-gold text-navy-900' :
                    index === 1 ? 'bg-gray-300 text-navy-900' :
                    index === 2 ? 'bg-amber-700 text-white' :
                    'bg-navy-light text-white/50'
                  }`}>
                    {index === 0 ? <Medal className="w-6 h-6" /> : index + 1}
                  </div>
                  <span className={`text-xl font-bold ${index === 0 ? 'text-gold' : 'text-white'}`}>
                    {team.name}
                  </span>
                </div>
                <span className={`text-2xl font-black ${index === 0 ? 'text-gold' : 'text-white/80'}`}>
                  {team.score}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(212,175,55,0.4)" }}
        whileTap={{ scale: 0.95 }}
        onClick={onRestart}
        className="flex items-center gap-3 px-8 py-4 bg-navy-light border-2 border-gold text-gold font-bold text-xl rounded-full transition-all hover:bg-gold hover:text-navy-900"
      >
        <RotateCcw className="w-6 h-6" />
        <span>لعبة جديدة</span>
      </motion.button>
    </div>
  );
}
