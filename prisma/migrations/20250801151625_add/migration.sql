/*
  Warnings:

  - The `size` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `size` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "size" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "size",
ADD COLUMN     "size" TEXT[];
