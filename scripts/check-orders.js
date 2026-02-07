const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const orders = await prisma.order.findMany({
    select: {
      id: true,
      providerRef: true,
      provider: true,
      status: true,
    },
  });

  console.log("Existing orders:");
  console.table(orders);

  // Check for duplicates
  const refs = orders.map((o) => o.providerRef).filter(Boolean);
  const duplicates = refs.filter((ref, idx) => refs.indexOf(ref) !== idx);

  if (duplicates.length > 0) {
    console.warn("⚠️  Duplicate providerRef values found:", duplicates);
  } else {
    console.log("✅ No duplicate providerRef values");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
