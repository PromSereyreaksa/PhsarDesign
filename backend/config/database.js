import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "PhsarDesign",   // replace with your PostgreSQL DB name
  "postgres",     // replace with your PostgreSQL username
  "",     // replace with your PostgreSQL password
  {
    host: "localhost",    // or your PostgreSQL host
    dialect: "postgres",  // PostgreSQL dialect
    logging: false,       // set true to see SQL logs
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      freezeTableName: true  // prevent plural table names
    }
  }
);

// Optional connection test
(async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to PostgreSQL:", error);
  }
})();
