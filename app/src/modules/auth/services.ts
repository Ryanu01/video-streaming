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

    static async signIn({ username, password}: AuthModel["signInBody"]) {
    
        const userExist = await prisma.user.findUnique({
            where: {
                username
            }
        })

        if(!userExist) {
            throw status(404, "Not Found")
        }

        const verify = await checkPassword(password, userExist.password)
        if(verify) {
            const token = jwt.sign({userId: userExist.id}, process.env.JWT_SECRET!)
            return {
                token,
                message: "User sign in successful"
            }
        }else {
            throw status(401, "Unauthorized")
        }
    
    }
}