import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useBudgetViewModel } from '../viewmodels/BudgetViewModel';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * Budget View
 * Displays budget allocations and spending progress
 */
export default function BudgetView() {
  const { budgets, categories, isLoading } = useBudgetViewModel();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const getCategoryById = (id: string) => categories.find(c => c.id === id);

  // Calculate total budget and spent
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallPercentage = (totalSpent / totalBudget) * 100;

  return (
    <ScrollView style={styles.container}>
      {/* Overall Budget Card */}
      <LinearGradient
        colors={['#2196F3', '#1976D2']}
        style={styles.overallCard}
      >
        <Text style={styles.overallLabel}>Total Budget</Text>
        <Text style={styles.overallAmount}>${totalBudget.toFixed(2)}</Text>
        <View style={styles.overallStats}>
          <View style={styles.overallStatItem}>
            <Text style={styles.overallStatLabel}>Spent</Text>
            <Text style={styles.overallStatValue}>
              ${totalSpent.toFixed(2)}
            </Text>
          </View>
          <View style={styles.overallStatItem}>
            <Text style={styles.overallStatLabel}>Remaining</Text>
            <Text style={styles.overallStatValue}>
              ${totalRemaining.toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(overallPercentage, 100)}%` },
            ]}
          />
        </View>
        <Text style={styles.overallPercentage}>
          {overallPercentage.toFixed(1)}% used
        </Text>
      </LinearGradient>

      {/* Budget Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Budget by Category</Text>

        {budgets.map(budget => {
          const category = getCategoryById(budget.categoryId);
          const percentage = budget.getPercentageSpent();
          const remaining = budget.getRemaining();

          return (
            <View key={budget.id} style={styles.budgetCard}>
              <View style={styles.budgetHeader}>
                <View style={styles.budgetHeaderLeft}>
                  <Text style={styles.categoryIconLarge}>{category?.icon}</Text>
                  <View>
                    <Text style={styles.categoryName}>{category?.name}</Text>
                    <Text style={styles.budgetPeriod}>Monthly</Text>
                  </View>
                </View>
                {budget.shouldAlert() && (
                  <Text style={styles.alertBadge}>⚠️ Alert</Text>
                )}
              </View>

              <View style={styles.budgetAmounts}>
                <View style={styles.amountItem}>
                  <Text style={styles.amountLabel}>Spent</Text>
                  <Text style={[styles.amountValue, styles.spentText]}>
                    ${budget.spent.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.amountItem}>
                  <Text style={styles.amountLabel}>Budget</Text>
                  <Text style={styles.amountValue}>
                    ${budget.amount.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.amountItem}>
                  <Text style={styles.amountLabel}>Remaining</Text>
                  <Text
                    style={[
                      styles.amountValue,
                      remaining > 0 ? styles.positiveText : styles.negativeText,
                    ]}
                  >
                    ${remaining.toFixed(2)}
                  </Text>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: budget.getStatusColor(),
                      },
                    ]}
                  />
                </View>
                <Text style={styles.percentageText}>
                  {percentage.toFixed(1)}%
                </Text>
              </View>

              {budget.isOverBudget() && (
                <View style={styles.overBudgetWarning}>
                  <Text style={styles.overBudgetText}>
                    ⚠️ Over budget by ${(budget.spent - budget.amount).toFixed(2)}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* AI Tip */}
      <View style={styles.aiTipCard}>
        <Text style={styles.aiTipIcon}>💡</Text>
        <View style={styles.aiTipContent}>
          <Text style={styles.aiTipTitle}>AI Tip</Text>
          <Text style={styles.aiTipText}>
            Based on your spending patterns, consider increasing your Groceries
            budget by 10% next month.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overallCard: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  overallLabel: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
  },
  overallAmount: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  overallStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  overallStatItem: {
    alignItems: 'center',
  },
  overallStatLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  overallStatValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  overallPercentage: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  budgetCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIconLarge: {
    fontSize: 32,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  budgetPeriod: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  alertBadge: {
    backgroundColor: '#FF9800',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  budgetAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  amountItem: {
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  spentText: {
    color: '#F44336',
  },
  positiveText: {
    color: '#4CAF50',
  },
  negativeText: {
    color: '#F44336',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    minWidth: 45,
  },
  overBudgetWarning: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
  },
  overBudgetText: {
    color: '#F57C00',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  aiTipCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  aiTipIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  aiTipContent: {
    flex: 1,
  },
  aiTipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 4,
  },
  aiTipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
