/**
 * Category Model
 * Represents a financial category for transactions and budgets
 */
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
}

export const defaultCategories: Category[] = [
  { id: '1', name: 'Salary', icon: '💼', color: '#4CAF50', type: 'income' },
  { id: '2', name: 'Freelance', icon: '💻', color: '#2196F3', type: 'income' },
  { id: '3', name: 'Investment', icon: '📈', color: '#9C27B0', type: 'income' },
  { id: '4', name: 'Groceries', icon: '🛒', color: '#FF9800', type: 'expense' },
  { id: '5', name: 'Transport', icon: '🚗', color: '#F44336', type: 'expense' },
  { id: '6', name: 'Entertainment', icon: '🎬', color: '#E91E63', type: 'expense' },
  { id: '7', name: 'Utilities', icon: '💡', color: '#607D8B', type: 'expense' },
  { id: '8', name: 'Healthcare', icon: '🏥', color: '#00BCD4', type: 'expense' },
  { id: '9', name: 'Shopping', icon: '🛍️', color: '#FF5722', type: 'expense' },
  { id: '10', name: 'Dining', icon: '🍽️', color: '#795548', type: 'expense' },
];
