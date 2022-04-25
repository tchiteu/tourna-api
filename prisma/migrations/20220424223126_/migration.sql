/*
  Warnings:

  - Added the required column `hashedRt` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Users` ADD COLUMN `hashedRt` VARCHAR(191) NOT NULL;
