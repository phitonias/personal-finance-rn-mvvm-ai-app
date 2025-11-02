import { AppleIntelligenceService } from '../../services/AppleIntelligenceService';
import { mockTransactions, mockBudgets, createMockTransaction, createMockBudget } from '../utils/testHelpers';
import { defaultCategories } from '../../models/Category';

describe('AppleIntelligenceService', () => {
  let service: AppleIntelligenceService;

  beforeEach(() => {
    service = AppleIntelligenceService.getInstance();
  });

  describe('getInstance', () => {
    it('should return singleton instance', () => {
      const instance1 = AppleIntelligenceService.getInstance();
      const instance2 = AppleIntelligenceService.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('categorizeTransaction', () => {
    it('should categorize grocery transactions', () => {
      const result = service.categorizTransaction('Whole Foods grocery shopping');

      expect(result.categoryId).toBe('4'); // Groceries
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('should categorize transport transactions', () => {
      const result = service.categorizTransaction('Uber ride to airport');

      expect(result.categoryId).toBe('5'); // Transport
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('should categorize entertainment transactions', () => {
      const result = service.categorizTransaction('Netflix subscription');

      expect(result.categoryId).toBe('6'); // Entertainment
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('should categorize utility transactions', () => {
      const result = service.categorizTransaction('Electric bill payment');

      expect(result.categoryId).toBe('7'); // Utilities
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('should categorize healthcare transactions', () => {
      const result = service.categorizTransaction('Doctor appointment');

      expect(result.categoryId).toBe('8'); // Healthcare
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('should categorize shopping transactions', () => {
      const result = service.categorizTransaction('Amazon purchase');

      expect(result.categoryId).toBe('9'); // Shopping
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('should categorize dining transactions', () => {
      const result = service.categorizTransaction('Restaurant dinner');

      expect(result.categoryId).toBe('10'); // Dining
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('should categorize salary transactions', () => {
      const result = service.categorizTransaction('Monthly salary payment');

      expect(result.categoryId).toBe('1'); // Salary
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('should return default category for unknown transaction', () => {
      const result = service.categorizTransaction('Unknown transaction xyz');

      expect(result.categoryId).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should be case insensitive', () => {
      const result1 = service.categorizTransaction('GROCERY STORE');
      const result2 = service.categorizTransaction('grocery store');

      expect(result1.categoryId).toBe(result2.categoryId);
    });
  });

  describe('generateInsights', () => {
    it('should generate insights from transactions and budgets', () => {
      const insights = service.generateInsights(
        mockTransactions,
        mockBudgets,
        defaultCategories
      );

      expect(insights).toBeDefined();
      expect(Array.isArray(insights)).toBe(true);
      expect(insights.length).toBeGreaterThan(0);
    });

    it('should include top spending category insight', () => {
      const transactions = [
        createMockTransaction({ amount: 500, categoryId: '4', type: 'expense' }),
        createMockTransaction({ amount: 100, categoryId: '5', type: 'expense' }),
      ];

      const insights = service.generateInsights(transactions, [], defaultCategories);

      const topSpendingInsight = insights.find(i => i.title === 'Top Spending Category');
      expect(topSpendingInsight).toBeDefined();
      expect(topSpendingInsight?.type).toBe('tip');
    });

    it('should generate budget warning when over threshold', () => {
      const budget = createMockBudget({
        categoryId: '4',
        amount: 100,
        spent: 90,
        alertThreshold: 80,
      });

      const insights = service.generateInsights([], [budget], defaultCategories);

      const budgetWarning = insights.find(i => i.type === 'warning');
      expect(budgetWarning).toBeDefined();
      expect(budgetWarning?.priority).toBe('high');
    });

    it('should generate spending forecast', () => {
      const insights = service.generateInsights(
        mockTransactions,
        mockBudgets,
        defaultCategories
      );

      const forecast = insights.find(i => i.type === 'prediction');
      expect(forecast).toBeDefined();
      expect(forecast?.title).toBe('Spending Forecast');
    });

    it('should generate savings achievement when applicable', () => {
      const transactions = [
        createMockTransaction({ amount: 5000, type: 'income' }),
        createMockTransaction({ amount: 200, type: 'expense' }),
      ];

      const insights = service.generateInsights(transactions, [], defaultCategories);

      const achievement = insights.find(i => i.type === 'achievement');
      expect(achievement).toBeDefined();
      expect(achievement?.message).toContain('saved');
    });

    it('should detect recurring expenses', () => {
      const transactions = [
        createMockTransaction({ amount: 50, isRecurring: true }),
        createMockTransaction({ amount: 100, isRecurring: true }),
      ];

      const insights = service.generateInsights(transactions, [], defaultCategories);

      const recurringInsight = insights.find(i => i.title === 'Recurring Expenses');
      expect(recurringInsight).toBeDefined();
      expect(recurringInsight?.message).toContain('recurring expenses');
    });

    it('should handle empty transactions', () => {
      const insights = service.generateInsights([], [], defaultCategories);

      expect(insights).toBeDefined();
      expect(Array.isArray(insights)).toBe(true);
    });
  });

  describe('suggestBudget', () => {
    it('should suggest budget based on transaction history', () => {
      const transactions = [
        createMockTransaction({ categoryId: '4', amount: 100, type: 'expense' }),
        createMockTransaction({ categoryId: '4', amount: 200, type: 'expense' }),
        createMockTransaction({ categoryId: '4', amount: 150, type: 'expense' }),
      ];

      const suggestion = service.suggestBudget('4', transactions);

      expect(suggestion).toBeGreaterThan(0);
      // Should be around 150 * 1.2 = 180
      expect(suggestion).toBeGreaterThanOrEqual(150);
    });

    it('should return default budget for category with no transactions', () => {
      const suggestion = service.suggestBudget('4', []);

      expect(suggestion).toBe(200);
    });

    it('should ignore income transactions', () => {
      const transactions = [
        createMockTransaction({ categoryId: '4', amount: 1000, type: 'income' }),
        createMockTransaction({ categoryId: '4', amount: 100, type: 'expense' }),
      ];

      const suggestion = service.suggestBudget('4', transactions);

      // Should only consider the 100 expense
      expect(suggestion).toBeCloseTo(120, 0); // 100 * 1.2
    });

    it('should only consider transactions for specified category', () => {
      const transactions = [
        createMockTransaction({ categoryId: '4', amount: 100, type: 'expense' }),
        createMockTransaction({ categoryId: '5', amount: 500, type: 'expense' }),
      ];

      const suggestion = service.suggestBudget('4', transactions);

      // Should only consider category 4
      expect(suggestion).toBeCloseTo(120, 0); // 100 * 1.2
    });
  });

  describe('detectAnomalies', () => {
    it('should detect anomalous transactions', () => {
      const transactions = [
        createMockTransaction({ amount: 50, type: 'expense' }),
        createMockTransaction({ amount: 60, type: 'expense' }),
        createMockTransaction({ amount: 55, type: 'expense' }),
        createMockTransaction({ amount: 58, type: 'expense' }),
        createMockTransaction({ amount: 52, type: 'expense' }),
        createMockTransaction({ amount: 500, type: 'expense' }), // Anomaly
      ];

      const anomalies = service.detectAnomalies(transactions);

      expect(anomalies.length).toBeGreaterThan(0);
      expect(anomalies[0].amount).toBe(500);
    });

    it('should return empty array for insufficient data', () => {
      const transactions = [
        createMockTransaction({ amount: 100, type: 'expense' }),
      ];

      const anomalies = service.detectAnomalies(transactions);

      expect(anomalies).toEqual([]);
    });

    it('should ignore income transactions', () => {
      const transactions = [
        createMockTransaction({ amount: 50, type: 'expense' }),
        createMockTransaction({ amount: 55, type: 'expense' }),
        createMockTransaction({ amount: 52, type: 'expense' }),
        createMockTransaction({ amount: 58, type: 'expense' }),
        createMockTransaction({ amount: 53, type: 'expense' }),
        createMockTransaction({ amount: 5000, type: 'income' }), // Should be ignored
      ];

      const anomalies = service.detectAnomalies(transactions);

      expect(anomalies.every(a => a.type === 'expense')).toBe(true);
    });

    it('should not flag normal variations', () => {
      const transactions = [
        createMockTransaction({ amount: 100, type: 'expense' }),
        createMockTransaction({ amount: 105, type: 'expense' }),
        createMockTransaction({ amount: 95, type: 'expense' }),
        createMockTransaction({ amount: 102, type: 'expense' }),
        createMockTransaction({ amount: 98, type: 'expense' }),
      ];

      const anomalies = service.detectAnomalies(transactions);

      expect(anomalies.length).toBe(0);
    });
  });
});
