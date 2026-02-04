import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger";
import authRoutes from "./routes/auth.routes";
import campaignRoutes from "./routes/campaign.routes";
import { errorHandler } from "./middleware/error";
import customerRoutes from "./routes/customers.routes";
import segmentRoutes from "./routes/segments.routes";
import performanceRoutes from "./routes/performance.routes";
import landingPageRoutes from "./routes/landingPage.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/campaigns", campaignRoutes);
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/segments", segmentRoutes);
app.use("/api/v1/performance", performanceRoutes);
app.use("/api/v1/landing-pages", landingPageRoutes);

app.use(errorHandler);

export default app;
