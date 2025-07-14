import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SettingsPage from '../page';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from 'next-themes';

// Mock dependencies
jest.mock('@/hooks/use-auth');
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

const mockUseAuth = useAuth as jest.Mock;
const mockUseTheme = useTheme as jest.Mock;

describe('SettingsPage', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: { username: 'testuser', email: 'test@test.com', role: 'Docente' } });
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: jest.fn(),
    });
  });

  it('renders user profile information', () => {
    render(<SettingsPage />);
    
    expect(screen.getByLabelText('Nombre de Usuario')).toHaveValue('testuser');
    expect(screen.getByLabelText('Email')).toHaveValue('test@test.com');
    expect(screen.getByLabelText('Rol')).toHaveValue('Docente');
  });

  it('renders theme switcher buttons', () => {
    render(<SettingsPage />);
    
    expect(screen.getByRole('button', { name: /claro/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /oscuro/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sistema/i })).toBeInTheDocument();
  });

  it('calls setTheme when a theme button is clicked', () => {
    const setTheme = jest.fn();
    mockUseTheme.mockReturnValue({ theme: 'light', setTheme });
    render(<SettingsPage />);

    const darkButton = screen.getByRole('button', { name: /oscuro/i });
    fireEvent.click(darkButton);

    expect(setTheme).toHaveBeenCalledWith('dark');
  });

  it('renders loading skeletons if user is not available', () => {
    mockUseAuth.mockReturnValue({ user: null });
    render(<SettingsPage />);
    
    const skeletons = screen.getAllByRole('generic', { name: '' });
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
