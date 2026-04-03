import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePets } from '../../context/PetContext';

const ChatPage = () => {
  const { petId } = useParams();
  const { getPetById } = usePets();
  const pet = getPetById(petId);
  const messagesEndRef = useRef(null);
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'owner',
      text: `Hi! I'm interested in ${pet?.name || 'this pet'}. Is it still available?`,
      time: '10:30 AM'
    },
    {
      id: 2,
      sender: 'owner',
      text: 'Please let me know if you need any more information!',
      time: '10:32 AM'
    }
  ]);

  if (!pet) {
    return (
      <div className="h-screen bg-warm-beige flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😿</div>
          <h2 className="text-2xl font-bold text-text-dark mb-2">Pet Not Found</h2>
          <Link to="/browse" className="text-primary-orange hover:underline">
            Browse other pets
          </Link>
        </div>
      </div>
    );
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate owner response after 2 seconds
    setTimeout(() => {
      const ownerResponse = {
        id: messages.length + 2,
        sender: 'owner',
        text: 'Thank you for your message! I will get back to you soon.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, ownerResponse]);
    }, 2000);
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-screen flex flex-col bg-warm-beige">
      {/* Header */}
      <div className="bg-white shadow-soft shrink-0">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to={`/pet/${petId}`}
              className="flex items-center text-text-dark/70 hover:text-primary-orange transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            
            <div className="flex items-center space-x-3">
              <img 
                src={pet.image} 
                alt={pet.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-primary-orange"
              />
              <div>
                <h2 className="font-semibold text-text-dark">{pet.name}'s Owner</h2>
                <p className="text-xs text-green-500 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Online
                </p>
              </div>
            </div>

            <Link 
              to={`/call/${petId}`}
              className="p-2 bg-primary-orange/10 rounded-full hover:bg-primary-orange/20 transition-colors duration-300"
              title="Call instead"
            >
              <svg className="w-5 h-5 text-primary-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Pet Info Banner */}
      <div className="bg-white border-b border-light-accent/20 shrink-0">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center space-x-3">
            <img 
              src={pet.image} 
              alt={pet.name}
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-text-dark">{pet.name}</h3>
              <p className="text-sm text-text-dark/60">{pet.breed} • {pet.location}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              pet.status === 'Adoption' ? 'bg-green-100 text-green-600' :
              pet.status === 'Lost' ? 'bg-red-100 text-red-600' :
              'bg-blue-100 text-blue-600'
            }`}>
              {pet.status}
            </span>
          </div>
        </div>
      </div>

      {/* Chat Messages - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-lg mx-auto space-y-4">
          {/* Date separator */}
          <div className="text-center my-4">
            <span className="text-xs text-text-dark/40 bg-white/50 px-3 py-1 rounded-full">
              Today
            </span>
          </div>

          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  msg.sender === 'user' 
                    ? 'bg-primary-orange text-white rounded-br-md' 
                    : 'bg-white text-text-dark shadow-soft rounded-bl-md'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${
                  msg.sender === 'user' ? 'text-white/70' : 'text-text-dark/40'
                }`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-light-accent/20 p-4 shrink-0">
        <div className="max-w-lg mx-auto">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <button 
              type="button"
              className="p-2 text-text-dark/40 hover:text-primary-orange transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-light-accent/20 rounded-full px-5 py-3 text-text-dark placeholder-text-dark/40 focus:outline-none focus:ring-2 focus:ring-primary-orange/30"
            />
            
            <button 
              type="submit"
              disabled={!message.trim()}
              className={`p-3 rounded-full transition-all duration-300 ${
                message.trim() 
                  ? 'bg-primary-orange text-white hover:bg-orange-400 shadow-soft hover:shadow-md' 
                  : 'bg-light-accent/30 text-text-dark/40 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

