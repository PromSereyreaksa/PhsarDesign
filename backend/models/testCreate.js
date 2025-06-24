import {
  sequelize,
  Users,
  Freelancers,
} from "./index.js";

async function runTests() {
  try {
    // Sync models (creates tables if not exist)
    await sequelize.sync();

    // Create user and freelancer profile
    const userFreelancer = await Users.create({
      email: "freelancer4143@example.com",
      password: "password123",
      role: "freelancer",
    });

    const freelancer = await Freelancers.create({
      userId: userFreelancer.userId,
      name: "Alice Freelancer",
      skills: "Node.js, React",
      availability: "Full-time",
    });

    console.log("Freelancer created:", freelancer.toJSON());
  } catch (error) {
    console.error("Error during test:", error);
  } finally {
    await sequelize.close();
  }
}

runTests();
