# 🎓 ThesisGate

**AI-Powered Thesis Analysis & Proofreading Platform**

ThesisGate is a comprehensive web application that provides intelligent analysis and feedback for academic thesis documents using advanced AI technology. Upload your PDF thesis and receive detailed, actionable feedback to improve your academic writing.

![ThesisGate Demo](https://img.shields.io/badge/Status-Active%20Development-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![React](https://img.shields.io/badge/React-18-blue)

## ✨ Features

### 🤖 AI-Powered Analysis
- **OpenAI GPT Integration**: Leverages advanced language models for comprehensive thesis analysis
- **Intelligent Feedback**: Provides structured feedback on writing quality, clarity, and academic standards
- **Multi-Section Analysis**: Breaks down feedback into Summary, Detailed Analysis, and Next Steps

### 📄 Document Processing
- **PDF Upload Support**: Seamless PDF file upload and processing
- **Text Extraction**: Advanced PDF text extraction for analysis
- **File Validation**: Secure file handling with size and type validation

### 🎨 Modern User Interface
- **Responsive Design**: Beautiful, mobile-friendly interface
- **Real-time Feedback**: Live analysis progress and results display
- **Interactive Components**: Drag-and-drop file upload, progress indicators
- **Glassmorphism Design**: Modern UI with backdrop blur effects

### 🔧 Technical Features
- **RESTful API**: Clean backend architecture with Express.js
- **CORS Support**: Cross-origin resource sharing for frontend-backend communication
- **Error Handling**: Comprehensive error handling and user feedback
- **Modular Architecture**: Scalable codebase with separation of concerns

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**
- **OpenAI API Key** (for AI analysis features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ThesisGate/thesis-gate.git
   cd thesis-gate
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Environment Setup**
   Create a `.env` file in the `server` directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   # or
   node minimal-server.js
   ```

2. **Start the frontend development server**
   ```bash
   # In the root directory
   npm run dev
   ```

3. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3001`
   - Health Check: `http://localhost:3001/api/health`

## 📁 Project Structure

```
thesis-gate/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   │   ├── Upload.jsx     # Main thesis upload and analysis page
│   │   ├── Login.jsx      # User authentication
│   │   └── Payment.jsx    # Subscription management
│   ├── App.jsx            # Main application component
│   └── index.css          # Global styles and utilities
├── server/                # Backend Express.js application
│   ├── minimal-server.js  # Lightweight server for testing
│   ├── server.js          # Full-featured server with AI integration
│   └── uploads/           # Temporary file storage (gitignored)
├── public/                # Static assets
├── package.json           # Frontend dependencies
└── README.md             # Project documentation
```

## 🔌 API Endpoints

### Health Check
```http
GET /api/health
```
Returns server status and timestamp.

### Thesis Upload & Analysis
```http
POST /api/upload-thesis
Content-Type: multipart/form-data

Body: thesis (PDF file)
```
Uploads and analyzes a thesis document, returning structured feedback.

## 🎯 Usage

1. **Upload Your Thesis**
   - Navigate to the upload page
   - Drag and drop your PDF thesis or click to browse
   - Supported formats: PDF (up to 10MB)

2. **AI Analysis**
   - The system extracts text from your PDF
   - OpenAI analyzes the content for:
     - Writing quality and clarity
     - Academic structure and flow
     - Grammar and style suggestions
     - Research methodology feedback

3. **Review Feedback**
   - **Summary**: Overall assessment of your thesis
   - **Detailed Analysis**: Specific points for improvement
   - **Next Steps**: Actionable recommendations

4. **Download Report**
   - Export your analysis results as a JSON report
   - Save feedback for future reference

## 🛠️ Development

### Frontend Development
- **Framework**: React 18 with Vite
- **Styling**: Custom CSS with utility classes
- **State Management**: React hooks (useState, useRef)
- **HTTP Client**: Fetch API

### Backend Development
- **Framework**: Express.js
- **AI Integration**: OpenAI API
- **File Processing**: Multer for file uploads
- **PDF Processing**: Multiple libraries supported (pdf-parse, pdf-extract)

### Testing the Analysis Display
The application includes a test button for debugging the analysis display:
```javascript
// Click "🧪 Test Analysis Display" to verify the UI works correctly
```

## 🔧 Configuration

### Environment Variables
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# OpenAI Configuration
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-3.5-turbo

# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOAD_DIR=./uploads
```

### Frontend Configuration
The frontend automatically connects to the backend API at `http://localhost:3001`. Update the `API_BASE_URL` in `src/pages/Upload.jsx` if needed.

## 🚨 Troubleshooting

### Common Issues

1. **"Failed to fetch" errors**
   - Ensure backend server is running on port 3001
   - Check CORS configuration
   - Verify API endpoints are accessible

2. **PDF processing errors**
   - Ensure PDF contains readable text (not just images)
   - Check file size limits (10MB max)
   - Verify PDF is not password-protected

3. **PostCSS/TailwindCSS errors**
   - Remove `postcss.config.js` and `tailwind.config.js` if present
   - The project uses custom CSS utilities instead

4. **OpenAI API errors**
   - Verify your API key is valid and has sufficient credits
   - Check rate limits and usage quotas
   - Ensure the model (gpt-3.5-turbo) is accessible

### Debug Mode
Enable debug logging by checking the browser console for detailed analysis processing information.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT API for intelligent analysis
- **React** and **Vite** for the modern frontend framework
- **Express.js** for the robust backend framework
- The open-source community for various PDF processing libraries

## 📞 Support

For support, email support@thesisgate.com or create an issue in this repository.

---

**Made with ❤️ for academic excellence**
