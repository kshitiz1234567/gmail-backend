/*
  Warnings:

  - Made the column `time` on table `messages_mapping` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "messages_mapping" ALTER COLUMN "time" SET NOT NULL;
