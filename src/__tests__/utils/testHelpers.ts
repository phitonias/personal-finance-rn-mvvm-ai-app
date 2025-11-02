import { Transaction } from '../../models/Transaction';
import { Budget } from '../../models/Budget';
import { Category } from '../../models/Category';
import { AIInsight } from '../../models/AIInsight';

/**
 * Test Helpers and Mock Data
 */

export const createMockTransaction = (overrides?: Partial<Transaction>): Transaction => {
  const defaults: Transaction = {
    id: '1',
    amount: 100,
    categoryId: '4',
    description: 'Test Transaction',
    date: new Date('2025-01-15'),
    type: 'expense',
    isRecurring: false,
    aiCategorized: false,
  };

  return { ...defaults, ...overrides };
};

export const createMockBudget = (overrides?: Partial<Budget>): Budget => {
  const defaults: Budget = {
    id: '1',
    categoryId: '4',
    amount: 500,
    spent: 200,
    period: 'monthly',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-01-31'),
    alertThreshold: 80,
  };

  return { ...defaults, ...overrides };
};

export const createMockCategory = (overrides?: Partial<Category>): Category => {
  const defaults: Category = {
    id: '1',
    name: 'Test Category',
    icon: '🧪',
    color: '#FF0000',
    type: 'expense',
  };

  return { ...defaults, ...overrides };
};

export const createMockAIInsight = (overrides?: Partial<AIInsight>): AIInsight => {
  const defaults: AIInsight = {
    id: '1',
    type: 'tip',
    title: 'Test Insight',
    message: 'This is a test insight',
    priority: 'medium',
    date: new Date('2025-01-15'),
    actionable: true,
  };

  return { ...defaults, ...overrides };
};

export const mockTransactions: Transaction[] = [
  createMockTransaction({
    id: '1',
    amount: 5000,
    categoryId: '1',
    description: 'Salary',
    type: 'income',
    date: new Date('2025-01-01'),
  }),
  createMockTransaction({
    id: '2',
    amount: 150,
    categoryId: '4',
    description: 'Groceries',
    type: 'expense',
    date: new Date('2025-01-05'),
  }),
  createMockTransaction({
    id: '3',
    amount: 45,
    categoryId: '5',
    description: 'Uber',
    type: 'expense',
    date: new Date('2025-01-07'),
    aiCategorized: true,
    aiConfidence: 0.92,
  }),
];

export const mockBudgets: Budget[] = [
  createMockBudget({
    id: '1',
    categoryId: '4',
    amount: 400,
    spent: 270,
  }),
  createMockBudget({
    id: '2',
    categoryId: '5',
    amount: 150,
    spent: 45,
  }),
];
