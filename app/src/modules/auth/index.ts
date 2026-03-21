import { Elysia } from 'elysia'

import { AuthModel } from './model'
import { Auth } from './services'
export const authApp = new Elysia ({ prefix: "/auth" })
    .post("/sign-up", async ({ body  })=> {
        
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

    .post("/sign-in", async ({ body }) => {
        const response = await Auth.signIn(body)

        return response
    }, {
        body: AuthModel.signInBody,

        response: {
            200: AuthModel.signInResponse,
            400: AuthModel.signInInvalid
        }
    })