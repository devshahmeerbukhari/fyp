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

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

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
    <div className={`fixed bottom-5 right-5 z-50`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-indigo-600 text-white p-3 rounded-full shadow-md hover:bg-indigo-700"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="flex flex-col h-[70vh] max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 text-white py-4 text-center shadow-md relative z-10">
            <h2 className="text-2xl font-bold tracking-wide">Bot Assistant</h2>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 text-lg font-medium">
                <p>Start a conversation with our virtual Assistant ✨</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`relative p-4 rounded-3xl max-w-[80%] text-base whitespace-pre-wrap break-words leading-relaxed transition-all
                    ${msg.isUser
                      ? 'bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-br-none animate-fadeInUp'
                      : 'bg-white text-gray-800 rounded-bl-none border border-indigo-200 shadow-md'
                    }`}>
                    {formatMessage(msg.text)}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="relative p-4 rounded-3xl bg-white text-gray-800 border border-indigo-200 shadow-md">
                  <div className="flex space-x-2">
                    <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-150" />
                    <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-300" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <form onSubmit={handleSubmit} className="flex items-center p-4 bg-white border-t border-gray-100 shadow-inner z-10">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 px-5 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="ml-3 px-6 py-3 bg-gradient-to-r from-indigo-700 to-indigo-900 text-white font-semibold rounded-full hover:from-indigo-800 hover:to-indigo-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
