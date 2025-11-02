import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useDashboardViewModel } from '../viewmodels/DashboardViewModel';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * Dashboard View
 * Displays financial overview, balance, and recent transactions
 */
export default function DashboardView() {
  const {
    totalIncome,
    totalExpenses,
    balance,
    recentTransactions,
    budgets,
    categories,
    isLoading,
  } = useDashboardViewModel();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const getCategoryById = (id: string) => categories.find(c => c.id === id);

  return (
    <ScrollView style={styles.container}>
      {/* Balance Card */}
      <LinearGradient
        colors={['#4CAF50', '#45B049']}
        style={styles.balanceCard}
      >
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balanceAmount}>
          ${balance.toFixed(2)}
        </Text>
        <View style={styles.incomeExpenseRow}>
          <View style={styles.incomeExpenseItem}>
            <Text style={styles.incomeExpenseLabel}>Income</Text>
            <Text style={styles.incomeAmount}>+${totalIncome.toFixed(2)}</Text>
          </View>
          <View style={styles.incomeExpenseItem}>
            <Text style={styles.incomeExpenseLabel}>Expenses</Text>
            <Text style={styles.expenseAmount}>-${totalExpenses.toFixed(2)}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Budget Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Budget Overview</Text>
        {budgets.slice(0, 3).map(budget => {
          const category = getCategoryById(budget.categoryId);
          const percentage = budget.getPercentageSpent();

          return (
            <View key={budget.id} style={styles.budgetItem}>
              <View style={styles.budgetHeader}>
                <Text style={styles.budgetCategoryName}>
                  {category?.icon} {category?.name}
                </Text>
                <Text style={styles.budgetAmount}>
                  ${budget.spent.toFixed(0)} / ${budget.amount.toFixed(0)}
                </Text>
              </View>
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
              <Text style={styles.budgetPercentage}>
                {percentage.toFixed(0)}% used
              </Text>
            </View>
          );
        })}
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {recentTransactions.map(transaction => {
          const category = getCategoryById(transaction.categoryId);

          return (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <Text style={styles.categoryIcon}>{category?.icon}</Text>
                <View>
                  <Text style={styles.transactionDescription}>
                    {transaction.description}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {transaction.date.toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  transaction.type === 'income'
                    ? styles.incomeText
                    : styles.expenseText,
                ]}
              >
                {transaction.getFormattedAmount()}
              </Text>
            </View>
          );
        })}
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
  balanceCard: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  balanceLabel: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 42,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  incomeExpenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  incomeExpenseItem: {
    alignItems: 'center',
  },
  incomeExpenseLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  incomeAmount: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  expenseAmount: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  budgetItem: {
    marginBottom: 20,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  budgetCategoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  budgetAmount: {
    fontSize: 14,
    color: '#666',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetPercentage: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  transactionDescription: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  incomeText: {
    color: '#4CAF50',
  },
  expenseText: {
    color: '#F44336',
  },
});
