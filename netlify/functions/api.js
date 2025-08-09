const { NestFactory } = require("@nestjs/core");
const { AppModule } = require("../../backend/dist/app.module");
const { ValidationPipe } = require("@nestjs/common");

let app;

async function createApp() {
  if (!app) {
    app = await NestFactory.create(AppModule);

    // Configuration CORS
    app.enableCors({
      origin: true,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    });

    // Validation globale
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );

    await app.init();
  }
  return app;
}

exports.handler = async (event, context) => {
  // Éviter les timeouts
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const app = await createApp();

    // Convertir l'événement Netlify en requête Express
    const httpAdapter = app.getHttpAdapter();
    const instance = httpAdapter.getInstance();

    return new Promise((resolve, reject) => {
      const req = {
        method: event.httpMethod,
        url: event.path.replace("/.netlify/functions/api", "") || "/",
        headers: event.headers,
        body: event.body,
        query: event.queryStringParameters || {},
      };

      const res = {
        statusCode: 200,
        headers: {},
        body: "",
        setHeader: function (name, value) {
          this.headers[name] = value;
        },
        status: function (code) {
          this.statusCode = code;
          return this;
        },
        json: function (data) {
          this.headers["Content-Type"] = "application/json";
          this.body = JSON.stringify(data);
          resolve({
            statusCode: this.statusCode,
            headers: this.headers,
            body: this.body,
          });
        },
        send: function (data) {
          this.body = data;
          resolve({
            statusCode: this.statusCode,
            headers: this.headers,
            body: this.body,
          });
        },
        end: function (data) {
          if (data) this.body = data;
          resolve({
            statusCode: this.statusCode,
            headers: this.headers,
            body: this.body,
          });
        },
      };

      // Simuler Express
      instance(req, res);
    });
  } catch (error) {
    console.error("Erreur dans la fonction Netlify:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Erreur interne du serveur",
        message: error.message,
      }),
    };
  }
};
