// Example configuration file
// Copy this to config.js and fill in your actual values

export const config = {
  // OpenAI Configuration
  OPENAI_API_KEY: 'your_openai_api_key_here', // Get from https://platform.openai.com/api-keys
  
  // Server Configuration
  PORT: 3001,
  NODE_ENV: 'development',
  
  // CORS Configuration
  FRONTEND_URL: 'http://localhost:5173',
  
  // File Upload Configuration
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  UPLOAD_DIR: 'uploads',
  
  // OpenAI Configuration
  OPENAI_MODEL: 'gpt-4',
  MAX_TOKENS: 1500,
  TEMPERATURE: 0.3,
  
  // Analysis Configuration
  MAX_CHUNKS_PER_REQUEST: 3, // Limit for demo to control API costs
  CHUNK_SIZE: 3000 // Characters per chunk
};

// Instructions:
// 1. Sign up for OpenAI API at https://platform.openai.com/
// 2. Create an API key and replace 'your_openai_api_key_here' with your actual key
// 3. Make sure you have billing set up in your OpenAI account
// 4. Copy this file to config.js (config.js should be in .gitignore)
// 5. Alternatively, use environment variables by creating a .env file 