import { SQSClient, ReceiveMessageCommand } from "@aws-sdk/client-sqs"
import dotenv from 'dotenv'
dotenv.config()
const client = new SQSClient({
    region: process.env.QUEUE_REGION!,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!
    }
})


async function start () {
    const command = new ReceiveMessageCommand({
        QueueUrl: process.env.QUEUE_URL!,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 20
    }) 

    while (true) {
        const {Messages} = await client.send(command)
        if (!Messages) {
            console.log("No message found");
            continue;   
        }

        for (const message of Messages) {
            const {Body, MessageId} = message

            console.log(`Message received `, { MessageId, Body });
            
        }
    }
}

start()