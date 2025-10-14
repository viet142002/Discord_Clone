/*
  Warnings:

  - You are about to drop the `MessageReply` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[replyToId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."MessageReply" DROP CONSTRAINT "MessageReply_replyToId_fkey";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "replyToId" TEXT;

-- DropTable
DROP TABLE "public"."MessageReply";

-- CreateIndex
CREATE UNIQUE INDEX "Message_replyToId_key" ON "Message"("replyToId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
