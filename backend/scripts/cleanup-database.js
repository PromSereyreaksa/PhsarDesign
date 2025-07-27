import { sequelize } from '../config/database.js';
import { Users, Artist, Clients, Projects, Applications, Portfolio, Notification, Reviews } from '../models/index.js';

async function cleanupDatabase() {
  try {
    console.log('Starting database cleanup...');

    // Delete all applications
    await Applications.destroy({ where: {} });
    console.log('✓ Deleted all applications');

    // Delete all notifications
    await Notification.destroy({ where: {} });
    console.log('✓ Deleted all notifications');

    // Delete all reviews
    await Reviews.destroy({ where: {} });
    console.log('✓ Deleted all reviews');

    // Delete all portfolio items
    await Portfolio.destroy({ where: {} });
    console.log('✓ Deleted all portfolio items');

    // Delete all projects except the first one
    const projects = await Projects.findAll({ limit: 1 });
    if (projects.length > 0) {
      await Projects.destroy({ 
        where: { 
          projectId: { [sequelize.Sequelize.Op.ne]: projects[0].projectId } 
        } 
      });
      console.log('✓ Deleted all projects except one test project');
    } else {
      await Projects.destroy({ where: {} });
      console.log('✓ Deleted all projects');
    }

    // Delete all artists except user1 (userId: 1)
    await Artist.destroy({ 
      where: { 
        userId: { [sequelize.Sequelize.Op.ne]: 1 } 
      } 
    });
    console.log('✓ Deleted all artists except user1');

    // Delete all clients except user51 (keep one client for testing)
    await Clients.destroy({ 
      where: { 
        userId: { [sequelize.Sequelize.Op.ne]: 51 } 
      } 
    });
    console.log('✓ Deleted all clients except user51');

    // Delete all users except user1 (artist) and user51 (client)
    await Users.destroy({ 
      where: { 
        userId: { [sequelize.Sequelize.Op.notIn]: [1, 51] } 
      } 
    });
    console.log('✓ Deleted all users except user1 and user51');

    console.log('\n✅ Database cleanup completed successfully!');
    console.log('Remaining data:');
    console.log('- 1 artist user (user1@example.com)');
    console.log('- 1 client user (user51@example.com)');
    console.log('- 1 test project (if existed)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

cleanupDatabase();
