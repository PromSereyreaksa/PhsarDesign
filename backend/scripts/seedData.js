import bcrypt from 'bcryptjs';
import { sequelize } from '../config/database.js';
import { Users, Clients, Freelancers, Projects, Applications, Messages } from '../models/index.js';

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
        name: 'John Client',
        email: 'john@client.com',
        password: hashedPassword,
        role: 'client'
      },
      {
        name: 'Jane Designer',
        email: 'jane@designer.com',
        password: hashedPassword,
        role: 'freelancer'
      },
      {
        name: 'Mike Artist',
        email: 'mike@artist.com',
        password: hashedPassword,
        role: 'freelancer'
      },
      {
        name: 'Sarah Marketing',
        email: 'sarah@marketing.com',
        password: hashedPassword,
        role: 'client'
      },
      {
        name: 'Alex Developer',
        email: 'alex@dev.com',
        password: hashedPassword,
        role: 'freelancer'
      }
    ]);
    console.log('👥 Created 5 users');

    // Create Clients
    const clients = await Clients.bulkCreate([
      {
        userId: users[0].userId,
        name: 'TechCorp Solutions',
        organization: 'TechCorp Solutions',
        avatarUrl: 'https://via.placeholder.com/150/0066cc/white?text=TC'
      },
      {
        userId: users[3].userId,
        name: 'Creative Marketing Co',
        organization: 'Creative Marketing Co',
        avatarUrl: 'https://via.placeholder.com/150/cc6600/white?text=CM'
      }
    ]);
    console.log('🏢 Created 2 clients');

    // Create Freelancers
    const freelancers = await Freelancers.bulkCreate([
      {
        userId: users[1].userId,
        name: 'Jane Designer',
        skills: 'UI Design, UX Research, Figma, Adobe Creative Suite, Prototyping',
        availability: 'full-time',
        portfolio_images_text: 'Portfolio: https://janedesigner.portfolio.com',
        avatarUrl: 'https://via.placeholder.com/150/9966cc/white?text=JD'
      },
      {
        userId: users[2].userId,
        name: 'Mike Artist',
        skills: 'Digital Illustration, Character Design, Concept Art, Photoshop, Procreate',
        availability: 'part-time',
        portfolio_images_text: 'Portfolio: https://mikeartist.artstation.com',
        avatarUrl: 'https://via.placeholder.com/150/cc3366/white?text=MA'
      },
      {
        userId: users[4].userId,
        name: 'Alex Developer',
        skills: 'React, Node.js, JavaScript, TypeScript, PostgreSQL, AWS',
        availability: 'full-time',
        portfolio_images_text: 'Portfolio: https://alexdev.github.io',
        avatarUrl: 'https://via.placeholder.com/150/3366cc/white?text=AD'
      }
    ]);
    console.log('💼 Created 3 freelancers');

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

    // Create Applications
    const applications = await Applications.bulkCreate([
      {
        projectId: projects[0].projectId,
        freelancerId: freelancers[0].freelancerId,
        coverLetter: 'I am excited to work on your mobile app UI design project. With my 5 years of experience in UI/UX design, I can deliver a modern and intuitive interface that meets your requirements.',
        proposedRate: 75.00,
        estimatedDuration: '3 weeks',
        status: 'pending'
      },
      {
        projectId: projects[1].projectId,
        freelancerId: freelancers[0].freelancerId,
        coverLetter: 'I would love to help create your brand identity package. My design approach focuses on creating memorable and effective brand experiences.',
        proposedRate: 70.00,
        estimatedDuration: '4 weeks',
        status: 'accepted'
      },
      {
        projectId: projects[2].projectId,
        freelancerId: freelancers[2].freelancerId,
        coverLetter: 'I have extensive experience in e-commerce development and would be perfect for this project. I can deliver a robust and scalable solution.',
        proposedRate: 85.00,
        estimatedDuration: '7 weeks',
        status: 'accepted'
      },
      {
        projectId: projects[3].projectId,
        freelancerId: freelancers[1].freelancerId,
        coverLetter: 'I specialize in social media illustrations and can create engaging visuals that will enhance your marketing campaigns.',
        proposedRate: 60.00,
        estimatedDuration: '2 weeks',
        status: 'pending'
      }
    ]);
    console.log('📝 Created 4 applications');

    // Create Messages
    const messages = await Messages.bulkCreate([
      {
        senderId: users[0].userId,
        receiverId: users[1].userId,
        subject: 'Mobile App UI Project Discussion',
        content: 'Hi Jane, I reviewed your portfolio and I\'m impressed with your work. Would you be interested in discussing the mobile app UI project?',
        isRead: true,
        sentAt: new Date('2025-01-20T10:00:00')
      },
      {
        senderId: users[1].userId,
        receiverId: users[0].userId,
        subject: 'Re: Mobile App UI Project Discussion',
        content: 'Hi John, thank you for reaching out! I would love to discuss the project with you. When would be a good time for a call?',
        isRead: false,
        sentAt: new Date('2025-01-20T14:30:00')
      },
      {
        senderId: users[3].userId,
        receiverId: users[1].userId,
        subject: 'Brand Identity Project Completion',
        content: 'Hi Jane, the brand identity package looks fantastic! We are very happy with the results. The payment has been processed.',
        isRead: true,
        sentAt: new Date('2025-01-15T16:45:00')
      }
    ]);
    console.log('💬 Created 3 messages');

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`• Users: ${users.length}`);
    console.log(`• Clients: ${clients.length}`);
    console.log(`• Freelancers: ${freelancers.length}`);
    console.log(`• Projects: ${projects.length}`);
    console.log(`• Applications: ${applications.length}`);
    console.log(`• Messages: ${messages.length}`);
    console.log('\n🔐 All users have password: password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
};

// Run the seeding function
seedDatabase();