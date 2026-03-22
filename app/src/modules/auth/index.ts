import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'


import { AuthModel } from './model'
import { Auth } from './services'
export const authApp = new Elysia ({ prefix: "/auth" })
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET!
        })
    )
    .post("/sign-up", async ({ body, jwt  })=> {
        
        const response = await Auth.signUp(body)

        return response
    }, {
        body: AuthModel.signUpBody,
        // response is optional, use to enforce return type
        response: {
            200: AuthModel.signUpResponse,
            400: AuthModel.signUpInvalid
        }
    })

    .post("/sign-in", async ({ jwt, body, status, cookie: { auth } }) => {
        const { credentialsIsCorrect, userId }= await Auth.signIn(body)
        if(!credentialsIsCorrect || !userId) {
            return status(400, "Invalid values")
        }
        
        const token = await jwt.sign({ userId })
        
        auth.set({
            value: token,
            httpOnly: true,
            maxAge: 7 * 86400
        })

        return {
            message: "Sign in successfull"
        }
    }, {
        body: AuthModel.signInBody,

        response: {
            200: AuthModel.signInResponse,
            400: AuthModel.signInInvalid
        }
    })