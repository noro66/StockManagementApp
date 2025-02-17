import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import ProfileScreen from '../ProfileScreen';
import { AuthService } from '@/services/authService';

// Mock the external dependencies
jest.mock('expo-router', () => ({
    router: {
        replace: jest.fn(),
    },
}));

jest.mock('@/services/authService', () => ({
    AuthService: {
        getCurrentUser: jest.fn(),
        logout: jest.fn(),
    },
}));

// Mock Alert.alert
jest.spyOn(Alert, 'alert');

describe('ProfileScreen', () => {
    const mockUser = {
        id: '123',
        name: 'John Doe',
        dob: '1990-01-01',
        city: 'New York',
        secretKey: 'abc123',
        warehouseId: 'WH001',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shows loading indicator initially', () => {
        const { getByTestId } = render(<ProfileScreen />);
        expect(getByTestId('loading-indicator')).toBeTruthy();
    });

    it('displays user profile data when fetch is successful', async () => {
        (AuthService.getCurrentUser as jest.Mock).mockResolvedValueOnce(mockUser);

        const { getByText } = render(<ProfileScreen />);

        await waitFor(() => {
            expect(getByText(mockUser.name)).toBeTruthy();
            expect(getByText(`ID: ${mockUser.id}`)).toBeTruthy();
            expect(getByText(`Date of Birth: ${mockUser.dob}`)).toBeTruthy();
            expect(getByText(`City: ${mockUser.city}`)).toBeTruthy();
            expect(getByText(`Secret Key: ${mockUser.secretKey}`)).toBeTruthy();
            expect(getByText(`Warehouse ID: ${mockUser.warehouseId}`)).toBeTruthy();
        });
    });

    it('displays error message when fetch fails', async () => {
        const errorMessage = 'Failed to fetch user profile. Please try again later.';
        (AuthService.getCurrentUser as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

        const { getByText } = render(<ProfileScreen />);

        await waitFor(() => {
            expect(getByText(errorMessage)).toBeTruthy();
            expect(Alert.alert).toHaveBeenCalledWith('Error', errorMessage);
        });
    });

    it('displays error when user data is not found', async () => {
        (AuthService.getCurrentUser as jest.Mock).mockResolvedValueOnce(null);

        const { getByText } = render(<ProfileScreen />);

        await waitFor(() => {
            expect(getByText('User data not found.')).toBeTruthy();
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'User data not found.');
        });
    });

    it('handles logout successfully', async () => {
        (AuthService.getCurrentUser as jest.Mock).mockResolvedValueOnce(mockUser);
        (AuthService.logout as jest.Mock).mockResolvedValueOnce(undefined);
        (AuthService.getCurrentUser as jest.Mock).mockResolvedValueOnce(null);

        const { getByText } = render(<ProfileScreen />);

        await waitFor(() => {
            expect(getByText('Logout')).toBeTruthy();
        });

        const logoutButton = getByText('Logout');
        await act(async () => {
            fireEvent.press(logoutButton);
        });

        expect(AuthService.logout).toHaveBeenCalled();
        expect(router.replace).toHaveBeenCalledWith('/');
    });

    it('handles logout failure', async () => {
        (AuthService.getCurrentUser as jest.Mock).mockResolvedValueOnce(mockUser);
        (AuthService.logout as jest.Mock).mockRejectedValueOnce(new Error('Logout failed'));

        const { getByText } = render(<ProfileScreen />);

        await waitFor(() => {
            expect(getByText('Logout')).toBeTruthy();
        });

        const logoutButton = getByText('Logout');
        await act(async () => {
            fireEvent.press(logoutButton);
        });

        expect(AuthService.logout).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith('Error during logout:', expect.any(Error));
    });

    // Test for component unmounting
    it('handles cleanup properly when component unmounts', () => {
        const { unmount } = render(<ProfileScreen />);
        unmount();
        // Add any cleanup assertions if needed
    });
});