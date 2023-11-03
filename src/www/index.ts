#!/usr/bin/env node
import app from "../app";
import http from "node:http";
import "dotenv/config";

const PORT = normalizePort(process.env["PORT"]!);
app.set("port", PORT);

const server = http.createServer(app);

server.on("error", onErrorHandler);
process.on("exit", () => server.close());
process.on("SIGTERM", () => server.close());

server.timeout = 5000000;
server.listen(PORT);

// --- 

function normalizePort(port: string) {
    const normalizedPort = parseInt(port, 10);
    if (isNaN(normalizedPort)) return port;
    if (normalizedPort >= 0) return normalizedPort;
    return false;
}

function onErrorHandler(error: NodeSystemError) {
    if (error.syscall !== "listen") {
        throw error;
    }

    const bind = typeof PORT === "string"
        ? "Pipe " + PORT
        : "Port " + PORT;

    // handle specific listen errors with friendly messages 
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

interface NodeSystemError extends Error {
    address?: string; //If present, the address to which a network connection failed 
    code: string;// The string error code 
    dest: string;// If present, the file path destination when reporting a file system error 
    errno: number;// The system-provided error number 
    info?: unknown;// If present, extra details about the error condition 
    message: string;// A system-provided human-readable description of the error 
    path?: string;// If present, the file path when reporting a file system error 
    port?: number;// If present, the network connection port that is not available 
    syscall: string;// The name of the system call that triggered the error 
}