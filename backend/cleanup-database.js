import { sequelize } from './config/database.js';
import { Applications, Projects, Clients, Artist, Users, Notification } from './models/index.js';

async function cleanupDatabase() {
  try {
    console.log('Starting database cleanup...');

    // Delete all applications
    console.log('Deleting all applications...');
    await Applications.destroy({ where: {} });
    console.log('✓ All applications deleted');

    // Delete all notifications
    console.log('Deleting all notifications...');
    await Notification.destroy({ where: {} });
    console.log('✓ All notifications deleted');

    // Delete all projects
    console.log('Deleting all projects...');
    await Projects.destroy({ where: {} });
    console.log('✓ All projects deleted');

    // Keep only user1 and delete other users
    console.log('Cleaning up users...');
    const user1 = await Users.findOne({ where: { email: 'user1@example.com' } });
    if (user1) {
      console.log(`Found user1 with ID: ${user1.userId}`);
      
      // Delete all users except user1
      await Users.destroy({ 
        where: { 
          userId: { [sequelize.Sequelize.Op.ne]: user1.userId }
        } 
      });
      console.log('✓ All users except user1 deleted');
      
      // Keep only the artist profile for user1
      const artist1 = await Artist.findOne({ where: { userId: user1.userId } });
      if (artist1) {
        console.log(`Found artist profile for user1 with ID: ${artist1.artistId}`);
        
        // Delete all other artists
        await Artist.destroy({ 
          where: { 
            artistId: { [sequelize.Sequelize.Op.ne]: artist1.artistId }
          } 
        });
        console.log('✓ All artists except user1\'s artist profile deleted');
      } else {
        console.log('❌ No artist profile found for user1');
      }
      
      // Delete all client profiles
      await Clients.destroy({ where: {} });
      console.log('✓ All client profiles deleted');
      
    } else {
      console.log('❌ user1@example.com not found');
    }

    // Create one test project for user1 to work on
    console.log('Creating test project...');
    
    // First create a test client
    const testClient = await Clients.create({
      userId: user1.userId,
      name: 'Test Client',
      organization: 'Test Organization',
      description: 'A test client for testing purposes',
      avatarUrl: null,
      location: 'Remote',
      website: null,
      slug: 'test-client'
    });
    console.log(`✓ Test client created with ID: ${testClient.clientId}`);

    const testProject = await Projects.create({
      clientId: testClient.clientId,
      title: 'Test Digital Art Project',
      description: 'This is a test project for creating digital artwork. Looking for a talented artist to create stunning visuals.',
      budget: 500,
      budgetType: 'fixed',
      status: 'open',
      category: 'digital-art',
      skillsRequired: 'Digital Art, Illustration, Adobe Photoshop',
      experienceLevel: 'intermediate',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      location: 'Remote'
    });
    console.log(`✓ Test project created with ID: ${testProject.projectId}`);

    console.log('\n🎉 Database cleanup completed successfully!');
    console.log('Remaining data:');
    console.log(`- 1 user (user1@example.com)`);
    console.log(`- 1 artist profile`);
    console.log(`- 1 client profile`);
    console.log(`- 1 test project`);
    console.log(`- 0 applications`);
    console.log(`- 0 notifications`);

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

cleanupDatabase();
