import { openDb } from './db.js';

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    const db = await openDb();
    
    // Test creating the users table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        email TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL
      )
    `);
    console.log('✅ Users table created/verified successfully');

    // Test inserting a test user
    const testUser = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'hashedpassword123'
    };

    try {
      await db.run(
        'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
        [testUser.email, testUser.username, testUser.password]
      );
      console.log('✅ Test user inserted successfully');
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        console.log('ℹ️ Test user already exists (this is fine)');
      } else {
        throw error;
      }
    }

    // Test querying users
    const users = await db.all('SELECT email, username FROM users');
    console.log('✅ Successfully queried users table');
    console.log('Current users in database:', users);

    console.log('\n🎉 Database tests completed successfully!');
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    process.exit(0);
  }
}

testDatabase(); 