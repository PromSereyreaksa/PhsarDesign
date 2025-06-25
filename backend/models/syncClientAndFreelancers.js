import Portfolio from './portfolio.model.js';

Portfolio.sync({ alter: true })
  .then(() => {
    console.log("✅ Portfolio table was synchronized successfully.");
  })
  .catch((err) => {
    console.error("❌ Error syncing Portfolio table:", err);
  });
