import {
  sequelize,
  Users,
  Clients,
  Freelancers,
  Projects,
  Messages,
  Applications,
} from "./index.js";

async function runTests() {
  try {
    // Sync all models but don't drop tables or delete data
    await sequelize.sync();
    console.log("Database synced.");

    // Find or create freelancer user
    let userFreelancer = await Users.findOne({ where: { email: "freelancer@example.com" } });
    if (!userFreelancer) {
      userFreelancer = await Users.create({
        email: "freelancer@example.com",
        password: "password123",
        role: "freelancer",
      });
    }

    // Find or create freelancer profile
    let freelancer = await Freelancers.findOne({ where: { userId: userFreelancer.userId } });
    if (!freelancer) {
      freelancer = await Freelancers.create({
        userId: userFreelancer.userId,
        name: "Alice Freelancer",
        skills: "Node.js, React",
        availability: "Full-time",
      });
    }

    // Find or create client user
    let userClient = await Users.findOne({ where: { email: "client@example.com" } });
    if (!userClient) {
      userClient = await Users.create({
        email: "client@example.com",
        password: "password456",
        role: "client",
      });
    }

    // Find or create client profile
    let client = await Clients.findOne({ where: { userId: userClient.userId } });
    if (!client) {
      client = await Clients.create({
        userId: userClient.userId,
        name: "Bob Client",
        organization: "Client Inc.",
      });
    }

    // Now create a message from freelancer to client
    const message = await Messages.create({
      senderId: userFreelancer.userId,
      receiverId: userClient.userId,
      content: "Hi Bob, I am interested in your project! 3",
    });

    console.log("Message created:", message.toJSON());

    // Fetch messages sent by freelancer with receiver info
    const sentMessages = await Messages.findAll({
      where: { senderId: userFreelancer.userId },
      include: { model: Users, as: "receiver" },
    });

    console.log(
      "Messages sent by freelancer:",
      sentMessages.map((m) => m.toJSON())
    );
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await sequelize.close();
  }
}

runTests();
