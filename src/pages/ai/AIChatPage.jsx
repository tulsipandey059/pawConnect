import React, { useState, useRef, useEffect } from 'react';
import AIAssistant from '../../components/chatbot/AIAssistant';
import '../../index.css'; // for tailwind

const AIChatPage = () => {
  const [messages, setMessages] = useState([
    { text: 'Hi! Ask me anything about pet care, diseases, or adoption! 🐾', isUser: false }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const mockResponses = [
    'Vaccinate puppies at 6-8 weeks for distemper, parvovirus, and rabies.',
    'Common symptoms of parvo include vomiting, diarrhea, lethargy. Isolate immediately and see vet!',
    "For adoption, prepare ID proof, home visit may be required. Show commitment to pet's lifelong care.",
    'Flea treatment every month. Use vet-approved spot-ons or oral meds. Regular grooming helps.',
    'Yes, many breeds are hypoallergenic like Poodle, Bichon Frise, but no breed is 100% hypoallergenic.',
    "Heatstroke signs: excessive panting, drooling, rapid heartbeat. Cool gradually with wet towels, vet ASAP.",
    'Kittens need wet food for hydration. Gradually transition to adult food at 1 year.',
    "Spay/neuter reduces cancer risk, prevents litters, improves behavior. Best at 6-12 months."
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { text: input, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-beige to-primary-orange/10 flex flex-col">
      <div className="max-w-2xl mx-auto flex-1 flex flex-col px-4 py-8 sm:p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-text-dark via-text-dark to-primary-orange/70 bg-clip-text text-transparent mb-4">
            AI Pet Assistant
          </h1>
          <p className="text-xl text-text-dark/70 max-w-lg mx-auto">
            Ask anything about pet health, care tips, adoption, or emergencies
          </p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 mb-8 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-5 py-3 rounded-2xl shadow-lg ${
                  msg.isUser
                    ? 'bg-primary-orange text-white rounded-br-sm'
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-text-dark rounded-bl-sm'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 shadow-xl">
          <div className="flex space-x-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about pet care, symptoms, adoption..."
              rows={1}
              className="flex-1 max-h-24 px-5 py-4 bg-white/50 border-2 border-light-accent rounded-2xl focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none resize-none transition-all text-lg placeholder-text-dark/50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-16 h-16 bg-primary-orange text-white rounded-3xl shadow-xl hover:shadow-2xl hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              <span className="text-2xl">➤</span>
            </button>
          </div>
          <div className="text-xs text-text-dark/50 mt-2 text-center">
            Examples: "Signs of parvo?" "Best flea treatment" "Adoption process"
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="bg-white/70 backdrop-blur-xl px-6 py-8 rounded-t-3xl shadow-2xl max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <p className="text-text-dark/70 font-medium">Quick questions:</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            'Vaccination schedule?',
            'Parvo symptoms?',
            'Flea treatment',
            'Adoption tips'
          ].map(q => (
            <button
              key={q}
              onClick={() => setInput(q)}
              className="p-4 bg-primary-orange/10 hover:bg-primary-orange/20 rounded-2xl text-left transition-all text-sm font-medium text-text-dark hover:text-primary-orange"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;

