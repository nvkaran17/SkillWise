import React, { useState, useRef } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import './FileReader.css';

function FileReader() {
  const { user, loading } = useAuth();
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'uploading' | 'ready' | 'asking'
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  if (loading) return (
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
        <p>Please log in to use the document analysis feature.</p>
      </div>
    </div>
  );

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAnswer('');
      setStatus('idle');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf' || 
          droppedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          droppedFile.type === 'text/plain') {
        setFile(droppedFile);
        setAnswer('');
        setStatus('idle');
      } else {
        alert('Please upload a PDF, DOCX, or TXT file.');
      }
    }
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const uploadFile = async () => {
    if (!file) return alert('Please select a file first.');

    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Override default headers for file upload
      const response = await api.post('/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload response:', response.data);
      setStatus('ready');
      alert('File uploaded and processed successfully.');
    } catch (err) {
      console.error('Upload error:', err.response?.data?.error || err.message);
      alert(err.response?.data?.error || 'Failed to upload/process file.');
      setStatus('idle');
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) return alert('Enter a question first.');

    setStatus('asking');
    setAnswer('');

    try {
      const res = await api.post('/file/ask', {
        question
      });
      setAnswer(res.data.answer || 'No answer found.');
    } catch (err) {
      console.error('Ask error:', err);
      setAnswer('Failed to get an answer.');
    } finally {
      setStatus('ready');
    }
  };

  return (
    <div className="file-reader-container">
      <div className="file-reader-header">
        <div className="header-content">
          <div className="header-icon">📄</div>
          <div className="header-text">
            <h1>Document Analysis</h1>
            <p>Upload documents and ask AI-powered questions</p>
          </div>
        </div>
      </div>

      <div className="file-reader-content">
        <div className="upload-section">
          <div 
            className={`file-drop-zone ${dragActive ? 'active' : ''} ${file ? 'has-file' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            
            {!file ? (
              <div className="drop-zone-content">
                <div className="upload-icon">📁</div>
                <h3>Drop your document here</h3>
                <p>Or click to browse files</p>
                <div className="supported-formats">
                  <span className="format-badge">PDF</span>
                  <span className="format-badge">DOCX</span>
                </div>
              </div>
            ) : (
              <div className="file-selected">
                <div className="file-icon">📄</div>
                <div className="file-info">
                  <h4>{file.name}</h4>
                  <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button 
                  className="remove-file"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setStatus('idle');
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {file && status === 'idle' && (
            <button
              className="btn btn-primary upload-btn"
              onClick={uploadFile}
              disabled={status === 'uploading'}
            >
              {status === 'uploading' ? '⏳ Processing...' : '🚀 Upload & Process'}
            </button>
          )}
        </div>

        {status === 'ready' && (
          <div className="question-section">
            <h3>💬 Ask a Question</h3>
            <div className="question-input-wrapper">
              <textarea
                className="question-input"
                rows="4"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What would you like to know about this document?"
              />
              <button
                className="btn btn-secondary ask-btn"
                onClick={askQuestion}
                disabled={status === 'asking' || !question.trim()}
              >
                {status === 'asking' ? '🤔 Thinking...' : '🔍 Ask Question'}
              </button>
            </div>
          </div>
        )}

        {answer && (
          <div className="answer-section">
            <div className="answer-header">
              <h3>💡 AI Response</h3>
              <div className="ai-badge">AI Generated</div>
            </div>
            <div className="answer-content">
              <p>{answer}</p>
            </div>
            <div className="answer-actions">
              <button 
                className="btn btn-outline-secondary"
                onClick={() => {
                  setQuestion('');
                  setAnswer('');
                }}
              >
                📝 Ask Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileReader;
