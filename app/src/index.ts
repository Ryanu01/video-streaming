import { Elysia } from "elysia";
import { authApp } from "./modules/auth";
import { apiApp } from "./modules/api/video";
import { storeApp } from "./modules/api/store";


const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .use(authApp)
  .use(apiApp)
  .use(storeApp)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
