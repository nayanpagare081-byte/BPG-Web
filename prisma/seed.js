/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'dev.db');
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('BPG@admin2024', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bpg.com' },
    update: {},
    create: {
      name: 'BPG Admin',
      email: 'admin@bpg.com',
      password: adminPassword,
      phone: '+91 96239 41966',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create sample customer
  const customerPassword = await bcrypt.hash('customer123', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      name: 'Rajesh Kumar',
      email: 'customer@example.com',
      password: customerPassword,
      phone: '+91 98765 43210',
      role: 'CUSTOMER',
    },
  });
  console.log('✅ Customer user created:', customer.email);

  // Create categories
  const categories = [
    { name: 'Excavators', slug: 'excavators', description: 'Heavy-duty excavators for earthmoving and construction projects', image: '/images/categories/excavators.jpg' },
    { name: 'Wheel Loaders', slug: 'wheel-loaders', description: 'Versatile wheel loaders for material handling and loading operations', image: '/images/categories/loaders.jpg' },
    { name: 'Bulldozers', slug: 'bulldozers', description: 'Powerful bulldozers for grading, pushing, and land clearing', image: '/images/categories/bulldozers.jpg' },
    { name: 'Compactors', slug: 'compactors', description: 'Road rollers and compactors for soil and asphalt compaction', image: '/images/categories/compactors.jpg' },
    { name: 'Cranes', slug: 'cranes', description: 'Mobile and tower cranes for heavy lifting operations', image: '/images/categories/cranes.jpg' },
    { name: 'Dump Trucks', slug: 'dump-trucks', description: 'Mining and construction dump trucks for material transport', image: '/images/categories/dump-trucks.jpg' },
  ];

  const createdCategories = [];
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories.push(created);
  }
  console.log('✅ Categories created:', createdCategories.length);

  // Create products
  const products = [
    {
      name: 'BPG EX-450 Hydraulic Excavator',
      slug: 'bpg-ex-450-hydraulic-excavator',
      description: 'The BPG EX-450 is a heavy-duty hydraulic excavator engineered for maximum productivity in the most demanding earthmoving operations. With a powerful turbocharged diesel engine delivering 450 HP, this machine combines raw power with precision control.',
      specifications: JSON.stringify({ 'Operating Weight': '45,000 kg', 'Engine Power': '450 HP', 'Max Digging Depth': '8.2 m', 'Bucket Capacity': '2.1 m³', 'Max Reach': '12.5 m', 'Fuel Tank': '680 L' }),
      categoryId: createdCategories[0].id, price: 8500000, showPrice: false,
      images: JSON.stringify(['/images/products/excavator-1.jpg']), featured: true, inStock: true,
    },
    {
      name: 'BPG EX-220 Crawler Excavator',
      slug: 'bpg-ex-220-crawler-excavator',
      description: 'The EX-220 is a mid-range crawler excavator perfect for urban construction, road building, and utility work. Its compact design allows operation in tight spaces while maintaining the power expected from BPG equipment.',
      specifications: JSON.stringify({ 'Operating Weight': '22,000 kg', 'Engine Power': '165 HP', 'Max Digging Depth': '6.7 m', 'Bucket Capacity': '1.0 m³', 'Max Reach': '9.9 m', 'Fuel Tank': '400 L' }),
      categoryId: createdCategories[0].id, price: 4200000, showPrice: false,
      images: JSON.stringify(['/images/products/excavator-2.jpg']), featured: true, inStock: true,
    },
    {
      name: 'BPG WL-950 Wheel Loader',
      slug: 'bpg-wl-950-wheel-loader',
      description: 'The WL-950 is a flagship wheel loader built for high-volume material handling. With its massive bucket capacity and powerful drivetrain, it excels in quarry operations and heavy construction loading.',
      specifications: JSON.stringify({ 'Operating Weight': '33,500 kg', 'Engine Power': '350 HP', 'Bucket Capacity': '5.0 m³', 'Breakout Force': '220 kN', 'Max Speed': '40 km/h', 'Fuel Tank': '500 L' }),
      categoryId: createdCategories[1].id, price: 6800000, showPrice: false,
      images: JSON.stringify(['/images/products/loader-1.jpg']), featured: true, inStock: true,
    },
    {
      name: 'BPG WL-450 Compact Loader',
      slug: 'bpg-wl-450-compact-loader',
      description: 'The WL-450 compact wheel loader is designed for versatility in confined spaces. Ideal for construction sites, warehouses, and agricultural applications with quick-attach system.',
      specifications: JSON.stringify({ 'Operating Weight': '8,200 kg', 'Engine Power': '95 HP', 'Bucket Capacity': '1.2 m³', 'Breakout Force': '65 kN', 'Max Speed': '35 km/h', 'Fuel Tank': '120 L' }),
      categoryId: createdCategories[1].id, price: 2800000, showPrice: true,
      images: JSON.stringify(['/images/products/loader-2.jpg']), featured: false, inStock: true,
    },
    {
      name: 'BPG BD-850 Heavy Bulldozer',
      slug: 'bpg-bd-850-heavy-bulldozer',
      description: 'The BD-850 is an earth-moving powerhouse designed for the toughest grading and land clearing jobs. Its hydrostatic drive system provides infinite speed control.',
      specifications: JSON.stringify({ 'Operating Weight': '52,000 kg', 'Engine Power': '520 HP', 'Blade Capacity': '16.4 m³', 'Blade Width': '4.88 m', 'Max Speed': '11.5 km/h', 'Fuel Tank': '800 L' }),
      categoryId: createdCategories[2].id, price: 12000000, showPrice: false,
      images: JSON.stringify(['/images/products/bulldozer-1.jpg']), featured: true, inStock: true,
    },
    {
      name: 'BPG BD-350 Medium Dozer',
      slug: 'bpg-bd-350-medium-dozer',
      description: 'The BD-350 is a versatile medium-sized bulldozer suitable for residential construction, road building, and agricultural land preparation.',
      specifications: JSON.stringify({ 'Operating Weight': '20,000 kg', 'Engine Power': '200 HP', 'Blade Capacity': '5.2 m³', 'Blade Width': '3.35 m', 'Max Speed': '10 km/h', 'Fuel Tank': '380 L' }),
      categoryId: createdCategories[2].id, price: 5500000, showPrice: false,
      images: JSON.stringify(['/images/products/bulldozer-2.jpg']), featured: false, inStock: true,
    },
    {
      name: 'BPG RC-1200 Vibratory Roller',
      slug: 'bpg-rc-1200-vibratory-roller',
      description: 'The RC-1200 is a high-performance vibratory roller designed for compacting soil, gravel, and asphalt surfaces with dual-vibration system.',
      specifications: JSON.stringify({ 'Operating Weight': '12,000 kg', 'Engine Power': '140 HP', 'Drum Width': '2.13 m', 'Vibration Frequency': '30/38 Hz', 'Max Speed': '12 km/h', 'Fuel Tank': '280 L' }),
      categoryId: createdCategories[3].id, price: 3500000, showPrice: true,
      images: JSON.stringify(['/images/products/compactor-1.jpg']), featured: false, inStock: true,
    },
    {
      name: 'BPG MC-80 Mobile Crane',
      slug: 'bpg-mc-80-mobile-crane',
      description: 'The MC-80 is a versatile mobile crane with an 80-ton lifting capacity. Its telescopic boom extends to 60 meters for industrial construction and heavy equipment installation.',
      specifications: JSON.stringify({ 'Max Lifting Capacity': '80 tons', 'Main Boom Length': '12.0 - 60.0 m', 'Max Tip Height': '62 m', 'Engine Power': '400 HP', 'Max Travel Speed': '75 km/h', 'Counterweight': '28,000 kg' }),
      categoryId: createdCategories[4].id, price: 15000000, showPrice: false,
      images: JSON.stringify(['/images/products/crane-1.jpg']), featured: true, inStock: true,
    },
    {
      name: 'BPG TC-250 Tower Crane',
      slug: 'bpg-tc-250-tower-crane',
      description: 'The TC-250 tower crane is designed for high-rise construction projects with 12-ton lifting capacity at full jib extension.',
      specifications: JSON.stringify({ 'Max Lifting Capacity': '12 tons', 'Max Jib Length': '70 m', 'Max Free Standing Height': '65 m', 'Slewing Speed': '0-0.7 rpm', 'Power Supply': '380V / 50Hz' }),
      categoryId: createdCategories[4].id, price: 22000000, showPrice: false,
      images: JSON.stringify(['/images/products/crane-2.jpg']), featured: false, inStock: false,
    },
    {
      name: 'BPG DT-40 Mining Dump Truck',
      slug: 'bpg-dt-40-mining-dump-truck',
      description: 'The DT-40 is a rigid frame dump truck designed for mining and large-scale earthmoving with 40-ton payload capacity.',
      specifications: JSON.stringify({ 'Payload Capacity': '40 tons', 'Engine Power': '540 HP', 'Body Volume': '25.2 m³', 'Max Speed': '55 km/h', 'Fuel Tank': '600 L' }),
      categoryId: createdCategories[5].id, price: 9500000, showPrice: false,
      images: JSON.stringify(['/images/products/dump-truck-1.jpg']), featured: true, inStock: true,
    },
    {
      name: 'BPG DT-25 Articulated Hauler',
      slug: 'bpg-dt-25-articulated-hauler',
      description: 'The DT-25 articulated hauler is built for off-road haulage in soft and uneven terrain with 6x6 all-wheel drive.',
      specifications: JSON.stringify({ 'Payload Capacity': '25 tons', 'Engine Power': '380 HP', 'Body Volume': '15.5 m³', 'Max Speed': '50 km/h', 'Drivetrain': '6x6 AWD', 'Fuel Tank': '450 L' }),
      categoryId: createdCategories[5].id, price: 7200000, showPrice: false,
      images: JSON.stringify(['/images/products/dump-truck-2.jpg']), featured: false, inStock: true,
    },
    {
      name: 'BPG EX-80 Mini Excavator',
      slug: 'bpg-ex-80-mini-excavator',
      description: 'The EX-80 mini excavator is the perfect machine for urban construction, landscaping, and utility work with zero-tail swing design.',
      specifications: JSON.stringify({ 'Operating Weight': '8,200 kg', 'Engine Power': '65 HP', 'Max Digging Depth': '4.5 m', 'Bucket Capacity': '0.28 m³', 'Max Reach': '7.2 m', 'Tail Swing': 'Zero' }),
      categoryId: createdCategories[0].id, price: 1800000, showPrice: true,
      images: JSON.stringify(['/images/products/excavator-3.jpg']), featured: false, inStock: true,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }
  console.log('✅ Products created:', products.length);

  // Create sample reviews
  const allProducts = await prisma.product.findMany();
  const reviewData = [
    { rating: 5, comment: 'Exceptional machine! The EX-450 has transformed our quarry operations. Reliability is outstanding.', approved: true },
    { rating: 4, comment: 'Solid performance on our highway project. The operator cab is very comfortable for long shifts.', approved: true },
    { rating: 5, comment: 'We have been using BPG equipment for 3 years. Their after-sales support is the best in the industry.', approved: true },
    { rating: 4, comment: 'Good value for the price point. The hydraulic system is smooth and responsive.', approved: true },
    { rating: 5, comment: 'This loader has been a game-changer for our mining operation. Very impressed with BPG quality.', approved: true },
  ];

  for (let i = 0; i < reviewData.length && i < allProducts.length; i++) {
    await prisma.review.create({
      data: { userId: customer.id, productId: allProducts[i].id, ...reviewData[i] },
    });
  }
  console.log('✅ Reviews created:', reviewData.length);

  // Create sample inquiries
  await prisma.inquiry.create({
    data: {
      userId: customer.id, name: 'Rajesh Kumar', email: 'customer@example.com', phone: '+91 98765 43210',
      message: 'Interested in purchasing 2 excavators for our new construction project in Pune.',
      status: 'CONTACTED',
      items: { create: [{ productId: allProducts[0].id, quantity: 2, message: 'Need with long arm attachment' }] },
    },
  });

  await prisma.inquiry.create({
    data: {
      userId: customer.id, name: 'Rajesh Kumar', email: 'customer@example.com', phone: '+91 98765 43210',
      message: 'Looking for a wheel loader for our warehouse operations.',
      status: 'PENDING',
      items: { create: [{ productId: allProducts[2].id, quantity: 1 }] },
    },
  });
  console.log('✅ Sample inquiries created');

  console.log('\n🎉 Database seeded successfully!');
  console.log('📧 Admin: admin@bpg.com / BPG@admin2024');
  console.log('📧 Customer: customer@example.com / customer123');
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
