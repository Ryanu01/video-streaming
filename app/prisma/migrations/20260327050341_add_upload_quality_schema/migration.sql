-- CreateTable
CREATE TABLE "UploadQuality" (
    "id" TEXT NOT NULL,
    "uploadId" TEXT NOT NULL,
    "Url720p" TEXT NOT NULL,
    "Url360p" TEXT NOT NULL,
    "Url480p" TEXT NOT NULL,

    CONSTRAINT "UploadQuality_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UploadQuality" ADD CONSTRAINT "UploadQuality_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "Upload"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
