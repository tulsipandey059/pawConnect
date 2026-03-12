
import React, { useState, useRef, useEffect } from 'react';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const mockResponses = [
    "Please consult a veterinarian if symptoms persist.",
    "This could be a common issue. Ensure proper hydration and monitor for 24 hours.",
    "Great question! Consider scheduling a checkup for a proper diagnosis.",
    "That sounds concerning. Isolate the pet and contact a local vet immediately.",
    "Many pets experience this seasonally. Try hypoallergenic food and see improvement.",
    "Excellent! Regular grooming and flea prevention can help prevent this.",
    "Consider environmental allergens. A vet dermatologist may be helpful."
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputMessage.trim() || isTyping) return;

    // Add user message
    const userMsg = { text: inputMessage, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      const aiMsg = { text: randomResponse, isUser: false };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      inputRef.current?.focus();
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-primary-orange to-orange-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center justify-center text-2xl shadow-lg border-4 border-white/50 backdrop-blur-sm"
        aria-label="AI Assistant"
      >
        🤖
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 z-[60] w-96 h-96 bg-white rounded-3xl shadow-2xl border border-primary-orange/20 overflow-hidden flex flex-col max-h-[500px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-orange/90 to-orange-500 px-6 py-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">PawConnect AI</h3>
                <p className="text-xs opacity-90">Pet health assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-warm-beige/30 to-white/50 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-text-dark/60">
                <div className="w-16 h-16 bg-primary-orange/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">Hi! I'm PawConnect AI</h4>
                <p className="max-w-md mx-auto">Ask me anything about pet health, symptoms, or care tips!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div 
                  key={index}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                      msg.isUser
                        ? 'bg-primary-orange text-white rounded-br-sm'
                        : 'bg-white/80 backdrop-blur-sm border border-primary-orange/20 rounded-bl-sm shadow-lg'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/80 backdrop-blur-sm border border-primary-orange/20 rounded-bl-sm rounded-2xl shadow-lg p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary-orange/50 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary-orange/50 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-primary-orange/50 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-primary-orange/20 bg-white/50">
            <div className="flex space-x-3">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about pet health..."
                className="flex-1 px-4 py-3 rounded-2xl border-2 border-primary-orange/20 focus:border-primary-orange focus:outline-none focus:ring-2 focus:ring-primary-orange/20 transition-all duration-300 bg-white/50 backdrop-blur-sm placeholder-text-dark/50 text-text-dark"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={!inputMessage.trim() || isTyping}
                className="w-12 h-12 bg-primary-orange hover:bg-orange-400 disabled:bg-primary-orange/50 disabled:cursor-not-allowed text-white rounded-2xl flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 shadow-soft disabled:shadow-none flex-shrink-0"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-2-9-9 2 2 9z" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-text-dark/50 mt-2 text-center">Powered by PawConnect AI</p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;

