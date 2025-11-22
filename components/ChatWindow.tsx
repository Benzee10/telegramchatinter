import React, { useRef, useEffect } from 'react';
import type { Message } from '../types';
import ChatBubble from './ChatBubble';
import TypingIndicator from './TypingIndicator';

interface ChatWindowProps {
  messages: Message[];
  typingAvatar: string | null;
  showJoinAction: boolean;
  onJoinClick: () => void;
}

const JoinGroupOverlay = ({ onJoinClick }: { onJoinClick: () => void }) => {
  // Generate random profile images for the popup
  const getRandomProfileImages = () => {
    const allUrls = [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_LlmiQuoxyVY90_y9NqtZ7vuO8ZzJG0j5JlU4pWPopFLmE0TjTgZDYyI&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJV2XHAUTvnd_MjP8ni23c_Bce4lcl6ivVEaXj5WOlhytV1DsceIqcFvM&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7YclcvudcKJKkVKcmED-5H0Zvr6_DggzOmw&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8rJ9vLjbeuFgykZK-0skLIcHrGBs5Ef94Izo7VSlcjXN-YL6qLvFb3-hB&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxirzTWp5HDqGIWz2XCbhUszD0vuF_r66D-tmn_wAklIsa8rw9TUXDsvI&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-LHZZ96ZGRpPFQYFvtgqHKORTSO2ze2sf_kfLskUlsmUDiJRl130y6Xg&s=10'
    ];
    return allUrls.sort(() => Math.random() - 0.5).slice(0, 3);
  };

  const randomImages = getRandomProfileImages();

  return (
    <div className="fixed inset-0 bg-transparent flex items-end justify-center z-50 animate-slide-up">
      <div className="bg-white rounded-t-3xl shadow-xl w-full mx-4 max-w-xs mb-0 p-4 pb-6 text-center safe-area-bottom border border-gray-200">
        {/* Location Warning Message */}
        <h2 className="text-lg font-semibold text-[#3390ec] mb-3">Access Restricted</h2>
        <p className="text-gray-700 mb-6 text-sm leading-relaxed">You were removed because your location does not match. Click the join button to verify your location.</p>

        {/* Member Avatars */}
        <div className="flex justify-center items-center mb-6 -space-x-2">
          {randomImages.map((url, index) => (
            <img 
              key={index}
              src={url}
              alt="Member" 
              className="w-10 h-10 rounded-full border-2 border-[#3390ec]"
            />
          ))}
        </div>

        {/* Join Button */}
        <button
          onClick={onJoinClick}
          className="bg-[#3390ec] text-white font-semibold py-3 px-6 rounded-full text-base active:bg-[#2b7cd6] transition-colors w-full touch-manipulation"
        >
          Join The Channel
        </button>
      </div>
      <style>{`
          @keyframes slide-up { 
            from { transform: translateY(100%); } 
            to { transform: translateY(0); } 
          } 
          .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
          .safe-area-bottom { padding-bottom: max(1.5rem, env(safe-area-inset-bottom)); }
      `}</style>
    </div>
  );
};

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, typingAvatar, showJoinAction, onJoinClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typingAvatar, showJoinAction]);

  const handleClick = () => {
    window.open('https://vip-redirect.vercel.app', '_blank');
  };

  return (
    <>
      <div ref={scrollRef} className="h-full overflow-y-auto overflow-x-hidden px-3 sm:px-4 pt-4 pb-4 flex flex-col bg-gray-50 touch-pan-y" onClick={handleClick}>
        {messages.map(msg =>
          msg.type === 'system' ? (
            <div key={msg.id} className="bg-gray-200 self-center text-center text-sm text-gray-600 rounded-md px-4 py-2 my-3 shadow-sm border border-gray-300 max-w-xs">
              {msg.text}
            </div>
          ) : (
            <ChatBubble key={msg.id} message={msg} />
          )
        )}
        {typingAvatar && <TypingIndicator avatar={typingAvatar} />}
      </div>
      {showJoinAction && <JoinGroupOverlay onJoinClick={onJoinClick} />}
    </>
  );
};

export default ChatWindow;