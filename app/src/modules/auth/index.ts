import { Elysia } from 'elysia'

import { AuthModel } from './model'
import { Auth } from './services'
export const authApp = new Elysia ({ prefix: "/auth" })
    .post("/sign-in", async ({ body  })=> {


            const response = await Auth.signIn(body)

            return response
        }, {
            body: AuthModel.signInBody,
            // response is optional, use to enforce return type
            response: {
                200: AuthModel.signInResponse,
                400: AuthModel.signInInvalid
            }
        }
    )
