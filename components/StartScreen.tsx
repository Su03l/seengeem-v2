'use client';

import { motion } from 'motion/react';
import { Play } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" 
           style={{ backgroundImage: 'radial-gradient(#d4af37 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-navy-900/0 via-navy-900/50 to-navy-900/80 z-0" />

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-12 relative z-10"
      >
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gold-light via-gold to-gold-dark drop-shadow-[0_0_15px_rgba(212,175,55,0.5)] mb-4">
          سين جيم
        </h1>
        <p className="text-xl md:text-2xl text-gold-light/80 font-medium tracking-wide">
          تحدي المعرفة الاحترافي
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(212,175,55,0.4)" }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-dark text-navy-900 font-bold text-2xl rounded-full overflow-hidden transition-all"
      >
        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
        <span>ابدأ اللعب</span>
        <Play className="w-6 h-6 fill-navy-900" />
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-16 max-w-md text-gold-light/60 text-sm leading-relaxed"
      >
        <p>أجب عن الأسئلة، اجمع النقاط، واستخدم وسائل المساعدة بحكمة للوصول إلى القمة.</p>
      </motion.div>
    </div>
  );
}
