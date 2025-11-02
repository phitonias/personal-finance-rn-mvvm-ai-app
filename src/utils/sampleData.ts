import { Transaction } from '../models/Transaction';
import { Budget } from '../models/Budget';

/**
 * Sample data for demonstration
 */

export const getSampleTransactions = (): Transaction[] => {
  const now = new Date();

  return [
    {
      id: '1',
      amount: 5000,
      categoryId: '1',
      description: 'Monthly Salary',
      date: new Date(now.getFullYear(), now.getMonth(), 1),
      type: 'income',
      isRecurring: true,
    },
    {
      id: '2',
      amount: 150.50,
      categoryId: '4',
      description: 'Whole Foods Grocery Shopping',
      date: new Date(now.getFullYear(), now.getMonth(), 5),
      type: 'expense',
      aiCategorized: true,
      aiConfidence: 0.92,
    },
    {
      id: '3',
      amount: 45.00,
      categoryId: '5',
      description: 'Uber ride to airport',
      date: new Date(now.getFullYear(), now.getMonth(), 7),
      type: 'expense',
      aiCategorized: true,
      aiConfidence: 0.88,
    },
    {
      id: '4',
      amount: 1200,
      categoryId: '2',
      description: 'Freelance Web Development Project',
      date: new Date(now.getFullYear(), now.getMonth(), 10),
      type: 'income',
    },
    {
      id: '5',
      amount: 89.99,
      categoryId: '7',
      description: 'Electric Bill - Monthly',
      date: new Date(now.getFullYear(), now.getMonth(), 12),
      type: 'expense',
      isRecurring: true,
      aiCategorized: true,
      aiConfidence: 0.95,
    },
    {
      id: '6',
      amount: 65.00,
      categoryId: '10',
      description: 'Dinner at Italian Restaurant',
      date: new Date(now.getFullYear(), now.getMonth(), 14),
      type: 'expense',
      aiCategorized: true,
      aiConfidence: 0.91,
    },
    {
      id: '7',
      amount: 250.00,
      categoryId: '9',
      description: 'Amazon shopping - clothes and electronics',
      date: new Date(now.getFullYear(), now.getMonth(), 15),
      type: 'expense',
      aiCategorized: true,
      aiConfidence: 0.87,
    },
    {
      id: '8',
      amount: 15.99,
      categoryId: '6',
      description: 'Netflix Subscription',
      date: new Date(now.getFullYear(), now.getMonth(), 16),
      type: 'expense',
      isRecurring: true,
      aiCategorized: true,
      aiConfidence: 0.94,
    },
    {
      id: '9',
      amount: 120.00,
      categoryId: '4',
      description: 'Trader Joes Weekly Grocery',
      date: new Date(now.getFullYear(), now.getMonth(), 18),
      type: 'expense',
      aiCategorized: true,
      aiConfidence: 0.93,
    },
    {
      id: '10',
      amount: 75.50,
      categoryId: '8',
      description: 'Pharmacy - Prescription Medicine',
      date: new Date(now.getFullYear(), now.getMonth(), 20),
      type: 'expense',
      aiCategorized: true,
      aiConfidence: 0.89,
    },
    {
      id: '11',
      amount: 500,
      categoryId: '3',
      description: 'Stock Dividend Payment',
      date: new Date(now.getFullYear(), now.getMonth(), 22),
      type: 'income',
    },
    {
      id: '12',
      amount: 32.00,
      categoryId: '5',
      description: 'Gas Station Fill-up',
      date: new Date(now.getFullYear(), now.getMonth(), 23),
      type: 'expense',
      aiCategorized: true,
      aiConfidence: 0.86,
    },
    {
      id: '13',
      amount: 180.00,
      categoryId: '9',
      description: 'New Running Shoes',
      date: new Date(now.getFullYear(), now.getMonth(), 24),
      type: 'expense',
      aiCategorized: true,
      aiConfidence: 0.85,
    },
    {
      id: '14',
      amount: 55.00,
      categoryId: '7',
      description: 'Internet Bill',
      date: new Date(now.getFullYear(), now.getMonth(), 25),
      type: 'expense',
      isRecurring: true,
      aiCategorized: true,
      aiConfidence: 0.96,
    },
    {
      id: '15',
      amount: 42.50,
      categoryId: '10',
      description: 'Coffee shop and brunch',
      date: new Date(now.getFullYear(), now.getMonth(), 26),
      type: 'expense',
      aiCategorized: true,
      aiConfidence: 0.90,
    },
  ];
};

export const getSampleBudgets = (): Budget[] => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Calculate actual spending from sample transactions
  const transactions = getSampleTransactions();
  const calculateSpent = (categoryId: string): number => {
    return transactions
      .filter(t => t.categoryId === categoryId && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return [
    {
      id: '1',
      categoryId: '4',
      amount: 400,
      spent: calculateSpent('4'),
      period: 'monthly',
      startDate: startOfMonth,
      endDate: endOfMonth,
      alertThreshold: 80,
    },
    {
      id: '2',
      categoryId: '5',
      amount: 150,
      spent: calculateSpent('5'),
      period: 'monthly',
      startDate: startOfMonth,
      endDate: endOfMonth,
      alertThreshold: 80,
    },
    {
      id: '3',
      categoryId: '6',
      amount: 100,
      spent: calculateSpent('6'),
      period: 'monthly',
      startDate: startOfMonth,
      endDate: endOfMonth,
      alertThreshold: 80,
    },
    {
      id: '4',
      categoryId: '7',
      amount: 200,
      spent: calculateSpent('7'),
      period: 'monthly',
      startDate: startOfMonth,
      endDate: endOfMonth,
      alertThreshold: 80,
    },
    {
      id: '5',
      categoryId: '9',
      amount: 300,
      spent: calculateSpent('9'),
      period: 'monthly',
      startDate: startOfMonth,
      endDate: endOfMonth,
      alertThreshold: 80,
    },
    {
      id: '6',
      categoryId: '10',
      amount: 250,
      spent: calculateSpent('10'),
      period: 'monthly',
      startDate: startOfMonth,
      endDate: endOfMonth,
      alertThreshold: 80,
    },
  ];
};
