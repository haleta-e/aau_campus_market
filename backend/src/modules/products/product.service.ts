import { ProductRepository } from './product.repository';
import { CreateProductDTO, UpdateProductDTO, ProductListQuery } from './product.schema';
import { JwtPayload } from '../../utils/jwt.util';

export class ProductService {
  private repo = new ProductRepository();

  async listProducts(query: ProductListQuery) {
    return this.repo.findAll(query);
  }

  async getProduct(id: string) {
    const product = await this.repo.findByIdWithSeller(id);
    if (!product) {
      throw { status: 404, code: 'PRODUCT_NOT_FOUND', message: 'Product not found' };
    }
    return product;
  }

  async createProduct(dto: CreateProductDTO, actor: JwtPayload, ipAddress?: string) {
    // Lookup seller profile that belongs to the requesting user
    const seller = await this.repo.findSellerByUserId(actor.userId);
    if (!seller) {
      throw {
        status: 403,
        code: 'NO_SELLER_PROFILE',
        message: 'No seller profile found. Register as a seller first.',
      };
    }
    if (seller.status !== 'ACTIVE') {
      throw { status: 403, code: 'SELLER_SUSPENDED', message: 'Your seller account is suspended' };
    }

    const product = await this.repo.create({
      seller_id: seller.id,
      name: dto.name,
      description: dto.description,
      category: dto.category,
      price: String(dto.price),
      stock_quantity: dto.stock_quantity,
      status: 'ACTIVE',
    });

    await this.repo.createAuditLog({
      actor_id: actor.userId,
      action: 'SELLER_CREATED_PRODUCT',
      entity_type: 'PRODUCT',
      entity_id: product.id,
      new_value: { name: product.name, price: product.price, stock: product.stock_quantity },
      ip_address: ipAddress,
    });

    return product;
  }

  async updateProduct(id: string, dto: UpdateProductDTO, actor: JwtPayload, ipAddress?: string) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw { status: 404, code: 'PRODUCT_NOT_FOUND', message: 'Product not found' };
    }

    // ADMIN can update any product; SELLER only their own
    if (actor.role === 'SELLER') {
      const seller = await this.repo.findSellerByUserId(actor.userId);
      if (!seller || existing.seller_id !== seller.id) {
        throw { status: 403, code: 'FORBIDDEN', message: 'You can only update your own products' };
      }
    }

    const updated = await this.repo.update(id, dto);

    await this.repo.createAuditLog({
      actor_id: actor.userId,
      action: 'PRODUCT_UPDATED',
      entity_type: 'PRODUCT',
      entity_id: id,
      old_value: { price: existing.price, stock: existing.stock_quantity, status: existing.status },
      new_value: dto,
      ip_address: ipAddress,
    });

    return updated;
  }

  async deleteProduct(id: string, actor: JwtPayload, ipAddress?: string) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw { status: 404, code: 'PRODUCT_NOT_FOUND', message: 'Product not found' };
    }

    if (actor.role === 'SELLER') {
      const seller = await this.repo.findSellerByUserId(actor.userId);
      if (!seller || existing.seller_id !== seller.id) {
        throw { status: 403, code: 'FORBIDDEN', message: 'You can only remove your own products' };
      }
    }

    const deactivated = await this.repo.deactivate(id);

    await this.repo.createAuditLog({
      actor_id: actor.userId,
      action: 'PRODUCT_DEACTIVATED',
      entity_type: 'PRODUCT',
      entity_id: id,
      old_value: { status: existing.status },
      new_value: { status: 'INACTIVE' },
      ip_address: ipAddress,
    });

    return deactivated;
  }
}
