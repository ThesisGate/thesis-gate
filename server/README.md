# ThesisGate Backend

AI-powered thesis proofreading API with OpenAI integration.

## Features

- 📄 PDF file upload and text extraction
- 🤖 AI-powered comprehensive thesis analysis using OpenAI GPT-4
- 🔍 Grammar, structure, clarity, and style analysis
- 📊 Detailed statistics and recommendations
- 🛡️ Security with rate limiting and input validation
- 🚀 Fast and scalable Express.js backend

## Quick Start

### Prerequisites

- Node.js 18+ 
- OpenAI API account with billing enabled
- PDF files for testing

### Installation

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up OpenAI API key**
   
   Option A - Environment Variables (Recommended):
   ```bash
   # Create .env file
   echo "OPENAI_API_KEY=your_actual_openai_api_key_here" > .env
   ```
   
   Option B - Configuration file:
   ```bash
   cp config.example.js config.js
   # Edit config.js with your API key
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Or production mode
   npm start
   ```

5. **Verify it's running**
   ```bash
   curl http://localhost:3001/api/health
   ```

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and timestamp.

### Upload and Analyze Thesis
```
POST /api/upload-thesis
Content-Type: multipart/form-data
```

**Parameters:**
- `thesis` (file): PDF file to analyze (max 10MB)

**Response:**
```json
{
  "success": true,
  "filename": "thesis.pdf",
  "fileSize": 1024000,
  "textLength": 50000,
  "chunksAnalyzed": 3,
  "totalChunks": 8,
  "analysis": {
    "summary": "Overall assessment with grade and recommendations...",
    "detailedAnalysis": ["Section 1 analysis...", "Section 2 analysis..."],
    "statistics": {
      "wordCount": 8500,
      "characterCount": 50000,
      "pageCount": 25,
      "analysisDate": "2024-01-15T10:30:00.000Z"
    }
  },
  "recommendations": [
    "Review grammar and punctuation suggestions...",
    "Improve clarity and flow in identified sections..."
  ]
}
```

### Quick Text Analysis
```
POST /api/quick-analysis
Content-Type: application/json
```

**Body:**
```json
{
  "text": "Your thesis text here...",
  "analysisType": "comprehensive" // or "grammar", "structure", "clarity"
}
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | - | Your OpenAI API key (required) |
| `PORT` | 3001 | Server port |
| `NODE_ENV` | development | Environment mode |
| `FRONTEND_URL` | http://localhost:5173 | Frontend URL for CORS |
| `MAX_FILE_SIZE` | 10485760 | Max upload size (10MB) |

### Analysis Configuration

- **Model**: GPT-4 (for highest quality analysis)
- **Chunk Size**: 3000 characters (optimal for context)
- **Max Chunks**: 3 per request (to control API costs)
- **Temperature**: 0.3 (for consistent, focused analysis)

## Getting OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Set up billing (required for GPT-4)
6. Copy your key and add it to your environment

**Important**: Keep your API key secure and never commit it to version control.

## Development

### Project Structure
```
server/
├── server.js          # Main Express server
├── package.json       # Dependencies and scripts
├── config.example.js  # Configuration template
├── uploads/           # Temporary file storage
└── README.md         # This file
```

### Testing

**Test health endpoint:**
```bash
curl http://localhost:3001/api/health
```

**Test file upload:**
```bash
curl -X POST \
  -F "thesis=@/path/to/your/thesis.pdf" \
  http://localhost:3001/api/upload-thesis
```

**Test quick analysis:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"text":"This is a sample academic text for analysis.","analysisType":"grammar"}' \
  http://localhost:3001/api/quick-analysis
```

### Common Issues

**"OpenAI API key not provided"**
- Ensure your API key is set in environment variables or config file
- Verify the key is correct and has billing enabled

**"File too large"**
- PDFs must be under 10MB
- Consider compressing your PDF or splitting it into sections

**"Could not extract text from PDF"**
- Ensure your PDF contains readable text (not just images)
- Try a different PDF or convert images to text first

**CORS errors**
- Check that FRONTEND_URL matches your frontend's URL
- Verify the frontend is running on the expected port

## Security Features

- **Rate Limiting**: 10 requests per 15 minutes per IP
- **File Validation**: Only PDF files accepted
- **Size Limits**: 10MB maximum file size
- **CORS Protection**: Restricted to specified origins
- **Helmet**: Security headers for Express
- **Input Sanitization**: Text length and content validation

## API Costs

The backend uses OpenAI GPT-4, which has the following approximate costs:
- Input: $0.03 per 1K tokens
- Output: $0.06 per 1K tokens

For a typical 10,000-word thesis:
- Text extraction: Free
- Analysis cost: ~$2-5 depending on analysis depth

The backend limits analysis to 3 chunks (9,000 characters) to control costs while providing comprehensive feedback.

## Production Deployment

### Environment Setup
```bash
export NODE_ENV=production
export OPENAI_API_KEY=your_production_key
export PORT=3001
export FRONTEND_URL=https://yourdomain.com
```

### Security Considerations
- Use HTTPS in production
- Set up proper logging and monitoring
- Consider implementing authentication
- Set up database for storing analysis results
- Implement file cleanup for uploaded PDFs

## License

MIT License - see LICENSE file for details. 