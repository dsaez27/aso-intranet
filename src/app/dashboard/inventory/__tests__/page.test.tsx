import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardInventoryPage from '../page';
import { useInventory } from '@/hooks/use-inventory';

// Mock dependencies
jest.mock('@/hooks/use-inventory', () => ({
  useInventory: jest.fn(),
}));

jest.mock('@/components/inventory/inventory-page', () => ({
    InventoryPage: () => <div data-testid="inventory-page-component">Inventory Page Component</div>
}));

const mockUseInventory = useInventory as jest.Mock;

describe('DashboardInventoryPage', () => {
  it('renders the loading state initially', () => {
    mockUseInventory.mockReturnValue({ loading: true });
    render(<DashboardInventoryPage />);
    
    expect(screen.getByText('Gestión de Inventario')).toBeInTheDocument();
    // Check for skeleton elements
    const skeletons = screen.getAllByRole('generic', { name: '' });
    expect(skeletons.length).toBeGreaterThan(0);
    expect(screen.queryByTestId('inventory-page-component')).not.toBeInTheDocument();
  });

  it('renders the inventory page component when not loading', () => {
    mockUseInventory.mockReturnValue({ 
        loading: false,
        displayItems: [],
        totalFilteredItems: 0,
        currentPage: 1,
        itemsPerPage: 10,
        setCurrentPage: jest.fn(),
        sortConfig: null,
        searchQuery: '',
        setSearchQuery: jest.fn(),
        handleSort: jest.fn(),
        handleExport: jest.fn(),
        deletingItemId: null,
        isFormOpen: false,
        isDeleteConfirmOpen: false,
        entityToDelete: null,
        handleAddNew: jest.fn(),
        handleEdit: jest.fn(),
        handleDelete: jest.fn(),
        handleConfirmDelete: jest.fn(),
        setIsFormOpen: jest.fn(),
        setIsDeleteConfirmOpen: jest.fn(),
        onSubmit: jest.fn(),
        form: { handleSubmit: (fn: any) => fn }
    });
    render(<DashboardInventoryPage />);
    
    expect(screen.getByText('Gestión de Inventario')).toBeInTheDocument();
    expect(screen.getByTestId('inventory-page-component')).toBeInTheDocument();
  });
});
