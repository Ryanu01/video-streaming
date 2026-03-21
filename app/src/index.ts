import { Elysia } from "elysia";
import { authApp } from "./modules/auth";


const app = new Elysia().get("/", () => "Hello Elysia").use(authApp).listen(3000);
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
