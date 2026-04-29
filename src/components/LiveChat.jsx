import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Smile, Mic, Square, Image as ImageIcon, Trash2 } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, limit } from 'firebase/firestore';

export default function LiveChat({ userProfile, onRequestVerify }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(true); // Firebase manages connection
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Reference to the 'messages' collection
    const messagesRef = collection(db, 'messages');
    // Query: order by timestamp descending to get newest, limit to 50
    const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(50));

    // Listen for real-time updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = [];
      snapshot.forEach((doc) => {
        fetchedMessages.push({ id: doc.id, ...doc.data() });
      });
      // Reverse array so oldest is at the top, newest at the bottom
      setMessages(fetchedMessages.reverse());
      scrollToBottom();
    }, (error) => {
      console.error("Firebase Chat Error:", error);
      setIsConnected(false);
    });

    return () => unsubscribe();
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const onEmojiClick = (emojiObject) => {
    setInputValue(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleSendMessage = async (e, customData = {}) => {
    if (e) e.preventDefault();
    if (!userProfile) {
      if (onRequestVerify) onRequestVerify();
      return;
    }
    
    if (inputValue.trim() || customData.audio || customData.image) {
      try {
        await addDoc(collection(db, 'messages'), {
          text: inputValue,
          user: userProfile.name,
          audio: customData.audio || null,
          image: customData.image || null,
          timestamp: new Date().toISOString()
        });
        setInputValue('');
      } catch (error) {
        console.error("Error sending message:", error);
        alert("Failed to send message. Image/Audio might be too large (max 1MB).");
      }
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await deleteDoc(doc(db, 'messages', id));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleImageUpload = (e) => {
    if (!userProfile) {
      if (onRequestVerify) onRequestVerify();
      return;
    }
    const file = e.target.files[0];
    if (file) {
      // Firebase Firestore limits documents to 1MB. We must compress or ensure the image is small.
      if (file.size > 800000) { // ~800KB limit for safe base64
        alert("Image is too large! Please upload an image smaller than 800KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handleSendMessage(null, { image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    if (!userProfile) {
      if (onRequestVerify) onRequestVerify();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        if (audioBlob.size > 800000) {
          alert("Voice message too long! Please keep it under 30 seconds.");
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          handleSendMessage(null, { audio: reader.result });
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied", err);
      alert("Microphone access required for voice messages.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col h-[650px] bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden sticky top-24">
      <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center gap-3 shadow-md z-10">
        <MessageCircle className="w-6 h-6" />
        <div>
          <h2 className="font-bold text-lg leading-tight">Live Chat</h2>
          <p className="text-xs text-indigo-100 opacity-90">{isConnected ? 'Online (Firebase)' : 'Disconnected'}</p>
        </div>
        <div className={`w-2.5 h-2.5 rounded-full ml-auto ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-900 space-y-4 relative" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")', backgroundBlendMode: 'overlay' }}>
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm text-center px-4">
            Start the conversation! Say hi to the community.
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = userProfile && msg.user === userProfile.name;
            return (
              <div key={msg.id} className={`flex flex-col group ${isMe ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                <span className="text-[10px] font-medium text-slate-400 mb-1 px-1">{msg.user} • {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                <div className={`relative px-4 py-2.5 rounded-2xl max-w-[85%] text-sm shadow-sm transition-all ${isMe ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-sm'}`}>
                  {msg.image && (
                    <img src={msg.image} alt="chat attachment" className="max-w-full rounded-xl mb-2 object-cover max-h-48" />
                  )}
                  {msg.audio && (
                    <audio controls src={msg.audio} className="h-8 max-w-full mb-2" />
                  )}
                  {msg.text && <div className="break-words">{msg.text}</div>}
                  
                  {isMe && (
                    <button 
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full transition-all"
                      title="Unsend message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="relative bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
        {showEmojiPicker && (
          <div className="absolute bottom-full right-0 mb-2 z-50 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5">
            <EmojiPicker onEmojiClick={onEmojiClick} theme="auto" />
          </div>
        )}
        
        <form onSubmit={(e) => handleSendMessage(e)} className="p-3 flex items-center gap-2">
          <button 
            type="button" 
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-slate-400 hover:text-indigo-500 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Smile className="w-5 h-5" />
          </button>

          <label className="text-slate-400 hover:text-indigo-500 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
            <ImageIcon className="w-5 h-5" />
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} ref={fileInputRef} />
          </label>
          
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => {
              if (!userProfile && onRequestVerify) onRequestVerify();
              setShowEmojiPicker(false);
            }}
            placeholder={isRecording ? "Recording..." : (userProfile ? "Message..." : "Verify to chat...")}
            disabled={isRecording}
            className="flex-1 px-4 py-2.5 rounded-full border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
          />
          
          {inputValue.trim() ? (
            <button 
              type="submit" 
              disabled={!isConnected}
              className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white flex items-center justify-center transition-colors shrink-0 shadow-sm"
            >
              <Send className="w-4 h-4 -ml-0.5" />
            </button>
          ) : (
            isRecording ? (
              <button 
                type="button" 
                onClick={stopRecording}
                className="w-10 h-10 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors shrink-0 animate-pulse shadow-sm"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button 
                type="button" 
                onClick={startRecording}
                disabled={!isConnected}
                className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 flex items-center justify-center transition-colors shrink-0"
              >
                <Mic className="w-4 h-4" />
              </button>
            )
          )}
        </form>
      </div>
    </div>
  );
}
