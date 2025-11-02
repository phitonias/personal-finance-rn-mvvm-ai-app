import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useBudgetViewModel } from '../../viewmodels/BudgetViewModel';
import * as sampleData from '../../utils/sampleData';
import { mockBudgets, mockTransactions } from '../utils/testHelpers';

jest.mock('../../utils/sampleData', () => ({
  getSampleBudgets: jest.fn(),
  getSampleTransactions: jest.fn(),
}));

describe('useBudgetViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (sampleData.getSampleBudgets as jest.Mock).mockReturnValue(mockBudgets);
    (sampleData.getSampleTransactions as jest.Mock).mockReturnValue(mockTransactions);
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useBudgetViewModel());

    expect(result.current.isLoading).toBe(true);
  });

  it('should load budgets', async () => {
    const { result } = renderHook(() => useBudgetViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.budgets.length).toBe(mockBudgets.length);
  });

  it('should provide categories', async () => {
    const { result } = renderHook(() => useBudgetViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.categories).toBeDefined();
    expect(result.current.categories.length).toBeGreaterThan(0);
  });

  it('should add a new budget', async () => {
    const { result } = renderHook(() => useBudgetViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const initialCount = result.current.budgets.length;

    act(() => {
      result.current.addBudget({
        categoryId: '6',
        amount: 300,
        period: 'monthly',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        alertThreshold: 80,
      });
    });

    await waitFor(() => {
      expect(result.current.budgets.length).toBe(initialCount + 1);
    });

    const newBudget = result.current.budgets[result.current.budgets.length - 1];
    expect(newBudget.categoryId).toBe('6');
    expect(newBudget.amount).toBe(300);
    expect(newBudget.spent).toBe(0);
  });

  it('should update budget amount', async () => {
    const { result } = renderHook(() => useBudgetViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const budgetId = result.current.budgets[0].id;

    act(() => {
      result.current.updateBudget(budgetId, 600);
    });

    await waitFor(() => {
      const updatedBudget = result.current.budgets.find(b => b.id === budgetId);
      expect(updatedBudget?.amount).toBe(600);
    });
  });

  it('should not update non-existent budget', async () => {
    const { result } = renderHook(() => useBudgetViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const initialBudgets = [...result.current.budgets];

    act(() => {
      result.current.updateBudget('non-existent-id', 999);
    });

    await waitFor(() => {
      expect(result.current.budgets).toEqual(initialBudgets);
    });
  });

  it('should suggest budget based on transactions', async () => {
    const { result } = renderHook(() => useBudgetViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const suggestion = result.current.getSuggestedBudget('4');

    expect(suggestion).toBeGreaterThan(0);
    expect(typeof suggestion).toBe('number');
  });

  it('should handle empty budgets', async () => {
    (sampleData.getSampleBudgets as jest.Mock).mockReturnValue([]);

    const { result } = renderHook(() => useBudgetViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.budgets.length).toBe(0);
  });

  it('should preserve budget properties when updating', async () => {
    const { result } = renderHook(() => useBudgetViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const budgetId = result.current.budgets[0].id;
    const originalBudget = result.current.budgets[0];

    act(() => {
      result.current.updateBudget(budgetId, 777);
    });

    await waitFor(() => {
      const updatedBudget = result.current.budgets.find(b => b.id === budgetId);
      expect(updatedBudget?.id).toBe(originalBudget.id);
      expect(updatedBudget?.categoryId).toBe(originalBudget.categoryId);
      expect(updatedBudget?.spent).toBe(originalBudget.spent);
      expect(updatedBudget?.period).toBe(originalBudget.period);
      expect(updatedBudget?.amount).toBe(777); // Only amount changed
    });
  });
});
