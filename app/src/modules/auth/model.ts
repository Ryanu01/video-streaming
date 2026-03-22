import { t, type UnwrapSchema } from 'elysia'

export const AuthModel = {
    signUpBody: t.Object({
        username: t.String(),
        password: t.String({ minLength: 6 }),
        gender: t.Enum({
            MALE: "MALE",
            FEMALE: "FEMALE",
            OTHERS: "OTHERS"
        }),
        banner: t.Optional(t.String()),
        profilePicture: t.Optional(t.String()),
        description: t.Optional(t.String())
    }),
    signUpResponse: t.Object({
        username: t.String(),
        message: t.String()
    }),
    signUpInvalid: t.Literal("Invalid values"),

    signInBody: t.Object({
        username: t.String(),
        password: t.String()
    }),
    signInResponse: t.Object({
        message: t.Literal("Sign in successfull")
    }),
    signInInvalid: t.Literal("Invalid values")
}

export type AuthModel = {
	[k in keyof typeof AuthModel]: UnwrapSchema<typeof AuthModel[k]>
}


