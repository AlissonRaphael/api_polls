-- CreateTable
CREATE TABLE "LogError" (
    "id" TEXT NOT NULL,
    "stack" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogError_pkey" PRIMARY KEY ("id")
);
