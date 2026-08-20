import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting ApexBags Database Seeding...');

  // Create Categories
  const cat1 = await prisma.category.upsert({
    where: { slug: 'executive-laptop-bags' },
    update: {},
    create: {
      name: 'Executive Laptop Bags',
      slug: 'executive-laptop-bags',
      description: 'Custom padded laptop bags, executive sleeves, and slim corporate briefcases with custom logo branding.',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
      metaTitle: 'Custom B2B Executive Laptop Bags Manufacturer | Wholesale Supply',
      metaDescription: 'Bulk manufacturer of executive laptop bags and custom briefcases for corporate gifting and employee kits.',
      metaKeywords: 'laptop bags manufacturer, corporate briefcases wholesale, custom logo laptop bag, B2B bag supplier',
    },
  });

  const cat2 = await prisma.category.upsert({
    where: { slug: 'corporate-backpacks' },
    update: {},
    create: {
      name: 'Corporate Backpacks',
      slug: 'corporate-backpacks',
      description: 'Ergonomic business backpacks, anti-theft tech bags, and commuter packs with USB charging ports and custom embroidery.',
      image: 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=800',
      metaTitle: 'Wholesale Corporate Backpacks Manufacturer | Bulk Custom Branding',
      metaDescription: 'Leading OEM/ODM manufacturer of corporate tech backpacks and customized company event backpacks.',
      metaKeywords: 'corporate backpacks wholesale, custom business backpack, branded IT backpack',
    },
  });

  const cat3 = await prisma.category.upsert({
    where: { slug: 'duffel-travel-bags' },
    update: {},
    create: {
      name: 'Duffel & Travel Bags',
      slug: 'duffel-travel-bags',
      description: 'Heavy-duty travel duffels, weekender holdalls, and gym fitness duffels crafted for corporate rewards and brand giveaways.',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
      metaTitle: 'Custom B2B Travel Duffel Bags Manufacturer | Bulk Supplier',
      metaDescription: 'High quality wholesale duffel bags and weekender travel bags for sports teams and corporate events.',
      metaKeywords: 'custom travel duffel bags, wholesale duffel bag manufacturer, corporate sports bag',
    },
  });

  const cat4 = await prisma.category.upsert({
    where: { slug: 'eco-canvas-tote-bags' },
    update: {},
    create: {
      name: 'Eco Canvas & Tote Bags',
      slug: 'eco-canvas-tote-bags',
      description: 'Sustainable organic cotton canvas totes, heavy jute shopper bags, and eco-friendly promotional bags for exhibitions.',
      image: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&q=80&w=800',
      metaTitle: 'Eco Canvas Totes & Jute Bag Manufacturer | Wholesale Eco Bags',
      metaDescription: 'Sustainable B2B manufacturer of canvas tote bags and cotton trade show bags with screen printing.',
      metaKeywords: 'eco canvas bag manufacturer, wholesale canvas tote, jute bag supplier',
    },
  });

  // Create Products
  await prisma.product.upsert({
    where: { slug: 'apex-pro-tech-laptop-backpack' },
    update: {},
    create: {
      name: 'Apex Pro Tech 15.6 Inch Executive Laptop Backpack',
      slug: 'apex-pro-tech-laptop-backpack',
      categoryId: cat2.id,
      images: [
        'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000',
      ],
      shortDesc: 'Premium 1680D water-resistant ballistic nylon executive backpack with high-density EVA laptop padding, hidden anti-theft pocket, and USB charge port.',
      fullDesc: 'Engineered specifically for corporate onboarding kits and executive travel, the Apex Pro Tech Laptop Backpack blends sophisticated aesthetics with extreme durability.',
      features: [
        'High-Density EVA Foam Padding for 15.6" Laptops',
        'Water-Resistant 1680D Ballistic Matt Polyester Fabric',
        'External USB Smart Charging Port with Pass-Through Cable',
        'Anti-Theft Hidden Zippered Pocket on Back Panel',
      ],
      materials: '1680D Ballistic Polyester, EVA Foam Core',
      moq: 100,
      isFeatured: true,
      metaTitle: 'Apex Pro Tech Laptop Backpack | Custom Corporate B2B Manufacturer',
      metaDescription: 'Bulk executive 15.6" laptop backpack manufacturer. Water-resistant 1680D nylon.',
    },
  });

  await prisma.product.upsert({
    where: { slug: 'apex-voyager-leatherette-duffel-bag' },
    update: {},
    create: {
      name: 'Apex Voyager Leatherette Weekender Duffel Bag',
      slug: 'apex-voyager-leatherette-duffel-bag',
      categoryId: cat3.id,
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000',
      ],
      shortDesc: 'Luxury vegan leatherette weekender duffel with dedicated shoe compartment, waterproof interior lining, and debossed company logo capability.',
      fullDesc: 'The Apex Voyager Leatherette Duffel Bag is designed for corporate rewards, executive gifts, and luxury travel promotions.',
      features: [
        'Premium Scratch-Resistant Vegan PU Leatherette Outer Shell',
        'Separate Side-Access Ventilated Shoe & Laundry Pocket',
        'Reinforced Rolled Handles & Detachable Padded Shoulder Strap',
      ],
      materials: 'Premium Vegan Leatherette (PU)',
      moq: 50,
      isFeatured: true,
      metaTitle: 'Apex Voyager Leatherette Travel Duffel Bag | Wholesale B2B Supply',
      metaDescription: 'Luxury leatherette weekender duffel bag manufacturer for corporate gifting.',
    },
  });

  await prisma.product.upsert({
    where: { slug: 'ecoguard-organic-cotton-canvas-tote' },
    update: {},
    create: {
      name: 'EcoGuard Organic Cotton Canvas Tote Bag',
      slug: 'ecoguard-organic-cotton-canvas-tote',
      categoryId: cat4.id,
      images: [
        'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&q=80&w=1000',
      ],
      shortDesc: 'Heavyweight 320 GSM GOTS certified organic cotton canvas tote bag with gusseted bottom and full-color eco-friendly screen printing.',
      fullDesc: 'A staple for eco-conscious brands, trade show exhibitions, and retail merchandise.',
      features: [
        '100% GOTS Certified Organic Natural Cotton Canvas',
        'Cross-Stitched X-Reinforced Shoulder Straps',
        'Eco-Friendly Water-Based Screen Printing',
      ],
      materials: '320 GSM Organic Unbleached Cotton Canvas',
      moq: 200,
      isFeatured: true,
      metaTitle: 'EcoGuard Organic Cotton Canvas Tote Bag Manufacturer | Wholesale',
      metaDescription: 'Bulk custom organic canvas tote bag manufacturer.',
    },
  });

  // Create Default Admin User
  await prisma.adminUser.upsert({
    where: { email: 'admin@apexbags.com' },
    update: {},
    create: {
      email: 'admin@apexbags.com',
      password: 'admin123passwordhash', // Replace with bcrypt hash in production
      name: 'Apex Super Admin',
      role: 'ADMIN',
    },
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
