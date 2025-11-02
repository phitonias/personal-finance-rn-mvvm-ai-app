import { BudgetModel } from '../../models/Budget';
import { createMockBudget } from '../utils/testHelpers';

describe('BudgetModel', () => {
  describe('constructor', () => {
    it('should create a budget instance with all properties', () => {
      const data = createMockBudget({
        id: '123',
        categoryId: '4',
        amount: 500,
        spent: 300,
        period: 'monthly',
        alertThreshold: 75,
      });

      const budget = new BudgetModel(data);

      expect(budget.id).toBe('123');
      expect(budget.categoryId).toBe('4');
      expect(budget.amount).toBe(500);
      expect(budget.spent).toBe(300);
      expect(budget.period).toBe('monthly');
      expect(budget.alertThreshold).toBe(75);
    });

    it('should default alertThreshold to 80 if not provided', () => {
      const data = createMockBudget({ alertThreshold: undefined });
      const budget = new BudgetModel(data);

      expect(budget.alertThreshold).toBe(80);
    });

    it('should convert date strings to Date objects', () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');

      const budget = new BudgetModel(
        createMockBudget({ startDate, endDate })
      );

      expect(budget.startDate).toBeInstanceOf(Date);
      expect(budget.endDate).toBeInstanceOf(Date);
    });
  });

  describe('getPercentageSpent', () => {
    it('should calculate percentage correctly', () => {
      const budget = new BudgetModel(
        createMockBudget({ amount: 500, spent: 250 })
      );

      expect(budget.getPercentageSpent()).toBe(50);
    });

    it('should handle zero budget', () => {
      const budget = new BudgetModel(
        createMockBudget({ amount: 0, spent: 0 })
      );

      expect(budget.getPercentageSpent()).toBe(NaN);
    });

    it('should handle over budget spending', () => {
      const budget = new BudgetModel(
        createMockBudget({ amount: 100, spent: 150 })
      );

      expect(budget.getPercentageSpent()).toBe(150);
    });

    it('should handle decimal percentages', () => {
      const budget = new BudgetModel(
        createMockBudget({ amount: 300, spent: 100 })
      );

      expect(budget.getPercentageSpent()).toBeCloseTo(33.33, 2);
    });
  });

  describe('getRemaining', () => {
    it('should calculate remaining budget', () => {
      const budget = new BudgetModel(
        createMockBudget({ amount: 500, spent: 200 })
      );

      expect(budget.getRemaining()).toBe(300);
    });

    it('should return 0 for over budget', () => {
      const budget = new BudgetModel(
        createMockBudget({ amount: 100, spent: 150 })
      );

      expect(budget.getRemaining()).toBe(0);
    });

    it('should return full amount when nothing spent', () => {
      const budget = new BudgetModel(
        createMockBudget({ amount: 500, spent: 0 })
      );

      expect(budget.getRemaining()).toBe(500);
    });

    it('should return 0 when budget exactly matches spending', () => {
      const budget = new BudgetModel(
        createMockBudget({ amount: 250, spent: 250 })
      );

      expect(budget.getRemaining()).toBe(0);
    });
  });

  describe('isOverBudget', () => {
    it('should return true when over budget', () => {
      const budget = new BudgetModel(
        createMockBudget({ amount: 100, spent: 150 })
      );

      expect(budget.isOverBudget()).toBe(true);
    });

    it('should return false when under budget', () => {
      const budget = new BudgetModel(
        createMockBudget({ amount: 500, spent: 200 })
      );

      expect(budget.isOverBudget()).toBe(false);
    });

    it('should return false when exactly at budget', () => {
      const budget = new BudgetModel(
        createMockBudget({ amount: 300, spent: 300 })
      );

      expect(budget.isOverBudget()).toBe(false);
    });
  });

  describe('shouldAlert', () => {
    it('should return true when at alert threshold', () => {
      const budget = new BudgetModel(
        createMockBudget({ amount: 100, spent: 80, alertThreshold: 80 })
      );

      expect(budget.shouldAlert()).toBe(true);
    });

    it('should return true when over alert threshold', () => {
      const budget = new BudgetModel(
        createMockBudget({ amount: 100, spent: 90, alertThreshold: 80 })
      );

      expect(budget.shouldAlert()).toBe(true);
    });

    it('should return false when under alert threshold', () => {
      const budget = new BudgetModel(
        createMockBudget({ amount: 100, spent: 70, alertThreshold: 80 })
      );

      expect(budget.shouldAlert()).toBe(false);
    });

    it('should use default threshold of 80', () => {
      const budget = new BudgetModel(
        createMockBudget({ amount: 100, spent: 81, alertThreshold: undefined })
      );

      expect(budget.shouldAlert()).toBe(true);
    });
  });

  describe('getStatusColor', () => {
    it('should return red when over budget', () => {
      const budget = new BudgetModel(
        createMockBudget({ amount: 100, spent: 110 })
      );

      expect(budget.getStatusColor()).toBe('#F44336');
    });

    it('should return orange when at alert threshold', () => {
      const budget = new BudgetModel(
        createMockBudget({ amount: 100, spent: 85, alertThreshold: 80 })
      );

      expect(budget.getStatusColor()).toBe('#FF9800');
    });

    it('should return green when under alert threshold', () => {
      const budget = new BudgetModel(
        createMockBudget({ amount: 100, spent: 50 })
      );

      expect(budget.getStatusColor()).toBe('#4CAF50');
    });

    it('should return red exactly at 100%', () => {
      const budget = new BudgetModel(
        createMockBudget({ amount: 100, spent: 100 })
      );

      expect(budget.getStatusColor()).toBe('#F44336');
    });
  });
});
