import dotenv from "dotenv";
dotenv.config();
import express from "express";
import next from "next";
import auth from "./lib/server/basic-auth";

if (!process.env.PORT) {
  throw new Error("Please specify port");
}
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  if (process.env.NODE_ENV === "production" && process.env.STAGING === "1") {
  // if (process.env.NODE_ENV === "production") {
    server.use(auth);
  }

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
