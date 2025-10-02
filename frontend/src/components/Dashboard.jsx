import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './dashboard.css';

function Dashboard() {
  const { user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      id: 'quiz',
      title: 'AI Quiz Master',
      description: 'Test your knowledge with adaptive AI-generated quizzes',
      icon: '🧠',
      path: '/quiz',
      color: 'primary',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 'file',
      title: 'Document Analysis',
      description: 'Upload documents and ask questions to get instant insights',
      icon: '📄',
      path: '/file',
      color: 'secondary',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      id: 'chat',
      title: 'AI Learning Mentor',
      description: 'Get personalized tutoring and explanations from your AI mentor',
      icon: '💬',
      path: '/chat',
      color: 'accent',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
  ];

  return (
    <div className={`dashboard-container ${isLoaded ? 'loaded' : ''}`}>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="welcome-badge">
            <span className="wave">👋</span>
            <span>Welcome back, {user?.email?.split('@')[0] || 'Learner'}!</span>
          </div>
          <h1 className="hero-title">
            <span className="gradient-text">SkillWise</span>
            <br />
            <span className="subtitle">Your AI Learning Companion</span>
          </h1>
          <p className="hero-description">
            Unlock your potential with AI-powered learning tools designed to adapt to your pace and style
          </p>
        </div>
        <div className="hero-visual">
          <div className="floating-elements">
            <div className="float-element element-1">🎯</div>
            <div className="float-element element-2">⚡</div>
            <div className="float-element element-3">🚀</div>
            <div className="float-element element-4">📚</div>
            <div className="float-element element-5">✨</div>
            <div className="float-element element-6">🎉</div>
            <div className="float-element element-7">💡</div>
            <div className="float-element element-8">🔥</div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="features-section">
        <h2 className="section-title" data-text="Choose Your Learning Path">Choose Your Learning Path</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <Link
              key={feature.id}
              to={feature.path}
              className={`feature-card feature-${feature.id}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`feature-icon ${feature.id}`}>
                <span>{feature.icon}</span>
              </div>
              <div className="feature-content">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-arrow">
                  <span>Get Started</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">∞</div>
            <div className="stat-label">Questions Generated</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">AI Availability</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Personalized</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
