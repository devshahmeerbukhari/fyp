import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react'; // Import icons from lucide-react

interface Message {
  text: string;
  isUser: boolean;
}

function formatMessage(text: string) {
  return text.split('\n').map((line, i) => {
    const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const formattedText = boldText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    return <p key={i} dangerouslySetInnerHTML={{ __html: formattedText }} />;
  });
}

function Chatbot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State for toggling chat visibility
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle outside clicks to close chat on mobile
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen && 
        chatWindowRef.current && 
        !chatWindowRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('button')
      ) {
        // Only close on mobile devices
        if (window.innerWidth < 640) {
          setIsOpen(false);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Adjust chat window height on resize
  useEffect(() => {
    function handleResize() {
      if (chatWindowRef.current) {
        // On mobile, make the chat take up most of the viewport
        if (window.innerWidth < 640) {
          chatWindowRef.current.style.height = '85vh';
        } else {
          chatWindowRef.current.style.height = '70vh';
        }
      }
    }

    if (isOpen) {
      handleResize();
      window.addEventListener('resize', handleResize);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setIsLoading(true);
    const userInput = input;
    setInput('');

    try {
      const response = await fetch('/api/v1/chat/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Error getting response');
      }

      setMessages(prev => [...prev, {
        text: data.data.response,
        isUser: false
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        text: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
        isUser: false
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed z-50">
      {/* Different positioning based on screen size */}
      <div className={`
        ${isOpen ? 'fixed inset-0 bg-black bg-opacity-50 z-40 sm:bg-opacity-0 sm:relative sm:inset-auto' : 'hidden'}
      `} />
      
      {/* Chat Toggle Button - Always at the bottom right when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed z-50 p-3.5 right-5 bottom-5 rounded-full shadow-lg bg-green-600 hover:bg-green-700 text-white transition-all duration-300 focus:outline-none"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          ref={chatWindowRef}
          className={`
            bg-white flex flex-col rounded-lg shadow-2xl overflow-hidden border border-gray-300 z-40
            fixed transition-all duration-300 ease-in-out
            sm:max-w-md lg:max-w-lg
            inset-0 m-4 sm:m-0 sm:right-5 sm:bottom-20 sm:left-auto sm:top-auto sm:w-96 lg:w-[28rem]
          `}
        >
          {/* Header with close button */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-4 text-center shadow-md relative z-10">
            <h2 className="text-xl sm:text-2xl font-bold tracking-wide">Travel Assistant</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-green-800 transition-colors duration-200"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 text-base sm:text-lg font-medium px-4 text-center">
                <p>Start a conversation with our travel assistant ✨</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`
                    relative p-3 sm:p-4 rounded-3xl max-w-[90%] sm:max-w-[80%] text-sm sm:text-base 
                    whitespace-pre-wrap break-words leading-relaxed transition-all
                    ${msg.isUser
                      ? 'bg-gradient-to-br from-green-600 to-green-700 text-white rounded-br-none animate-fadeInUp'
                      : 'bg-white text-gray-800 rounded-bl-none border border-green-200 shadow-md'
                    }
                  `}>
                    {formatMessage(msg.text)}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="relative p-3 sm:p-4 rounded-3xl bg-white text-gray-800 border border-green-200 shadow-md">
                  <div className="flex space-x-2">
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-400 rounded-full animate-bounce delay-150" />
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-400 rounded-full animate-bounce delay-300" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <form onSubmit={handleSubmit} className="flex items-center p-3 sm:p-4 bg-white border-t border-gray-100 shadow-inner z-10">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 sm:px-5 sm:py-3 text-sm sm:text-base rounded-full border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="ml-2 sm:ml-3 p-2 sm:px-4 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-full hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} /> {/* Fixed size for all screens */}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
