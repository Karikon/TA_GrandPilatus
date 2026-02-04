import { startTestServer, stopTestServer, resetDatabase } from "./utils/testServer";
import { defaultCredentials, login, register } from "./utils/auth";

let api: Awaited<ReturnType<typeof startTestServer>>;

beforeAll(async () => {
    api = await startTestServer();
});

afterAll(async () => {
    await stopTestServer();
});

beforeEach(async () => {
    await resetDatabase();
});

describe("Auth API", () => {
    it("registers a new admin user", async () => {
        const res = await register(api);
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({ email: defaultCredentials.email });
        expect(res.body.id).toBeDefined();
    });

    it("logs in with valid credentials", async () => {
        await register(api);
        const res = await login(api);
        expect(res.status).toBe(200);
        expect(res.body.access).toBeTruthy();
        expect(res.body.refresh).toBeTruthy();
    });

    it("rejects invalid credentials", async () => {
        await register(api);
        const res = await login(api, { ...defaultCredentials, password: "wrong" });
        expect(res.status).toBe(401);
        expect(res.body.error).toBe("Invalid credentials");
    });
});
