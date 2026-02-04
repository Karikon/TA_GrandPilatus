import { startTestServer, stopTestServer, resetDatabase } from "./utils/testServer";
import { registerAndLogin } from "./utils/auth";
import { Customer } from "../src/models/Customer";

let api: Awaited<ReturnType<typeof startTestServer>>;
let token: string;

beforeAll(async () => {
    api = await startTestServer();
});

afterAll(async () => {
    await stopTestServer();
});

beforeEach(async () => {
    await resetDatabase();
    token = await registerAndLogin(api);
});

const auth = () => ({ Authorization: `Bearer ${token}` });

describe("Landing pages API", () => {
    it("creates, updates and deletes a landing page", async () => {
        const payload = {
            title: "Autumn Spa Retreat",
            bodyHtml: "<h1>Relax</h1>",
            url: "https://hotel.test/autumn",
            status: "draft",
        };

        const createRes = await api.post("/api/v1/landing-pages").set(auth()).send(payload);
        expect(createRes.status).toBe(201);
        expect(createRes.body).toMatchObject({ title: payload.title, status: payload.status });

        const listRes = await api.get("/api/v1/landing-pages").set(auth());
        expect(listRes.status).toBe(200);
        expect(listRes.body).toHaveLength(1);

        const updated = await api
            .patch(`/api/v1/landing-pages/${createRes.body._id}`)
            .set(auth())
            .send({ status: "published" });
        expect(updated.status).toBe(200);
        expect(updated.body.status).toBe("published");

        const delRes = await api.delete(`/api/v1/landing-pages/${createRes.body._id}`).set(auth());
        expect(delRes.status).toBe(204);
    });
});

describe("Segments API", () => {
    it("manages segment lifecycle", async () => {
        const segPayload = { title: "Spa Lovers", customers: [] as string[] };

        const createRes = await api.post("/api/v1/segments").set(auth()).send(segPayload);
        expect(createRes.status).toBe(201);
        expect(createRes.body.title).toBe(segPayload.title);

        const list = await api.get("/api/v1/segments").set(auth());
        expect(list.status).toBe(200);
        expect(list.body).toHaveLength(1);

        const update = await api
            .patch(`/api/v1/segments/${createRes.body._id}`)
            .set(auth())
            .send({ title: "Wellness Fans" });
        expect(update.status).toBe(200);
        expect(update.body.title).toBe("Wellness Fans");

        const del = await api.delete(`/api/v1/segments/${createRes.body._id}`).set(auth());
        expect(del.status).toBe(204);
    });
});

describe("Campaigns API", () => {
    async function createSegment() {
        const res = await api.post("/api/v1/segments").set(auth()).send({ title: "Guests", customers: [] });
        return res.body._id as string;
    }

    async function createLandingPage() {
        const res = await api.post("/api/v1/landing-pages").set(auth()).send({
            title: "Lake Weekend",
            bodyHtml: "<h1>Lake</h1>",
            url: `https://hotel.test/lake-${Date.now()}`,
            status: "published",
        });
        return res.body._id as string;
    }

    it("runs through campaign CRUD", async () => {
        const segmentId = await createSegment();
        const landingId = await createLandingPage();

        const start = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        const end = new Date(Date.now() + 60 * 60 * 1000).toISOString();

        const payload = {
            name: "Autumn Offer",
            segments: [segmentId],
            landingPage: landingId,
            segmentCriteria: { season: "autumn" },
            schedule: { startAt: start, endAt: end },
        };

        const create = await api.post("/api/v1/campaigns").set(auth()).send(payload);
        expect(create.status).toBe(201);
        expect(create.body.name).toBe(payload.name);
        expect(create.body.status).toBe("active");

        const list = await api.get("/api/v1/campaigns").set(auth());
        expect(list.status).toBe(200);
        expect(list.body).toHaveLength(1);

        const campaignId = create.body._id as string;
        const fetched = await api.get(`/api/v1/campaigns/${campaignId}`).set(auth());
        expect(fetched.status).toBe(200);
        expect(fetched.body._id).toBe(campaignId);

        const updated = await api
            .patch(`/api/v1/campaigns/${campaignId}`)
            .set(auth())
            .send({ name: "Updated Autumn Offer" });
        expect(updated.status).toBe(200);
        expect(updated.body.name).toBe("Updated Autumn Offer");

        const del = await api.delete(`/api/v1/campaigns/${campaignId}`).set(auth());
        expect(del.status).toBe(204);
    });
});

describe("Customers and reporting", () => {
    it("lists customers and returns performance metrics", async () => {
        await Customer.create({
            firstName: "Anna",
            lastName: "Meier",
            age: 30,
            interests: ["Spa"],
            address: { street: "Pilatusstrasse 1", postalCode: "6003", city: "Luzern", country: "CH" },
        });

        const customersRes = await api.get("/api/v1/customers").set(auth());
        expect(customersRes.status).toBe(200);
        expect(customersRes.body).toHaveLength(1);

        // need at least one campaign for performance endpoint
        const segmentId = (
            await api.post("/api/v1/segments").set(auth()).send({ title: "All Guests", customers: [] })
        ).body._id as string;
        const landingId = (
            await api.post("/api/v1/landing-pages").set(auth()).send({
                title: "Spa Day",
                bodyHtml: "<p>Relax</p>",
                url: `https://hotel.test/spa-${Date.now()}`,
                status: "published",
            })
        ).body._id as string;

        await api.post("/api/v1/campaigns").set(auth()).send({
            name: "Spa Blast",
            segments: [segmentId],
            landingPage: landingId,
            schedule: {
                startAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                endAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            },
        });

        const performanceRes = await api.get("/api/v1/performance").set(auth());
        expect(performanceRes.status).toBe(200);
        expect(performanceRes.body.length).toBeGreaterThan(0);
        const metrics = performanceRes.body[0];
        expect(metrics).toHaveProperty("campaignId");
        expect(metrics).toHaveProperty("deliveryRate");
        expect(metrics).toHaveProperty("clickRate");
        expect(metrics).toHaveProperty("conversionRate");
    });
});
