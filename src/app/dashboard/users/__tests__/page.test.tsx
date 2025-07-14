import React from 'react';
import { render, screen } from '@testing-library/react';
import UsersPage from '../page';
import { useAuth } from '@/hooks/use-auth';
import { useUsers } from '@/hooks/use-users';

// Mock dependencies
jest.mock('@/hooks/use-auth');
jest.mock('@/hooks/use-users');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));

jest.mock('@/components/users/user-management-page', () => ({
    UserManagementPage: () => <div data-testid="user-management-page-component" />
}));


const mockUseAuth = useAuth as jest.Mock;
const mockUseUsers = useUsers as jest.Mock;

describe('UsersPage', () => {
  it('renders loading skeleton when auth is loading', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });
    mockUseUsers.mockReturnValue({ loading: false });
    render(<UsersPage />);

    const skeletons = screen.getAllByRole('generic', { name: '' });
    expect(skeletons.length).toBeGreaterThan(0);
    expect(screen.queryByTestId('user-management-page-component')).not.toBeInTheDocument();
  });

  it('renders loading skeleton when users are loading', () => {
    mockUseAuth.mockReturnValue({ user: { id: '1', role: 'Administrador General' }, loading: false });
    mockUseUsers.mockReturnValue({ loading: true });
    render(<UsersPage />);

    const skeletons = screen.getAllByRole('generic', { name: '' });
    expect(skeletons.length).toBeGreaterThan(0);
    expect(screen.queryByTestId('user-management-page-component')).not.toBeInTheDocument();
  });

  it('renders user management component when data is loaded', () => {
    mockUseAuth.mockReturnValue({ user: { id: '1', role: 'Administrador General' }, loading: false });
    mockUseUsers.mockReturnValue({ loading: false });
    render(<UsersPage />);
    
    expect(screen.getByText('Gestión de Usuarios')).toBeInTheDocument();
    expect(screen.getByTestId('user-management-page-component')).toBeInTheDocument();
  });
  
  it('redirects if user is not authenticated', () => {
    const mockRouter = { replace: jest.fn() };
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue(mockRouter);
    mockUseAuth.mockReturnValue({ user: null, loading: false });
    mockUseUsers.mockReturnValue({ loading: false });
    render(<UsersPage />);
    
    expect(mockRouter.replace).toHaveBeenCalledWith('/dashboard');
  });
});
