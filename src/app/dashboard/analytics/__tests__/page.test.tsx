import React from 'react';
import { render, screen } from '@testing-library/react';
import AnalyticsPage from '../page';
import { useAuth } from '@/hooks/use-auth';
import { useInventory } from '@/hooks/use-inventory';
import { useRequests } from '@/hooks/use-requests';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/hooks/use-auth');
jest.mock('@/hooks/use-inventory');
jest.mock('@/hooks/use-requests');

const mockUseAuth = useAuth as jest.Mock;
const mockUseInventory = useInventory as jest.Mock;
const mockUseRequests = useRequests as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;

describe('AnalyticsPage', () => {
  const mockInventoryItems = [
    { id: '1', category: 'Cat A', status: 'En Stock', quantity: 10, minimumQuantity: 5 },
    { id: '2', category: 'Cat B', status: 'Stock Bajo', quantity: 4, minimumQuantity: 5 },
  ];
  const mockRequests = [
    { id: 'r1', status: 'Pendiente', itemName: 'Item 1', quantity: 2, requesterName: 'User A' },
    { id: 'r2', status: 'Aprobado', itemName: 'Item 2', quantity: 1, requesterName: 'User B' },
  ];

  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      replace: jest.fn(),
    });
    mockUseAuth.mockReturnValue({ user: { role: 'Administrador General' }, loading: false });
    mockUseInventory.mockReturnValue({ items: mockInventoryItems, loading: false });
    mockUseRequests.mockReturnValue({ requests: mockRequests, loading: false });
  });

  it('renders the analytics dashboard when data is loaded', () => {
    render(<AnalyticsPage />);
    
    expect(screen.getByText('Análisis de Inventario')).toBeInTheDocument();
    expect(screen.getByText('Visualiza métricas y tendencias clave de tu inventario, solicitudes y actividad de usuarios.')).toBeInTheDocument();
    
    // Check for KPI cards
    expect(screen.getByText('Categorías Únicas')).toBeInTheDocument();
    expect(screen.getByText('Artículos Totales')).toBeInTheDocument();
    
    // Check for a chart title
    expect(screen.getByText('Estado de Solicitudes')).toBeInTheDocument();
  });

  it('renders loading skeletons when auth is loading', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });
    render(<AnalyticsPage />);

    // Check for the presence of skeletons
    const skeletons = screen.getAllByRole('generic', { name: '' });
    // This is a bit fragile, but we can check if there are a bunch of skeletons rendered.
    // Each <Skeleton /> component will have a role of 'generic' and an empty accessible name.
    expect(skeletons.length).toBeGreaterThan(5); 
  });
  
  it('renders loading skeletons when inventory is loading', () => {
    mockUseInventory.mockReturnValue({ items: [], loading: true });
    render(<AnalyticsPage />);

    const skeletons = screen.getAllByRole('generic', { name: '' });
    expect(skeletons.length).toBeGreaterThan(5);
  });

  it('redirects if user is not present after loading', () => {
    const replace = jest.fn();
    mockUseRouter.mockReturnValue({ replace });
    mockUseAuth.mockReturnValue({ user: null, loading: false });
    render(<AnalyticsPage />);
    
    expect(replace).toHaveBeenCalledWith('/dashboard');
  });

});
