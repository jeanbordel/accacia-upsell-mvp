const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Upsert Hotel
  const hotel = await prisma.hotel.upsert({
    where: { id: "hotel-bacolux" },
    update: {},
    create: {
      id: "hotel-bacolux",
      name: "Hotel Bacolux",
    },
  });
  console.log("Hotel:", hotel.name);

  // Upsert Screen
  const screen = await prisma.screen.upsert({
    where: { qrSlug: "bacolux-lobby" },
    update: {},
    create: {
      id: "screen-bacolux-lobby",
      hotelId: hotel.id,
      name: "Lobby Screen",
      qrSlug: "bacolux-lobby",
    },
  });
  console.log("Screen:", screen.name, "→", screen.qrSlug);

  // Upsert Offer
  const offer = await prisma.offer.upsert({
    where: { id: "offer-spa-upgrade" },
    update: {},
    create: {
      id: "offer-spa-upgrade",
      hotelId: hotel.id,
      title: "Spa & Wellness Upgrade",
      description:
        "Acces nelimitat la spa, saună și piscină interioară pe toată durata sejurului.",
      priceCents: 15000, // 150.00 RON
      currency: "RON",
      isActive: true,
    },
  });
  console.log("Offer:", offer.title, "→", offer.priceCents / 100, offer.currency);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
