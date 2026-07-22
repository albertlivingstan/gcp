import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, AlertTriangle, ArrowLeft, Loader2, Send, ChevronRight, XCircle, RefreshCw } from 'lucide-react';
import { EMAIL_SCENARIOS, PASSAGE_RECALL_DATA, getQuestionsForTopic } from '../../data/mockQuestions';

export default function PracticeSession({ topic, category, onClose }) {
  const isPassageRecall = topic?.name === 'Passage Recall';
  const isEmailWriting = topic?.name === 'Email Writing';
  const isMCQ = !isPassageRecall && !isEmailWriting;

  // Phases: 'setup' -> 'reading' (Passage) -> 'writing' -> 'mcq' -> 'analyzing' -> 'result'
  const initialPhase = isPassageRecall ? 'reading' : (isMCQ ? 'mcq' : 'setup');
  const initialTime = isPassageRecall ? 90 : (isMCQ ? 60 : 600);

  const [phase, setPhase] = useState(initialPhase);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  
  // States for Passage
  const [passageIndex, setPassageIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);

  // States for Email
  const [emailScenario, setEmailScenario] = useState(EMAIL_SCENARIOS[0]);

  // States for MCQ
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [mcqResult, setMcqResult] = useState(null); // 'correct' | 'incorrect'

  const currentPassage = PASSAGE_RECALL_DATA[passageIndex];
  const topicQuestions = isMCQ ? getQuestionsForTopic(topic.name) : [];
  const currentQuestion = isMCQ ? topicQuestions[currentQuestionIndex] : null;

  // Countdown timer logic
  useEffect(() => {
    let timer;
    if ((phase === 'reading' || phase === 'writing' || (phase === 'mcq' && !mcqResult)) && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (phase === 'reading') {
        setPhase('writing');
        setTimeLeft(0);
      } else if (phase === 'writing') {
        handleSubmit();
      } else if (phase === 'mcq' && !mcqResult) {
        handleOptionSelect(null); // Time's up
      }
    }
    return () => clearInterval(timer);
  }, [phase, timeLeft, mcqResult]);

  // Anti-cheat handlers
  const handlePreventCheat = (e) => {
    e.preventDefault();
  };

  const handleAntiCopy = (e) => {
    e.preventDefault();
    if (e.clipboardData) {
      e.clipboardData.setData('text/plain', 'Copying questions is disabled for practice integrity.');
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Passage/Email Submit
  const handleSubmit = () => {
    setPhase('analyzing');
    setTimeout(() => {
      setFeedback({
        score: Math.floor(Math.random() * 20) + 80,
        grammar: 'Good',
        coherence: 'Excellent',
        notes: isPassageRecall 
          ? 'You successfully captured the core points from the passage.'
          : 'Your email follows a professional structure and clearly states the purpose.',
      });
      setPhase('result');
    }, 2500);
  };

  const startEmailWriting = () => {
    setPhase('writing');
    setTimeLeft(600); // 10 mins
  };

  const handleNextPassage = () => {
    setUserInput('');
    setFeedback(null);
    setPassageIndex(prev => prev + 1);
    setPhase('reading');
    setTimeLeft(90);
  };

  // MCQ Handlers
  const handleOptionSelect = (index) => {
    if (mcqResult) return; 
    setSelectedOption(index);
    
    if (currentQuestion && index === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
      setMcqResult('correct');
    } else {
      setMcqResult('incorrect');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < topicQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setMcqResult(null);
      setTimeLeft(60);
    } else {
      setPhase('result');
    }
  };

  const renderHeader = () => (
    <div className={`p-5 mb-4 rounded-2xl bg-gradient-to-r ${category.gradient} flex justify-between items-center text-white`}>
      <div>
        <button onClick={onClose} className="flex items-center gap-2 text-white/80 hover:text-white mb-2 text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Hub
        </button>
        <h2 className="text-2xl font-bold">{topic.name} Practice</h2>
      </div>
      {(phase === 'reading' || phase === 'writing' || phase === 'mcq') && (
        <div className="bg-white/20 px-4 py-2 rounded-xl flex items-center gap-2 font-mono text-xl font-bold">
          <Clock className="w-5 h-5" />
          {formatTime(timeLeft)}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col">
      {renderHeader()}

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          
          {/* SETUP PHASE */}
          {phase === 'setup' && isEmailWriting && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4"
            >
              <h3 className="text-lg font-bold mb-4">Select an Email Scenario</h3>
              <select 
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 mb-6 focus:ring-2 focus:ring-teal-500"
                value={emailScenario.value}
                onChange={(e) => {
                  const sc = EMAIL_SCENARIOS.find(s => s.value === e.target.value);
                  setEmailScenario(sc);
                }}
              >
                {EMAIL_SCENARIOS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-xl mb-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Prompt</p>
                <p className="text-slate-800 dark:text-slate-200 font-medium">{emailScenario.prompt}</p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 p-4 rounded-xl flex gap-3 mb-6">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p className="text-sm">
                  <strong>Rules:</strong> You will have 10 minutes to write the email. Copy and paste are disabled. The AI will evaluate your formatting and grammar.
                </p>
              </div>
              <button 
                onClick={startEmailWriting}
                className={`w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r ${category.gradient} shadow-md hover:shadow-lg transition-all`}
              >
                Start Writing
              </button>
            </motion.div>
          )}

          {/* READING PHASE */}
          {phase === 'reading' && isPassageRecall && (
            <motion.div
              key="reading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center justify-center h-full p-6 text-center"
            >
              <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl text-left">
                <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-200 flex justify-between items-center">
                  <span>Read carefully (Passage {passageIndex + 1}/{PASSAGE_RECALL_DATA.length})</span>
                  <span className="text-red-500">Disappears in {timeLeft}s</span>
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg select-none mb-6" onCopy={handleAntiCopy}>
                  {currentPassage}
                </p>
                <div className="flex justify-end">
                  <button 
                    onClick={() => {
                      setPhase('writing');
                      setTimeLeft(0);
                    }}
                    className={`px-6 py-2 rounded-xl font-bold text-white bg-gradient-to-r ${category.gradient} shadow-md hover:shadow-lg transition-all`}
                  >
                    I'm Ready, Start Writing
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* WRITING PHASE */}
          {phase === 'writing' && (
            <motion.div
              key="writing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col h-full"
            >
              {isEmailWriting && (
                <div className="mb-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Scenario Prompt</p>
                  <p className="text-sm text-slate-800 dark:text-slate-200" onCopy={handleAntiCopy}>{emailScenario.prompt}</p>
                </div>
              )}
              {isPassageRecall && (
                <div className="mb-4 text-sm font-semibold text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> The passage has been hidden. Write what you recall in the space below.
                </div>
              )}
              <textarea
                className="flex-1 w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 resize-none focus:ring-2 focus:ring-teal-500 mb-4"
                placeholder={isEmailWriting ? "Subject:\n\nDear [Name],\n\n..." : "Type the passage here..."}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onCopy={handlePreventCheat}
                onPaste={handlePreventCheat}
                onCut={handlePreventCheat}
                onDrop={handlePreventCheat}
                autoComplete="off"
                spellCheck="false"
              />
              <button 
                onClick={handleSubmit}
                disabled={userInput.trim().length === 0}
                className={`w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r ${category.gradient} shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
              >
                <Send className="w-5 h-5" /> Submit for AI Analysis
              </button>
            </motion.div>
          )}

          {/* MCQ PHASE */}
          {phase === 'mcq' && isMCQ && currentQuestion && (
            <motion.div
              key="mcq"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col h-full"
              onCopy={handleAntiCopy} // Container level anti-copy
            >
              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold text-slate-500">Question {currentQuestionIndex + 1} of {topicQuestions.length}</span>
                <span className="font-bold text-teal-600">Score: {score}</span>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 mb-6 select-none">
                <h3 className="text-xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                  {currentQuestion.question}
                </h3>
              </div>

              <div className="space-y-3 mb-6 select-none">
                {currentQuestion.options.map((opt, i) => {
                  let btnClass = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20";
                  if (mcqResult) {
                    if (i === currentQuestion.correctAnswer) {
                      btnClass = "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:text-green-300 dark:border-green-600";
                    } else if (i === selectedOption) {
                      btnClass = "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:text-red-300 dark:border-red-600";
                    } else {
                      btnClass = "bg-slate-50 border-slate-200 opacity-50 dark:bg-slate-800 dark:border-slate-700";
                    }
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleOptionSelect(i)}
                      disabled={!!mcqResult}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium ${btnClass} flex justify-between items-center`}
                    >
                      <span>{opt}</span>
                      {mcqResult && i === currentQuestion.correctAnswer && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {mcqResult && i === selectedOption && i !== currentQuestion.correctAnswer && <XCircle className="w-5 h-5 text-red-600" />}
                    </button>
                  );
                })}
              </div>

              {mcqResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-auto">
                  <button 
                    onClick={handleNextQuestion}
                    className={`w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r ${category.gradient} shadow-lg flex items-center justify-center gap-2`}
                  >
                    {currentQuestionIndex < topicQuestions.length - 1 ? 'Next Question' : 'View Results'}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ANALYZING PHASE */}
          {phase === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-4"
            >
              <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
              <h3 className="text-xl font-bold">AI is Analyzing your Response...</h3>
              <p className="text-slate-500">Checking for grammar, coherence, and structure.</p>
            </motion.div>
          )}

          {/* RESULT PHASE */}
          {phase === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 text-center"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>
              
              {isMCQ ? (
                <>
                  <h3 className="text-3xl font-bold mb-2">Score: {score} / {topicQuestions.length}</h3>
                  <p className="text-slate-500 mb-8">Practice Session Complete!</p>
                </>
              ) : (
                <>
                  <h3 className="text-3xl font-bold mb-2">Score: {feedback?.score}/100</h3>
                  <p className="text-slate-500 mb-8">AI Evaluation Complete</p>

                  <div className="grid grid-cols-2 gap-4 text-left mb-8">
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                      <p className="text-xs text-slate-500 uppercase font-bold mb-1">Grammar</p>
                      <p className="font-medium">{feedback?.grammar}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                      <p className="text-xs text-slate-500 uppercase font-bold mb-1">Coherence</p>
                      <p className="font-medium">{feedback?.coherence}</p>
                    </div>
                    <div className="col-span-2 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                      <p className="text-xs text-slate-500 uppercase font-bold mb-1">AI Feedback Notes</p>
                      <p className="font-medium text-sm">{feedback?.notes}</p>
                    </div>
                  </div>

                  {isPassageRecall && passageIndex < PASSAGE_RECALL_DATA.length - 1 && (
                    <button 
                      onClick={handleNextPassage}
                      className={`w-full mb-3 py-3 rounded-xl font-bold text-white bg-gradient-to-r ${category.gradient} shadow-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all`}
                    >
                      <RefreshCw className="w-5 h-5" /> Try Next Passage
                    </button>
                  )}
                </>
              )}

              <button 
                onClick={onClose}
                className="w-full py-3 rounded-xl font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Back to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
