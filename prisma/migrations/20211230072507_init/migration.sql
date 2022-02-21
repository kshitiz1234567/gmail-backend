/*
  Warnings:

  - Added the required column `sentAt` to the `messages_mapping` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "messages_mapping" ADD COLUMN     "sentAt" TIMESTAMP(3) NOT NULL;
