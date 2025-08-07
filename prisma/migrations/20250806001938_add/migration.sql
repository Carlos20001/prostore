-- CreateTable
CREATE TABLE "_OrderToProductSize" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OrderToProductSize_AB_unique" ON "_OrderToProductSize"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderToProductSize_B_index" ON "_OrderToProductSize"("B");

-- AddForeignKey
ALTER TABLE "_OrderToProductSize" ADD CONSTRAINT "_OrderToProductSize_A_fkey" FOREIGN KEY ("A") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderToProductSize" ADD CONSTRAINT "_OrderToProductSize_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductSize"("id") ON DELETE CASCADE ON UPDATE CASCADE;
