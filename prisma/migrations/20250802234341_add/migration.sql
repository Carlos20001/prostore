-- CreateTable
CREATE TABLE "ProductSize" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sizeLabel" TEXT NOT NULL,
    "productId" UUID NOT NULL,

    CONSTRAINT "ProductSize_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductSize" ADD CONSTRAINT "ProductSize_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
