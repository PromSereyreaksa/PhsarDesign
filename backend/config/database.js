import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find project root (look for package.json)
function findProjectRoot(startDir) {
    let currentDir = startDir;
    while (currentDir !== path.dirname(currentDir)) {
        if (fs.existsSync(path.join(currentDir, 'package.json'))) {
        return currentDir;
        }
        currentDir = path.dirname(currentDir);
    }
    return startDir; // fallback
}

const projectRoot = findProjectRoot(__dirname);
const envPath = path.join(projectRoot, '.env');

console.log("Loading .env from:", envPath);
dotenv.config({ path: envPath });

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD || null,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        define: {
            freezeTableName: true,
        },
    }
);