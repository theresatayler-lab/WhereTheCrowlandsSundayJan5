import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { aiAPI } from '../utils/api';
import { Bot, Send } from 'lucide-react';
import { toast } from 'sonner';

export const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiAPI.chat(input, sessionId);
      setSessionId(response.session_id);
      const aiMessage = { role: 'assistant', content: response.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      toast.error('Failed to get AI response');
      console.error('AI chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-italiana text-4xl md:text-6xl text-primary mb-4">AI Research Assistant</h1>
          <p className="font-montserrat text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Ask questions about deities, historical figures, rituals, and sacred sites from 1910-1945
          </p>
        </motion.div>

        <GlassCard hover={false} className="min-h-[600px] flex flex-col" testId="ai-chat-card">
          <div className="flex-1 overflow-y-auto space-y-4 mb-6 max-h-[500px]" data-testid="chat-messages">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <Bot className="w-16 h-16 text-primary mb-4" />
                <p className="font-montserrat text-muted-foreground">
                  Start a conversation by asking about occult history, deities, or practices
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  data-testid={`chat-message-${idx}`}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-sm ${
                      msg.role === 'user'
                        ? 'bg-primary/20 border border-primary/30'
                        : 'bg-card/80 border border-border'
                    }`}
                  >
                    <p className="font-montserrat text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-card/80 border border-border p-4 rounded-sm">
                  <p className="font-montserrat text-sm text-muted-foreground">Thinking...</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              data-testid="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about Hecate, Gerald Gardner, rituals..."
              className="flex-1 bg-input/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 rounded-sm px-4 py-3 text-foreground font-montserrat"
            />
            <button
              onClick={handleSend}
              data-testid="chat-send-button"
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-all duration-300 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};