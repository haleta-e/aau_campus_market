import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginPage } from './LoginPage';
import { AuthProvider } from '../context/AuthContext';
import { authService } from '../services/authService';

describe('LoginPage Component', () => {
  const onSuccessMock = vi.fn();
  const onCancelMock = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  const renderWithAuth = (props = {}) => {
    return render(
      <AuthProvider>
        <LoginPage onSuccess={onSuccessMock} onCancel={onCancelMock} {...props} />
      </AuthProvider>
    );
  };

  it('renders login form elements and header', () => {
    renderWithAuth();

    expect(screen.getByRole('heading', { name: /Sign In to AAU Campus Market/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Username or AAU Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Sign In$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  it('validates empty inputs and displays field error messages', async () => {
    renderWithAuth();

    fireEvent.click(screen.getByRole('button', { name: /^Sign In$/i }));

    expect(await screen.findByText('Username or AAU email address is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(onSuccessMock).not.toHaveBeenCalled();
  });

  it('successfully logs in and invokes onSuccess callback', async () => {
    vi.spyOn(authService, 'login').mockResolvedValueOnce({
      accessToken: 'valid-jwt',
      refreshToken: 'valid-refresh',
      user: {
        id: 'u-1',
        username: 'testbuyer',
        email: 'buyer@aau.edu.et',
        role: 'BUYER',
        status: 'ACTIVE',
      },
    });

    renderWithAuth();

    fireEvent.change(screen.getByLabelText(/Username or AAU Email/i), {
      target: { value: 'testbuyer' },
    });
    fireEvent.change(screen.getByLabelText(/^Password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /^Sign In$/i }));

    await waitFor(() => {
      expect(onSuccessMock).toHaveBeenCalledTimes(1);
    });
  });

  it('displays error banner when authentication fails', async () => {
    vi.spyOn(authService, 'login').mockRejectedValueOnce({
      message: 'Invalid username or password',
      statusCode: 401,
    });

    renderWithAuth();

    fireEvent.change(screen.getByLabelText(/Username or AAU Email/i), {
      target: { value: 'testbuyer' },
    });
    fireEvent.change(screen.getByLabelText(/^Password/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /^Sign In$/i }));

    expect(await screen.findByTestId('login-error-banner')).toHaveTextContent(
      'Invalid username or password'
    );
    expect(onSuccessMock).not.toHaveBeenCalled();
  });

  it('triggers onCancel when Cancel button is clicked', () => {
    renderWithAuth();

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });
});
