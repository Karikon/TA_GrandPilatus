import { createServer } from "http";
import app from "./app";
import { connectMongo } from "./db/mongo";
import { env } from "./config/env";

// Kick off the server straight away so deploys behave like a simple script
(async () => {
    await connectMongo();
    // Keep a plain HTTP server so we can plug in sockets later if needed
    const server = createServer(app);
    server.listen(env.PORT, () => {
        console.log(`API listening on http://localhost:${env.PORT}`);
    });
})();
