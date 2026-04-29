import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, MessageCircle } from 'lucide-react';

const SOCKET_SERVER_URL = 'http://localhost:5001';

export default function LiveChat({ userProfile, onRequestVerify }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SOCKET_SERVER_URL);

    socketRef.current.on('connect', () => {
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen for initial chat history
    socketRef.current.on('chat history', (history) => {
      setMessages(history);
      scrollToBottom();
    });

    // Listen for incoming new messages
    socketRef.current.on('chat message', (msg) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userProfile) {
      if (onRequestVerify) onRequestVerify();
      return;
    }
    
    if (inputValue.trim() && socketRef.current) {
      socketRef.current.emit('chat message', {
        text: inputValue,
        user: userProfile.name
      });
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden sticky top-24">
      <div className="p-4 bg-indigo-600 text-white flex items-center gap-2 shadow-md">
        <MessageCircle className="w-5 h-5" />
        <h2 className="font-bold text-lg">Live Community Chat</h2>
        <div className={`w-2.5 h-2.5 rounded-full ml-auto ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} title={isConnected ? "Connected" : "Disconnected"}></div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm text-center px-4">
            No messages yet. Be the first to start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = userProfile && msg.user === userProfile.name;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                <span className="text-xs text-slate-500 dark:text-slate-400 mb-1 px-1">{msg.user}</span>
                <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${isMe ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-600 rounded-bl-sm shadow-sm'}`}>
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex gap-2">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => !userProfile && onRequestVerify && onRequestVerify()}
          placeholder={userProfile ? "Type a message..." : "Verify to chat..."}
          className="flex-1 px-4 py-2.5 rounded-full border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
        />
        <button 
          type="submit" 
          disabled={!isConnected}
          className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white flex items-center justify-center transition-colors shrink-0 shadow-sm"
        >
          <Send className="w-4 h-4 -ml-0.5" />
        </button>
      </form>
    </div>
  );
}
