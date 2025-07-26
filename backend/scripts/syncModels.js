import { sequelize } from '../config/database.js';
import { 
  Users, 
  Clients, 
  Freelancers, 
  Projects, 
  Applications, 
  Reviews, 
  Messages 
} from '../models/index.js';

const syncModels = async () => {
  try {
    console.log('🔄 Starting model synchronization...');

    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync all models with alter: true to update existing tables
    // This will modify existing tables to match model definitions without dropping data
    await sequelize.sync({ alter: true });
    console.log('✅ All models synchronized successfully.');

    // Verify each model is working
    console.log('\n🔍 Verifying models...');
    
    try {
      await Users.findAll({ limit: 1 });
      console.log('✅ Users model - OK');
    } catch (error) {
      console.log('❌ Users model - Error:', error.message);
    }

    try {
      await Clients.findAll({ limit: 1 });
      console.log('✅ Clients model - OK');
    } catch (error) {
      console.log('❌ Clients model - Error:', error.message);
    }

    try {
      await Freelancers.findAll({ limit: 1 });
      console.log('✅ Freelancers model - OK');
    } catch (error) {
      console.log('❌ Freelancers model - Error:', error.message);
    }

    try {
      await Projects.findAll({ limit: 1 });
      console.log('✅ Projects model - OK');
    } catch (error) {
      console.log('❌ Projects model - Error:', error.message);
    }

    try {
      await Applications.findAll({ limit: 1 });
      console.log('✅ Applications model - OK');
    } catch (error) {
      console.log('❌ Applications model - Error:', error.message);
    }

    try {
      await Reviews.findAll({ limit: 1 });
      console.log('✅ Reviews model - OK');
    } catch (error) {
      console.log('❌ Reviews model - Error:', error.message);
    }

    try {
      await Messages.findAll({ limit: 1 });
      console.log('✅ Messages model - OK');
    } catch (error) {
      console.log('❌ Messages model - Error:', error.message);
    }

    console.log('\n📊 Model Synchronization Summary:');
    console.log('• Users: Core user authentication and profiles');
    console.log('• Clients: Client-specific profile data');
    console.log('• Freelancers: Freelancer-specific profile data');
    console.log('• Projects: Job postings and project management');
    console.log('• Applications: Freelancer applications to projects');
    console.log('• Reviews: Rating and review system');
    console.log('• Messages: User-to-user messaging system');
    console.log('\n✅ Model synchronization completed successfully!');
    console.log('\n📝 Note: Portfolio model excluded as requested');

  } catch (error) {
    console.error('❌ Error during model synchronization:', error);
    
    // Provide helpful error information
    if (error.name === 'SequelizeConnectionError') {
      console.error('🔧 Database connection failed. Please check:');
      console.error('   - Database server is running');
      console.error('   - Connection settings in .env file');
      console.error('   - Database credentials are correct');
    } else if (error.name === 'SequelizeDatabaseError') {
      console.error('🔧 Database error. This might be due to:');
      console.error('   - Missing database or tables');
      console.error('   - Permission issues');
      console.error('   - Constraint violations');
    } else {
      console.error('🔧 General error details:', error.message);
    }
  } finally {
    await sequelize.close();
    console.log('🔌 Database connection closed.');
  }
};

// Add command line options
const args = process.argv.slice(2);
if (args.includes('--force')) {
  console.log('⚠️  Force mode detected. This will DROP ALL TABLES and recreate them!');
  console.log('⚠️  ALL DATA WILL BE LOST!');
  
  // Add a delay to let user cancel if needed
  setTimeout(async () => {
    try {
      await sequelize.sync({ force: true });
      console.log('✅ All models recreated with force mode.');
    } catch (error) {
      console.error('❌ Error in force mode:', error);
    } finally {
      await sequelize.close();
    }
  }, 3000);
} else {
  // Run normal sync
  syncModels();
}

export default syncModels;