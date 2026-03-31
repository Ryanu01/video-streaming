import { Elysia } from "elysia";
import { authApp } from "./modules/auth";
import { apiApp } from "./modules/api/video";
import { storeApp } from "./modules/api/store";
import { cors } from '@elysiajs/cors'


const app = new Elysia()
  .use(cors({
    origin: "http://localhost:8080",
    credentials: true
  }))
  .get("/", () => "Hello Elysia")
  .use(authApp)
  .use(apiApp)
  .use(storeApp)
  
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
