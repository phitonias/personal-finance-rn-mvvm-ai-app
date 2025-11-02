/**
 * Transaction Model
 * Represents a financial transaction (income or expense)
 */
export interface Transaction {
  id: string;
  amount: number;
  categoryId: string;
  description: string;
  date: Date;
  type: 'income' | 'expense';
  isRecurring?: boolean;
  aiCategorized?: boolean; // Flag to indicate if AI suggested this category
  aiConfidence?: number; // AI confidence score (0-1)
}

export class TransactionModel implements Transaction {
  id: string;
  amount: number;
  categoryId: string;
  description: string;
  date: Date;
  type: 'income' | 'expense';
  isRecurring?: boolean;
  aiCategorized?: boolean;
  aiConfidence?: number;

  constructor(data: Transaction) {
    this.id = data.id;
    this.amount = data.amount;
    this.categoryId = data.categoryId;
    this.description = data.description;
    this.date = new Date(data.date);
    this.type = data.type;
    this.isRecurring = data.isRecurring;
    this.aiCategorized = data.aiCategorized;
    this.aiConfidence = data.aiConfidence;
  }

  /**
   * Format amount with currency symbol
   */
  getFormattedAmount(): string {
    const prefix = this.type === 'expense' ? '-' : '+';
    return `${prefix}$${this.amount.toFixed(2)}`;
  }

  /**
   * Check if transaction is from today
   */
  isToday(): boolean {
    const today = new Date();
    return (
      this.date.getDate() === today.getDate() &&
      this.date.getMonth() === today.getMonth() &&
      this.date.getFullYear() === today.getFullYear()
    );
  }
}
