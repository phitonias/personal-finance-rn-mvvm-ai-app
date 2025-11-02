import { Transaction } from '../models/Transaction';
import { AIInsight } from '../models/AIInsight';
import { Category, defaultCategories } from '../models/Category';
import { Budget } from '../models/Budget';

/**
 * Apple Intelligence Service
 * Simulates Apple Intelligence features for financial insights
 * In a production app, this would integrate with Apple's ML frameworks
 * like Core ML, Natural Language framework, or on-device intelligence APIs
 */
export class AppleIntelligenceService {
  private static instance: AppleIntelligenceService;

  private constructor() {}

  static getInstance(): AppleIntelligenceService {
    if (!AppleIntelligenceService.instance) {
      AppleIntelligenceService.instance = new AppleIntelligenceService();
    }
    return AppleIntelligenceService.instance;
  }

  /**
   * AI-powered transaction categorization
   * Uses NLP to suggest category based on description
   */
  categorizTransaction(description: string): { categoryId: string; confidence: number } {
    const lowerDesc = description.toLowerCase();

    // Simple keyword-based categorization (in production, use Core ML model)
    const categoryKeywords: { [key: string]: string[] } = {
      '4': ['grocery', 'supermarket', 'food store', 'market', 'trader joe', 'whole foods'],
      '5': ['uber', 'lyft', 'taxi', 'gas', 'fuel', 'parking', 'metro', 'bus'],
      '6': ['movie', 'cinema', 'netflix', 'spotify', 'game', 'concert', 'ticket'],
      '7': ['electric', 'water', 'gas bill', 'internet', 'phone bill', 'utility'],
      '8': ['doctor', 'hospital', 'pharmacy', 'medical', 'health', 'clinic'],
      '9': ['amazon', 'shopping', 'clothes', 'shoes', 'store', 'mall'],
      '10': ['restaurant', 'cafe', 'dinner', 'lunch', 'breakfast', 'delivery', 'doordash'],
      '1': ['salary', 'paycheck', 'wage', 'income', 'payment received'],
      '2': ['freelance', 'contract', 'consulting', 'gig'],
      '3': ['dividend', 'stock', 'interest', 'investment return'],
    };

    let bestMatch = '4'; // Default to groceries
    let highestConfidence = 0.3;

    for (const [categoryId, keywords] of Object.entries(categoryKeywords)) {
      for (const keyword of keywords) {
        if (lowerDesc.includes(keyword)) {
          const confidence = 0.75 + Math.random() * 0.2; // Simulate 75-95% confidence
          if (confidence > highestConfidence) {
            bestMatch = categoryId;
            highestConfidence = confidence;
          }
        }
      }
    }

    return {
      categoryId: bestMatch,
      confidence: highestConfidence,
    };
  }

  /**
   * Generate AI insights based on spending patterns
   */
  generateInsights(
    transactions: Transaction[],
    budgets: Budget[],
    categories: Category[]
  ): AIInsight[] {
    const insights: AIInsight[] = [];

    // Analyze spending by category
    const spendingByCategory = this.analyzeSpendingByCategory(transactions, categories);

    // Insight 1: Highest spending category
    if (spendingByCategory.length > 0) {
      const topCategory = spendingByCategory[0];
      const category = categories.find(c => c.id === topCategory.categoryId);

      insights.push({
        id: 'insight-1',
        type: 'tip',
        title: 'Top Spending Category',
        message: `You've spent $${topCategory.amount.toFixed(2)} on ${category?.name} this month. Consider reviewing these expenses.`,
        priority: 'medium',
        date: new Date(),
        actionable: true,
        relatedCategoryId: topCategory.categoryId,
      });
    }

    // Insight 2: Budget warnings
    const overBudgets = budgets.filter(b => b.spent > b.amount * 0.8);
    if (overBudgets.length > 0) {
      const budget = overBudgets[0];
      const category = categories.find(c => c.id === budget.categoryId);

      insights.push({
        id: 'insight-2',
        type: 'warning',
        title: 'Budget Alert',
        message: `You're at ${((budget.spent / budget.amount) * 100).toFixed(0)}% of your ${category?.name} budget. Try to reduce spending in this category.`,
        priority: 'high',
        date: new Date(),
        actionable: true,
        relatedCategoryId: budget.categoryId,
      });
    }

    // Insight 3: Spending trend prediction
    const avgDailySpending = this.calculateAverageDailySpending(transactions);
    const daysInMonth = 30;
    const projectedMonthlySpending = avgDailySpending * daysInMonth;

    insights.push({
      id: 'insight-3',
      type: 'prediction',
      title: 'Spending Forecast',
      message: `Based on your current spending pattern, you're on track to spend $${projectedMonthlySpending.toFixed(2)} this month.`,
      priority: 'low',
      date: new Date(),
      actionable: false,
    });

    // Insight 4: Savings achievement
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    if (totalIncome > totalExpenses) {
      const savings = totalIncome - totalExpenses;
      const savingsRate = (savings / totalIncome) * 100;

      insights.push({
        id: 'insight-4',
        type: 'achievement',
        title: 'Great Job!',
        message: `You've saved $${savings.toFixed(2)} (${savingsRate.toFixed(1)}% of your income) this month!`,
        priority: 'low',
        date: new Date(),
        actionable: false,
      });
    }

    // Insight 5: Recurring expense detection
    const recurringExpenses = transactions.filter(t => t.isRecurring);
    if (recurringExpenses.length > 0) {
      const recurringTotal = recurringExpenses.reduce((sum, t) => sum + t.amount, 0);

      insights.push({
        id: 'insight-5',
        type: 'tip',
        title: 'Recurring Expenses',
        message: `You have ${recurringExpenses.length} recurring expenses totaling $${recurringTotal.toFixed(2)}/month. Review subscriptions you may not be using.`,
        priority: 'medium',
        date: new Date(),
        actionable: true,
      });
    }

    return insights;
  }

  /**
   * Analyze spending by category
   */
  private analyzeSpendingByCategory(
    transactions: Transaction[],
    categories: Category[]
  ): { categoryId: string; amount: number }[] {
    const spendingMap = new Map<string, number>();

    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const current = spendingMap.get(t.categoryId) || 0;
        spendingMap.set(t.categoryId, current + t.amount);
      });

    return Array.from(spendingMap.entries())
      .map(([categoryId, amount]) => ({ categoryId, amount }))
      .sort((a, b) => b.amount - a.amount);
  }

  /**
   * Calculate average daily spending
   */
  private calculateAverageDailySpending(transactions: Transaction[]): number {
    const expenses = transactions.filter(t => t.type === 'expense');

    if (expenses.length === 0) return 0;

    const dates = expenses.map(t => new Date(t.date));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

    const daysDiff = Math.max(1, Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)));
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

    return totalExpenses / daysDiff;
  }

  /**
   * Smart budget recommendations
   */
  suggestBudget(categoryId: string, transactions: Transaction[]): number {
    const categoryTransactions = transactions.filter(
      t => t.categoryId === categoryId && t.type === 'expense'
    );

    if (categoryTransactions.length === 0) {
      return 200; // Default suggestion
    }

    const avgSpending = categoryTransactions.reduce((sum, t) => sum + t.amount, 0) /
                        categoryTransactions.length;

    // Suggest 20% more than average to provide buffer
    return Math.ceil(avgSpending * 1.2);
  }

  /**
   * Anomaly detection - detect unusual transactions
   */
  detectAnomalies(transactions: Transaction[]): Transaction[] {
    if (transactions.length < 5) return [];

    const amounts = transactions
      .filter(t => t.type === 'expense')
      .map(t => t.amount);

    const mean = amounts.reduce((sum, a) => sum + a, 0) / amounts.length;
    const variance = amounts.reduce((sum, a) => sum + Math.pow(a - mean, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);

    // Flag transactions more than 2 standard deviations from mean
    return transactions.filter(t => {
      if (t.type !== 'expense') return false;
      return Math.abs(t.amount - mean) > 2 * stdDev;
    });
  }
}
