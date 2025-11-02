import { useState, useEffect } from 'react';
import { Transaction, TransactionModel } from '../models/Transaction';
import { Category, defaultCategories } from '../models/Category';
import { AppleIntelligenceService } from '../services/AppleIntelligenceService';
import { getSampleTransactions } from '../utils/sampleData';

/**
 * Transactions ViewModel
 * Manages business logic for transactions view
 */
export interface TransactionsData {
  transactions: TransactionModel[];
  categories: Category[];
  filteredTransactions: TransactionModel[];
  isLoading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  filterByCategory: (categoryId: string | null) => void;
  filterByType: (type: 'income' | 'expense' | 'all') => void;
}

export const useTransactionsViewModel = (): TransactionsData => {
  const [transactions, setTransactions] = useState<TransactionModel[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<'income' | 'expense' | 'all'>('all');

  const aiService = AppleIntelligenceService.getInstance();

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, categoryFilter, typeFilter]);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      const sampleTransactions = getSampleTransactions().map(t => new TransactionModel(t));
      setTransactions(sampleTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }

    // Filter by category
    if (categoryFilter) {
      filtered = filtered.filter(t => t.categoryId === categoryFilter);
    }

    // Sort by date (most recent first)
    filtered.sort((a, b) => b.date.getTime() - a.date.getTime());

    setFilteredTransactions(filtered);
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction = new TransactionModel({
      ...transactionData,
      id: Date.now().toString(),
    });

    setTransactions(prev => [newTransaction, ...prev]);
  };

  const filterByCategory = (categoryId: string | null) => {
    setCategoryFilter(categoryId);
  };

  const filterByType = (type: 'income' | 'expense' | 'all') => {
    setTypeFilter(type);
  };

  return {
    transactions,
    categories: defaultCategories,
    filteredTransactions,
    isLoading,
    addTransaction,
    filterByCategory,
    filterByType,
  };
};
