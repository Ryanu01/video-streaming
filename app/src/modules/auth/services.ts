import { status } from "elysia";
import { prisma } from "../../db";
import { checkPassword, hashPassword } from "./helper";
import type { AuthModel } from "./model";
import jwt from "jsonwebtoken"

export abstract class Auth {
    static async signUp({ username, password, banner, gender, profilePicture, description  }: AuthModel["signUpBody"]) {


            const hashedPassword = await hashPassword(password)

            const userExist = await prisma.user.findUnique({
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

        
    }

    static async signIn({ username, password }: AuthModel["signInBody"]): Promise<{ credentialsIsCorrect: boolean, userId?: string }>   {
    
        const userExist = await prisma.user.findUnique({
            where: {
                username
            }
        })

        if(!userExist) {
            return { credentialsIsCorrect: false }
        }

        const verify = await checkPassword(password, userExist.password)
        
        if(verify) {
            return { credentialsIsCorrect: true, userId: userExist.id }
        }else {
            return { credentialsIsCorrect: false }
        }

    
    }
}