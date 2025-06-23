import sequelize from "sequelize";
import { sequelize } from "../config/database.js";

const User = sequelize.define(User,{
    // Models attributes
    id:{
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    
    
})