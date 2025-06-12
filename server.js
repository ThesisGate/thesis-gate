import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import { OpenAI } from 'openai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Environment variables (with defaults for demo)
const PORT = process.env.PORT || 3001;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'your_openai_api_key_here';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Too many requests, please try again later.'
});
app.use('/api/', limiter);

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'ThesisGate Backend'
  });
});

// Upload and analyze PDF (simplified version)
app.post('/api/upload-thesis', upload.single('thesis'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    console.log('Processing PDF upload:', req.file.originalname);

    // For now, return a mock response to test the connection
    const response = {
      success: true,
      filename: req.file.originalname,
      fileSize: req.file.size,
      textLength: 1000,
      chunksAnalyzed: 1,
      totalChunks: 1,
      analysis: {
        summary: "This is a test response. PDF processing is working, but actual text extraction is temporarily disabled for debugging.",
        detailedAnalysis: ["Test analysis - server is functioning correctly"],
        statistics: {
          wordCount: 150,
          characterCount: 1000,
          pageCount: 5,
          analysisDate: new Date().toISOString()
        }
      },
      recommendations: [
        "Test recommendation: Backend server is now responding properly",
        "Next step: Enable full PDF text extraction"
      ]
    };

    console.log('Test analysis completed successfully');
    res.json(response);

  } catch (error) {
    console.error('Error processing thesis:', error);
    res.status(500).json({ 
      error: 'Failed to process thesis. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ error: error.message });
  }
  
  if (error.message === 'Only PDF files are allowed') {
    return res.status(400).json({ error: 'Only PDF files are allowed' });
  }
  
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, async () => {
  // Ensure uploads directory exists
  const uploadsDir = path.join(__dirname, 'uploads');
  try {
    await fs.access(uploadsDir);
  } catch {
    await fs.mkdir(uploadsDir, { recursive: true });
    console.log('📁 Created uploads directory');
  }

  console.log(`🚀 ThesisGate Backend running on port ${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 CORS enabled for: ${FRONTEND_URL}`);
  
  if (OPENAI_API_KEY === 'your_openai_api_key_here') {
    console.log('⚠️  Warning: Please set your OpenAI API key in environment variables');
  }
});

export default app; 