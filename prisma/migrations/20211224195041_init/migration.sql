/*
  Warnings:

  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `recipientId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `messages_mapping` table. All the data in the column will be lost.
  - Added the required column `username` to the `messages_mapping` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_authorId_fkey";

-- DropForeignKey
ALTER TABLE "messages_mapping" DROP CONSTRAINT "messages_mapping_userId_fkey";

-- DropIndex
DROP INDEX "Users_username_key";

-- AlterTable
ALTER TABLE "Users" DROP CONSTRAINT "Users_pkey",
DROP COLUMN "userId",
ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("username");

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "authorId",
DROP COLUMN "recipientId",
ADD COLUMN     "recipientName" TEXT;

-- AlterTable
ALTER TABLE "messages_mapping" DROP COLUMN "userId",
ADD COLUMN     "username" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_authorName_fkey" FOREIGN KEY ("authorName") REFERENCES "Users"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages_mapping" ADD CONSTRAINT "messages_mapping_username_fkey" FOREIGN KEY ("username") REFERENCES "Users"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;
