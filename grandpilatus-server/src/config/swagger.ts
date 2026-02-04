import swaggerJSDoc from "swagger-jsdoc";

// Auto-generate docs from the routes and models so expo stays in sync
export const specs = swaggerJSDoc({
    definition: {
        openapi: "3.0.3",
        info: { title: "Grand Pilatus API", version: "1.0.0" },
        servers: [{ url: "/" }],
        components: {
            securitySchemes: {
                bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ["./src/routes/*.ts", "./src/models/*.ts"]
});
