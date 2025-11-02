/**
 * AIInsight Model
 * Represents AI-generated financial insights and recommendations
 */
export interface AIInsight {
  id: string;
  type: 'tip' | 'warning' | 'achievement' | 'prediction';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  date: Date;
  actionable?: boolean;
  relatedCategoryId?: string;
}

export class AIInsightModel implements AIInsight {
  id: string;
  type: 'tip' | 'warning' | 'achievement' | 'prediction';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  date: Date;
  actionable?: boolean;
  relatedCategoryId?: string;

  constructor(data: AIInsight) {
    this.id = data.id;
    this.type = data.type;
    this.title = data.title;
    this.message = data.message;
    this.priority = data.priority;
    this.date = new Date(data.date);
    this.actionable = data.actionable;
    this.relatedCategoryId = data.relatedCategoryId;
  }

  /**
   * Get icon based on insight type
   */
  getIcon(): string {
    switch (this.type) {
      case 'tip':
        return '💡';
      case 'warning':
        return '⚠️';
      case 'achievement':
        return '🎉';
      case 'prediction':
        return '🔮';
      default:
        return 'ℹ️';
    }
  }

  /**
   * Get color based on priority
   */
  getColor(): string {
    switch (this.priority) {
      case 'high':
        return '#F44336';
      case 'medium':
        return '#FF9800';
      case 'low':
        return '#4CAF50';
      default:
        return '#2196F3';
    }
  }
}
