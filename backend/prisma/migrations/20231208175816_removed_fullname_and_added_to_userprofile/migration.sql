/*
  Warnings:

  - You are about to drop the column `fullname` on the `users` table. All the data in the column will be lost.
  - Added the required column `firstname` to the `UserProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `UserProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `UserProfile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Title" AS ENUM ('Mr', 'Mrs', 'Miss', 'Chief', 'Sir');

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "firstname" TEXT NOT NULL,
ADD COLUMN     "lastname" TEXT NOT NULL,
ADD COLUMN     "title" "Title" NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "fullname";
