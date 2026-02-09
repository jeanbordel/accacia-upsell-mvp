-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'PAGE_VIEW';

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "data" JSONB,
ADD COLUMN     "orderId" TEXT;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "Screen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
