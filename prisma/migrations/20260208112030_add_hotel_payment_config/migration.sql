-- CreateEnum
CREATE TYPE "PaymentOwner" AS ENUM ('HOTEL');

-- AlterEnum
ALTER TYPE "PaymentProvider" ADD VALUE 'PAYU';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentOwner" "PaymentOwner" NOT NULL DEFAULT 'HOTEL';

-- CreateTable
CREATE TABLE "HotelPaymentConfig" (
    "id" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "defaultPsp" "PaymentProvider",
    "stripeSecret" TEXT,
    "stripeWebhook" TEXT,
    "netopiaSignature" TEXT,
    "netopiaTestMode" BOOLEAN NOT NULL DEFAULT true,
    "netopiaHostedUrlTest" TEXT,
    "netopiaHostedUrlLive" TEXT,
    "netopiaPublicKeyPem" TEXT,
    "netopiaPrivateKeyPem" TEXT,
    "payuMerchantId" TEXT,
    "payuSecret" TEXT,
    "payuEnv" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HotelPaymentConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HotelPaymentConfig_hotelId_key" ON "HotelPaymentConfig"("hotelId");

-- AddForeignKey
ALTER TABLE "HotelPaymentConfig" ADD CONSTRAINT "HotelPaymentConfig_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
