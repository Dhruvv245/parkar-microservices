import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import  express from "express";
import expressProxy from "express-http-proxy";


const app = express();
const userServiceUrl = process.env.USER_SERVICE_URL || "http://localhost:3001";
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use('/user', expressProxy(userServiceUrl));

app.listen(PORT, () => {
  console.log(`Gateway service running on port ${PORT}`);
});