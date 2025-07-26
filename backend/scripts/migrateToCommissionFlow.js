import { sequelize } from '../config/database.js';
import {
  Users,
  Clients,
  Artist,
  Projects,
  Applications,
  Reviews,
  CommissionRequest
} from '../models/index.js';

/**
 * Migration script to transform freelancer platform to commission-based art platform
 * This script will:
 * 1. Drop old tables (portfolios, messages, freelancers)
 * 2. Create new tables (artists, commission_requests)
 * 3. Update existing tables with new field names
 */

const migrateDatabase = async () => {
  try {
    console.log('🔄 Starting migration to commission flow...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Drop old tables first
    console.log('🗑️  Dropping old tables...');
    await sequelize.query('DROP TABLE IF EXISTS portfolios CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS messages CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS freelancers CASCADE;');
    console.log('✅ Old tables dropped');

    // Create new schema
    console.log('🏗️  Creating new schema...');
    
    // Force sync to recreate tables with new structure
    await sequelize.sync({ force: true });
    
    console.log('✅ New schema created successfully');

    // Update user roles from 'freelancer' to 'artist' 
    console.log('🔄 Updating user roles...');
    await sequelize.query(`
      UPDATE users 
      SET role = 'artist' 
      WHERE role = 'freelancer';
    `);
    console.log('✅ User roles updated');

    console.log('🎉 Migration completed successfully!');
    console.log('📋 Summary of changes:');
    console.log('   • Removed: portfolios, messages, freelancers tables');
    console.log('   • Added: artists, commission_requests tables');
    console.log('   • Updated: user roles, field naming consistency');
    console.log('   • New API endpoints: /api/artists, /api/commissions');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
};

// Run migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateDatabase()
    .then(() => {
      console.log('✅ Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration script failed:', error);
      process.exit(1);
    });
}

export default migrateDatabase;