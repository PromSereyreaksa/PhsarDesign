#!/usr/bin/env node

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// Import and run the seeding script
import resyncAndSeed from './resyncAndSeed.js';

console.log('🌱 Starting ArtLink Database Resync & Seed Process...');
console.log('⚠️  WARNING: This will DROP ALL EXISTING DATA and recreate tables!');
console.log('');

// Add a small delay to let user read the warning
await new Promise(resolve => setTimeout(resolve, 2000));

try {
  await resyncAndSeed();
  console.log('');
  console.log('✨ Database successfully resynced and seeded!');
  console.log('🎯 You can now test your application with the seeded data.');
  console.log('');
  console.log('📝 Default login credentials for testing:');
  console.log('   Email: user1@example.com (Artist)');
  console.log('   Email: user51@example.com (Client)');
  console.log('   Password: password123');
} catch (error) {
  console.error('');
  console.error('💥 Failed to resync and seed database:', error.message);
  console.error('');
  console.error('🔧 Troubleshooting:');
  console.error('1. Make sure PostgreSQL is running');
  console.error('2. Check your database connection in .env file');
  console.error('3. Ensure database exists and credentials are correct');
}

process.exit(0);