"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const priceRoutes_1 = __importDefault(require("./routes/priceRoutes"));
const db_1 = __importDefault(require("./config/db"));
const pricePoller_1 = __importDefault(require("./services/pricePoller"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
    },
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Connect to MongoDB
(0, db_1.default)();
// Use routes
app.use('/api', priceRoutes_1.default);
// Start price polling service
(0, pricePoller_1.default)(io);
io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
exports.default = server;
