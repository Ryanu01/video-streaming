const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3")
const fs = require("node:fs/promises")
const syncfs = require("node:fs")
const path = require("node:path")
const ffmpeg = require("fluent-ffmpeg")
require("dotenv/config")

const RESOLUTIONS = [
    { name: "360p", width: 480, height: 360 },
    { name: "480p", width: 858, height: 480 },
    { name: "720p", width: 1280, height: 720 },

]

const client = new S3Client({
    region: "us-east-1"
})

const BUCKET_NAME = process.env.BUCKET_NAME
const KEY = process.env.KEY
async function init() {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: KEY
    })
    const result = await client.send(command);
    
    const originalFilePath = `original-video.mp4`
    await fs.writeFile(originalFilePath, result.Body)

    const originalVideoPath = path.resolve(originalFilePath)

    const promises = RESOLUTIONS.map(resolution => {
        const output = `video-${resolution.name}-${KEY.split("/")[1]}`
        try {
            return new Promise((resolve) => {
                ffmpeg(originalVideoPath)
                .output(output)
                .withVideoCodec("libx264")
                .audioCodec("aac")
                .withSize(`${resolution.width}x${resolution.height}`)
                .on('end', async () => {
                    const putCommand = new PutObjectCommand({
                        Bucket: "final-videos.ryan.gomes",
                        Key: output,
                        Body: syncfs.createReadStream(path.resolve(output)),
                        ContentType: "video/mp4",
                        ContentDisposition: "inline",
                    })
                    await client.send(putCommand)
                    console.log(`Uploaded ${output}`);
                    
                    resolve()
                })
                .format("mp4")
                .run()
            })    
        } catch (error) {
            console.log(error);
            
        }
        
    })    

    await Promise.all(promises)

} 

init()