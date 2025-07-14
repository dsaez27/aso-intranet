import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardHomePage from '../page';
import { useAuth } from '@/hooks/use-auth';
import { useInventory } from '@/hooks/use-inventory';

// Mock dependencies
jest.mock('@/hooks/use-auth', () => ({
  useAuth: jest.fn(),
}));
jest.mock('@/hooks/use-inventory', () => ({
  useInventory: jest.fn(),
}));

// Mock the dynamic import of HomeDashboard
jest.mock('next/dynamic', () => () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { HomeDashboard } = require('@/components/home/home-dashboard');
    return HomeDashboard;
});

const mockUseAuth = useAuth as jest.Mock;
const mockUseInventory = useInventory as jest.Mock;

describe('DashboardHomePage', () => {
  const mockItems = [{ id: '1', product: 'Test Item', category: 'Test', quantity: 10, minimumQuantity: 5, status: 'En Stock' }];

  it('renders the dashboard with all quick links for an admin user', () => {
    mockUseAuth.mockReturnValue({ user: { role: 'Administrador General' } }); 
    mockUseInventory.mockReturnValue({ items: mockItems, loading: false });
    render(<DashboardHomePage />);
    
    expect(screen.getByText('Accesos Rápidos')).toBeInTheDocument();
    
    expect(screen.getByRole('link', { name: /gestionar inventario/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ver analíticas/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /administrar usuarios/i })).toBeInTheDocument();
  });

  it('renders the dashboard with limited quick links for a non-admin user', () => {
    mockUseAuth.mockReturnValue({ user: { role: 'Docente' } });
    mockUseInventory.mockReturnValue({ items: mockItems, loading: false });
    render(<DashboardHomePage />);
    
    expect(screen.getByText('Accesos Rápidos')).toBeInTheDocument();
    
    expect(screen.getByRole('link', { name: /gestionar inventario/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /crear solicitud/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /ver analíticas/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /administrar usuarios/i })).not.toBeInTheDocument();
  });

  it('passes inventory items to HomeDashboard', () => {
    mockUseAuth.mockReturnValue({ user: { role: 'Docente' } });
    mockUseInventory.mockReturnValue({ items: mockItems, loading: false });
    render(<DashboardHomePage />);
    // Check if a KPI card, which depends on items, is rendered.
    expect(screen.getByText('Artículos Totales')).toBeInTheDocument();
    expect(screen.getByText(mockItems.length.toString())).toBeInTheDocument();
  });
});
