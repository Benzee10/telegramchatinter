import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import { GROUP_INFO, MESSAGE_SCRIPT, WHATSAPP_BG_URL } from './constants';
import type { Message } from './types';

const ShareGate = ({ shareCount, onShareClick }: { shareCount: number, onShareClick: () => void }) => {
    const progress = (shareCount / 5) * 100;
    return (
        <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-6 text-center z-30 safe-area-inset">
            <h2 className="text-3xl sm:text-2xl font-bold text-[#3390ec] mb-6">Almost there!</h2>
            <p className="text-gray-700 mb-8 text-xl sm:text-lg leading-relaxed">Share with 5 groups on Telegram to unlock the private channel.</p>
            
            <div className="w-full max-w-sm bg-gray-200 rounded-full h-10 mb-3 overflow-hidden border border-gray-300">
                <div 
                    className="bg-[#3390ec] h-full flex items-center justify-center text-white font-bold transition-all duration-500"
                    style={{ width: `${progress}%` }}
                >
                   {shareCount > 0 && `${shareCount}/5`}
                </div>
            </div>
             <p className="text-gray-500 mb-10 text-base">Progress: {shareCount} of 5 completed.</p>

            <button
                onClick={onShareClick}
                className="w-full max-w-sm bg-[#3390ec] text-white font-bold py-5 px-6 rounded-full text-xl flex items-center justify-center gap-3 active:bg-[#2b7cd6] transition-colors touch-manipulation"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                SHARE TO CONTINUE
            </button>
            <style>{`
              .safe-area-inset { 
                padding-top: max(1.5rem, env(safe-area-inset-top)); 
                padding-bottom: max(1.5rem, env(safe-area-inset-bottom)); 
              }
            `}</style>
        </div>
    );
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingAvatar, setTypingAvatar] = useState<string | null>(null);
  const [showJoinAction, setShowJoinAction] = useState(false);
  const [showShareGate, setShowShareGate] = useState(false);
  const [shareCount, setShareCount] = useState(0);

  // Effect to show join button after 8 seconds
  useEffect(() => {
    const joinTimeout = window.setTimeout(() => {
      setShowJoinAction(true);
    }, 8000);

    return () => window.clearTimeout(joinTimeout);
  }, []);

  // Effect for simulating the chat conversation
  useEffect(() => {
    let currentTimeout: number;

    const addMessageWithDelay = (index: number) => {
      if (index >= MESSAGE_SCRIPT.length) {
        setTypingAvatar(null);
        return;
      }

      const messageData = MESSAGE_SCRIPT[index];
      const displayMessage = () => {
        setTypingAvatar(null);
        setMessages(prev => [...prev, { ...messageData, id: Date.now() + index }]);
        currentTimeout = window.setTimeout(() => addMessageWithDelay(index + 1), 1500 + Math.random() * 1000);
      };

      if (messageData.sender === 'other' && messageData.type !== 'system') {
        setTypingAvatar(messageData.avatar || null);
        currentTimeout = window.setTimeout(displayMessage, 1200 + Math.random() * 1500);
      } else {
        displayMessage();
      }
    };
    currentTimeout = window.setTimeout(() => addMessageWithDelay(0), 1000);
    return () => window.clearTimeout(currentTimeout);
  }, []);

  // Effect to redirect after 5 shares
  useEffect(() => {
      if (shareCount >= 5) {
          window.location.href = 'https://whatsapp.com/channel/0029VaR8AHz0LKZ9GuzyLs1b';
      }
  }, [shareCount]);

  const handleJoinClick = () => {
      window.open('https://whatsappad.vercel.app/', '_blank');
      setShowJoinAction(false);
      setShowShareGate(true);
  };

  const handleShareClick = () => {
    const message = encodeURIComponent(
        `You've been invited to the Matured mind group. Don't miss out: https://vibesnest.blogspot.com/p/500-active-whatsapp-groups.html`
    );
    window.open(`https://api.whatsapp.com/send?text=${message}`);
    setShareCount(prev => Math.min(prev + 1, 5));
};


  const handleAnyClick = () => {
    window.open('https://whatsappad.vercel.app/', '_blank');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100" onClick={handleAnyClick}>
      <div className="w-full h-screen sm:w-full sm:max-w-md sm:h-[95vh] sm:max-h-[900px] flex flex-col bg-white sm:shadow-2xl sm:rounded-lg overflow-hidden relative" onClick={handleAnyClick}>
        {!showShareGate && (
            <>
                <Header groupInfo={GROUP_INFO} />
                <div className="flex-grow overflow-hidden relative min-h-0">
                  <ChatWindow messages={messages} typingAvatar={typingAvatar} showJoinAction={showJoinAction} onJoinClick={handleJoinClick} />
                </div>
                <MessageInput />
            </>
        )}

        {showShareGate && <ShareGate shareCount={shareCount} onShareClick={handleShareClick} />}
      </div>
    </div>
  );
};

export default App;