import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
// import pdfParse from 'pdf-parse'; // disabled
import { OpenAI } from 'openai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { openDb } from './db.js';

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

let userCache = new Map(); // In-memory hashmap for quick lookup

async function initDb() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      password TEXT NOT NULL
    )
  `);
  // Load all users into the cache
  const users = await db.all('SELECT email, username, password FROM users');
  users.forEach(user => userCache.set(user.email, user));
}

initDb();

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

// Helper function to chunk text for OpenAI
function chunkText(text, maxChunkSize = 3000) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const chunks = [];
  let currentChunk = '';
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        // If a single sentence is too long, split it
        chunks.push(sentence.slice(0, maxChunkSize));
        currentChunk = sentence.slice(maxChunkSize);
      }
    } else {
      currentChunk += sentence + '.';
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

// Helper function to analyze text with OpenAI
async function analyzeWithOpenAI(text, analysisType = 'comprehensive') {
  const prompts = {
    grammar: `Please analyze the following academic text for grammar, punctuation, and syntax errors. Provide specific corrections and explanations:\n\n${text}`,
    
    structure: `Please analyze the following academic text for structural issues, flow, coherence, and logical organization. Provide specific suggestions for improvement:\n\n${text}`,
    
    clarity: `Please analyze the following academic text for clarity, readability, and academic writing style. Suggest improvements for better communication:\n\n${text}`,
    
    comprehensive: `As an expert academic editor, please provide a comprehensive analysis of the following thesis text. Focus on:

1. Grammar, punctuation, and syntax errors
2. Academic writing style and tone
3. Clarity and readability
4. Logical flow and coherence
5. Argument strength and evidence presentation
6. Citation and referencing style (if applicable)

Please provide specific, actionable feedback with examples and suggestions for improvement:

${text}`
  };

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert academic editor and proofreader with extensive experience in academic writing, thesis review, and scholarly communication. Provide detailed, constructive feedback that helps improve the quality of academic writing."
        },
        {
          role: "user",
          content: prompts[analysisType]
        }
      ],
      max_tokens: 1500,
      temperature: 0.3
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to analyze text with AI');
  }
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'ThesisGate Backend'
  });
});

// Upload and analyze PDF
app.post('/api/upload-thesis', upload.single('thesis'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    console.log('Processing PDF upload:', req.file.originalname);

    // Save PDF temporarily for processing
    const tempFilePath = path.join(__dirname, 'uploads', `temp_${Date.now()}_${req.file.originalname}`);
    await fs.writeFile(tempFilePath, req.file.buffer);

    // Mock extractedData for testing (replace with real PDF extraction later)
    const extractedData = {
      text_pages: ["This is a mock page of extracted text for testing purposes."],
    };

    const extractedText = extractedData.text_pages.join(' ');
    const pageCount = extractedData.text_pages.length;

    if (!extractedText || extractedText.trim().length < 100) {
      return res.status(400).json({ 
        error: 'Could not extract sufficient text from PDF. Please ensure the PDF contains readable text.' 
      });
    }

    console.log(`Extracted ${extractedText.length} characters from PDF`);

    // Chunk the text for analysis
    const textChunks = chunkText(extractedText, 3000);
    console.log(`Split text into ${textChunks.length} chunks for analysis`);

    // Analyze each chunk (limit to first 3 chunks for demo to avoid API costs)
    const maxChunks = Math.min(textChunks.length, 3);
    const analysisPromises = [];

    for (let i = 0; i < maxChunks; i++) {
      analysisPromises.push(analyzeWithOpenAI(textChunks[i], 'comprehensive'));
    }

    const chunkAnalyses = await Promise.all(analysisPromises);

    // Create comprehensive summary
    const summaryPrompt = `Based on the following analysis of different sections of a thesis, provide a comprehensive summary with:

1. Overall assessment and grade (A-F)
2. Top 5 strengths
3. Top 5 areas for improvement
4. Specific action items
5. Overall recommendation

Analysis sections:
${chunkAnalyses.map((analysis, i) => `Section ${i + 1}:\n${analysis}`).join('\n\n')}`;

    const summaryResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert academic supervisor providing final thesis evaluation. Be constructive, specific, and encouraging while maintaining high academic standards."
        },
        {
          role: "user",
          content: summaryPrompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.2
    });

    // Structure the response
    const response = {
      success: true,
      filename: req.file.originalname,
      fileSize: req.file.size,
      textLength: extractedText.length,
      chunksAnalyzed: maxChunks,
      totalChunks: textChunks.length,
      analysis: {
        summary: summaryResponse.choices[0].message.content,
        detailedAnalysis: chunkAnalyses,
        statistics: {
          wordCount: extractedText.split(/\s+/).length,
          characterCount: extractedText.length,
          pageCount: pageCount,
          analysisDate: new Date().toISOString()
        }
      },
      recommendations: [
        "Review grammar and punctuation suggestions in the detailed analysis",
        "Improve clarity and flow in identified sections",
        "Strengthen arguments with additional evidence where noted",
        "Consider restructuring paragraphs as suggested",
        "Proofread final version before submission"
      ]
    };

    console.log('Analysis completed successfully');
    res.json(response);

  } catch (error) {
    console.error('Error processing thesis:', error);
    
    if (error.message.includes('OpenAI')) {
      res.status(503).json({ 
        error: 'AI analysis service temporarily unavailable. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to process thesis. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
});

// Quick analysis endpoint for testing
app.post('/api/quick-analysis', async (req, res) => {
  try {
    const { text, analysisType = 'comprehensive' } = req.body;
    
    if (!text || text.trim().length < 50) {
      return res.status(400).json({ error: 'Text too short for analysis (minimum 50 characters)' });
    }

    const analysis = await analyzeWithOpenAI(text.slice(0, 2000), analysisType); // Limit to 2000 chars for quick analysis
    
    res.json({
      success: true,
      analysis,
      textLength: text.length,
      analysisType
    });

  } catch (error) {
    console.error('Error in quick analysis:', error);
    res.status(500).json({ 
      error: 'Analysis failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }
  const db = await openDb();
  const existing = await db.get('SELECT email FROM users WHERE email = ?', email);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }
  const hashed = await bcrypt.hash(password, 12);
  await db.run('INSERT INTO users (email, username, password) VALUES (?, ?, ?)', email, username, hashed);
  userCache.set(email, { email, username, password: hashed });
  res.json({ success: true });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  let user = userCache.get(email);
  if (!user) {
    const db = await openDb();
    user = await db.get('SELECT email, username, password FROM users WHERE email = ?', email);
    if (user) userCache.set(email, user);
  }
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ success: true, username: user.username, email: user.email });
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