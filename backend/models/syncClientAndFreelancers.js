import { sequelize } from "../config/database.js"; // your sequelize instance
import Freelancers from "./freelancer.model.js";
import Clients from "./client.model.js";

async function syncModels() {
  try {
    await sequelize.authenticate();
    console.log("Database connection OK.");

    // Sync models with alter:true to update tables safely
    await Freelancers.sync({ alter: true });
    await Clients.sync({ alter: true });

    console.log("Freelancers and Clients tables synced successfully!");
  } catch (error) {
    console.error("Error syncing models:", error);
  } finally {
    await sequelize.close();
  }
}

syncModels();
