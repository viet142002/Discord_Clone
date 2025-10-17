/*
  Warnings:

  - A unique constraint covering the columns `[slug,serverId]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Server` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Server` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Server" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Channel_slug_serverId_key" ON "Channel"("slug", "serverId");

-- CreateIndex
CREATE UNIQUE INDEX "Server_slug_key" ON "Server"("slug");
