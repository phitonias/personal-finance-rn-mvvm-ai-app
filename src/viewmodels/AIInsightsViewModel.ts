import { useState, useEffect } from 'react';
import { AIInsight, AIInsightModel } from '../models/AIInsight';
import { Transaction, TransactionModel } from '../models/Transaction';
import { Budget, BudgetModel } from '../models/Budget';
import { Category, defaultCategories } from '../models/Category';
import { AppleIntelligenceService } from '../services/AppleIntelligenceService';
import { getSampleTransactions, getSampleBudgets } from '../utils/sampleData';

/**
 * AI Insights ViewModel
 * Manages business logic for AI insights view
 */
export interface AIInsightsData {
  insights: AIInsightModel[];
  anomalies: TransactionModel[];
  isLoading: boolean;
  refreshInsights: () => void;
  categorizeTransaction: (description: string) => { categoryId: string; confidence: number };
}

export const useAIInsightsViewModel = (): AIInsightsData => {
  const [insights, setInsights] = useState<AIInsightModel[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [anomalies, setAnomalies] = useState<TransactionModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const aiService = AppleIntelligenceService.getInstance();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      const sampleTransactions = getSampleTransactions();
      const sampleBudgets = getSampleBudgets();

      setTransactions(sampleTransactions);
      setBudgets(sampleBudgets);

      // Generate insights
      const generatedInsights = aiService.generateInsights(
        sampleTransactions,
        sampleBudgets,
        defaultCategories
      );
      setInsights(generatedInsights.map(i => new AIInsightModel(i)));

      // Detect anomalies
      const detectedAnomalies = aiService.detectAnomalies(sampleTransactions);
      setAnomalies(detectedAnomalies.map(t => new TransactionModel(t)));
    } catch (error) {
      console.error('Error loading AI insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshInsights = () => {
    loadData();
  };

  const categorizeTransaction = (description: string) => {
    return aiService.categorizTransaction(description);
  };

  return {
    insights,
    anomalies,
    isLoading,
    refreshInsights,
    categorizeTransaction,
  };
};
