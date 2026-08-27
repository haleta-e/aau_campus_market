import { db, pool } from './index';
import { users, sellers, products, orders, order_items, transactions, complaints, complaint_messages, audit_logs } from './schema';
import { hashPassword } from '../utils/password.util';

export const seedDatabase = async () => {
  console.log('🌱 Starting AAU Campus Market Database Seed...');

  try {
    // Clear existing data cleanly (Reverse dependency order)
    await db.delete(complaint_messages);
    await db.delete(complaints);
    await db.delete(transactions);
    await db.delete(order_items);
    await db.delete(orders);
    await db.delete(products);
    await db.delete(sellers);
    await db.delete(audit_logs);
    await db.delete(users);

    console.log('🧹 Existing data cleaned.');

    // 1. Create Demo Users with Argon2id Password Hashes
    const adminPasswordHash = await hashPassword('Admin@123456');
    const sellerPasswordHash = await hashPassword('Seller@123456');
    const buyerPasswordHash = await hashPassword('Buyer@123456');

    const [adminUser] = await db.insert(users).values({
      username: 'admin',
      email: 'admin@aau.edu.et',
      password_hash: adminPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
    }).returning();

    const [sellerUser] = await db.insert(users).values({
      username: 'seller01',
      email: 'seller01@aau.edu.et',
      password_hash: sellerPasswordHash,
      role: 'SELLER',
      status: 'ACTIVE',
    }).returning();

    const [buyerUser1] = await db.insert(users).values({
      username: 'buyer01',
      email: 'buyer01@aau.edu.et',
      password_hash: buyerPasswordHash,
      role: 'BUYER',
      status: 'ACTIVE',
    }).returning();

    const [buyerUser2] = await db.insert(users).values({
      username: 'buyer02',
      email: 'buyer02@aau.edu.et',
      password_hash: buyerPasswordHash,
      role: 'BUYER',
      status: 'ACTIVE',
    }).returning();

    console.log('✅ Demo Users created (Admin, Seller, 2 Buyers).');

    // 2. Create Seller Profile
    const [sellerProfile] = await db.insert(sellers).values({
      user_id: sellerUser.id,
      seller_name: 'Campus Electronics & Essentials',
      store_name: '4 Kilo Tech Hub',
      phone: '+251911223344',
      campus_location: '4 Kilo Campus',
      status: 'ACTIVE',
    }).returning();

    console.log('✅ Seller Profile created.');

    // 3. Create Sample Products owned by seller01
    const [product1] = await db.insert(products).values({
      seller_id: sellerProfile.id,
      name: 'USB Flash Drive 64GB High Speed',
      description: 'Durable USB 3.0 flash drive suitable for storing lectures and assignments.',
      category: 'Electronics',
      price: '450.00',
      stock_quantity: 25,
      status: 'ACTIVE',
    }).returning();

    const [product2] = await db.insert(products).values({
      seller_id: sellerProfile.id,
      name: 'A4 Exercise Notebook 200 Pages',
      description: 'Hardcover grid notebook for engineering and mathematics notes.',
      category: 'Stationery',
      price: '120.00',
      stock_quantity: 50,
      status: 'ACTIVE',
    }).returning();

    const [product3] = await db.insert(products).values({
      seller_id: sellerProfile.id,
      name: 'Scientific Calculator fx-991EX',
      description: 'Standard natural display calculator approved for AAU exams.',
      category: 'Electronics',
      price: '1250.00',
      stock_quantity: 10,
      status: 'ACTIVE',
    }).returning();

    console.log('✅ Sample Products created.');

    // 4. Create Sample Historical Order (ORD-2026-0001)
    const [sampleOrder] = await db.insert(orders).values({
      order_number: 'ORD-2026-0001',
      buyer_id: buyerUser1.id,
      seller_id: sellerProfile.id,
      status: 'ACCEPTED',
      total_amount: '690.00',
      payment_status: 'SUCCESS',
      accepted_at: new Date(),
      completed_at: new Date(),
    }).returning();

    // Store historical price at time of purchase in order_items
    await db.insert(order_items).values([
      {
        order_id: sampleOrder.id,
        product_id: product1.id,
        quantity: 1,
        unit_price: '450.00',
        subtotal: '450.00',
      },
      {
        order_id: sampleOrder.id,
        product_id: product2.id,
        quantity: 2,
        unit_price: '120.00',
        subtotal: '240.00',
      },
    ]);

    console.log('✅ Sample Order & Historical Order Items created.');

    // 5. Create Transaction Record
    await db.insert(transactions).values({
      order_id: sampleOrder.id,
      buyer_id: buyerUser1.id,
      seller_id: sellerProfile.id,
      amount: '690.00',
      payment_method: 'MOCK_PAYMENT',
      status: 'SUCCESS',
      reference: 'MOCK-TXN-2026-000188',
    });

    console.log('✅ Sample Payment Transaction created.');

    // 6. Create Sample Dispute / Complaint
    const [sampleComplaint] = await db.insert(complaints).values({
      complaint_number: 'CMP-2026-0001',
      order_id: sampleOrder.id,
      buyer_id: buyerUser1.id,
      seller_id: sellerProfile.id,
      admin_id: adminUser.id,
      subject: 'Minor Notebook Packaging Cover Damage',
      description: 'The notebook cover was slightly bent during pickup.',
      status: 'UNDER_REVIEW',
      priority: 'MEDIUM',
    }).returning();

    await db.insert(complaint_messages).values([
      {
        complaint_id: sampleComplaint.id,
        sender_id: buyerUser1.id,
        message: 'Hello, the corner of the notebook was bent when I opened the package.',
      },
      {
        complaint_id: sampleComplaint.id,
        sender_id: adminUser.id,
        message: 'Admin review initiated. Contacting seller for resolution options.',
      },
    ]);

    console.log('✅ Sample Complaint & Thread Messages created.');

    // 7. Create Audit Log Entries
    await db.insert(audit_logs).values([
      {
        actor_id: adminUser.id,
        action: 'ADMIN_INITIALIZED_DATABASE_SEED',
        entity_type: 'SYSTEM',
        entity_id: adminUser.id,
        new_value: { status: 'SEED_SUCCESSFUL' },
        ip_address: '127.0.0.1',
      },
      {
        actor_id: sellerUser.id,
        action: 'SELLER_CREATED_PRODUCT',
        entity_type: 'PRODUCT',
        entity_id: product1.id,
        new_value: { name: product1.name, price: product1.price },
        ip_address: '127.0.0.1',
      },
    ]);

    console.log('✅ Sample Audit Logs recorded.');

    console.log('🎉 Seed completed successfully!');
    console.log('\nDemo Accounts:');
    console.log('--------------------------------------------------');
    console.log('ADMIN  : admin@aau.edu.et    | Password: Admin@123456');
    console.log('SELLER : seller01@aau.edu.et | Password: Seller@123456');
    console.log('BUYER  : buyer01@aau.edu.et  | Password: Buyer@123456');
    console.log('BUYER  : buyer02@aau.edu.et  | Password: Buyer@123456');
    console.log('--------------------------------------------------\n');

  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  seedDatabase();
}
