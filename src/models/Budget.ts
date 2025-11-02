/**
 * Budget Model
 * Represents a budget allocation for a category
 */
export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  spent: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  alertThreshold?: number; // Percentage (e.g., 80 means alert at 80% spent)
}

export class BudgetModel implements Budget {
  id: string;
  categoryId: string;
  amount: number;
  spent: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  alertThreshold?: number;

  constructor(data: Budget) {
    this.id = data.id;
    this.categoryId = data.categoryId;
    this.amount = data.amount;
    this.spent = data.spent;
    this.period = data.period;
    this.startDate = new Date(data.startDate);
    this.endDate = new Date(data.endDate);
    this.alertThreshold = data.alertThreshold || 80;
  }

  /**
   * Calculate percentage of budget spent
   */
  getPercentageSpent(): number {
    return (this.spent / this.amount) * 100;
  }

  /**
   * Get remaining budget amount
   */
  getRemaining(): number {
    return Math.max(0, this.amount - this.spent);
  }

  /**
   * Check if budget is over limit
   */
  isOverBudget(): boolean {
    return this.spent > this.amount;
  }

  /**
   * Check if budget should trigger alert
   */
  shouldAlert(): boolean {
    return this.getPercentageSpent() >= (this.alertThreshold || 80);
  }

  /**
   * Get status color based on spending
   */
  getStatusColor(): string {
    const percentage = this.getPercentageSpent();
    if (percentage >= 100) return '#F44336'; // Red
    if (percentage >= (this.alertThreshold || 80)) return '#FF9800'; // Orange
    return '#4CAF50'; // Green
  }
}
