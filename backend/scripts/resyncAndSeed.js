import { sequelize } from '../config/database.js';
import {
  Users,
  Clients,
  Artist,
  Projects,
  JobPost,
  Applications,
  Reviews,
  AvailabilityPost,
  Portfolio,
  Analytics,
  Message,
  Notification
} from '../models/index.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Seed data generators
const generateRandomEmail = (index) => `user${index}@example.com`;
const generateRandomName = () => {
  const firstNames = ['Alex', 'Jamie', 'Taylor', 'Morgan', 'Jordan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Sage', 'Phoenix', 'River', 'Skylar', 'Rowan', 'Blake'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
};

const generateSlug = (text, index) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') + `-${index}`;
};

const generateRandomCompany = () => {
  const companies = ['TechCorp', 'Creative Solutions', 'Digital Dreams', 'ArtisanWorks', 'PixelPerfect', 'DesignHub', 'Innovation Labs', 'Startup Studios', 'MediaForge', 'BrandCraft'];
  return companies[Math.floor(Math.random() * companies.length)] + ` ${Math.floor(Math.random() * 1000)}`;
};

const categories = ['illustration', 'design', 'photography', 'writing', 'video', 'music', 'animation', 'web-development', 'other'];
const skillsList = [
  'Digital Illustration', 'Logo Design', 'Web Design', 'Character Design', 'Concept Art',
  'Photography', 'Video Editing', 'Animation', 'UI/UX Design', 'Graphic Design',
  'Creative Writing', 'Copywriting', 'Music Production', 'Sound Design', '3D Modeling',
  'Motion Graphics', 'Brand Identity', 'Print Design', 'Icon Design', 'Illustration'
];

const generateRandomSkills = () => {
  const numSkills = Math.floor(Math.random() * 5) + 2;
  const shuffled = [...skillsList].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numSkills).join(', ');
};

const generateRandomText = (minWords = 10, maxWords = 50) => {
  const words = [
    'creative', 'innovative', 'professional', 'experienced', 'talented', 'skilled', 'artistic',
    'design', 'illustration', 'photography', 'animation', 'development', 'project', 'client',
    'quality', 'deadline', 'portfolio', 'expertise', 'solution', 'vision', 'concept',
    'modern', 'unique', 'custom', 'premium', 'outstanding', 'excellent', 'amazing',
    'work', 'service', 'deliver', 'create', 'develop', 'produce', 'collaborate'
  ];
  const numWords = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  let text = '';
  for (let i = 0; i < numWords; i++) {
    text += words[Math.floor(Math.random() * words.length)] + ' ';
  }
  return text.trim() + '.';
};

const generateRandomPrice = (min = 50, max = 5000) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateRandomDate = (daysBack = 30, daysForward = 60) => {
  const now = new Date();
  const pastDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
  const futureDate = new Date(now.getTime() + (daysForward * 24 * 60 * 60 * 1000));
  return new Date(pastDate.getTime() + Math.random() * (futureDate.getTime() - pastDate.getTime()));
};

const resyncAndSeed = async () => {
  try {
    console.log('🚀 Starting database resync and seeding...');
    
    // Force sync (drops and recreates all tables)
    console.log('📊 Dropping and recreating tables...');
    await sequelize.sync({ force: true });
    console.log('✅ Tables created successfully');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Seed Users (100 records)
    console.log('👥 Seeding Users...');
    const users = [];
    for (let i = 1; i <= 100; i++) {
      const role = i <= 50 ? 'artist' : 'client';
      users.push({
        email: generateRandomEmail(i),
        password: hashedPassword,
        role: role,
        isEmailVerified: Math.random() > 0.3,
        createdAt: generateRandomDate(90, 0),
        updatedAt: generateRandomDate(30, 0)
      });
    }
    const createdUsers = await Users.bulkCreate(users, { returning: true });
    console.log(`✅ Created ${createdUsers.length} users`);

    // 2. Seed Artists (50 records - for users with role 'artist')
    console.log('🎨 Seeding Artists...');
    const artists = [];
    const artistUsers = createdUsers.filter(user => user.role === 'artist');
    for (let i = 0; i < artistUsers.length; i++) {
      const user = artistUsers[i];
      const name = generateRandomName();
      artists.push({
        userId: user.userId,
        name: name,
        slug: generateSlug(name, i + 1),
        skills: generateRandomSkills(),
        specialties: generateRandomSkills(),
        availability: ['available', 'busy', 'unavailable'][Math.floor(Math.random() * 3)],
        hourlyRate: generateRandomPrice(25, 200),
        avatarUrl: `https://picsum.photos/200/200?random=${i}`,
        portfolioUrl: `https://portfolio-${i}.example.com`,
        rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
        totalCommissions: Math.floor(Math.random() * 100),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    }
    const createdArtists = await Artist.bulkCreate(artists, { returning: true });
    console.log(`✅ Created ${createdArtists.length} artists`);

    // 3. Seed Clients (50 records - for users with role 'client')
    console.log('💼 Seeding Clients...');
    const clients = [];
    const clientUsers = createdUsers.filter(user => user.role === 'client');
    for (let i = 0; i < clientUsers.length; i++) {
      const user = clientUsers[i];
      const name = generateRandomName();
      clients.push({
        userId: user.userId,
        organization: Math.random() > 0.5 ? generateRandomCompany() : null,
        name: name,
        slug: generateSlug(name, i + 51), // Start from 51 to avoid conflicts with artists
        avatarUrl: `https://picsum.photos/200/200?random=${i + 100}`,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    }
    const createdClients = await Clients.bulkCreate(clients, { returning: true });
    console.log(`✅ Created ${createdClients.length} clients`);

    // 4. Seed Availability Posts (100 records)
    console.log('📝 Seeding Availability Posts...');
    const availabilityPosts = [];
    for (let i = 0; i < 100; i++) {
      const artist = createdArtists[Math.floor(Math.random() * createdArtists.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const title = `Professional ${category.charAt(0).toUpperCase() + category.slice(1)} Services`;
      
      availabilityPosts.push({
        artistId: artist.artistId,
        title: title,
        slug: generateSlug(title, i + 1),
        description: generateRandomText(20, 100),
        category: category,
        availabilityType: ['immediate', 'within-week', 'within-month', 'flexible'][Math.floor(Math.random() * 4)],
        duration: ['1-3 days', '1 week', '2-3 weeks', '1 month', 'Flexible'][Math.floor(Math.random() * 5)],
        budget: generateRandomPrice(100, 3000),
        location: Math.random() > 0.7 ? 'Local only' : 'Remote',
        skills: generateRandomSkills(),
        portfolioSamples: [],
        contactPreference: ['platform', 'email', 'direct'][Math.floor(Math.random() * 3)],
        status: ['active', 'paused'][Math.floor(Math.random() * 2)],
        expiresAt: generateRandomDate(0, 60),
        viewCount: Math.floor(Math.random() * 500),
        createdAt: generateRandomDate(60, 0),
        updatedAt: generateRandomDate(30, 0)
      });
    }
    const createdAvailabilityPosts = await AvailabilityPost.bulkCreate(availabilityPosts, { returning: true });
    console.log(`✅ Created ${createdAvailabilityPosts.length} availability posts`);

    // 5. Seed Job Posts (100 records)
    console.log('💼 Seeding Job Posts...');
    const jobPosts = [];
    for (let i = 0; i < 100; i++) {
      const client = createdClients[Math.floor(Math.random() * createdClients.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const title = `Need ${category.charAt(0).toUpperCase() + category.slice(1)} for Project`;
      
      jobPosts.push({
        clientId: client.clientId,
        title: title,
        slug: generateSlug(title, i + 101), // Start from 101 to avoid conflicts with availability posts
        description: generateRandomText(30, 150),
        category: category,
        budget: generateRandomPrice(200, 5000),
        budgetType: ['fixed', 'hourly', 'negotiable'][Math.floor(Math.random() * 3)],
        deadline: generateRandomDate(7, 90),
        location: Math.random() > 0.6 ? 'Remote preferred' : 'Location flexible',
        skillsRequired: generateRandomSkills(),
        experienceLevel: ['beginner', 'intermediate', 'expert', 'any'][Math.floor(Math.random() * 4)],
        attachments: [],
        status: ['open', 'closed'][Math.floor(Math.random() * 2)],
        applicationsCount: Math.floor(Math.random() * 20),
        viewCount: Math.floor(Math.random() * 200),
        expiresAt: generateRandomDate(0, 45),
        createdAt: generateRandomDate(45, 0),
        updatedAt: generateRandomDate(15, 0)
      });
    }
    const createdJobPosts = await JobPost.bulkCreate(jobPosts, { returning: true });
    console.log(`✅ Created ${createdJobPosts.length} job posts`);

    // 6. Seed Projects (100 records)
    console.log('🚀 Seeding Projects...');
    const projects = [];
    for (let i = 0; i < 100; i++) {
      const client = createdClients[Math.floor(Math.random() * createdClients.length)];
      const artist = Math.random() > 0.3 ? createdArtists[Math.floor(Math.random() * createdArtists.length)] : null;
      
      projects.push({
        clientId: client.clientId,
        artistId: artist?.artistId || null,
        title: `Creative Project ${i + 1}`,
        description: generateRandomText(30, 120),
        budget: generateRandomPrice(300, 8000),
        category: categories[Math.floor(Math.random() * categories.length)],
        status: ['open', 'in_progress', 'completed', 'cancelled'][Math.floor(Math.random() * 4)],
        paymentStatus: ['pending', 'processing', 'completed', 'failed'][Math.floor(Math.random() * 4)],
        paymentIntentId: Math.random() > 0.7 ? `pi_${uuidv4().substring(0, 20)}` : null,
        createdAt: generateRandomDate(90, 0),
        completedAt: Math.random() > 0.6 ? generateRandomDate(30, 0) : null
      });
    }
    const createdProjects = await Projects.bulkCreate(projects, { returning: true });
    console.log(`✅ Created ${createdProjects.length} projects`);

    // 7. Seed Applications (100 records)
    console.log('📋 Seeding Applications...');
    const applications = [];
    for (let i = 0; i < 100; i++) {
      const isArtistToJob = Math.random() > 0.5;
      
      if (isArtistToJob) {
        // Artist applying to job post
        const jobPost = createdJobPosts[Math.floor(Math.random() * createdJobPosts.length)];
        const artist = createdArtists[Math.floor(Math.random() * createdArtists.length)];
        
        applications.push({
          jobPostId: jobPost.jobId,
          artistId: artist.artistId,
          applicationType: 'artist_to_job',
          message: generateRandomText(20, 80),
          proposedBudget: generateRandomPrice(jobPost.budget * 0.8, jobPost.budget * 1.2),
          proposedDeadline: generateRandomDate(7, 60),
          status: ['pending', 'accepted', 'rejected'][Math.floor(Math.random() * 3)],
          createdAt: generateRandomDate(30, 0)
        });
      } else {
        // Client applying to service
        const availabilityPost = createdAvailabilityPosts[Math.floor(Math.random() * createdAvailabilityPosts.length)];
        const client = createdClients[Math.floor(Math.random() * createdClients.length)];
        
        applications.push({
          availabilityPostId: availabilityPost.postId,
          clientId: client.clientId,
          artistId: availabilityPost.artistId,
          applicationType: 'client_to_service',
          message: generateRandomText(15, 60),
          proposedBudget: generateRandomPrice(availabilityPost.budget * 0.9, availabilityPost.budget * 1.3),
          proposedDeadline: generateRandomDate(5, 45),
          status: ['pending', 'accepted', 'rejected'][Math.floor(Math.random() * 3)],
          createdAt: generateRandomDate(20, 0)
        });
      }
    }
    const createdApplications = await Applications.bulkCreate(applications, { returning: true });
    console.log(`✅ Created ${createdApplications.length} applications`);

    // 8. Seed Portfolio (100 records)
    console.log('🎨 Seeding Portfolio...');
    const portfolios = [];
    for (let i = 0; i < 100; i++) {
      const artist = createdArtists[Math.floor(Math.random() * createdArtists.length)];
      
      portfolios.push({
        artistId: artist.artistId,
        title: `Portfolio Piece ${i + 1}`,
        description: generateRandomText(10, 50),
        category: categories[Math.floor(Math.random() * categories.length)],
        imageUrl: `https://picsum.photos/800/600?random=${i + 1000}`,
        tags: skillsList.slice(0, Math.floor(Math.random() * 5) + 1),
        projectUrl: Math.random() > 0.7 ? `https://project-${i}.example.com` : null,
        completionDate: generateRandomDate(180, 0),
        likes: Math.floor(Math.random() * 100),
        views: Math.floor(Math.random() * 1000),
        featured: Math.random() > 0.8,
        isPublic: Math.random() > 0.1,
        createdAt: generateRandomDate(180, 0),
        updatedAt: generateRandomDate(60, 0)
      });
    }
    const createdPortfolios = await Portfolio.bulkCreate(portfolios, { returning: true });
    console.log(`✅ Created ${createdPortfolios.length} portfolio items`);

    // 9. Seed Reviews (100 records)
    console.log('⭐ Seeding Reviews...');
    const reviews = [];
    const reviewClientUsers = createdUsers.filter(u => u.role === 'client');
    const usedCombinations = new Set();
    
    let attempts = 0;
    while (reviews.length < 100 && attempts < 500) {
      const artist = createdArtists[Math.floor(Math.random() * createdArtists.length)];
      const clientUser = reviewClientUsers[Math.floor(Math.random() * reviewClientUsers.length)];
      const combination = `${clientUser.userId}-${artist.artistId}`;
      
      if (!usedCombinations.has(combination)) {
        usedCombinations.add(combination);
        reviews.push({
          artistId: artist.artistId,
          userId: clientUser.userId,
          rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars mostly
          reviewText: generateRandomText(15, 80),
          createdAt: generateRandomDate(60, 0),
          updatedAt: generateRandomDate(30, 0)
        });
      }
      attempts++;
    }
    
    const createdReviews = await Reviews.bulkCreate(reviews.slice(0, 100), { returning: true });
    console.log(`✅ Created ${createdReviews.length} reviews`);

    // 10. Seed Messages (100 records)
    console.log('💬 Seeding Messages...');
    const messages = [];
    for (let i = 0; i < 100; i++) {
      const sender = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const receiver = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      
      if (sender.userId !== receiver.userId) {
        messages.push({
          senderId: sender.userId,
          receiverId: receiver.userId,
          content: generateRandomText(5, 30),
          messageType: 'text',
          isRead: Math.random() > 0.4,
          projectId: Math.random() > 0.7 ? createdProjects[Math.floor(Math.random() * createdProjects.length)]?.projectId : null,
          applicationId: Math.random() > 0.8 ? createdApplications[Math.floor(Math.random() * createdApplications.length)]?.applicationId : null,
          createdAt: generateRandomDate(30, 0),
          updatedAt: generateRandomDate(15, 0)
        });
      }
    }
    const createdMessages = await Message.bulkCreate(messages, { returning: true });
    console.log(`✅ Created ${createdMessages.length} messages`);

    // 11. Seed Notifications (100 records)
    console.log('🔔 Seeding Notifications...');
    const notifications = [];
    const notificationTypes = ['application_received', 'application_accepted', 'project_completed', 'message_received', 'review_received'];
    
    for (let i = 0; i < 100; i++) {
      const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      
      notifications.push({
        userId: user.userId,
        type: notificationTypes[Math.floor(Math.random() * notificationTypes.length)],
        title: `Notification ${i + 1}`,
        message: generateRandomText(8, 25),
        isRead: Math.random() > 0.5,
        createdAt: generateRandomDate(15, 0),
        updatedAt: generateRandomDate(7, 0)
      });
    }
    const createdNotifications = await Notification.bulkCreate(notifications, { returning: true });
    console.log(`✅ Created ${createdNotifications.length} notifications`);

    // 12. Seed Analytics (100 records)
    console.log('📊 Seeding Analytics...');
    const analytics = [];
    const eventTypes = ['profile_view', 'portfolio_view', 'project_view', 'application_submitted', 'application_accepted', 'project_completed', 'message_sent', 'like_given'];
    const entityTypes = ['profile', 'portfolio', 'project', 'application', 'message'];
    
    for (let i = 0; i < 100; i++) {
      const isArtist = Math.random() > 0.5;
      const artistId = isArtist ? createdArtists[Math.floor(Math.random() * createdArtists.length)].artistId : null;
      const clientId = !isArtist ? createdClients[Math.floor(Math.random() * createdClients.length)].clientId : null;
      
      analytics.push({
        artistId: artistId,
        clientId: clientId,
        eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        entityType: entityTypes[Math.floor(Math.random() * entityTypes.length)],
        entityId: Math.floor(Math.random() * 1000).toString(),
        metadata: { source: 'web', device: 'desktop', browser: 'chrome' },
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (compatible; SeedBot/1.0)',
        date: generateRandomDate(7, 0),
        createdAt: generateRandomDate(7, 0),
        updatedAt: generateRandomDate(3, 0)
      });
    }
    const createdAnalytics = await Analytics.bulkCreate(analytics, { returning: true });
    console.log(`✅ Created ${createdAnalytics.length} analytics records`);

    console.log('🎉 Database resync and seeding completed successfully!');
    console.log(`
📊 Summary:
- Users: ${createdUsers.length}
- Artists: ${createdArtists.length}
- Clients: ${createdClients.length}
- Availability Posts: ${createdAvailabilityPosts.length}
- Job Posts: ${createdJobPosts.length}
- Projects: ${createdProjects.length}
- Applications: ${createdApplications.length}
- Portfolio Items: ${createdPortfolios.length}
- Reviews: ${createdReviews.length}
- Messages: ${createdMessages.length}
- Notifications: ${createdNotifications.length}
- Analytics: ${createdAnalytics.length}

✅ All data seeded successfully with realistic relationships!
✨ The new application system is fully populated and ready to test!
    `);

  } catch (error) {
    console.error('❌ Error during resync and seeding:', error);
    throw error;
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  resyncAndSeed()
    .then(() => {
      console.log('🚀 Seeding completed, exiting...');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export default resyncAndSeed;