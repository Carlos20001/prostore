/*
  Warnings:

  - You are about to drop the `ProductSize` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductSize" DROP CONSTRAINT "ProductSize_productId_fkey";

-- DropTable
DROP TABLE "ProductSize";
