import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useTransactionsViewModel } from '../../viewmodels/TransactionsViewModel';
import * as sampleData from '../../utils/sampleData';
import { mockTransactions, createMockTransaction } from '../utils/testHelpers';

jest.mock('../../utils/sampleData', () => ({
  getSampleTransactions: jest.fn(),
}));

describe('useTransactionsViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (sampleData.getSampleTransactions as jest.Mock).mockReturnValue(mockTransactions);
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useTransactionsViewModel());

    expect(result.current.isLoading).toBe(true);
  });

  it('should load transactions', async () => {
    const { result } = renderHook(() => useTransactionsViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.transactions.length).toBe(mockTransactions.length);
  });

  it('should filter transactions by type - expenses', async () => {
    const { result } = renderHook(() => useTransactionsViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.filterByType('expense');
    });

    await waitFor(() => {
      expect(result.current.filteredTransactions.every(t => t.type === 'expense')).toBe(true);
    });
  });

  it('should filter transactions by type - income', async () => {
    const { result } = renderHook(() => useTransactionsViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.filterByType('income');
    });

    await waitFor(() => {
      expect(result.current.filteredTransactions.every(t => t.type === 'income')).toBe(true);
    });
  });

  it('should show all transactions when filter is "all"', async () => {
    const { result } = renderHook(() => useTransactionsViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.filterByType('all');
    });

    await waitFor(() => {
      expect(result.current.filteredTransactions.length).toBe(mockTransactions.length);
    });
  });

  it('should filter by category', async () => {
    const { result } = renderHook(() => useTransactionsViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.filterByCategory('4'); // Groceries
    });

    await waitFor(() => {
      expect(result.current.filteredTransactions.every(t => t.categoryId === '4')).toBe(true);
    });
  });

  it('should clear category filter when passed null', async () => {
    const { result } = renderHook(() => useTransactionsViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.filterByCategory('4');
    });

    await waitFor(() => {
      expect(result.current.filteredTransactions.length).toBeLessThan(mockTransactions.length);
    });

    act(() => {
      result.current.filterByCategory(null);
    });

    await waitFor(() => {
      expect(result.current.filteredTransactions.length).toBe(mockTransactions.length);
    });
  });

  it('should sort filtered transactions by date (most recent first)', async () => {
    const { result } = renderHook(() => useTransactionsViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const transactions = result.current.filteredTransactions;
    for (let i = 0; i < transactions.length - 1; i++) {
      expect(transactions[i].date.getTime()).toBeGreaterThanOrEqual(
        transactions[i + 1].date.getTime()
      );
    }
  });

  it('should add a new transaction', async () => {
    const { result } = renderHook(() => useTransactionsViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const initialCount = result.current.transactions.length;

    act(() => {
      result.current.addTransaction({
        amount: 250,
        categoryId: '4',
        description: 'New Transaction',
        date: new Date(),
        type: 'expense',
      });
    });

    await waitFor(() => {
      expect(result.current.transactions.length).toBe(initialCount + 1);
    });

    const newTransaction = result.current.transactions[0]; // Should be first (most recent)
    expect(newTransaction.description).toBe('New Transaction');
    expect(newTransaction.amount).toBe(250);
  });

  it('should provide categories', async () => {
    const { result } = renderHook(() => useTransactionsViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.categories).toBeDefined();
    expect(result.current.categories.length).toBeGreaterThan(0);
  });

  it('should handle empty transactions', async () => {
    (sampleData.getSampleTransactions as jest.Mock).mockReturnValue([]);

    const { result } = renderHook(() => useTransactionsViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.transactions.length).toBe(0);
    expect(result.current.filteredTransactions.length).toBe(0);
  });

  it('should combine filters (type and category)', async () => {
    const mixedTransactions = [
      createMockTransaction({ id: '1', categoryId: '4', type: 'expense' }),
      createMockTransaction({ id: '2', categoryId: '4', type: 'income' }),
      createMockTransaction({ id: '3', categoryId: '5', type: 'expense' }),
    ];
    (sampleData.getSampleTransactions as jest.Mock).mockReturnValue(mixedTransactions);

    const { result } = renderHook(() => useTransactionsViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.filterByCategory('4');
      result.current.filterByType('expense');
    });

    await waitFor(() => {
      expect(result.current.filteredTransactions.length).toBe(1);
      expect(result.current.filteredTransactions[0].id).toBe('1');
    });
  });
});
