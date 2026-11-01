import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { AdminDashboard } from './AdminDashboard';
import * as adminService from '../services/adminService';

// Mock the entire adminService module
vi.mock('../services/adminService');

const mockStats = {
  total_users: 42, total_sellers: 5, total_products: 120,
  total_orders: 88, total_complaints: 3, total_revenue_etb: '45600.00',
};

const mockUsers = [
  { id: 'u1', email: 'admin@aau.et', username: 'sysadmin', role: 'ADMIN' as const,
    status: 'ACTIVE' as const, created_at: '2026-01-01T00:00:00Z', store_name: null },
  { id: 'u2', email: 'seller@aau.et', username: 'seller1', role: 'SELLER' as const,
    status: 'ACTIVE' as const, created_at: '2026-01-02T00:00:00Z', store_name: 'AAU Bookshop' },
];

const mockOrders = [
  { id: 'o1', order_number: 'ORD-001', buyer_id: 'b1', buyer_username: 'buyer1',
    buyer_email: 'buyer@aau.et', seller_id: 's1', store_name: 'AAU Bookshop',
    status: 'COMPLETED' as const, payment_status: 'SUCCESS', total_amount: '250.00',
    created_at: '2026-10-01T08:00:00Z', accepted_at: null, completed_at: '2026-10-01T09:00:00Z' },
];

const mockComplaints = [
  { id: 'c1', complaint_number: 'CMP-001', order_id: 'o1', buyer_id: 'b1',
    seller_id: 's1', admin_id: null, subject: 'Wrong item delivered',
    description: 'Wrong book received.', status: 'OPEN' as const,
    priority: 'HIGH' as const, resolution: null,
    created_at: '2026-10-05T10:00:00Z', updated_at: '2026-10-05T10:00:00Z', resolved_at: null },
];

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(adminService.getAdminStats).mockResolvedValue(mockStats);
    vi.mocked(adminService.getAdminUsers).mockResolvedValue(mockUsers);
    vi.mocked(adminService.getAdminOrders).mockResolvedValue(mockOrders);
    vi.mocked(adminService.getAdminComplaints).mockResolvedValue(mockComplaints);
    vi.mocked(adminService.getAuditLogs).mockResolvedValue({ rows: [], total: 0, page: 1, limit: 25 });
  });

  it('renders the admin dashboard title', () => {
    render(<AdminDashboard />);
    expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
  });

  it('shows tab navigation with all expected sections', () => {
    render(<AdminDashboard />);
    expect(screen.getByRole('button', { name: /Overview/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Users/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Orders/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Complaints/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Inventory/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Audit Trail/i })).toBeInTheDocument();
  });

  it('loads and displays dashboard KPI statistics on Overview tab', async () => {
    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText('42')).toBeInTheDocument(); // total_users
      expect(screen.getByText('120')).toBeInTheDocument(); // total_products
    });
  });

  it('switches to Users tab and shows user table', async () => {
    render(<AdminDashboard />);
    fireEvent.click(screen.getByRole('button', { name: /Users/i }));
    await waitFor(() => {
      expect(screen.getByText('sysadmin')).toBeInTheDocument();
      expect(screen.getByText('seller1')).toBeInTheDocument();
      expect(screen.getByText('AAU Bookshop')).toBeInTheDocument();
    });
  });

  it('switches to Orders tab and shows order table', async () => {
    render(<AdminDashboard />);
    fireEvent.click(screen.getByRole('button', { name: /Orders/i }));
    await waitFor(() => {
      expect(screen.getByText('ORD-001')).toBeInTheDocument();
      expect(screen.getByText('buyer1')).toBeInTheDocument();
    });
  });

  it('switches to Complaints tab and shows complaint table', async () => {
    render(<AdminDashboard />);
    fireEvent.click(screen.getByRole('button', { name: /Complaints/i }));
    await waitFor(() => {
      expect(screen.getByText('CMP-001')).toBeInTheDocument();
      expect(screen.getByText('Wrong item delivered')).toBeInTheDocument();
    });
  });

  it('shows blocked features notice', () => {
    render(<AdminDashboard />);
    expect(screen.getByText(/Features Not Yet Implemented/i)).toBeInTheDocument();
    expect(screen.getByText(/Discount Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Special Requests/i)).toBeInTheDocument();
    expect(screen.getByText(/Delivery Worker Management/i)).toBeInTheDocument();
  });

  it('shows "Protected" for admin user status actions', async () => {
    render(<AdminDashboard />);
    fireEvent.click(screen.getByRole('button', { name: /Users/i }));
    await waitFor(() => {
      expect(screen.getByText('Protected')).toBeInTheDocument();
    });
  });
});
