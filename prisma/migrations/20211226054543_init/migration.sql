/*
  Warnings:

  - The `recipientName` column on the `messages` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "messages" DROP COLUMN "recipientName",
ADD COLUMN     "recipientName" TEXT[];
