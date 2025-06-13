import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openDb() {
  return open({
    filename: './users.db',
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

initDb();
