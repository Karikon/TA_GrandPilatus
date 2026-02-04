import supertest, { SuperTest, Test } from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
// Starts and stops the backend-server for the tests and sets it up correctly.
let mongo: MongoMemoryServer | null = null;
let agentPromise: Promise<SuperTest<Test>> | null = null;

const defaultEnv = {
    JWT_SECRET: "test-secret",
    REFRESH_SECRET: "refresh-secret",
    JWT_EXPIRES_IN: "15m",
    REFRESH_EXPIRES_IN: "7d",
};

export function startTestServer(): Promise<SuperTest<Test>> {
    if (agentPromise) return agentPromise;

    agentPromise = (async () => {
        for (const [k, v] of Object.entries(defaultEnv)) {
            if (!process.env[k]) process.env[k] = v;
        }

        mongo = await MongoMemoryServer.create();
        process.env.MONGO_URI = mongo.getUri();

        const { connectMongo } = await import("../../src/db/mongo");
        await connectMongo();

        // import the express app after env/db are ready
        const { default: app } = await import("../../src/app");

        const agent = (supertest as any)(app) as SuperTest<Test>;
        return agent;
    })();

    return agentPromise;
}

export async function stopTestServer(): Promise<void> {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    }
    if (mongo) {
        await mongo.stop();
        mongo = null;
    }
}

export async function resetDatabase(): Promise<void> {
    if (mongoose.connection.readyState !== 1) return;
    const { collections } = mongoose.connection;
    for (const key of Object.keys(collections)) {
        await collections[key].deleteMany({});
    }
}
