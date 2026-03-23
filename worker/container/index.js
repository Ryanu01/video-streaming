const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3")
const fs = require("fs/promises")
const path = require("node:path")
const ffmpeg = require("fluent-ffmpeg")
require("dotenv/config")

const RESOLUTIONS = [
    { name: "360p", width: 480, height: 360 },
    { name: "480p", width: 858, height: 480 },
    { name: "720p", width: 1280, height: 720 },

]

const client = new S3Client({
    region: process.env.BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
})

const BUCKET_NAME = process.env.BUCKET_NAME
const KEY = process.env.KEY
async function init() {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: KEY
    })
    const result = await client.send(command);
    
    const originalFilePath = `some-path`
    await fs.writeFile(originalFilePath, result.Body)

    const originalVideoPath = path.resolve(originalFilePath)

    const promises = RESOLUTIONS.map(resolution => {
        const output = `transcoded/video-${resolution.name}.mp4`

        return new Promise((resolve) => {
            ffmpeg(originalVideoPath)
            .output(output)
            .withVideoCodec("Libx264")
            .audioCodec("aac")
            .withSize(`${resolution.width}x${resolution.height}`)
            .on('end', async () => {
                const putCommand = new PutObjectCommand({
                    Bucket: "",
                    Key: output
                })
                await client.send(putCommand)
                console.log(`Uploaded ${output}`);
                
                resolve()
            })
            .format("mp4")
            .run()
        })
    })    

    await Promise.all(promises)



} 

