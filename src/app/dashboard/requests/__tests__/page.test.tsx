import React from 'react';
import { render, screen } from '@testing-library/react';
import RequestsPage from '../page';
import { useAuth } from '@/hooks/use-auth';
import { useRequests } from '@/hooks/use-requests';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/hooks/use-auth');
jest.mock('@/hooks/use-requests');

const mockUseAuth = useAuth as jest.Mock;
const mockUseRequests = useRequests as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;

describe('RequestsPage', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      replace: jest.fn(),
    });
    mockUseAuth.mockReturnValue({ user: { role: 'Docente' }, loading: false });
    mockUseRequests.mockReturnValue({ loading: false });
  });

  it('renders the requests page component when data is loaded', () => {
    render(<RequestsPage />);
    
    expect(screen.getByText('Gestión de Solicitudes')).toBeInTheDocument();
    expect(screen.getByText('Crea y gestiona tus solicitudes de materiales. Los administradores pueden aprobar o rechazar solicitudes aquí.')).toBeInTheDocument();
  });

  it('renders loading skeletons when auth is loading', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });
    render(<RequestsPage />);

    const skeletons = screen.getAllByRole('generic', { name: '' });
    expect(skeletons.length).toBeGreaterThan(0);
  });
  
  it('renders loading skeletons when requests are loading', () => {
    mockUseRequests.mockReturnValue({ loading: true });
    render(<RequestsPage />);

    const skeletons = screen.getAllByRole('generic', { name: '' });
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('redirects if user is not present after loading', () => {
    const replace = jest.fn();
    mockUseRouter.mockReturnValue({ replace });
    mockUseAuth.mockReturnValue({ user: null, loading: false });
    render(<RequestsPage />);
    
    expect(replace).toHaveBeenCalledWith('/dashboard');
  });
});
