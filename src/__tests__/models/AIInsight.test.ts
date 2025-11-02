import { AIInsightModel } from '../../models/AIInsight';
import { createMockAIInsight } from '../utils/testHelpers';

describe('AIInsightModel', () => {
  describe('constructor', () => {
    it('should create an AI insight instance with all properties', () => {
      const data = createMockAIInsight({
        id: '123',
        type: 'warning',
        title: 'Budget Alert',
        message: 'You are over budget',
        priority: 'high',
        actionable: true,
        relatedCategoryId: '4',
      });

      const insight = new AIInsightModel(data);

      expect(insight.id).toBe('123');
      expect(insight.type).toBe('warning');
      expect(insight.title).toBe('Budget Alert');
      expect(insight.message).toBe('You are over budget');
      expect(insight.priority).toBe('high');
      expect(insight.actionable).toBe(true);
      expect(insight.relatedCategoryId).toBe('4');
    });

    it('should convert date string to Date object', () => {
      const date = new Date('2025-01-15');
      const insight = new AIInsightModel(
        createMockAIInsight({ date })
      );

      expect(insight.date).toBeInstanceOf(Date);
      expect(insight.date.getDate()).toBe(15);
    });
  });

  describe('getIcon', () => {
    it('should return lightbulb for tip', () => {
      const insight = new AIInsightModel(
        createMockAIInsight({ type: 'tip' })
      );

      expect(insight.getIcon()).toBe('💡');
    });

    it('should return warning for warning', () => {
      const insight = new AIInsightModel(
        createMockAIInsight({ type: 'warning' })
      );

      expect(insight.getIcon()).toBe('⚠️');
    });

    it('should return party for achievement', () => {
      const insight = new AIInsightModel(
        createMockAIInsight({ type: 'achievement' })
      );

      expect(insight.getIcon()).toBe('🎉');
    });

    it('should return crystal ball for prediction', () => {
      const insight = new AIInsightModel(
        createMockAIInsight({ type: 'prediction' })
      );

      expect(insight.getIcon()).toBe('🔮');
    });
  });

  describe('getColor', () => {
    it('should return red for high priority', () => {
      const insight = new AIInsightModel(
        createMockAIInsight({ priority: 'high' })
      );

      expect(insight.getColor()).toBe('#F44336');
    });

    it('should return orange for medium priority', () => {
      const insight = new AIInsightModel(
        createMockAIInsight({ priority: 'medium' })
      );

      expect(insight.getColor()).toBe('#FF9800');
    });

    it('should return green for low priority', () => {
      const insight = new AIInsightModel(
        createMockAIInsight({ priority: 'low' })
      );

      expect(insight.getColor()).toBe('#4CAF50');
    });
  });

  describe('optional properties', () => {
    it('should handle missing optional properties', () => {
      const data = createMockAIInsight({
        actionable: undefined,
        relatedCategoryId: undefined,
      });

      const insight = new AIInsightModel(data);

      expect(insight.actionable).toBeUndefined();
      expect(insight.relatedCategoryId).toBeUndefined();
    });

    it('should preserve actionable flag', () => {
      const insight = new AIInsightModel(
        createMockAIInsight({ actionable: false })
      );

      expect(insight.actionable).toBe(false);
    });
  });

  describe('all insight types', () => {
    it('should handle all insight type combinations', () => {
      const types: Array<'tip' | 'warning' | 'achievement' | 'prediction'> = [
        'tip',
        'warning',
        'achievement',
        'prediction',
      ];
      const priorities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];

      types.forEach(type => {
        priorities.forEach(priority => {
          const insight = new AIInsightModel(
            createMockAIInsight({ type, priority })
          );

          expect(insight.getIcon()).toBeDefined();
          expect(insight.getColor()).toBeDefined();
          expect(insight.type).toBe(type);
          expect(insight.priority).toBe(priority);
        });
      });
    });
  });
});
