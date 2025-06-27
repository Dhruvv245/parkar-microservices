import http, { Server } from "http";
import app from "./app";

const server:Server = http.createServer(app);

export default server;
