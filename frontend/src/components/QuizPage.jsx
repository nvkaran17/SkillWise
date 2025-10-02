import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import './QuizPage.css';

function QuizPage() {
  const { user, loading: authLoading } = useAuth();
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('ez');
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizMode, setQuizMode] = useState('setup'); // 'setup' | 'taking' | 'results'
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  // Timer effect
  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0 && !submitted) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft, submitted]);

  if (authLoading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  );
  
  if (!user) return (
    <div className="auth-required">
      <div className="auth-message">
        <span className="lock-icon">🔒</span>
        <h3>Authentication Required</h3>
        <p>Please log in to take quizzes and track your progress.</p>
      </div>
    </div>
  );

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic for your quiz.');
      return;
    }
    
    try {
      setLoading(true);
      const res = await api.post('/quiz/generate', {
        topic,
        numQuestions: 10,
        difficulty,
      });

      if (!res.data.quiz) {
        throw new Error('No quiz data received');
      }

      setQuiz(res.data.quiz);
      setAnswers({});
      setSubmitted(false);
      setCurrentQuestion(0);
      setQuizMode('taking');
      setTimeLeft(20 * 60); // 20 minutes
      setQuizStarted(true);
    } catch (err) {
      console.error('Error generating quiz:', err);
      alert("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionIndex, optionIndex) => {
    if (!submitted) {
      setAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setQuizMode('results');
    setQuizStarted(false);
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return { correct, total: quiz.length, percentage: Math.round((correct / quiz.length) * 100) };
  };

  const resetQuiz = () => {
    setQuiz([]);
    setAnswers({});
    setSubmitted(false);
    setCurrentQuestion(0);
    setQuizMode('setup');
    setTimeLeft(0);
    setQuizStarted(false);
    setTopic('');
    setDifficulty('ez');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRetake = () => {
    setQuiz([]);
    setAnswers({});
    setSubmitted(false);
    setTopic('');
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1>AI Quiz Master</h1>
        <p>Test your knowledge with AI-generated quizzes</p>
      </div>

      <div className="quiz-setup">
        <div className="setup-form">
          <div className="form-group">
            <label className="form-label">📚 Enter a Topic</label>
            <input
              type="text"
              className="topic-input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Machine Learning, History, Science..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">⚡ Difficulty Level</label>
            <div className="difficulty-selector">
              <div 
                className={`difficulty-option ${difficulty === 'ez' ? 'selected' : ''}`}
                onClick={() => setDifficulty('ez')}
              >
                Easy
              </div>
              <div 
                className={`difficulty-option ${difficulty === 'mid' ? 'selected' : ''}`}
                onClick={() => setDifficulty('mid')}
              >
                Medium
              </div>
              <div 
                className={`difficulty-option ${difficulty === 'tuff' ? 'selected' : ''}`}
                onClick={() => setDifficulty('tuff')}
              >
                Hard
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerateQuiz}
            className="btn btn-primary generate-btn"
            disabled={loading || !topic}
          >
            {loading ? '🔄 Generating Quiz...' : 'Generate Quiz'}
          </button>
        </div>
      </div>

      {quiz.length > 0 && (
        <div className="quiz-taking">
          <div className="quiz-progress">
            <div className="progress-info">
              <div className="progress-item">
                <div className="progress-value">{Object.keys(answers).length}</div>
                <div className="progress-label">Answered</div>
              </div>
              <div className="progress-item">
                <div className="progress-value">{quiz.length}</div>
                <div className="progress-label">Total</div>
              </div>
              {submitted && (
                <div className="progress-item">
                  <div className="progress-value">
                    {Object.keys(answers).filter((i) => quiz[i].answer === answers[i]).length}
                  </div>
                  <div className="progress-label">Correct</div>
                </div>
              )}
            </div>
          </div>

          {quiz.map((q, i) => {
            const userAnswer = answers[i];
            const correctAnswer = q.answer;
            const isCorrect = submitted && userAnswer === correctAnswer;

            return (
              <div key={i} className="question-card">
                <div className="question-header">
                  <div className="question-number">Question {i + 1}</div>
                  <h3 className="question-text">{q.question}</h3>
                </div>

                <div className="options-grid">
                  {q.options.map((option, j) => {
                    const isSelected = answers[i] === j;
                    let optionClass = 'option-button';
                    
                    if (submitted) {
                      if (j === correctAnswer) optionClass += ' correct';
                      else if (isSelected && j !== correctAnswer) optionClass += ' incorrect';
                    } else if (isSelected) {
                      optionClass += ' selected';
                    }

                    return (
                      <button
                        key={j}
                        className={optionClass}
                        onClick={() => handleOptionSelect(i, j)}
                        disabled={submitted}
                      >
                        <strong>{optionLetters[j]}.</strong> {option}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="answer-feedback">
                    {isCorrect ? (
                      <div className="feedback correct-feedback">
                        ✅ Correct!
                      </div>
                    ) : (
                      <div className="feedback incorrect-feedback">
                        ❌ Incorrect. The correct answer is: <strong>{optionLetters[correctAnswer]}. {q.options[correctAnswer]}</strong>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <div className="quiz-navigation">
            {!submitted ? (
              <button onClick={handleSubmit} className="btn btn-secondary submit-btn">
                📝 Submit Quiz
              </button>
            ) : (
              <div className="results-section">
                <div className="final-score">
                  🎯 Final Score: {Object.keys(answers).filter((i) => quiz[i].answer === answers[i]).length} / {quiz.length}
                </div>
                <button onClick={handleRetake} className="btn btn-primary">
                  🔄 Retake Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizPage;
