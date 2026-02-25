'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, Question, Team } from '@/lib/questions';
import { Trophy, Users, CheckCircle2, XCircle, HelpCircle, SkipForward, X, Timer, Swords, Landmark, FlaskConical, Globe, BookOpen, Cpu, Sparkles } from 'lucide-react';
import { playSound } from '@/lib/sounds';

const categoryIcons: Record<string, React.ReactNode> = {
  history: <Landmark className="w-6 h-6" />,
  science: <FlaskConical className="w-6 h-6" />,
  sports: <Trophy className="w-6 h-6" />,
  geography: <Globe className="w-6 h-6" />,
  literature: <BookOpen className="w-6 h-6" />,
  technology: <Cpu className="w-6 h-6" />,
};

interface GameBoardProps {
  categories: Category[];
  teams: Team[];
  onGameEnd: (teams: Team[]) => void;
}

export default function GameBoard({ categories: initialCategories, teams: initialTeams, onGameEnd }: GameBoardProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [activeQuestion, setActiveQuestion] = useState<{ categoryId: string, question: Question } | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [guessedWrong, setGuessedWrong] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  
  // Lifeline states for the current question
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [audienceVotes, setAudienceVotes] = useState<number[] | null>(null);

  // Challenge states
  const [stealingTeamId, setStealingTeamId] = useState<string | null>(null);

  // Tie breaker states
  const [tieBreakerMode, setTieBreakerMode] = useState(false);

  useEffect(() => {
    if (!activeQuestion || isAnswerRevealed || timeLeft <= 0 || stealingTeamId) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 11 && prev > 1) {
          playSound('intense-tick');
        } else if (prev > 11 && prev <= 60) {
          // Optional: play normal tick if you want it to tick all the time, 
          // but usually it's better to only tick at the end to build tension.
          // playSound('tick');
        }
        
        if (prev <= 1) {
          playSound('wrong');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeQuestion, isAnswerRevealed, timeLeft, stealingTeamId]);

  const handleQuestionSelect = (categoryId: string, question: Question) => {
    if (question.isAnswered) return;
    setActiveQuestion({ categoryId, question });
    setIsAnswerRevealed(false);
    setSelectedOption(null);
    setGuessedWrong([]);
    setHiddenOptions([]);
    setAudienceVotes(null);
    setTimeLeft(60);
    setStealingTeamId(null);
    
    if (question.isChallenge) {
      playSound('challenge');
    }
  };

  const handleOptionSelect = (index: number) => {
    if (isAnswerRevealed || hiddenOptions.includes(index) || guessedWrong.includes(index)) return;
    setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || !activeQuestion) return;
    
    if (selectedOption === activeQuestion.question.correctAnswerIndex) {
      playSound('correct');
      setIsAnswerRevealed(true);
    } else {
      playSound('wrong');
      setGuessedWrong(prev => [...prev, selectedOption]);
      setSelectedOption(null);
    }
  };

  const handleRevealAnswer = () => {
    setIsAnswerRevealed(true);
  };

  const handleAwardPoints = (teamId: string) => {
    if (!activeQuestion) return;
    
    if (activeQuestion.question.isChallenge) {
      setStealingTeamId(teamId);
    } else {
      setTeams(prev => prev.map(t => 
        t.id === teamId ? { ...t, score: t.score + activeQuestion.question.points } : t
      ));
      closeQuestion(activeQuestion.categoryId, activeQuestion.question.id);
    }
  };

  const handleStealPoints = (targetTeamId: string) => {
    if (!activeQuestion || !stealingTeamId) return;
    
    setTeams(prev => prev.map(t => {
      if (t.id === stealingTeamId) {
        return { ...t, score: t.score + activeQuestion.question.points };
      }
      if (t.id === targetTeamId) {
        return { ...t, score: t.score - activeQuestion.question.points };
      }
      return t;
    }));
    
    setStealingTeamId(null);
    closeQuestion(activeQuestion.categoryId, activeQuestion.question.id);
  };

  const handleCloseWithoutPoints = () => {
    if (!activeQuestion) return;
    closeQuestion(activeQuestion.categoryId, activeQuestion.question.id);
  };

  const closeQuestion = (categoryId: string, questionId: number) => {
    if (tieBreakerMode) {
      onGameEnd(teams);
      return;
    }

    setCategories(prev => prev.map(c => {
      if (c.id === categoryId) {
        return {
          ...c,
          questions: c.questions.map(q => q.id === questionId ? { ...q, isAnswered: true } : q)
        };
      }
      return c;
    }));

    setActiveQuestion(null);
    setIsAnswerRevealed(false);
    setHiddenOptions([]);
    setAudienceVotes(null);
    setGuessedWrong([]);
    
    // Check if game is over
    const allAnswered = categories.every(c => c.questions.every(q => q.id === questionId || q.isAnswered));
    if (allAnswered) {
      const maxScore = Math.max(...teams.map(t => t.score));
      const topTeamsCount = teams.filter(t => t.score === maxScore).length;
      
      if (topTeamsCount > 1) {
        setTieBreakerMode(true);
        const tieBreakerQuestion: Question = {
          id: 999,
          text: 'سؤال التعادل: كم عدد سور القرآن الكريم؟',
          options: ['110', '112', '114', '116'],
          correctAnswerIndex: 2,
          points: 1000,
          isChallenge: false,
        };
        setActiveQuestion({ categoryId: 'tiebreaker', question: tieBreakerQuestion });
        setTimeLeft(60);
      } else {
        onGameEnd(teams);
      }
    }
  };

  const handleFiftyFifty = useCallback((teamId: string) => {
    if (!activeQuestion || isAnswerRevealed) return;
    
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, lifelines: { ...t.lifelines, fiftyFifty: false } } : t));
    
    const wrongOptions = activeQuestion.question.options
      .map((_, index) => index)
      .filter((index) => index !== activeQuestion.question.correctAnswerIndex && !guessedWrong.includes(index));
    
    const pseudoRandom = (Date.now() % 100) / 100;
    const shuffled = wrongOptions.sort(() => 0.5 - pseudoRandom);
    
    // Always hide exactly 2 options (or whatever is left if less than 2)
    const optionsToHide = shuffled.slice(0, 2);
    setHiddenOptions(optionsToHide);
  }, [activeQuestion, isAnswerRevealed, guessedWrong]);

  const handleAskAudience = useCallback((teamId: string) => {
    if (!activeQuestion || isAnswerRevealed) return;
    
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, lifelines: { ...t.lifelines, askAudience: false } } : t));
    
    const votes = [0, 0, 0, 0];
    let remaining = 100;
    
    // Ensure correct answer gets the highest percentage (between 45% and 75%)
    const pseudoRandom1 = (Date.now() % 100) / 100;
    const correctVote = Math.floor(pseudoRandom1 * 30) + 45; 
    votes[activeQuestion.question.correctAnswerIndex] = correctVote;
    remaining -= correctVote;
    
    const otherIndices = [0, 1, 2, 3].filter(i => i !== activeQuestion.question.correctAnswerIndex);
    
    // Distribute remaining votes among other options
    otherIndices.forEach((index, i) => {
      if (i === otherIndices.length - 1) {
        votes[index] = remaining; // Last option gets whatever is left
      } else {
        // Ensure no wrong option gets more than the correct option
        const maxAllowed = Math.min(remaining, correctVote - 1);
        const pseudoRandom2 = ((Date.now() + i) % 100) / 100;
        // Give a random amount, but keep it reasonable
        const vote = Math.floor(pseudoRandom2 * (maxAllowed / 1.5));
        votes[index] = vote;
        remaining -= vote;
      }
    });
    
    setAudienceVotes(votes);
  }, [activeQuestion, isAnswerRevealed]);

  const handleSkip = (teamId: string) => {
    if (!activeQuestion || isAnswerRevealed) return;
    
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, lifelines: { ...t.lifelines, skip: false } } : t));
    handleCloseWithoutPoints();
  };

  // Split teams for right and left panels
  const rightTeams = teams.filter((_, i) => i % 2 === 0);
  const leftTeams = teams.filter((_, i) => i % 2 !== 0);

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8 max-w-7xl mx-auto w-full relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" 
           style={{ backgroundImage: 'radial-gradient(#d4af37 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
      
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-navy-900/0 via-navy-900/50 to-navy-900/80 z-0" />

      {/* Header / Scoreboard */}
      <header className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8 relative z-10">
        {teams.map((team) => (
          <motion.div
            key={team.id}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-4 px-6 py-3 md:px-8 md:py-4 rounded-3xl border-2 border-gold/30 bg-gradient-to-b from-navy-900/90 to-navy/80 shadow-[0_8px_30px_rgba(0,0,0,0.5),inset_0_2px_10px_rgba(212,175,55,0.1)] backdrop-blur-md relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
            <div className="flex flex-col items-center">
              <span className="text-sm md:text-base font-bold text-gold/80 tracking-widest uppercase mb-1">
                {team.name}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 drop-shadow-sm">{team.score}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </header>

      {/* Game Board Grid */}
      <div className="flex-1 relative mt-4">
        {/* Decorative background for the board */}
        <div className="absolute inset-0 bg-navy-900/60 rounded-[2rem] border-2 border-gold/20 backdrop-blur-md -m-4 md:-m-8 p-4 md:p-8 z-0 shadow-[0_0_50px_rgba(10,17,40,0.8)]" />
        
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <div key={category.id} className="flex flex-col gap-4">
              {/* Category Header */}
              <div className="relative overflow-hidden bg-gradient-to-b from-gold-light via-gold to-gold-dark text-navy-900 font-black text-lg md:text-xl py-5 px-2 text-center rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_2px_0_rgba(255,255,255,0.5)] border-2 border-gold-light mb-2">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-t-xl" />
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="bg-navy-900/10 p-2 rounded-full backdrop-blur-sm">
                    {categoryIcons[category.id] || <Sparkles className="w-6 h-6" />}
                  </div>
                  <span className="tracking-wider drop-shadow-sm">{category.name}</span>
                </div>
              </div>
              
              {/* Questions Column */}
              <div className="flex flex-col gap-3">
                {category.questions.map((question) => (
                  <motion.button
                    key={question.id}
                    whileHover={!question.isAnswered ? { scale: 1.05, y: -5 } : {}}
                    whileTap={!question.isAnswered ? { scale: 0.95 } : {}}
                    onClick={() => handleQuestionSelect(category.id, question)}
                    disabled={question.isAnswered}
                    className={`relative py-5 md:py-7 rounded-2xl border-2 font-black text-2xl md:text-3xl transition-all duration-300 flex items-center justify-center overflow-hidden group ${
                      question.isAnswered 
                        ? 'bg-navy-900/50 border-navy-800 text-navy-light/20 cursor-not-allowed shadow-inner' 
                        : question.isChallenge
                          ? 'bg-gradient-to-br from-red-900/80 to-navy-900/90 border-red-500/50 text-red-400 hover:border-red-400 hover:text-red-300 shadow-[0_8px_16px_rgba(239,68,68,0.2),inset_0_2px_10px_rgba(239,68,68,0.2)]'
                          : 'bg-gradient-to-br from-navy-light/60 to-navy-900/80 border-gold/40 text-gold hover:border-gold-light hover:text-gold-light shadow-[0_8px_16px_rgba(0,0,0,0.4),inset_0_2px_10px_rgba(212,175,55,0.1)]'
                    }`}
                  >
                    {/* Glass reflection effect */}
                    {!question.isAnswered && (
                      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}

                    {question.isAnswered ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-navy-900/80 backdrop-blur-sm">
                        <div className="w-full h-0.5 bg-navy-light/30 rotate-45 absolute" />
                        <div className="w-full h-0.5 bg-navy-light/30 -rotate-45 absolute" />
                      </div>
                    ) : (
                      <div className="relative z-10 flex items-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {question.isChallenge && <Swords className="w-6 h-6 animate-pulse text-red-500" />}
                        <span className="tracking-tighter">{question.points}</span>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Question Modal */}
      <AnimatePresence>
        {activeQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-stretch justify-between bg-navy/95 backdrop-blur-md overflow-hidden"
          >
            {/* Right Panel (Teams 1, 3) */}
            <div className="w-1/4 max-w-[300px] bg-navy-light/30 border-l border-gold/20 p-6 flex flex-col gap-6 overflow-y-auto">
              {rightTeams.map(team => (
                <TeamPanel 
                  key={team.id} 
                  team={team} 
                  isAnswerRevealed={isAnswerRevealed}
                  onFiftyFifty={() => handleFiftyFifty(team.id)}
                  onAskAudience={() => handleAskAudience(team.id)}
                  onSkip={() => handleSkip(team.id)}
                  onAwardPoints={() => handleAwardPoints(team.id)}
                />
              ))}
            </div>

            {/* Center Panel (Question) */}
            <div className="flex-1 flex flex-col p-8 md:p-12 overflow-y-auto relative">
              {/* Steal Modal Overlay */}
              {stealingTeamId && (
                <div className="absolute inset-0 z-20 bg-navy-900/90 backdrop-blur-md flex items-center justify-center p-8">
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="bg-gradient-to-br from-red-900/90 to-navy-900/95 border-2 border-red-500/50 p-8 rounded-3xl max-w-md w-full text-center shadow-[0_0_50px_rgba(239,68,68,0.3)] relative overflow-hidden"
                  >
                    {/* Decorative background elements */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.2)_0%,transparent_70%)] pointer-events-none" />
                    
                    <div className="relative z-10">
                      <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-6 border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                        <Swords className="w-10 h-10 text-red-400 animate-pulse" />
                      </div>
                      
                      <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-300 to-red-600 mb-2">
                        تحدي وسرقة!
                      </h3>
                      
                      <p className="text-red-200/80 mb-8 text-lg">
                        اختر الفريق الذي تريد سحب <span className="font-bold text-white">{activeQuestion.question.points}</span> نقطة منه:
                      </p>
                      
                      <div className="flex flex-col gap-3">
                        {teams.filter(t => t.id !== stealingTeamId).map(team => (
                          <button
                            key={team.id}
                            onClick={() => handleStealPoints(team.id)}
                            className="group relative overflow-hidden py-4 px-6 rounded-2xl bg-navy-900/50 border border-red-500/30 hover:border-red-400 transition-all duration-300 flex items-center justify-between"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                            <span className="font-bold text-xl text-white relative z-10">{team.name}</span>
                            <span className="text-red-300 font-medium relative z-10">{team.score} نقطة</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <span className="bg-gold text-navy-900 px-4 py-1 rounded-full text-sm font-bold">
                    {tieBreakerMode ? 'جولة التعادل' : categories.find(c => c.id === activeQuestion.categoryId)?.name}
                  </span>
                  <span className="text-gold font-bold text-xl">{activeQuestion.question.points} نقطة</span>
                  {activeQuestion.question.isChallenge && (
                    <span className="bg-red-500/20 text-red-400 border border-red-500/50 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <Swords className="w-4 h-4" />
                      تحدي
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${timeLeft <= 10 ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse' : 'bg-navy-light border-gold/30 text-gold'}`}>
                    <Timer className="w-5 h-5" />
                    <span className="font-bold text-xl w-8 text-center">{timeLeft}</span>
                  </div>
                  <button 
                    onClick={handleCloseWithoutPoints}
                    className="p-2 rounded-full bg-navy-light text-white/50 hover:text-white hover:bg-red-500/50 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full">
                <h2 className="text-3xl md:text-5xl font-bold text-center leading-tight text-white mb-12 drop-shadow-md">
                  {activeQuestion.question.text}
                </h2>

                {/* Audience Votes Display */}
                {audienceVotes && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex justify-center gap-6 mb-12"
                  >
                    {audienceVotes.map((vote, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div className="h-32 w-10 bg-navy-light rounded-t-md relative flex items-end overflow-hidden border border-gold/20">
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${vote}%` }}
                            className="w-full bg-gradient-to-t from-gold-dark to-gold-light"
                          />
                        </div>
                        <span className="text-sm font-bold mt-3 text-gold-light">{vote}%</span>
                        <span className="text-xs text-white/50">{['أ', 'ب', 'ج', 'د'][idx]}</span>
                      </div>
                    ))}
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeQuestion.question.options.map((option, index) => {
                    const isHidden = hiddenOptions.includes(index);
                    const isWrong = guessedWrong.includes(index);
                    const isCorrect = index === activeQuestion.question.correctAnswerIndex;
                    const isSelected = index === selectedOption;
                    
                    let buttonStateClass = "bg-navy/60 border-gold/40 text-white hover:bg-navy-light/80 hover:border-gold";
                    
                    if (isAnswerRevealed) {
                      if (isCorrect) {
                        buttonStateClass = "bg-green-600/80 border-green-400 text-white shadow-[0_0_20px_rgba(74,222,128,0.5)]";
                      } else if (isSelected || isWrong) {
                        buttonStateClass = "bg-red-600/80 border-red-400 text-white shadow-[0_0_20px_rgba(248,113,113,0.5)]";
                      } else {
                        buttonStateClass = "bg-navy/30 border-navy/50 text-white/30";
                      }
                    } else if (isWrong) {
                      buttonStateClass = "bg-red-900/40 border-red-500/50 text-white/50";
                    } else if (isSelected) {
                      buttonStateClass = "bg-gold/80 border-gold text-navy-900 shadow-[0_0_20px_rgba(212,175,55,0.4)]";
                    }

                    return (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: isHidden ? 0 : 1, y: 0 }}
                        whileHover={!isAnswerRevealed && !isHidden && !isWrong ? { scale: 1.02 } : {}}
                        whileTap={!isAnswerRevealed && !isHidden && !isWrong ? { scale: 0.98 } : {}}
                        onClick={() => handleOptionSelect(index)}
                        disabled={isAnswerRevealed || isHidden || isWrong}
                        className={`relative p-6 rounded-2xl border-2 text-xl md:text-2xl font-semibold transition-all duration-300 ${buttonStateClass} ${isHidden || isWrong ? 'pointer-events-none' : ''}`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border shrink-0 ${
                            isSelected && !isAnswerRevealed ? 'bg-navy-900/20 text-navy-900 border-navy-900/30' : 
                            isWrong ? 'bg-red-500/20 text-red-500 border-red-500/30' : 'bg-gold/20 text-gold border-gold/30'
                          }`}>
                            {['أ', 'ب', 'ج', 'د'][index]}
                          </span>
                          <span className="flex-1 text-right">{option}</span>
                          {isAnswerRevealed && isCorrect && <CheckCircle2 className="w-8 h-8 text-white shrink-0 drop-shadow-md" />}
                          {(isAnswerRevealed && isSelected && !isCorrect) || isWrong ? <XCircle className="w-8 h-8 text-red-400 shrink-0 drop-shadow-md" /> : null}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {!isAnswerRevealed && (
                  <div className="mt-12 flex justify-center gap-4">
                    <button
                      onClick={handleCheckAnswer}
                      disabled={selectedOption === null}
                      className={`px-8 py-4 font-bold text-xl rounded-full transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] ${
                        selectedOption !== null 
                          ? 'bg-gold text-navy-900 hover:bg-gold-light' 
                          : 'bg-navy-light/50 text-white/30 cursor-not-allowed shadow-none border border-gold/20'
                      }`}
                    >
                      تحقق من الإجابة
                    </button>
                    <button
                      onClick={handleRevealAnswer}
                      className="px-8 py-4 bg-navy-light border-2 border-gold/50 text-gold font-bold text-xl rounded-full hover:bg-gold/10 transition-colors"
                    >
                      إظهار الإجابة
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Left Panel (Teams 2, 4) */}
            <div className="w-1/4 max-w-[300px] bg-navy-light/30 border-r border-gold/20 p-6 flex flex-col gap-6 overflow-y-auto">
              {leftTeams.map(team => (
                <TeamPanel 
                  key={team.id} 
                  team={team} 
                  isAnswerRevealed={isAnswerRevealed}
                  onFiftyFifty={() => handleFiftyFifty(team.id)}
                  onAskAudience={() => handleAskAudience(team.id)}
                  onSkip={() => handleSkip(team.id)}
                  onAwardPoints={() => handleAwardPoints(team.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface TeamPanelProps {
  team: Team;
  isAnswerRevealed: boolean;
  onFiftyFifty: () => void;
  onAskAudience: () => void;
  onSkip: () => void;
  onAwardPoints: () => void;
}

function TeamPanel({ team, isAnswerRevealed, onFiftyFifty, onAskAudience, onSkip, onAwardPoints }: TeamPanelProps) {
  return (
    <div className="bg-gradient-to-br from-navy-900/80 to-navy/90 border-2 border-gold/30 rounded-3xl p-5 flex flex-col gap-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
      {/* Decorative top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
      
      <div className="text-center border-b-2 border-gold/10 pb-4 relative">
        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark mb-1 tracking-wide">{team.name}</h3>
        <div className="inline-flex items-center justify-center bg-navy-900/50 px-4 py-1.5 rounded-full border border-gold/20 shadow-inner mt-2">
          <span className="text-white/90 font-bold text-lg">{team.score}</span>
          <span className="text-gold/70 text-xs mr-2 font-medium">نقطة</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <p className="text-xs text-center text-gold/50 font-semibold tracking-widest uppercase">المساعدات المتاحة</p>
        <div className="flex justify-center gap-3">
          <LifelineButton 
            icon={<HelpCircle className="w-5 h-5" />} 
            label="50:50" 
            available={team.lifelines.fiftyFifty} 
            disabled={isAnswerRevealed}
            onClick={onFiftyFifty} 
          />
          <LifelineButton 
            icon={<Users className="w-5 h-5" />} 
            label="الجمهور" 
            available={team.lifelines.askAudience} 
            disabled={isAnswerRevealed}
            onClick={onAskAudience} 
          />
          <LifelineButton 
            icon={<SkipForward className="w-5 h-5" />} 
            label="تخطي" 
            available={team.lifelines.skip} 
            disabled={isAnswerRevealed}
            onClick={onSkip} 
          />
        </div>
      </div>

      <button
        onClick={onAwardPoints}
        disabled={!isAnswerRevealed}
        className={`mt-4 py-4 rounded-2xl font-black text-lg transition-all duration-300 relative overflow-hidden group ${
          isAnswerRevealed 
            ? 'bg-gradient-to-r from-gold-dark via-gold to-gold-light text-navy-900 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-[1.02]' 
            : 'bg-navy-900/50 border border-navy-700 text-white/20 cursor-not-allowed'
        }`}
      >
        {isAnswerRevealed && (
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        )}
        <span className="relative z-10">منح النقاط</span>
      </button>
    </div>
  );
}

function LifelineButton({ icon, label, available, disabled, onClick }: { icon: React.ReactNode, label: string, available: boolean, disabled: boolean, onClick: () => void }) {
  const isUsable = available && !disabled;
  
  return (
    <button
      onClick={onClick}
      disabled={!isUsable}
      title={label}
      className={`relative flex items-center justify-center w-14 h-14 rounded-2xl border-2 transition-all duration-300 shadow-lg ${
        !available 
          ? 'bg-navy-900/80 border-red-500/20 text-red-500/30 cursor-not-allowed shadow-inner' 
          : disabled
            ? 'bg-navy-900/50 border-gold/10 text-gold/30 cursor-not-allowed'
            : 'bg-gradient-to-br from-navy-light/80 to-navy-900/90 border-gold/50 text-gold hover:border-gold-light hover:text-gold-light hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:-translate-y-1'
      }`}
    >
      {icon}
      {!available && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-0.5 bg-red-500/40 rotate-45 absolute" />
          <div className="w-full h-0.5 bg-red-500/40 -rotate-45 absolute" />
        </div>
      )}
    </button>
  );
}
