import { ComplaintRepository } from './complaint.repository';
import {
  CreateComplaintDTO,
  AddComplaintMessageDTO,
  ResolveComplaintDTO,
} from './complaint.schema';
import { JwtPayload } from '../../utils/jwt.util';

export class ComplaintService {
  private repo = new ComplaintRepository();

  async fileComplaint(dto: CreateComplaintDTO, actor: JwtPayload, ipAddress?: string) {
    const order = await this.repo.findOrderById(dto.order_id);
    if (!order) {
      throw { status: 404, code: 'ORDER_NOT_FOUND', message: 'Order not found' };
    }

    if (order.buyer_id !== actor.userId) {
      throw { status: 403, code: 'FORBIDDEN', message: 'You can only file a complaint for your own order' };
    }

    const complaintNumber = await this.repo.generateComplaintNumber();

    const complaint = await this.repo.createComplaint({
      complaint_number: complaintNumber,
      order_id: order.id,
      buyer_id: actor.userId,
      seller_id: order.seller_id,
      subject: dto.subject,
      description: dto.description,
      priority: dto.priority ?? 'MEDIUM',
      status: 'OPEN',
    });

    // Add initial message into the thread
    await this.repo.addMessage({
      complaint_id: complaint.id,
      sender_id: actor.userId,
      message: dto.description,
    });

    await this.repo.createAuditLog({
      actor_id: actor.userId,
      action: 'COMPLAINT_FILED',
      entity_type: 'COMPLAINT',
      entity_id: complaint.id,
      new_value: {
        complaint_number: complaint.complaint_number,
        order_id: order.id,
        subject: dto.subject,
      },
      ip_address: ipAddress,
    });

    return complaint;
  }

  async getComplaintDetail(id: string, actor: JwtPayload) {
    const complaint = await this.repo.findComplaintById(id);
    if (!complaint) {
      throw { status: 404, code: 'COMPLAINT_NOT_FOUND', message: 'Complaint not found' };
    }

    if (actor.role === 'BUYER' && complaint.buyer_id !== actor.userId) {
      throw { status: 403, code: 'FORBIDDEN', message: 'You cannot view this complaint' };
    }

    if (actor.role === 'SELLER') {
      const seller = await this.repo.findSellerByUserId(actor.userId);
      if (!seller || complaint.seller_id !== seller.id) {
        throw { status: 403, code: 'FORBIDDEN', message: 'You cannot view this complaint' };
      }
    }

    const messages = await this.repo.findMessagesByComplaintId(id);
    return { ...complaint, messages };
  }

  async addMessage(id: string, dto: AddComplaintMessageDTO, actor: JwtPayload, ipAddress?: string) {
    const complaint = await this.repo.findComplaintById(id);
    if (!complaint) {
      throw { status: 404, code: 'COMPLAINT_NOT_FOUND', message: 'Complaint not found' };
    }

    if (actor.role === 'BUYER' && complaint.buyer_id !== actor.userId) {
      throw { status: 403, code: 'FORBIDDEN', message: 'You cannot message on this complaint' };
    }

    if (actor.role === 'SELLER') {
      const seller = await this.repo.findSellerByUserId(actor.userId);
      if (!seller || complaint.seller_id !== seller.id) {
        throw { status: 403, code: 'FORBIDDEN', message: 'You cannot message on this complaint' };
      }
    }

    if (['RESOLVED', 'REJECTED', 'CLOSED'].includes(complaint.status)) {
      throw { status: 409, code: 'COMPLAINT_CLOSED', message: 'Cannot add messages to a closed complaint' };
    }

    const msg = await this.repo.addMessage({
      complaint_id: id,
      sender_id: actor.userId,
      message: dto.message,
    });

    await this.repo.createAuditLog({
      actor_id: actor.userId,
      action: 'COMPLAINT_MESSAGE_ADDED',
      entity_type: 'COMPLAINT',
      entity_id: id,
      new_value: { message_id: msg.id },
      ip_address: ipAddress,
    });

    return msg;
  }

  async resolveComplaint(id: string, dto: ResolveComplaintDTO, actor: JwtPayload, ipAddress?: string) {
    const complaint = await this.repo.findComplaintById(id);
    if (!complaint) {
      throw { status: 404, code: 'COMPLAINT_NOT_FOUND', message: 'Complaint not found' };
    }

    const updated = await this.repo.resolveComplaint(id, actor.userId, dto.status, dto.resolution);

    await this.repo.createAuditLog({
      actor_id: actor.userId,
      action: 'COMPLAINT_RESOLVED',
      entity_type: 'COMPLAINT',
      entity_id: id,
      old_value: { status: complaint.status },
      new_value: { status: dto.status, resolution: dto.resolution },
      ip_address: ipAddress,
    });

    return updated;
  }

  async getMyComplaints(actor: JwtPayload) {
    return this.repo.findComplaintsByBuyer(actor.userId);
  }

  async getSellerComplaints(actor: JwtPayload) {
    const seller = await this.repo.findSellerByUserId(actor.userId);
    if (!seller) {
      throw { status: 403, code: 'NO_SELLER_PROFILE', message: 'No seller profile found' };
    }
    return this.repo.findComplaintsBySeller(seller.id);
  }

  async getAllComplaints() {
    return this.repo.findAllComplaints();
  }
}
