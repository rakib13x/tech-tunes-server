import { Server } from "http";
import app from "./app/app";
import config from "./config";
import connectToDatabase from "./db";

let server: Server;

async function main() {
  // database connection
  await connectToDatabase();

  server = app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server is listening on port ${config.port}`.green);
  });
}

main();

// handle unhandledRejection
process.on("unhandledRejection", () => {
  // eslint-disable-next-line no-console
  console.log(`❌ unhandledRejection is detected, shutting down the server...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// handle uncaughtException
process.on("uncaughtException", () => {
  // eslint-disable-next-line no-console
  console.log(`❌ uncaughtException is detected, shutting down the server...`);
  process.exit(1);
});
