import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'ThesisGate Backend (Minimal)'
  });
});

// Mock thesis upload endpoint
app.post('/api/upload-thesis', (req, res) => {
  console.log('Received thesis upload request');
  
  // Mock response for testing
  const response = {
    success: true,
    filename: 'test-file.pdf',
    fileSize: 12345,
    textLength: 1000,
    chunksAnalyzed: 1,
    totalChunks: 1,
    analysis: {
      summary: "✅ Backend connection successful! This is a test response showing that your frontend and backend are communicating properly. PDF processing functionality will be added next.",
      detailedAnalysis: [
        "🎉 Great news! The server is receiving your requests",
        "📡 Frontend-backend communication is working perfectly",
        "🔄 File upload handling is functional",
        "⚡ API endpoints are responding correctly"
      ],
      statistics: {
        wordCount: 150,
        characterCount: 1000,
        pageCount: 5,
        analysisDate: new Date().toISOString()
      }
    },
    recommendations: [
      "✅ Backend server is running successfully",
      "✅ API communication established", 
      "📋 Next: Implement PDF text extraction",
      "🔧 Next: Add OpenAI analysis integration"
    ]
  };

  console.log('Sending test response');
  res.json(response);
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Minimal ThesisGate Backend running on port ${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/api/health`);
  console.log(`✅ Ready to test frontend connection!`);
});

export default app; 