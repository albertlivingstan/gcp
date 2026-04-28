import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Brain, Infinity as InfinityIcon, Lock, Network, MessageSquare, ArrowRight, BookOpen } from 'lucide-react';
import { subjects } from '../data/mockData';

const iconMap = {
  Cpu: <Cpu className="w-8 h-8" />,
  Brain: <Brain className="w-8 h-8" />,
  Infinity: <InfinityIcon className="w-8 h-8" />,
  Lock: <Lock className="w-8 h-8" />,
  Network: <Network className="w-8 h-8" />,
  MessageSquare: <MessageSquare className="w-8 h-8" />
};

export default function Home() {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <section className="text-center space-y-4 py-12">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
          Master Your Engineering Subjects
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Access high-quality study materials, collaborate with peers, and get AI-powered assistance for all your core engineering subjects.
        </p>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Link 
              key={subject.id} 
              to={`/subject/${subject.id}`}
              className="group relative block bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${subject.color}`}></div>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl text-white ${subject.color} shadow-lg`}>
                  {iconMap[subject.icon]}
                </div>
                <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {subject.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">
                {subject.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Interactive Labs Section Added Here */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white text-center">Interactive Virtual Labs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <a href="/24CS2019_DevOps_Lab.html" className="group relative block bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden border-l-4 border-l-blue-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl text-white bg-blue-500 shadow-lg">
                <Network className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">DevOps Lab Pro</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Interactive sandbox for Git, Docker, Python, CI/CD, and Kubernetes experiments.
            </p>
          </a>
          
          <a href="/gcp_lab_revision_site.html" className="group relative block bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden border-l-4 border-l-green-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl text-white bg-green-500 shadow-lg">
                <InfinityIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-green-500 transition-colors">GCP Lab Revision</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Comprehensive revision site for Google Cloud Platform experiments and commands.
            </p>
          </a>
        </div>
      </section>

      <section className="bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl p-8 md:p-12 text-center mt-16 border border-indigo-100 dark:border-indigo-800/30">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Why StudyHub?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg">Integrated Viewer</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Read PPTs directly in the browser without downloading files.</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg">AI Assistant</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Get context-aware help from Claude, specifically tuned for your subject.</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg">Collaborative Notes</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Share your notes and learn from top notes approved by admins.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
