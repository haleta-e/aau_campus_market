import { db } from '../../db';
import { products, sellers, audit_logs, Product, NewProduct } from '../../db/schema';
import { eq, and, ilike, sql, SQL } from 'drizzle-orm';
import { ProductListQuery, UpdateProductDTO } from './product.schema';

export class ProductRepository {
  async findById(id: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return result[0];
  }

  async findSellerByUserId(userId: string) {
    const result = await db.select().from(sellers).where(eq(sellers.user_id, userId)).limit(1);
    return result[0];
  }

  async findAll(query: ProductListQuery) {
    const { page, limit, category, search, seller_id } = query;
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [eq(products.status, 'ACTIVE')];

    if (category) conditions.push(eq(products.category, category));
    if (seller_id) conditions.push(eq(products.seller_id, seller_id));
    if (search) conditions.push(ilike(products.name, `%${search}%`));

    const rows = await db
      .select({
        id: products.id,
        seller_id: products.seller_id,
        name: products.name,
        description: products.description,
        category: products.category,
        price: products.price,
        stock_quantity: products.stock_quantity,
        status: products.status,
        created_at: products.created_at,
        updated_at: products.updated_at,
        store_name: sellers.store_name,
        campus_location: sellers.campus_location,
      })
      .from(products)
      .leftJoin(sellers, eq(products.seller_id, sellers.id))
      .where(and(...conditions))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(products)
      .where(and(...conditions));

    return { rows, total: count, page, limit };
  }

  async findByIdWithSeller(id: string) {
    const result = await db
      .select({
        id: products.id,
        seller_id: products.seller_id,
        name: products.name,
        description: products.description,
        category: products.category,
        price: products.price,
        stock_quantity: products.stock_quantity,
        status: products.status,
        created_at: products.created_at,
        updated_at: products.updated_at,
        store_name: sellers.store_name,
        campus_location: sellers.campus_location,
        seller_phone: sellers.phone,
      })
      .from(products)
      .leftJoin(sellers, eq(products.seller_id, sellers.id))
      .where(eq(products.id, id))
      .limit(1);
    return result[0];
  }

  async create(data: NewProduct): Promise<Product> {
    const [product] = await db.insert(products).values(data).returning();
    return product;
  }

  async update(id: string, data: UpdateProductDTO): Promise<Product | undefined> {
    const updatePayload: any = { ...data, updated_at: new Date() };
    if (data.price !== undefined) updatePayload.price = String(data.price);
    const [updated] = await db
      .update(products)
      .set(updatePayload)
      .where(eq(products.id, id))
      .returning();
    return updated;
  }

  async deactivate(id: string): Promise<Product | undefined> {
    const [updated] = await db
      .update(products)
      .set({ status: 'INACTIVE', updated_at: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updated;
  }

  async createAuditLog(log: {
    actor_id?: string;
    action: string;
    entity_type: string;
    entity_id?: string;
    old_value?: any;
    new_value?: any;
    ip_address?: string;
  }) {
    await db.insert(audit_logs).values(log);
  }
}
