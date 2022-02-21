/*
  Warnings:

  - You are about to drop the column `sentAt` on the `messages_mapping` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "messages_mapping" DROP COLUMN "sentAt",
ADD COLUMN     "time" TIMESTAMP(3);
