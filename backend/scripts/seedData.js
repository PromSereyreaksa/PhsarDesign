import bcrypt from 'bcryptjs';
import { sequelize } from '../config/database.js';
import { Users, Clients, Artist, Projects, Applications, AvailabilityPost } from '../models/index.js';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await sequelize.sync({ force: true });
    console.log('📝 Database tables recreated');

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Users
    const users = await Users.bulkCreate([
      {
        email: 'john@client.com',
        password: hashedPassword,
        role: 'client'
      },
      {
        email: 'jane@designer.com',
        password: hashedPassword,
        role: 'artist'
      },
      {
        email: 'mike@artist.com',
        password: hashedPassword,
        role: 'artist'
      },
      {
        email: 'sarah@marketing.com',
        password: hashedPassword,
        role: 'client'
      },
      {
        email: 'alex@dev.com',
        password: hashedPassword,
        role: 'artist'
      }
    ], { returning: true });
    console.log('👥 Created 5 users');

    // Create Clients with manual slugs
    const client1 = await Clients.create({
      userId: users[0].userId,
      name: 'TechCorp Solutions',
      slug: 'techcorp-solutions',
      organization: 'TechCorp Solutions',
      avatarUrl: 'https://via.placeholder.com/150/0066cc/white?text=TC'
    });
    
    const client2 = await Clients.create({
      userId: users[3].userId,
      name: 'Creative Marketing Co',
      slug: 'creative-marketing-co',
      organization: 'Creative Marketing Co',
      avatarUrl: 'https://via.placeholder.com/150/cc6600/white?text=CM'
    });
    
    const clients = [client1, client2];
    console.log('🏢 Created 2 clients');

    // Create Artists with manual slugs
    const artist1 = await Artist.create({
      userId: users[1].userId,
      name: 'Jane Designer',
      slug: 'jane-designer',
      skills: 'UI Design, UX Research, Figma, Adobe Creative Suite, Prototyping',
      specialties: 'Mobile App Design, Web Design, User Experience',
      availability: 'available',
      hourlyRate: 75.00,
      avatarUrl: 'https://via.placeholder.com/150/9966cc/white?text=JD',
      portfolioUrl: 'https://janedesigner.portfolio.com',
      rating: 4.8,
      totalCommissions: 15
    });
    
    const artist2 = await Artist.create({
      userId: users[2].userId,
      name: 'Mike Artist',
      slug: 'mike-artist',
      skills: 'Digital Illustration, Character Design, Concept Art, Photoshop, Procreate',
      specialties: 'Character Design, Digital Art, Concept Art',
      availability: 'available',
      hourlyRate: 60.00,
      avatarUrl: 'https://via.placeholder.com/150/cc3366/white?text=MA',
      portfolioUrl: 'https://mikeartist.artstation.com',
      rating: 4.6,
      totalCommissions: 22
    });
    
    const artist3 = await Artist.create({
      userId: users[4].userId,
      name: 'Alex Developer',
      slug: 'alex-developer',
      skills: 'React, Node.js, JavaScript, TypeScript, PostgreSQL, AWS',
      specialties: 'Full-Stack Development, Web Applications, APIs',
      availability: 'available',
      hourlyRate: 85.00,
      avatarUrl: 'https://via.placeholder.com/150/3366cc/white?text=AD',
      portfolioUrl: 'https://alexdev.github.io',
      rating: 4.9,
      totalCommissions: 8
    });
    
    const artists = [artist1, artist2, artist3];
    console.log('🎨 Created 3 artists');

    // Create Projects
    const projects = await Projects.bulkCreate([
      {
        clientId: clients[0].clientId,
        title: 'Mobile App UI Design',
        description: 'Design a modern and intuitive user interface for our new mobile application. The app will be used for task management and productivity.',
        budget: 2500.00,
        deadline: new Date('2025-03-15'),
        status: 'open',
        category: 'UI/UX Design',
        requiredSkills: ['UI Design', 'Mobile Design', 'Figma'],
        timeEstimate: '2-3 weeks',
        priority: 'high'
      },
      {
        clientId: clients[1].clientId,
        title: 'Brand Identity Package',
        description: 'Create a complete brand identity package including logo, color palette, typography, and brand guidelines for a new startup.',
        budget: 1800.00,
        deadline: new Date('2025-02-28'),
        status: 'open',
        category: 'Branding',
        requiredSkills: ['Logo Design', 'Brand Identity', 'Adobe Illustrator'],
        timeEstimate: '3-4 weeks',
        priority: 'medium'
      },
      {
        clientId: clients[0].clientId,
        title: 'E-commerce Website Development',
        description: 'Develop a full-featured e-commerce website with payment integration, inventory management, and admin dashboard.',
        budget: 5000.00,
        deadline: new Date('2025-04-30'),
        status: 'in_progress',
        category: 'Web Development',
        requiredSkills: ['React', 'Node.js', 'E-commerce', 'Payment Integration'],
        timeEstimate: '6-8 weeks',
        priority: 'high'
      },
      {
        clientId: clients[1].clientId,
        title: 'Social Media Illustrations',
        description: 'Create a series of custom illustrations for social media marketing campaigns. Need 10 unique illustrations.',
        budget: 1200.00,
        deadline: new Date('2025-02-15'),
        status: 'open',
        category: 'Illustration',
        requiredSkills: ['Digital Illustration', 'Social Media Design', 'Adobe Creative Suite'],
        timeEstimate: '2 weeks',
        priority: 'medium'
      }
    ]);
    console.log('📋 Created 4 projects');

    // Create Availability Posts with manual slugs
    const post1 = await AvailabilityPost.create({
      artistId: artists[0].artistId,
      title: 'UI/UX Designer Available for Mobile App Projects',
      slug: 'ui-ux-designer-available-for-mobile-app-projects',
      description: 'Experienced UI/UX designer specializing in mobile applications. I create intuitive and beautiful user interfaces that enhance user experience. Currently available for new projects starting immediately.',
      category: 'design',
      availabilityType: 'immediate',
      duration: '2-4 weeks per project',
      budget: 2000,
      location: 'Remote',
      skills: 'UI Design, UX Research, Figma, Adobe Creative Suite, Prototyping, Mobile Design',
      portfolioSamples: ['https://via.placeholder.com/400x300/9966cc/white?text=UI+Design+1', 'https://via.placeholder.com/400x300/9966cc/white?text=UI+Design+2'],
      contactPreference: 'platform',
      status: 'active',
      viewCount: 45
    });
    
    const post2 = await AvailabilityPost.create({
      artistId: artists[1].artistId,
      title: 'Character Designer & Digital Artist for Hire',
      slug: 'character-designer-digital-artist-for-hire',
      description: 'Professional character designer and digital artist with expertise in game art, illustrations, and concept art. Available for both short-term and long-term projects. Passionate about bringing characters to life!',
      category: 'illustration',
      availabilityType: 'flexible',
      duration: '1-6 weeks depending on project scope',
      budget: 1500,
      location: 'Remote / Los Angeles, CA',
      skills: 'Character Design, Digital Illustration, Concept Art, Photoshop, Procreate, Game Art',
      portfolioSamples: ['https://via.placeholder.com/400x300/cc3366/white?text=Character+1', 'https://via.placeholder.com/400x300/cc3366/white?text=Character+2'],
      contactPreference: 'platform',
      status: 'active',
      viewCount: 67
    });
    
    const post3 = await AvailabilityPost.create({
      artistId: artists[2].artistId,
      title: 'Full-Stack Developer Available for Web Applications',
      slug: 'full-stack-developer-available-for-web-applications',
      description: 'Senior full-stack developer with expertise in React, Node.js, and modern web technologies. I build scalable web applications and APIs. Currently looking for challenging projects to work on.',
      category: 'web-development',
      availabilityType: 'within-week',
      duration: '4-12 weeks',
      budget: 5000,
      location: 'Remote / New York, NY',
      skills: 'React, Node.js, JavaScript, TypeScript, PostgreSQL, AWS, REST APIs, GraphQL',
      portfolioSamples: ['https://via.placeholder.com/400x300/3366cc/white?text=Web+App+1', 'https://via.placeholder.com/400x300/3366cc/white?text=Web+App+2'],
      contactPreference: 'email',
      status: 'active',
      viewCount: 89
    });
    
    const availabilityPosts = [post1, post2, post3];
    console.log('📢 Created 3 availability posts');

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`• Users: ${users.length}`);
    console.log(`• Clients: ${clients.length}`);
    console.log(`• Artists: ${artists.length}`);
    console.log(`• Projects: ${projects.length}`);
    console.log(`• Availability Posts: ${availabilityPosts.length}`);
    console.log('\n🔐 All users have password: password123');
    console.log('\n👥 Test Accounts:');
    console.log('• Client: john@client.com (TechCorp Solutions)');
    console.log('• Client: sarah@marketing.com (Creative Marketing Co)');
    console.log('• Artist: jane@designer.com (UI/UX Designer)');
    console.log('• Artist: mike@artist.com (Character Designer)');
    console.log('• Artist: alex@dev.com (Full-Stack Developer)');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
};

// Run the seeding function
seedDatabase();