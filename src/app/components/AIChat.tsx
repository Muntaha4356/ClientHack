import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { Card } from './Card';
import apiClient from '../../utils/apiClient';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm CashMate AI, your intelligent financial advisor. I have access to your financial data and can help you with budgeting, savings goals, expense analysis, and personalized financial advice. What would you like to know about your finances?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch chat history when component opens
  useEffect(() => {
    if (isOpen && messages.length === 1) {
      fetchChatHistory();
    }
  }, [isOpen]);

  const fetchChatHistory = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/chat/history');
      
      if (response.data.success && response.data.data.length > 0) {
        const chatMessages = response.data.data.map((msg: any) => ({
          id: msg._id,
          text: msg.message,
          sender: msg.role === 'user' ? 'user' : 'ai',
          timestamp: new Date(msg.createdAt),
        }));
        
        // Set conversation ID from the most recent message
        if (response.data.data.length > 0) {
          setConversationId(response.data.data[0].conversation_id);
        }
        
        setMessages(chatMessages);
      }
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await apiClient.post('/chat/message', {
        message: input,
        conversationId: conversationId,
      });

      if (response.data.success && response.data.data) {
        // Set conversation ID if this is the first message
        if (!conversationId) {
          setConversationId(response.data.data.conversationId);
        }

        if (response.data.data.bot_response && response.data.data.bot_response.message) {
          const aiMessage: Message = {
            id: response.data.data.bot_response._id || Date.now().toString(),
            text: response.data.data.bot_response.message,
            sender: 'ai',
            timestamp: new Date(response.data.data.bot_response.createdAt || new Date()),
          };

          setMessages(prev => [...prev, aiMessage]);
        } else {
          console.error('Invalid bot response structure:', response.data.data.bot_response);
          const errorMessage: Message = {
            id: Date.now().toString(),
            text: "Received invalid response from server. Please try again.",
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorMessage]);
        }
      } else {
        console.error('API response not successful:', response.data);
        const errorMessage: Message = {
          id: Date.now().toString(),
          text: response.data?.message || "Failed to get a response. Please try again.",
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      let errorText = "Sorry, I encountered an error processing your request. Please try again.";
      if (error instanceof Error && error.message) {
        errorText = `Error: ${error.message}`;
      }
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: errorText,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear this chat history?')) {
      try {
        await apiClient.delete('/chat/history', {
          params: { conversationId: conversationId }
        });
        setMessages([
          {
            id: '1',
            text: "Hi! I'm CashMate AI, your intelligent financial advisor. I have access to your financial data and can help you with budgeting, savings goals, expense analysis, and personalized financial advice. What would you like to know about your finances?",
            sender: 'ai',
            timestamp: new Date()
          }
        ]);
        setConversationId(null);
      } catch (error) {
        console.error('Failed to clear chat history:', error);
      }
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 w-16 h-16 bg-primary rounded-full shadow-2xl shadow-primary/30 flex items-center justify-center hover:scale-110 transition-transform z-50"
          >
            <MessageCircle className="w-7 h-7 cursor-pointer text-white" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 right-8 w-96 h-[600px] z-50"
          >
            <Card className="h-full flex flex-col relative">
              {/* Close Button - Top Right Inside */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-125 z-50 ring-2 ring-red-300"
                aria-label="Close chat"
              >
                <X className="w-5 h-5 font-bold" strokeWidth={3} />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-border pr-10">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">CashMate AI</h3>
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Online
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {isLoading && (
                  <div className="flex justify-center items-center h-full">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    </div>
                  </div>
                )}

                {!isLoading && messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} px-4`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.sender === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-muted/50'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start px-4">
                    <div className="bg-muted/50 rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="pt-4 border-t border-border flex flex-col gap-2">
                <button
                  onClick={handleClearHistory}
                  className="text-xs text-muted-foreground hover:text-foreground px-4 py-1 text-left transition-colors"
                >
                  Clear History
                </button>
                <div className="flex gap-2 px-4 pb-4">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    disabled={isTyping}
                    className="flex-1 px-4 py-3 rounded-xl bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm disabled:opacity-50"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="px-4 py-3 bg-primary text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}