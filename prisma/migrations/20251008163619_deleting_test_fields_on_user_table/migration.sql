/*
  Warnings:

  - You are about to drop the column `test` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `test2` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `test3` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "test",
DROP COLUMN "test2",
DROP COLUMN "test3";
