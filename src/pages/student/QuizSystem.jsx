import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Award, Zap, ShieldAlert, Timer, ChevronRight, X, Trophy, Star, CheckCircle, Flame, User } from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { subjects } from '../../data/mockData';
import confetti from 'canvas-confetti';

export default function QuizSystem() {
  const [quizzes, setQuizzes] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Student State
  const [studentName, setStudentName] = useState(localStorage.getItem('studentName') || '');
  const [isNameSet, setIsNameSet] = useState(!!localStorage.getItem('studentName'));
  const [totalXP, setTotalXP] = useState(0); 
  const [userAttempts, setUserAttempts] = useState({});
  
  // Game State
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const qSnap = await getDocs(collection(db, 'adminQuizzes'));
        const qz = [];
        qSnap.forEach((doc) => qz.push({ id: doc.id, ...doc.data() }));
        setQuizzes(qz);

        const lSnap = await getDocs(collection(db, 'quizLeaderboard'));
        const ld = [];
        lSnap.forEach((doc) => ld.push({ id: doc.id, ...doc.data() }));
        ld.sort((a, b) => (b.xp || 0) - (a.xp || 0));
        setLeaderboard(ld);

        if (isNameSet) {
          const userDoc = ld.find(u => u.name.toLowerCase() === studentName.toLowerCase());
          if (userDoc) {
            setTotalXP(userDoc.xp || 0);
            setUserAttempts(userDoc.attempts || {});
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isNameSet, studentName, showResult]);

  // Timer logic for active quiz
  useEffect(() => {
    if (activeQuiz && !showResult && !isAnswerChecked && timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && activeQuiz && !showResult && !isAnswerChecked) {
      handleCheckAnswer(-1); // Time's up
    }
  }, [timeLeft, activeQuiz, showResult, isAnswerChecked]);

  const handleSetName = async (e) => {
    e.preventDefault();
    if (!studentName.trim()) return;
    localStorage.setItem('studentName', studentName.trim());
    setIsNameSet(true);
    
    const userRef = doc(db, 'quizLeaderboard', studentName.trim().toLowerCase());
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, { name: studentName.trim(), xp: 0, attempts: {} });
      setTotalXP(0);
      setUserAttempts({});
    } else {
      setTotalXP(userSnap.data().xp || 0);
      setUserAttempts(userSnap.data().attempts || {});
    }
  };

  const startChallenge = (quiz) => {
    if (!isNameSet) {
      alert('Please enter your name to start the challenge!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const maxAttempts = quiz.attempts || 1;
    const currentAttempts = userAttempts[quiz.id] || 0;
    if (currentAttempts >= maxAttempts) {
      alert('You have reached the maximum number of attempts for this quiz!');
      return;
    }

    if (quiz.type === 'external') {
      window.open(quiz.externalLink, '_blank');
      return;
    }

    setActiveQuiz(quiz);
    setCurrentQuestionIdx(0);
    setScore(0);
    scoreRef.current = 0;
    setShowResult(false);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setStreak(0);
    setTimeLeft(quiz.time * 60); 
  };

  const handleCheckAnswer = (optIdx) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(optIdx);
    setIsAnswerChecked(true);

    const isCorrect = optIdx === activeQuiz.questions[currentQuestionIdx].correctIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
      scoreRef.current += 1;
      setStreak(prev => prev + 1);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, colors: ['#10B981', '#34D399'] });
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      handleNextQuestion();
    }, 2000);
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIdx + 1 < activeQuiz.questions.length) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      setShowResult(true);
      const finalScore = scoreRef.current;
      const earnedXP = Math.round((finalScore / activeQuiz.questions.length) * activeQuiz.xp);
      const newTotal = totalXP + earnedXP;
      
      const newAttempts = { ...userAttempts };
      newAttempts[activeQuiz.id] = (newAttempts[activeQuiz.id] || 0) + 1;
      
      setTotalXP(newTotal);
      setUserAttempts(newAttempts);
      
      if (earnedXP > 0) {
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
      }
      
      try {
        const userRef = doc(db, 'quizLeaderboard', studentName.toLowerCase());
        await setDoc(userRef, { name: studentName, xp: newTotal, attempts: newAttempts }, { merge: true });
      } catch (err) {
        console.error("Failed to save XP and attempts", err);
      }
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (activeQuiz) {
    if (showResult) {
      const finalScore = scoreRef.current;
      const percentage = Math.round((finalScore / activeQuiz.questions.length) * 100);
      const earnedXP = Math.round((finalScore / activeQuiz.questions.length) * activeQuiz.xp);
      
      return (
        <div className="max-w-3xl mx-auto py-12 px-4 animate-in fade-in zoom-in duration-500">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl text-center">
            <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-amber-500" />
            </div>
            <h2 className="text-4xl font-black mb-2">Quiz Complete!</h2>
            <p className="text-slate-500 text-lg mb-8">{activeQuiz.title}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl">
                <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Score</div>
                <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{percentage}%</div>
                <div className="text-sm text-slate-500 mt-1">{finalScore} out of {activeQuiz.questions.length} correct</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl">
                <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">XP Earned</div>
                <div className="text-4xl font-black text-amber-500">+{earnedXP}</div>
                <div className="text-sm text-slate-500 mt-1">Total XP: {totalXP}</div>
              </div>
            </div>
            
            <button 
              onClick={() => setActiveQuiz(null)}
              className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 px-8 py-4 rounded-xl font-bold text-lg w-full transition-colors"
            >
              Back to Quiz Hub
            </button>
          </div>
        </div>
      );
    }

    const currentQ = activeQuiz.questions[currentQuestionIdx];
    
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-300">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setActiveQuiz(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <X className="w-6 h-6" />
          </button>
          <div className="flex gap-4">
            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
              <Timer className="w-5 h-5 text-indigo-500" /> {formatTime(timeLeft)}
            </div>
            <div className="bg-amber-100 dark:bg-amber-900/30 px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-amber-600 dark:text-amber-500">
              <Flame className="w-5 h-5" /> Streak: {streak}
            </div>
          </div>
        </div>

        <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full mb-12 overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentQuestionIdx) / activeQuiz.questions.length) * 100}%` }}
          ></div>
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-center mb-12 leading-tight">
          {currentQ.text}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQ.options.map((opt, idx) => {
            let btnClass = "bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 text-slate-700 dark:text-slate-200";
            if (isAnswerChecked) {
              if (idx === currentQ.correctIndex) {
                btnClass = "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400 scale-[1.02] shadow-lg shadow-green-500/20";
              } else if (idx === selectedAnswer) {
                btnClass = "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400 scale-[0.98]";
              } else {
                btnClass = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-50";
              }
            } else if (selectedAnswer === idx) {
              btnClass = "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-400 scale-[1.02] shadow-md";
            }

            return (
              <button
                key={idx}
                disabled={isAnswerChecked}
                onClick={() => handleCheckAnswer(idx)}
                className={`p-6 rounded-2xl text-lg font-bold transition-all duration-200 flex items-center justify-between ${btnClass}`}
              >
                <span>{opt}</span>
                {isAnswerChecked && idx === currentQ.correctIndex && <CheckCircle className="w-6 h-6 text-green-500" />}
                {isAnswerChecked && idx === selectedAnswer && idx !== currentQ.correctIndex && <X className="w-6 h-6 text-red-500" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Interactive Quiz Hub</h1>
          <p className="text-slate-500 mt-1">Compete with friends, earn XP, and level up your knowledge!</p>
        </div>
        <div className="flex gap-3">
          {isNameSet ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">
                  {studentName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold">{studentName}</div>
                  <div className="text-xs text-indigo-600 font-bold">Online</div>
                </div>
              </div>
              <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm">
                <Award className="w-5 h-5" /> {totalXP} XP
              </div>
            </div>
          ) : (
            <form onSubmit={handleSetName} className="flex gap-2">
              <input 
                type="text" 
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your name" 
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold transition-colors">
                Save
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Quizzes */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-500 fill-current" /> Available Challenges
          </h3>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-slate-100 dark:bg-slate-800 h-48 rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : quizzes.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center text-slate-500">
              No quizzes available right now. Check back later!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quizzes.map((quiz) => {
                const maxAttempts = quiz.attempts || 1;
                const currentAttempts = userAttempts[quiz.id] || 0;
                const outOfAttempts = currentAttempts >= maxAttempts;
                
                return (
                  <motion.div 
                    key={quiz.id}
                    whileHover={{ y: -4 }}
                    className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border transition-all ${quiz.active && !outOfAttempts ? 'border-indigo-200 dark:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10' : 'border-slate-200 dark:border-slate-800 opacity-60'}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full">
                        {subjects.find(s => s.id === quiz.subjectId)?.title || quiz.subjectId}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
                        <Award className="w-3 h-3" /> {quiz.xp} XP
                      </span>
                    </div>
                    <h4 className="text-lg font-bold mb-2 line-clamp-2 min-h-[56px]">
                      {quiz.title} {quiz.type === 'external' && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full ml-2 align-middle">Live Battle</span>}
                    </h4>
                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium mb-6">
                      <span className="flex items-center gap-1"><Timer className="w-4 h-4" /> {quiz.time} mins</span>
                      <span className="flex items-center gap-1">
                        <ShieldAlert className="w-4 h-4" /> 
                        {quiz.type === 'external' ? 'Wayground Link' : `${(quiz.questions || []).length} Qs`}
                      </span>
                    </div>
                    
                    {outOfAttempts ? (
                      <button disabled className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed">
                        Attempts Used ({currentAttempts}/{maxAttempts})
                      </button>
                    ) : (
                      <button 
                        onClick={() => quiz.active && startChallenge(quiz)}
                        disabled={!quiz.active}
                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${quiz.active ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}`}
                      >
                        {quiz.active ? `Start Challenge (${maxAttempts - currentAttempts} left)` : 'Unavailable'}
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Leaderboard */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" /> Global Leaderboard
            </h3>
            <div className="space-y-4">
              {leaderboard.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">No ranked students yet. Be the first!</p>
              ) : (
                leaderboard.slice(0, 10).map((user, index) => {
                  const rank = index + 1;
                  const isMe = isNameSet && user.name.toLowerCase() === studentName.toLowerCase();
                  return (
                    <div key={user.id} className={`flex items-center justify-between p-3 rounded-xl ${isMe ? 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${rank === 1 ? 'bg-yellow-100 text-yellow-700' : rank === 2 ? 'bg-slate-200 text-slate-700' : rank === 3 ? 'bg-amber-200 text-amber-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                          {rank}
                        </div>
                        <span className={`font-medium ${isMe ? 'text-indigo-700 dark:text-indigo-400 font-bold' : ''}`}>{user.name}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-500">{user.xp || 0} XP</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
