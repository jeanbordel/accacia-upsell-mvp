// Update hotel logos for Bacolux units
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function updateLogos() {
  try {
    // Find all hotels
    const hotels = await prisma.hotel.findMany();
    
    console.log(`Found ${hotels.length} hotels`);

    // Update Bacolux Hotel with main logo
    const bacolux = hotels.find(h => h.name.toLowerCase().includes('bacolux'));
    if (bacolux) {
      await prisma.hotel.update({
        where: { id: bacolux.id },
        data: { logoUrl: '/logos/bacolux.svg' }
      });
      console.log(`✓ Updated ${bacolux.name} with Bacolux logo`);
    }

    // Update Koralio with its logo
    const koralio = hotels.find(h => h.name.toLowerCase().includes('koralio'));
    if (koralio) {
      await prisma.hotel.update({
        where: { id: koralio.id },
        data: { logoUrl: '/logos/koralio.svg' }
      });
      console.log(`✓ Updated ${koralio.name} with Koralio logo`);
    }

    // If no specific hotels found, update the first one
    if (!bacolux && !koralio && hotels.length > 0) {
      await prisma.hotel.update({
        where: { id: hotels[0].id },
        data: { logoUrl: '/logos/koralio.svg' }
      });
      console.log(`✓ Updated ${hotels[0].name} with Koralio logo (default)`);
    }

    console.log('\n✅ Logo update complete!');
    
  } catch (error) {
    console.error('Error updating logos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateLogos();
