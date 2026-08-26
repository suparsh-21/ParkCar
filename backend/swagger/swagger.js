const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "ParkKar API",
            version: "1.0.0",
            description:
                "API documentation for ParkKar — Find. Park. Go."
        },

        servers: [
            {
                url: "http://localhost:5000",
                description: "Local development server"
            }
        ],

        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "token",
                    description:
                        "JWT authentication cookie"
                }
            }
        }
    },

    apis: [
        "./routes/*.js"
    ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;