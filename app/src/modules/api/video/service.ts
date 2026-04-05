import { prisma } from "../../../db";
import client from "./helper";
import { VideoModel } from "./model";


export abstract class Video {
  static async getVideos() { 
    try {
        await prisma.$transaction(async (tx) => {
          const uploadData = await tx.upload.findMany({})
          return uploadData;          
        })
    } catch (error) {
      return error   
    }
  }
  
  static async postVideoKeyToRedis({ videoKey }: VideoModel["videoKeyBody"]) {
    try {
      const pushed = await client.lpush("videoKey:", videoKey)
      return pushed;
    } catch (error) {
      return error
    }
  }
}

