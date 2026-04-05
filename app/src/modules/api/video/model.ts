import { t, UnwrapSchema } from "elysia";

export const VideoModel = {
  videoKeyBody: t.Object({
    videoKey: t.String()
  }),
  videoModelResponse: t.Object({
    message: t.Literal("Video added to redis")
  }),
  videoModelInvalid: t.Literal("Url not found")
}

export type VideoModel = {
  [k in keyof typeof VideoModel]: UnwrapSchema<typeof VideoModel[k]>
}
