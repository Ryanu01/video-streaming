import jwt from "@elysiajs/jwt";
import { Elysia } from "elysia"
import { Store } from "./service";
import { StoreModel } from "./model";

export const storeApp = new Elysia({ prefix: "/api" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!
    })
  )
  .resolve(async ({ cookie: { auth }, jwt, status }) => {

    

    if (!auth) {
      throw new Response("Unauthorized", { status: 401 })
    }
    
    const decoded = await jwt.verify(auth.value as string)
    
    if (!decoded || !decoded.userId) {
      throw new Response("Unauthorized", { status: 401 })
    }

    return {
      userId: decoded.userId as string
    }
  })
  .get("/get-url", async ({ body }) => {
    const response = await Store.getPresignedUrl()

    return response

  }, {
    response: {
      200: StoreModel.presignedUrlResponse,
      400: StoreModel.presignedUrlInvalid
    }
  }) 
