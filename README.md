# 🧠 SkillWise - AI-Powered Learning Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-green)](https://expressjs.com/)

> **Your AI Learning Companion** - Unlock your potential with AI-powered learning tools designed to adapt to your pace and style.

SkillWise is a modern, responsive web application that leverages artificial intelligence to create personalized learning experiences. Whether you're taking adaptive quizzes, analyzing documents, or getting AI-powered tutoring, SkillWise adapts to your learning style and pace.

## ✨ Features

### 🧠 AI Quiz Master
- **Adaptive Quiz Generation**: AI creates personalized quizzes based on any topic
- **Multiple Difficulty Levels**: Easy, Medium, and Hard difficulty options
- **Real-time Feedback**: Instant results with detailed explanations
- **Progress Tracking**: Monitor your learning progress over time
- **Timed Challenges**: Optional time limits for competitive learning

### 📄 Document Analysis
- **Smart File Upload**: Support for PDF and DOCX documents
- **AI-Powered Q&A**: Ask questions about uploaded documents
- **Drag & Drop Interface**: Intuitive file upload experience
- **Instant Insights**: Get immediate answers from your documents
- **Multiple Format Support**: Extensible to support more file types

### 💬 AI Learning Mentor
- **Personalized Tutoring**: One-on-one AI mentoring sessions
- **Adaptive Explanations**: Explanations tailored to your understanding level
- **Interactive Learning**: Conversational AI that responds to your needs
- **Subject Versatility**: Support for multiple academic subjects

### 🎨 Modern UI/UX
- **Responsive Design**: Seamless experience across all devices
- **Dark/Light Themes**: Comfortable viewing in any environment
- **Smooth Animations**: Engaging micro-interactions and transitions
- **Accessibility First**: Built with WCAG guidelines in mind
- **Progressive Web App**: App-like experience in your browser

## 🚀 Tech Stack

### Frontend
- **React 19.1.0** - Modern UI library with latest features
- **React Router 7.7.0** - Client-side routing
- **Vite 7.0.4** - Fast build tool and development server
- **CSS3** - Modern styling with custom properties and animations
- **Bootstrap 5.3.7** - Responsive design framework
- **Axios** - HTTP client for API communication

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express 5.1.0** - Web application framework
- **Firebase Admin SDK** - Authentication and database
- **Multer** - File upload handling
- **PDF-Parse & Mammoth** - Document processing
- **CORS** - Cross-origin resource sharing

### Authentication & Database
- **Firebase Authentication** - Secure user authentication
- **Firebase Firestore** - NoSQL document database
- **JWT Tokens** - Secure API access

### AI Integration
- **OpenAI API** - GPT-powered AI features
- **Custom AI Utils** - Tailored AI processing functions

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0.0 or higher)
- **npm** (comes with Node.js)
- **Git** (for version control)
- **Firebase Project** (for authentication and database)
- **OpenAI API Key** (for AI features)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/skillwise.git
cd skillwise
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Configuration

#### Backend Environment (`.env` in `/backend`)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
VITE_FRONTEND_ORIGIN=http://localhost:5173

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Firebase Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="your_private_key_here"
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
```

#### Frontend Environment (`.env` in `/frontend`)

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Firebase Setup

1. Create a new [Firebase project](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password
3. Create a Firestore database
4. Generate a service account key
5. Add your Firebase configuration to the environment files

### 5. OpenAI Setup

1. Sign up for an [OpenAI account](https://platform.openai.com/)
2. Generate an API key
3. Add the API key to your backend environment file

## 🚀 Running the Application

### Development Mode

Start both frontend and backend in development mode:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Start production server
cd ../backend
npm start
```

## 📁 Project Structure

```
skillwise/
├── 📁 backend/                 # Backend server
│   ├── 📁 controllers/         # Route controllers
│   ├── 📁 middleware/          # Custom middleware
│   ├── 📁 routes/              # API routes
│   ├── 📁 utils/               # Utility functions
│   ├── 📄 index.js             # Server entry point
│   └── 📄 package.json         # Backend dependencies
│
├── 📁 frontend/                # React frontend
│   ├── 📁 public/              # Static assets
│   ├── 📁 src/                 # Source code
│   │   ├── 📁 components/      # React components
│   │   ├── 📁 context/         # React context
│   │   ├── 📁 lib/             # Utility libraries
│   │   ├── 📁 utils/           # Utility functions
│   │   ├── 📄 App.jsx          # Main App component
│   │   └── 📄 main.jsx         # App entry point
│   ├── 📄 index.html           # HTML template
│   ├── 📄 package.json         # Frontend dependencies
│   └── 📄 vite.config.js       # Vite configuration
│
├── 📄 .gitignore               # Git ignore rules
├── 📄 README.md                # Project documentation
└── 📄 package.json             # Root dependencies
```

## 🔗 API Endpoints

### Authentication
All API endpoints require Firebase authentication token in the `Authorization` header.

### Quiz Endpoints
- `POST /api/quiz/generate` - Generate AI quiz
- `POST /api/quiz/submit` - Submit quiz answers

### File Processing Endpoints
- `POST /api/file/upload` - Upload document
- `POST /api/file/question` - Ask question about document

### Chat Endpoints
- `POST /api/chat/message` - Send message to AI mentor

### Health Check
- `GET /health` - Server health status

## 🎨 UI Components

### Dashboard
- **Hero Section**: Centered layout with floating animations
- **Feature Cards**: Themed cards for each learning tool
- **Stats Section**: Progress tracking and achievements

### Quiz Page
- **Cyan Theme**: Professional blue-green color scheme
- **Interactive Forms**: Smooth form interactions
- **Progress Tracking**: Real-time quiz progress
- **Results Display**: Detailed feedback and scoring

### File Reader
- **Pink Theme**: Warm and inviting color scheme
- **Drag & Drop**: Intuitive file upload
- **Q&A Interface**: Clean question-answer layout
- **File Preview**: Document information display

## 🔧 Configuration

### Vite Configuration
The frontend uses Vite for fast development and optimized builds. Configuration can be found in `frontend/vite.config.js`.

### ESLint Configuration
Code linting is configured with ESLint. Rules can be modified in `frontend/eslint.config.js`.

### Styling
- **CSS Custom Properties**: For consistent theming
- **Responsive Design**: Mobile-first approach
- **Modern CSS**: Grid, Flexbox, and advanced selectors

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `dist` folder to your hosting provider

3. Set environment variables in your hosting dashboard

### Backend Deployment (Railway/Heroku/Digital Ocean)

1. Set up environment variables on your hosting platform

2. Deploy the backend folder

3. Update CORS configuration for production URLs

### Environment Variables for Production

Ensure all environment variables are properly configured in your production environment.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write clear commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Bug Reports & Feature Requests

Please use the [GitHub Issues](https://github.com/yourusername/skillwise/issues) page to report bugs or request new features.

## 📞 Support & Contact

- **Email**: support@skillwise.app
- **GitHub**: [@yourusername](https://github.com/yourusername)
- **Documentation**: [docs.skillwise.app](https://docs.skillwise.app)

## 🙏 Acknowledgments

- **OpenAI** for providing powerful AI capabilities
- **Firebase** for authentication and database services
- **React Team** for the amazing framework
- **Vite Team** for the fast build tool
- **All Contributors** who help make SkillWise better

---

<div align="center">
  <strong>Built with ❤️ by the SkillWise Team</strong>
  <br>
  <em>Empowering learners through AI-powered education</em>
</div>