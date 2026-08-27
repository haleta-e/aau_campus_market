import { AdminRepository } from './admin.repository';
import { AuditLogsQueryDTO, UpdateUserStatusDTO } from './admin.schema';
import { JwtPayload } from '../../utils/jwt.util';

export class AdminService {
  private repo = new AdminRepository();

  async getDashboardStats() {
    return this.repo.getSystemStats();
  }

  async getAuditLogs(query: AuditLogsQueryDTO) {
    return this.repo.getAuditLogs(query);
  }

  async getAllUsers() {
    return this.repo.getAllUsers();
  }

  async updateUserStatus(userId: string, dto: UpdateUserStatusDTO, actor: JwtPayload, ipAddress?: string) {
    const updated = await this.repo.updateUserStatus(userId, dto.status);
    if (!updated) {
      throw { status: 404, code: 'USER_NOT_FOUND', message: 'User not found' };
    }

    await this.repo.createAuditLog({
      actor_id: actor.userId,
      action: 'ADMIN_UPDATED_USER_STATUS',
      entity_type: 'USER',
      entity_id: userId,
      new_value: { status: dto.status },
      ip_address: ipAddress,
    });

    return updated;
  }

  async getAllOrders() {
    return this.repo.getAllOrders();
  }
}
