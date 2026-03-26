import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { StoreModel } from "./model"

export abstract class Store {
  static async getPresignedUrl(): Promise<StoreModel["presignedUrlResponse"]> {
    const s3 = new S3Client({
      region: "us-east-1",
      forcePathStyle: true,
      credentials: {
        secretAccessKey: process.env.SECRET_ACCESS_KEY!,
        accessKeyId: process.env.ACCESS_KEY_ID!
      }
    })
    
    const videoPath = "videos/" + crypto.randomUUID() + ".mp4"
    const putUrl = await getSignedUrl(
      s3,
      new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: videoPath,
        ContentType: "video/mp4"
      }),
      { expiresIn: 3600 }
    )
    return {
      putUrl,
      finalVidoeUrl: `https://s3.us-east-1.amazonaws.com/${process.env.BUCKET_NAME}/videos/${videoPath}`

    }
  }

}

