import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useAIInsightsViewModel } from '../../viewmodels/AIInsightsViewModel';
import * as sampleData from '../../utils/sampleData';
import { mockTransactions, mockBudgets } from '../utils/testHelpers';

jest.mock('../../utils/sampleData', () => ({
  getSampleTransactions: jest.fn(),
  getSampleBudgets: jest.fn(),
}));

describe('useAIInsightsViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (sampleData.getSampleTransactions as jest.Mock).mockReturnValue(mockTransactions);
    (sampleData.getSampleBudgets as jest.Mock).mockReturnValue(mockBudgets);
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useAIInsightsViewModel());

    expect(result.current.isLoading).toBe(true);
  });

  it('should load and generate insights', async () => {
    const { result } = renderHook(() => useAIInsightsViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.insights).toBeDefined();
    expect(result.current.insights.length).toBeGreaterThan(0);
  });

  it('should detect anomalies', async () => {
    const { result } = renderHook(() => useAIInsightsViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.anomalies).toBeDefined();
    expect(Array.isArray(result.current.anomalies)).toBe(true);
  });

  it('should categorize transaction description', async () => {
    const { result } = renderHook(() => useAIInsightsViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const categorization = result.current.categorizeTransaction('Whole Foods shopping');

    expect(categorization).toBeDefined();
    expect(categorization.categoryId).toBeDefined();
    expect(categorization.confidence).toBeGreaterThan(0);
    expect(categorization.confidence).toBeLessThanOrEqual(1);
  });

  it('should refresh insights', async () => {
    const { result } = renderHook(() => useAIInsightsViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const initialInsights = result.current.insights;

    act(() => {
      result.current.refreshInsights();
    });

    // Should set loading to true temporarily
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Insights should be regenerated
    expect(result.current.insights).toBeDefined();
  });

  it('should generate different types of insights', async () => {
    const { result } = renderHook(() => useAIInsightsViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const insights = result.current.insights;
    const insightTypes = new Set(insights.map(i => i.type));

    expect(insightTypes.size).toBeGreaterThan(0);
    expect(['tip', 'warning', 'achievement', 'prediction'].some(type =>
      insightTypes.has(type as any)
    )).toBe(true);
  });

  it('should assign priorities to insights', async () => {
    const { result } = renderHook(() => useAIInsightsViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const insights = result.current.insights;
    const priorities = insights.map(i => i.priority);

    expect(priorities.every(p => ['low', 'medium', 'high'].includes(p))).toBe(true);
  });

  it('should handle empty data gracefully', async () => {
    (sampleData.getSampleTransactions as jest.Mock).mockReturnValue([]);
    (sampleData.getSampleBudgets as jest.Mock).mockReturnValue([]);

    const { result } = renderHook(() => useAIInsightsViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.insights).toBeDefined();
    expect(Array.isArray(result.current.insights)).toBe(true);
    expect(result.current.anomalies).toBeDefined();
    expect(Array.isArray(result.current.anomalies)).toBe(true);
  });

  it('should categorize various transaction descriptions', async () => {
    const { result } = renderHook(() => useAIInsightsViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const testCases = [
      'Grocery store',
      'Uber ride',
      'Netflix subscription',
      'Restaurant dinner',
      'Electric bill',
    ];

    testCases.forEach(description => {
      const result_cat = result.current.categorizeTransaction(description);
      expect(result_cat.categoryId).toBeDefined();
      expect(result_cat.confidence).toBeGreaterThan(0);
    });
  });

  it('should maintain insight model instances', async () => {
    const { result } = renderHook(() => useAIInsightsViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const insights = result.current.insights;
    insights.forEach(insight => {
      expect(insight.getIcon).toBeDefined();
      expect(insight.getColor).toBeDefined();
      expect(typeof insight.getIcon()).toBe('string');
      expect(typeof insight.getColor()).toBe('string');
    });
  });

  it('should maintain anomaly model instances', async () => {
    const { result } = renderHook(() => useAIInsightsViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const anomalies = result.current.anomalies;
    anomalies.forEach(anomaly => {
      expect(anomaly.getFormattedAmount).toBeDefined();
      expect(anomaly.isToday).toBeDefined();
      expect(typeof anomaly.getFormattedAmount()).toBe('string');
      expect(typeof anomaly.isToday()).toBe('boolean');
    });
  });
});
