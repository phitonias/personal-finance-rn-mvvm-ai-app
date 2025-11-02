import { TransactionModel } from '../../models/Transaction';
import { createMockTransaction } from '../utils/testHelpers';

describe('TransactionModel', () => {
  describe('constructor', () => {
    it('should create a transaction instance with all properties', () => {
      const data = createMockTransaction({
        id: '123',
        amount: 250.50,
        categoryId: '5',
        description: 'Uber ride',
        type: 'expense',
        aiCategorized: true,
        aiConfidence: 0.95,
      });

      const transaction = new TransactionModel(data);

      expect(transaction.id).toBe('123');
      expect(transaction.amount).toBe(250.50);
      expect(transaction.categoryId).toBe('5');
      expect(transaction.description).toBe('Uber ride');
      expect(transaction.type).toBe('expense');
      expect(transaction.aiCategorized).toBe(true);
      expect(transaction.aiConfidence).toBe(0.95);
      expect(transaction.date).toBeInstanceOf(Date);
    });

    it('should convert date string to Date object', () => {
      const data = createMockTransaction({
        date: new Date('2025-01-15'),
      });

      const transaction = new TransactionModel(data);

      expect(transaction.date).toBeInstanceOf(Date);
      expect(transaction.date.getDate()).toBe(15);
      expect(transaction.date.getMonth()).toBe(0); // January is 0
      expect(transaction.date.getFullYear()).toBe(2025);
    });
  });

  describe('getFormattedAmount', () => {
    it('should format expense with negative prefix', () => {
      const transaction = new TransactionModel(
        createMockTransaction({ amount: 100, type: 'expense' })
      );

      expect(transaction.getFormattedAmount()).toBe('-$100.00');
    });

    it('should format income with positive prefix', () => {
      const transaction = new TransactionModel(
        createMockTransaction({ amount: 500, type: 'income' })
      );

      expect(transaction.getFormattedAmount()).toBe('+$500.00');
    });

    it('should format decimal amounts correctly', () => {
      const transaction = new TransactionModel(
        createMockTransaction({ amount: 123.456, type: 'expense' })
      );

      expect(transaction.getFormattedAmount()).toBe('-$123.46');
    });

    it('should format zero amount', () => {
      const transaction = new TransactionModel(
        createMockTransaction({ amount: 0, type: 'expense' })
      );

      expect(transaction.getFormattedAmount()).toBe('-$0.00');
    });
  });

  describe('isToday', () => {
    it('should return true for today\'s date', () => {
      const today = new Date();
      const transaction = new TransactionModel(
        createMockTransaction({ date: today })
      );

      expect(transaction.isToday()).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const transaction = new TransactionModel(
        createMockTransaction({ date: yesterday })
      );

      expect(transaction.isToday()).toBe(false);
    });

    it('should return false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const transaction = new TransactionModel(
        createMockTransaction({ date: tomorrow })
      );

      expect(transaction.isToday()).toBe(false);
    });

    it('should return false for different month', () => {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const transaction = new TransactionModel(
        createMockTransaction({ date: lastMonth })
      );

      expect(transaction.isToday()).toBe(false);
    });
  });

  describe('optional properties', () => {
    it('should handle missing optional properties', () => {
      const data = createMockTransaction({
        isRecurring: undefined,
        aiCategorized: undefined,
        aiConfidence: undefined,
      });

      const transaction = new TransactionModel(data);

      expect(transaction.isRecurring).toBeUndefined();
      expect(transaction.aiCategorized).toBeUndefined();
      expect(transaction.aiConfidence).toBeUndefined();
    });

    it('should preserve recurring flag', () => {
      const transaction = new TransactionModel(
        createMockTransaction({ isRecurring: true })
      );

      expect(transaction.isRecurring).toBe(true);
    });
  });
});
