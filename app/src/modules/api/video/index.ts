import jwt from "@elysiajs/jwt"
import { Elysia } from "elysia"
import { prisma } from "../../../db"
import { UploadType, UploadStatus } from "../../../generated/prisma/client"
import { ws } from "../../ws"
import { VideoModel } from "./model"
import { Video } from "./service"

export const apiApp = new Elysia({ prefix: "/api" })
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
  .post("/videos/uploaded", async ({ body }) => {
    console.log(body);
    const response = await Video.postVideoKeyToRedis(body)

    return {
      message: "Video added to redis"
    };

  }, {
    body: VideoModel.videoKeyBody,
    
    response: {
      200: VideoModel.videoModelResponse,
      400: VideoModel.videoModelInvalid
    }

  })

  .post("/videos/add", async ({ body, userId }) => {
    const { title, videoKey, type } = body as { title: string; videoKey: string; type: "PRIVATE" | "PUBLIC" }
    
    if (!title || !videoKey || !type) {
      throw new Response("Missing required fields", { status: 400 })
    }

    const s3Url = process.env.AWS_S3_URL + videoKey

    const upload = await prisma.upload.create({
      data: {
        title,
        videoUrl: s3Url,
        thumbnail: "https://mockcdn.com/thumbnail placeholder",
        userId: userId,
        type: type === "PRIVATE" ? UploadType.PRIVATE : UploadType.PUBLIC,
        status: "PROCESSING"
      }
    })

    return {
      id: upload.id,
      status: upload.status
    }
  })
  .get("/videos/:id/status", async ({ params, userId }) => {
    const upload = await prisma.upload.findFirst({
      where: {
        id: params.id,
        userId: userId
      },
      include: {
        qualities: true
      }
    })

    if (!upload) {
      throw new Response("Upload not found", { status: 404 })
    }

    return {
      status: upload.status,
      title: upload.title,
      qualities: upload.qualities
    }
  })

const workerApp = new Elysia({ prefix: "/worker" })

workerApp.post("/transcode-complete", async ({ body }) => {
  const { uploadId, qualities } = body as { 
    uploadId: string; 
    qualities: { url360p: string; url480p: string; url720p: string } 
  }

  if (!uploadId) {
    throw new Response("Missing uploadId", { status: 400 })
  }

  const upload = await prisma.upload.findUnique({ where: { id: uploadId } })
  if (!upload) {
    throw new Response("Upload not found", { status: 404 })
  }

  await prisma.uploadQuality.create({
    data: {
      uploadId,
      Url360p: qualities?.url360p || "https://mockcdn.com/360p",
      Url480p: qualities?.url480p || "https://mockcdn.com/480p",
      Url720p: qualities?.url720p || "https://mockcdn.com/720p"
    }
  })

  await prisma.upload.update({
    where: { id: uploadId },
    data: { status: "COMPLETED" }
  })

  ws.broadcast(uploadId, {
    type: "TRANSCODE_COMPLETE",
    status: "COMPLETED",
    qualities: {
      url360p: qualities?.url360p || "https://mockcdn.com/360p",
      url480p: qualities?.url480p || "https://mockcdn.com/480p",
      url720p: qualities?.url720p || "https://mockcdn.com/720p"
    }
  })

  return { success: true }
})

export { workerApp }
