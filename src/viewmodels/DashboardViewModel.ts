import { useState, useEffect } from 'react';
import { Transaction, TransactionModel } from '../models/Transaction';
import { Budget, BudgetModel } from '../models/Budget';
import { Category, defaultCategories } from '../models/Category';
import { AppleIntelligenceService } from '../services/AppleIntelligenceService';
import { getSampleTransactions, getSampleBudgets } from '../utils/sampleData';

/**
 * Dashboard ViewModel
 * Manages business logic for the dashboard view
 */
export interface DashboardData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  recentTransactions: TransactionModel[];
  budgets: BudgetModel[];
  categories: Category[];
  isLoading: boolean;
}

export const useDashboardViewModel = (): DashboardData => {
  const [transactions, setTransactions] = useState<TransactionModel[]>([]);
  const [budgets, setBudgets] = useState<BudgetModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Simulate loading from storage/API
      await new Promise(resolve => setTimeout(resolve, 500));

      const sampleTransactions = getSampleTransactions().map(t => new TransactionModel(t));
      const sampleBudgets = getSampleBudgets().map(b => new BudgetModel(b));

      setTransactions(sampleTransactions);
      setBudgets(sampleBudgets);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Get recent transactions (last 5)
  const recentTransactions = transactions
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  return {
    totalIncome,
    totalExpenses,
    balance,
    recentTransactions,
    budgets,
    categories: defaultCategories,
    isLoading,
  };
};
