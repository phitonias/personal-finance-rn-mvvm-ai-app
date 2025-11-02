import { useState, useEffect } from 'react';
import { Budget, BudgetModel } from '../models/Budget';
import { Category, defaultCategories } from '../models/Category';
import { Transaction } from '../models/Transaction';
import { AppleIntelligenceService } from '../services/AppleIntelligenceService';
import { getSampleBudgets, getSampleTransactions } from '../utils/sampleData';

/**
 * Budget ViewModel
 * Manages business logic for budget view
 */
export interface BudgetData {
  budgets: BudgetModel[];
  categories: Category[];
  isLoading: boolean;
  addBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  updateBudget: (id: string, amount: number) => void;
  getSuggestedBudget: (categoryId: string) => number;
}

export const useBudgetViewModel = (): BudgetData => {
  const [budgets, setBudgets] = useState<BudgetModel[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const aiService = AppleIntelligenceService.getInstance();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      const sampleBudgets = getSampleBudgets().map(b => new BudgetModel(b));
      const sampleTransactions = getSampleTransactions();

      setBudgets(sampleBudgets);
      setTransactions(sampleTransactions);
    } catch (error) {
      console.error('Error loading budget data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addBudget = (budgetData: Omit<Budget, 'id' | 'spent'>) => {
    const newBudget = new BudgetModel({
      ...budgetData,
      id: Date.now().toString(),
      spent: 0,
    });

    setBudgets(prev => [...prev, newBudget]);
  };

  const updateBudget = (id: string, amount: number) => {
    setBudgets(prev =>
      prev.map(budget =>
        budget.id === id
          ? new BudgetModel({ ...budget, amount })
          : budget
      )
    );
  };

  const getSuggestedBudget = (categoryId: string): number => {
    return aiService.suggestBudget(categoryId, transactions);
  };

  return {
    budgets,
    categories: defaultCategories,
    isLoading,
    addBudget,
    updateBudget,
    getSuggestedBudget,
  };
};
