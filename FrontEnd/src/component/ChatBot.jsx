import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Bot, User, ChevronsDown } from 'lucide-react';

// Main Chatbot Component
export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Effect to scroll to the bottom of the messages container when a new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Effect to add a welcoming message when the chat opens for the first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { text: "Hello! I'm your AI assistant. How can I help you today?", sender: 'bot' }
      ]);
    }
  }, [isOpen, messages]);

  // Toggles the chat window's visibility
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Handles sending a message
  const handleSendMessage = async () => {
    const trimmedInput = inputValue.trim();
    if (trimmedInput === '') return;

    // Add user's message to the chat
    setMessages(prev => [...prev, { text: trimmedInput, sender: 'user' }]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Get response from Gemini API
      const botResponse = await getBotResponse(trimmedInput);
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting. Please try again later.", sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetches a response from the Gemini API
  const getBotResponse = async (prompt) => {
    const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || process.env.VITE_GOOGLE_API_KEY;
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      return result.candidates[0].content.parts[0].text;
    } else {
      // Handle cases where the response structure is unexpected
      return "I'm not sure how to respond to that. Could you try rephrasing?";
    }
  };

  // Allows sending message with "Enter" key
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Window */}
      <div className={`fixed bottom-24 right-4 sm:right-6 md:right-8 w-full max-w-sm h-[70vh] sm:h-[60vh] flex flex-col bg-white rounded-2xl shadow-2xl transition-all duration-300 ease-in-out z-50 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-2xl shadow-md">
          <div className="flex items-center space-x-3">
            <Bot className="w-7 h-7" />
            <h3 className="text-lg font-semibold">AI Assistant</h3>
          </div>
          <button onClick={toggleChat} className="p-1 rounded-full hover:bg-white/20 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && <Bot className="w-6 h-6 text-blue-500 flex-shrink-0" />}
                <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
                {msg.sender === 'user' && <User className="w-6 h-6 text-gray-400 flex-shrink-0" />}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-end gap-2 justify-start">
                <Bot className="w-6 h-6 text-blue-500 flex-shrink-0" />
                <div className="px-4 py-2 rounded-2xl bg-gray-200 rounded-bl-none">
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{animationDelay: '0s'}}></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || inputValue.trim() === ''}
              className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-110"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-4 sm:right-6 md:right-8 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-xl flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-110 z-40"
      >
        {isOpen ? <ChevronsDown className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
      </button>
    </>
  );
};
