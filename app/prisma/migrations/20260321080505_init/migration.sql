-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHERS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "channelName" TEXT NOT NULL,
    "banner" TEXT,
    "profilePicture" TEXT,
    "subcriberCount" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
