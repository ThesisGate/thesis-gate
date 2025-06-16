import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const dbPath = path.join(__dirname, 'thesisgate.db');

export async function openDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}

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

// User operations
export async function createUser(username, email, password) {
  const db = await openDb();
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    await db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    // Add to cache
    userCache.set(email, { username, email, password: hashedPassword });
    
    return { username, email };
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      throw new Error('Email already exists');
    }
    throw error;
  }
}

export async function findUserByEmail(email) {
  // First check cache
  if (userCache.has(email)) {
    return userCache.get(email);
  }
  
  // If not in cache, check database
  const db = await openDb();
  const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
  
  if (user) {
    // Add to cache
    userCache.set(email, user);
  }
  
  return user;
}

export async function verifyPassword(user, password) {
  return bcrypt.compare(password, user.password);
}

// Initialize database
initDb();

export default {
  createUser,
  findUserByEmail,
  verifyPassword
};