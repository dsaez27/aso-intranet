import React from 'react';
import { render, screen } from '@testing-library/react';
import RepairsPage from '../page';
import { useRepairRequests } from '@/hooks/use-repair-requests';

// Mock dependencies
jest.mock('@/hooks/use-repair-requests');
jest.mock('@/components/repairs/repairs-page', () => ({
  RepairsPage: () => <div data-testid="repairs-page-component" />,
}));

const mockUseRepairRequests = useRepairRequests as jest.Mock;

describe('RepairsPage', () => {
  it('renders loading skeletons when data is loading', () => {
    mockUseRepairRequests.mockReturnValue({ loading: true });
    render(<RepairsPage />);

    expect(screen.getByText('Gestión de Soporte Técnico')).toBeInTheDocument();
    // Check for the presence of skeletons
    const skeletons = screen.getAllByRole('generic', { name: '' });
    expect(skeletons.length).toBeGreaterThan(0);
    expect(screen.queryByTestId('repairs-page-component')).not.toBeInTheDocument();
  });

  it('renders the repairs page component when data is loaded', () => {
    mockUseRepairRequests.mockReturnValue({ loading: false });
    render(<RepairsPage />);
    
    expect(screen.getByText('Gestión de Soporte Técnico')).toBeInTheDocument();
    expect(screen.getByTestId('repairs-page-component')).toBeInTheDocument();
  });
});
