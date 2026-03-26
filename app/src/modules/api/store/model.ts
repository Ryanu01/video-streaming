import { t, UnwrapSchema } from "elysia";

export const StoreModel = {
  presignedUrlResponse: t.Object({
    putUrl: t.String(),
    finalVidoeUrl: t.String()
  }),
  presignedUrlInvalid: t.Literal("Url not formed")
}

export type StoreModel = {
  [k in keyof typeof StoreModel]: UnwrapSchema<typeof StoreModel[k]>
}
