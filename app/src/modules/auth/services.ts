import { status } from "elysia";
import { prisma } from "../../db";
import { hashPassword } from "./helper";
import type { AuthModel } from "./model";


export abstract class Auth {
    static async signIn({ username, password, banner, gender, profilePicture, description  }: AuthModel["signInBody"]) {
        try {

            const hashedPassword = await hashPassword(password)

            const userExist = await prisma.user.findFirst({
                where: {
                    username
                }
            })

            if(userExist) {
                throw status(409, "Conflict")
            }

            const user = await prisma.user.create({
                data: {
                    username,
                    password: hashedPassword,
                    gender,
                    channelName: username,
                    description: description ? description : "", 
                    banner: banner ? banner : "",
                    profilePicture: profilePicture ? profilePicture : "" 
                }
            })

            return {
                username: user.username,
                message: "User created successfully"
            }

        } catch (error) {
            throw status(400, "Bad Request")
        }
    }
}