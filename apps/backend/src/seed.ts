/**
 * Seed script for the jewellery retail platform.
 * Run with: npm run seed (from apps/backend)
 *
 * Uses Strapi's document service to insert initial data.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const createStrapi = require('@strapi/strapi').default ?? require('@strapi/strapi');

async function seed() {
  console.log('🌱 Starting seed...');

  const app = await createStrapi({ appDir: process.cwd(), distDir: './dist' }).load();

  try {
    // ─── Categories ──────────────────────────────────────────────────────────
    const categoryData = [
      { name: 'Rings', description: 'Elegant rings for every occasion, from engagement to fashion' },
      { name: 'Necklaces', description: 'Stunning necklaces crafted in gold, silver and platinum' },
      { name: 'Bracelets', description: 'Fine bracelets including bangles, chain and charm styles' },
    ];

    const categories: Record<string, string> = {};

    for (const cat of categoryData) {
      const existing = await app.documents('api::category.category').findMany({
        filters: { name: { $eq: cat.name } },
      });

      if (existing.length === 0) {
        const created = await app.documents('api::category.category').create({
          data: cat,
          status: 'published',
        });
        categories[cat.name] = created.documentId;
        console.log(`  ✔ Category created: ${cat.name}`);
      } else {
        categories[cat.name] = existing[0].documentId;
        console.log(`  – Category exists: ${cat.name}`);
      }
    }

    // ─── Products ─────────────────────────────────────────────────────────────
    const products = [
      {
        name: 'Diamond Solitaire Ring',
        sku: 'RNG-001',
        price: 2499.99,
        metal: 'White Gold',
        purity: '18K',
        weight: 3.5,
        stock: 15,
        categoryName: 'Rings',
        description: 'Classic round-cut diamond solitaire in 18K white gold.',
      },
      {
        name: 'Ruby Halo Ring',
        sku: 'RNG-002',
        price: 1899.99,
        metal: 'Yellow Gold',
        purity: '18K',
        weight: 4.2,
        stock: 8,
        categoryName: 'Rings',
        description: 'Natural ruby with diamond halo in 18K yellow gold.',
      },
      {
        name: 'Sapphire Eternity Band',
        sku: 'RNG-003',
        price: 3299.99,
        metal: 'Platinum',
        purity: 'PT950',
        weight: 5.1,
        stock: 5,
        categoryName: 'Rings',
        description: 'Blue sapphire full eternity band set in platinum.',
      },
      {
        name: 'Gold Chain Necklace',
        sku: 'NCK-001',
        price: 899.99,
        metal: 'Yellow Gold',
        purity: '22K',
        weight: 8.0,
        stock: 20,
        categoryName: 'Necklaces',
        description: 'Traditional 22K gold rope chain necklace, 18 inches.',
      },
      {
        name: 'Diamond Pendant Necklace',
        sku: 'NCK-002',
        price: 1599.99,
        metal: 'White Gold',
        purity: '18K',
        weight: 3.8,
        stock: 12,
        categoryName: 'Necklaces',
        description: 'Heart-shaped diamond pendant on 18K white gold chain.',
      },
      {
        name: 'Pearl Strand Necklace',
        sku: 'NCK-003',
        price: 749.99,
        metal: 'Sterling Silver',
        purity: '925',
        weight: 25.0,
        stock: 10,
        categoryName: 'Necklaces',
        description: 'Freshwater pearl strand with sterling silver clasp.',
      },
      {
        name: 'Tennis Bracelet',
        sku: 'BRC-001',
        price: 3899.99,
        metal: 'White Gold',
        purity: '18K',
        weight: 9.5,
        stock: 6,
        categoryName: 'Bracelets',
        description: '3ct total diamond tennis bracelet in 18K white gold.',
      },
      {
        name: 'Gold Bangle Set',
        sku: 'BRC-002',
        price: 1299.99,
        metal: 'Yellow Gold',
        purity: '22K',
        weight: 28.0,
        stock: 14,
        categoryName: 'Bracelets',
        description: 'Set of 6 traditional 22K gold bangles.',
      },
      {
        name: 'Charm Bracelet',
        sku: 'BRC-003',
        price: 599.99,
        metal: 'Sterling Silver',
        purity: '925',
        weight: 12.0,
        stock: 25,
        categoryName: 'Bracelets',
        description: 'Sterling silver charm bracelet with 5 assorted charms.',
      },
      {
        name: 'Emerald Cocktail Ring',
        sku: 'RNG-004',
        price: 4199.99,
        metal: 'Yellow Gold',
        purity: '18K',
        weight: 6.3,
        stock: 3,
        categoryName: 'Rings',
        description: 'Statement Colombian emerald cocktail ring with diamond surround.',
      },
    ];

    for (const { categoryName, ...productData } of products) {
      const existing = await app.documents('api::product.product').findMany({
        filters: { sku: { $eq: productData.sku } },
      });

      if (existing.length === 0) {
        await app.documents('api::product.product').create({
          data: {
            ...productData,
            category: categories[categoryName]
              ? { connect: [{ documentId: categories[categoryName] }] }
              : undefined,
          },
          status: 'published',
        });
        console.log(`  ✔ Product created: ${productData.name} (${productData.sku})`);
      } else {
        console.log(`  – Product exists: ${productData.sku}`);
      }
    }

    // ─── Suppliers ────────────────────────────────────────────────────────────
    const suppliers = [
      {
        name: 'Gemstone World Ltd.',
        email: 'sales@gemstoneworld.com',
        phone: '+44 20 7946 0958',
        address: '12 Hatton Garden, London EC1N 8AN, UK',
      },
      {
        name: 'Precious Metals Direct',
        email: 'orders@pmdirect.com',
        phone: '+91 22 6654 3300',
        address: '45 Zaveri Bazaar, Mumbai 400002, India',
      },
    ];

    for (const supplier of suppliers) {
      const existing = await app.documents('api::supplier.supplier').findMany({
        filters: { email: { $eq: supplier.email } },
      });

      if (existing.length === 0) {
        await app.documents('api::supplier.supplier').create({ data: supplier });
        console.log(`  ✔ Supplier created: ${supplier.name}`);
      } else {
        console.log(`  – Supplier exists: ${supplier.name}`);
      }
    }

    console.log('\n✅ Seed completed successfully!');
  } catch (err) {
    console.error('❌ Seed failed:', err);
    throw err;
  } finally {
    await app.destroy();
    process.exit(0);
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
