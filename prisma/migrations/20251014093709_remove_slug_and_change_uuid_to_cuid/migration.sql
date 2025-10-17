/*
  Warnings:

  - You are about to drop the column `slug` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Server` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Channel_slug_serverId_key";

-- DropIndex
DROP INDEX "public"."Server_slug_key";

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "slug";

-- AlterTable
ALTER TABLE "Server" DROP COLUMN "slug";
