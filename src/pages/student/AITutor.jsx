import React, { useState } from 'react';
import { Bot, Sparkles, Send, UploadCloud, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AITutor() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your AI Study Assistant. You can upload a PDF/PPT, or just ask me any question about your subjects!' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: "I'm analyzing your request. Since I am in demo mode, I can't generate a full answer right now, but soon I will extract context from your uploaded materials using Gemini API!" }]);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto h-[85vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Bot className="w-6 h-6 text-indigo-500" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Smart AI Tutor</h1>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><Sparkles className="w-3 h-3 text-amber-500" /> Powered by Gemini</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-sm font-semibold hover:border-indigo-300 transition-colors">
          <UploadCloud className="w-4 h-4 text-indigo-500" /> Upload Notes
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/50">
        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-sm' 
                : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-bl-sm text-slate-700 dark:text-slate-200'
            }`}>
              {msg.role === 'ai' && <BrainCircuit className="w-5 h-5 text-indigo-500 mb-2 opacity-50" />}
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question or request a summary..." 
            className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-slate-900 border border-transparent focus:border-indigo-200 transition-all text-sm"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
