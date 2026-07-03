import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator, Brain, BookOpen, Code2,
  ChevronRight, Target, Hash, Clock, Zap,
  AlignLeft, Puzzle, BarChart2, GitBranch,
  FileCode, Layers, Sigma, Activity
} from 'lucide-react';

const APTITUDE_CATEGORIES = [
  {
    id: 'quantitative',
    name: 'Quantitative Aptitude',
    icon: Calculator,
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-600',
    lightBg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-700/50',
    iconBg: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    description: 'Master numbers, ratios, and problem-solving techniques',
    topics: [
      { name: 'Profit & Loss', icon: BarChart2, difficulty: 'Medium', questions: 40 },
      { name: 'Ratio & Proportion', icon: Sigma, difficulty: 'Easy', questions: 35 },
      { name: 'Time & Work', icon: Clock, difficulty: 'Medium', questions: 45 },
      { name: 'Time, Speed & Distance', icon: Zap, difficulty: 'Hard', questions: 50 },
      { name: 'Averages', icon: Activity, difficulty: 'Easy', questions: 30 },
      { name: 'Permutations & Combinations', icon: Hash, difficulty: 'Hard', questions: 55 },
    ]
  },
  {
    id: 'logical',
    name: 'Logical Reasoning',
    icon: Brain,
    color: 'purple',
    gradient: 'from-purple-500 to-violet-600',
    lightBg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-700/50',
    iconBg: 'bg-purple-500',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    description: 'Sharpen analytical thinking and pattern recognition',
    topics: [
      { name: 'Seating (Linear)', icon: AlignLeft, difficulty: 'Easy', questions: 30 },
      { name: 'Syllogism', icon: GitBranch, difficulty: 'Medium', questions: 35 },
      { name: 'Puzzles (Basic)', icon: Puzzle, difficulty: 'Easy', questions: 40 },
      { name: 'Data Sufficiency', icon: BarChart2, difficulty: 'Hard', questions: 45 },
      { name: 'Logical Connectives', icon: Layers, difficulty: 'Medium', questions: 30 },
      { name: 'Seating (Advanced)', icon: AlignLeft, difficulty: 'Hard', questions: 50 },
    ]
  },
  {
    id: 'verbal',
    name: 'Verbal Ability',
    icon: BookOpen,
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600',
    lightBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-700/50',
    iconBg: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    description: 'Strengthen vocabulary, comprehension and language skills',
    topics: [
      { name: 'Antonyms', icon: BookOpen, difficulty: 'Easy', questions: 25 },
      { name: 'RC (Basic)', icon: FileCode, difficulty: 'Easy', questions: 30 },
      { name: 'Para Jumbles', icon: Layers, difficulty: 'Medium', questions: 35 },
      { name: 'Error Detection', icon: Target, difficulty: 'Medium', questions: 40 },
      { name: 'RC', icon: FileCode, difficulty: 'Hard', questions: 45 },
      { name: 'Cloze Test', icon: AlignLeft, difficulty: 'Hard', questions: 40 },
    ]
  },
  {
    id: 'problem-solving',
    name: 'Problem Solving',
    icon: Code2,
    color: 'orange',
    gradient: 'from-orange-500 to-red-500',
    lightBg: 'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-orange-200 dark:border-orange-700/50',
    iconBg: 'bg-orange-500',
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    description: 'Build coding logic and algorithmic problem-solving skills',
    topics: [
      { name: 'Loops', icon: GitBranch, difficulty: 'Easy', questions: 30 },
      { name: 'Coding Basics', icon: Code2, difficulty: 'Easy', questions: 35 },
      { name: 'Arrays (Basic)', icon: Layers, difficulty: 'Medium', questions: 40 },
      { name: 'Strings', icon: AlignLeft, difficulty: 'Medium', questions: 45 },
      { name: 'Pseudocode Practice', icon: FileCode, difficulty: 'Medium', questions: 35 },
      { name: 'Competitive Programming', icon: Zap, difficulty: 'Hard', questions: 60 },
    ]
  }
];

const DIFFICULTY_BADGE = {
  Easy:   'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Hard:   'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

export default function SubjectsHub() {
  const [selectedCategory, setSelectedCategory] = useState(APTITUDE_CATEGORIES[0]);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const cat = selectedCategory;
  const Icon = cat.icon;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-1">Aptitude Hub</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Practice all aptitude categories for placement preparation.
        </p>
      </div>

      {/* Category Selector Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {APTITUDE_CATEGORIES.map((c) => {
          const CIcon = c.icon;
          const isActive = selectedCategory.id === c.id;
          return (
            <motion.button
              key={c.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setSelectedCategory(c); setSelectedTopic(null); }}
              className={`text-left p-4 rounded-2xl border transition-all duration-200 ${
                isActive
                  ? `${c.lightBg} ${c.border} shadow-md`
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${isActive ? c.iconBg : 'bg-slate-100 dark:bg-slate-800'}`}>
                <CIcon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              </div>
              <p className={`font-bold text-sm leading-tight ${isActive ? '' : 'text-slate-700 dark:text-slate-300'}`}>
                {c.name}
              </p>
              <p className="text-xs text-slate-400 mt-1">{c.topics.length} topics</p>
            </motion.button>
          );
        })}
      </div>

      {/* Main Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Topic List */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cat.iconBg}`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-bold text-lg">{cat.name}</h2>
          </div>

          {cat.topics.map((topic, i) => {
            const TIcon = topic.icon;
            const isActive = selectedTopic?.name === topic.name;
            return (
              <motion.div
                key={topic.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ x: 4 }}
                onClick={() => setSelectedTopic(topic)}
                className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer border transition-all ${
                  isActive
                    ? `${cat.lightBg} ${cat.border} shadow-sm`
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? cat.iconBg : 'bg-slate-100 dark:bg-slate-800'}`}>
                  <TIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${isActive ? '' : 'text-slate-800 dark:text-slate-200'}`}>
                    {topic.name}
                  </p>
                  <p className="text-xs text-slate-400">{topic.questions} questions</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_BADGE[topic.difficulty]}`}>
                    {topic.difficulty}
                  </span>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-slate-600' : 'text-slate-300'}`} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div className="md:col-span-2">
          {selectedTopic ? (
            <motion.div
              key={selectedTopic.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm h-full"
            >
              {/* Topic Header */}
              <div className={`rounded-2xl p-5 mb-6 bg-gradient-to-r ${cat.gradient}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm font-medium mb-1">{cat.name}</p>
                    <h2 className="text-white text-2xl font-bold">{selectedTopic.name}</h2>
                  </div>
                  <div className="bg-white/20 rounded-xl p-3">
                    <selectedTopic.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {selectedTopic.questions} Questions
                  </span>
                  <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {selectedTopic.difficulty} Level
                  </span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Total Qs', value: selectedTopic.questions, icon: Hash },
                  { label: 'Difficulty', value: selectedTopic.difficulty, icon: Target },
                  { label: 'Category', value: cat.name.split(' ')[0], icon: Icon },
                ].map((stat) => (
                  <div key={stat.label} className={`${cat.lightBg} ${cat.border} border rounded-2xl p-4 text-center`}>
                    <stat.icon className={`w-5 h-5 mx-auto mb-2 text-${cat.color}-500`} />
                    <p className="font-bold text-lg">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 py-3 rounded-2xl font-bold text-white bg-gradient-to-r ${cat.gradient} shadow-lg transition-shadow hover:shadow-xl`}
                >
                  Start Practice
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-2xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  View Theory
                </motion.button>
              </div>
            </motion.div>
          ) : (
            /* Empty state */
            <div className={`${cat.lightBg} ${cat.border} border rounded-3xl p-10 flex flex-col items-center justify-center h-full text-center min-h-[400px]`}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br ${cat.gradient}`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">{cat.description}</p>
              <p className="mt-4 text-sm font-medium text-slate-400">← Select a topic to begin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
