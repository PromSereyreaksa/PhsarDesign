import { sequelize } from "../config/database.js";

import Users from "./user.model.js";
import Clients from "./client.model.js";
import Freelancers from "./freelancer.model.js";
import Projects from "./project.model.js";
import Messages from "./message.model.js";
import Applications from "./applications.model.js";
import Portfolios from "./portfolio.model.js";

const models = {
  Users,
  Clients,
  Freelancers,
  Projects,
  Messages,
  Applications,
  Portfolios, 
};

// Setup associations for all models that have an associate method
Object.values(models).forEach((model) => {
  if (typeof model.associate === "function") {
    model.associate(models);
  }
});

export {
  sequelize,
  Users,
  Clients,
  Freelancers,
  Projects,
  Messages,
  Applications,
  Portfolios,
};
