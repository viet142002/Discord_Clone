/*
  Warnings:

  - You are about to drop the column `replyToId` on the `Message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_replyToId_fkey";

-- DropIndex
DROP INDEX "public"."Message_replyToId_key";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "replyToId";

-- CreateTable
CREATE TABLE "MessageReply" (
    "id" TEXT NOT NULL,
    "replyToId" TEXT NOT NULL,

    CONSTRAINT "MessageReply_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MessageReply" ADD CONSTRAINT "MessageReply_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
