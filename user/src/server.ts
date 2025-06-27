import http, { Server } from "http";
import app from "./app";
import config from "./config";

const server:Server = http.createServer(app);

server.listen(config.PORT,()=>{
    console.log(`User service running on port ${config.PORT}`);
})

export default server;
