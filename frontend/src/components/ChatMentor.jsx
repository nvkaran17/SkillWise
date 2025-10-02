import React, { useEffect, useRef, useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import './ChatMentor.css';

export default function ChatMentor() {
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hi there! 👋 I\'m your SkillWise AI mentor. I\'m here to help you learn, answer questions, and guide you through any topic. What would you like to explore today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (!user) return <div className="text-center py-4">Please log in to use the chat.</div>;

  const send = async () => {
    if (loading || !user || sending) return;
    
    const text = input.trim();
    if (!text) return;
    
    const userMsg = { role: 'user', content: text, timestamp: new Date() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setSending(true);
    setIsTyping(true);

    try {
      const res = await api.post("/chat", { message: text });
      const assistantReply = res.data?.reply || 'No reply received.';
      
      // Simulate typing delay for better UX
      setTimeout(() => {
        setMessages((m) => [...m, { 
          role: 'assistant', 
          content: assistantReply,
          timestamp: new Date()
        }]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error("Chat API error:", error.response ? error.response.data : error.message);
      const errorMessage = error.response?.data?.error || error.message || "Failed to get reply from server.";
      
      setTimeout(() => {
        setMessages((m) => [...m, { 
          role: 'assistant', 
          content: `I apologize, but I encountered an error: ${errorMessage}. Please try again.`,
          timestamp: new Date(),
          isError: true
        }]);
        setIsTyping(false);
      }, 1000);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || !e.shiftKey)) {
      e.preventDefault();
      if (!sending) send();
    }
  };

  return (
    <div className="container my-4" style={{ maxWidth: 900 }}>
      <h3 className="mb-3">💬 Ask your AI Mentor</h3>

      <div className="card">
        <div
          className="card-body"
          style={{ height: '62vh', overflowY: 'auto', background: '#f7f7f9' }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`d-flex mb-3 ${m.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
            >
              <div
                style={{
                  maxWidth: '78%',
                  padding: '0.6rem 0.9rem',
                  borderRadius: 12,
                  background: m.role === 'user' ? '#0d6efd' : '#e9ecef',
                  color: m.role === 'user' ? 'white' : 'black',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {m.content}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        <div className="card-footer">
          <div className="input-group">
            <textarea
              className="form-control"
              placeholder="Type your question... (Shift+Enter for newline, Enter to send)"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={sending}
            />
            <button
              className="btn btn-primary"
              onClick={send}
              disabled={sending || !input.trim()}
            >
              {sending ? 'Thinking…' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
