import type supertest from "supertest";
// Auth-Mock for JEST tests
export const defaultCredentials = {
    email: "admin@test.com",
    password: "StrongPass123!",
};

type ApiClient = supertest.SuperAgentTest;

export async function register(agent: ApiClient, creds = defaultCredentials) {
    return agent.post("/api/v1/auth/register").send(creds);
}

export async function login(agent: ApiClient, creds = defaultCredentials) {
    return agent.post("/api/v1/auth/login").send(creds);
}

export async function registerAndLogin(agent: ApiClient, creds = defaultCredentials) {
    await register(agent, creds);
    const res = await login(agent, creds);
    return res.body.access as string;
}
