import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

import http, { Server } from "http";
import app from "./app";
import config from "./config";
import mongoose from "mongoose";

const server: Server = http.createServer(app);

const DB: string = config.DATABASE_URL;

process.on(`uncaughtException`, (err) => {
  console.log(`Uncaught Exception! Shutting down.....`);
  console.log(err.name, err.message);
  process.exit(1);
});

mongoose.connect(DB).then(() => console.log(`Connected to DB`));

server.listen(config.PORT, () => {
  console.log(`User service running on port ${config.PORT}`);
});

process.on(`unhandledRejection`, (err: Error) => {
  console.log(`Unhandled Rejection! Shutting down.....`);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

export default server;
