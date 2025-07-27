import { sequelize } from "../config/database.js";

import Users from "./user.model.js";
import Clients from "./client.model.js";
import Artist from "./artist.model.js";
import Projects from "./project.model.js";
import JobPost from "./jobPost.model.js";
import Applications from "./applications.model.js";
import Reviews from "./review.model.js";
import CommissionRequest from "./commissionRequest.model.js";
import AvailabilityPost from "./availabilityPost.model.js";
import Portfolio from "./portfolio.model.js";
import Analytics from "./analytics.model.js";
import Message from "./message.model.js";
import Notification from "./notification.model.js";

const models = {
  Users,
  Clients,
  Artist,
  Projects,
  JobPost,
  Applications,
  Reviews,
  CommissionRequest,
  AvailabilityPost,
  Portfolio,
  Analytics,
  Message,
  Notification,
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
  Artist,
  Projects,
  JobPost,
  Applications,
  Reviews,
  CommissionRequest,
  AvailabilityPost,
  Portfolio,
  Analytics,
  Message,
  Notification,
};
