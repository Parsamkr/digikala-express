import { Sequelize } from "@sequelize/core";
import { MariaDbDialect } from "@sequelize/mariadb";

const sequelize = new Sequelize({
  dialect: MariaDbDialect,
  database: process.env.DB_NAME || "mydb",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "13121376",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  showWarnings: true,
  connectTimeout: 1000,
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

export default sequelize;
