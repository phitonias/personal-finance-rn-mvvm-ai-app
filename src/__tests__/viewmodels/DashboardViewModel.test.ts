import { renderHook, waitFor } from '@testing-library/react-native';
import { useDashboardViewModel } from '../../viewmodels/DashboardViewModel';
import * as sampleData from '../../utils/sampleData';
import { mockTransactions, mockBudgets } from '../utils/testHelpers';

// Mock sample data
jest.mock('../../utils/sampleData', () => ({
  getSampleTransactions: jest.fn(),
  getSampleBudgets: jest.fn(),
}));

describe('useDashboardViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (sampleData.getSampleTransactions as jest.Mock).mockReturnValue(mockTransactions);
    (sampleData.getSampleBudgets as jest.Mock).mockReturnValue(mockBudgets);
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useDashboardViewModel());

    expect(result.current.isLoading).toBe(true);
  });

  it('should load data and update state', async () => {
    const { result } = renderHook(() => useDashboardViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.categories).toBeDefined();
    expect(result.current.budgets.length).toBeGreaterThan(0);
    expect(result.current.recentTransactions.length).toBeGreaterThan(0);
  });

  it('should calculate total income correctly', async () => {
    const { result } = renderHook(() => useDashboardViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Mock data has 1 income transaction of 5000
    expect(result.current.totalIncome).toBe(5000);
  });

  it('should calculate total expenses correctly', async () => {
    const { result } = renderHook(() => useDashboardViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Mock data has 2 expense transactions: 150 + 45
    expect(result.current.totalExpenses).toBe(195);
  });

  it('should calculate balance correctly', async () => {
    const { result } = renderHook(() => useDashboardViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Balance = Income - Expenses = 5000 - 195
    expect(result.current.balance).toBe(4805);
  });

  it('should limit recent transactions to 5', async () => {
    const manyTransactions = [
      ...mockTransactions,
      ...mockTransactions,
      ...mockTransactions,
    ];
    (sampleData.getSampleTransactions as jest.Mock).mockReturnValue(manyTransactions);

    const { result } = renderHook(() => useDashboardViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.recentTransactions.length).toBeLessThanOrEqual(5);
  });

  it('should sort transactions by date (most recent first)', async () => {
    const { result } = renderHook(() => useDashboardViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const transactions = result.current.recentTransactions;
    for (let i = 0; i < transactions.length - 1; i++) {
      expect(transactions[i].date.getTime()).toBeGreaterThanOrEqual(
        transactions[i + 1].date.getTime()
      );
    }
  });

  it('should provide default categories', async () => {
    const { result } = renderHook(() => useDashboardViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.categories).toBeDefined();
    expect(result.current.categories.length).toBeGreaterThan(0);
    expect(result.current.categories[0]).toHaveProperty('id');
    expect(result.current.categories[0]).toHaveProperty('name');
    expect(result.current.categories[0]).toHaveProperty('icon');
  });

  it('should handle empty transactions', async () => {
    (sampleData.getSampleTransactions as jest.Mock).mockReturnValue([]);

    const { result } = renderHook(() => useDashboardViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.totalIncome).toBe(0);
    expect(result.current.totalExpenses).toBe(0);
    expect(result.current.balance).toBe(0);
    expect(result.current.recentTransactions.length).toBe(0);
  });

  it('should handle empty budgets', async () => {
    (sampleData.getSampleBudgets as jest.Mock).mockReturnValue([]);

    const { result } = renderHook(() => useDashboardViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.budgets.length).toBe(0);
  });
});
