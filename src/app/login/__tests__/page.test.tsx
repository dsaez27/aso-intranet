import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../page';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

// Mock dependencies
jest.mock('@/hooks/use-auth', () => ({
  useAuth: jest.fn(),
}));
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

const mockUseAuth = useAuth as jest.Mock;
const mockUseToast = useToast as jest.Mock;

describe('LoginPage', () => {
  let mockLogin: jest.Mock;
  let mockToast: jest.Mock;

  beforeEach(() => {
    mockLogin = jest.fn();
    mockToast = jest.fn();
    mockUseAuth.mockReturnValue({ login: mockLogin });
    mockUseToast.mockReturnValue({ toast: mockToast });
  });

  it('renders the login form elements', () => {
    render(<LoginPage />);

    expect(screen.getByText('Escuela Angelina Salas Olivares')).toBeInTheDocument();
    expect(screen.getByText('Sistema de Gestión de Inventario')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).toBeInTheDocument();
  });

  it('calls the login function on form submission', async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@escuela.test' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@escuela.test', 'password123');
    });
  });

  it('shows a toast message on failed login', async () => {
    mockLogin.mockResolvedValue(false); // Simulate failed login
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'wrong@escuela.test' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Inicio de Sesión Fallido',
        description: 'Email o contraseña incorrectos.',
      });
    });
  });

  it('does not show a toast message on successful login', async () => {
    mockLogin.mockResolvedValue(true); // Simulate successful login
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'correct@escuela.test' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'correctpassword' } });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

    await waitFor(() => {
      expect(mockToast).not.toHaveBeenCalled();
    });
  });
});
