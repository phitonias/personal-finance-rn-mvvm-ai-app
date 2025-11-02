import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useAIInsightsViewModel } from '../viewmodels/AIInsightsViewModel';
import { defaultCategories } from '../models/Category';

/**
 * AI Insights View
 * Displays AI-generated financial insights and recommendations
 * Demonstrates Apple Intelligence integration
 */
export default function AIInsightsView() {
  const {
    insights,
    anomalies,
    isLoading,
    refreshInsights,
  } = useAIInsightsViewModel();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const getCategoryById = (id: string) => defaultCategories.find(c => c.id === id);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>AI Financial Insights</Text>
          <Text style={styles.headerSubtitle}>
            Powered by Apple Intelligence
          </Text>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={refreshInsights}
        >
          <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Smart Insights</Text>

        {insights.map(insight => (
          <View
            key={insight.id}
            style={[
              styles.insightCard,
              {
                borderLeftColor: insight.getColor(),
              },
            ]}
          >
            <View style={styles.insightHeader}>
              <Text style={styles.insightIcon}>{insight.getIcon()}</Text>
              <View style={styles.insightHeaderText}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <View style={styles.insightMeta}>
                  <Text
                    style={[
                      styles.insightType,
                      { color: insight.getColor() },
                    ]}
                  >
                    {insight.type.toUpperCase()}
                  </Text>
                  <Text
                    style={[
                      styles.insightPriority,
                      {
                        backgroundColor:
                          insight.priority === 'high'
                            ? '#FFEBEE'
                            : insight.priority === 'medium'
                            ? '#FFF3E0'
                            : '#E8F5E9',
                        color:
                          insight.priority === 'high'
                            ? '#F44336'
                            : insight.priority === 'medium'
                            ? '#FF9800'
                            : '#4CAF50',
                      },
                    ]}
                  >
                    {insight.priority.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.insightMessage}>{insight.message}</Text>
            {insight.actionable && (
              <View style={styles.actionableTag}>
                <Text style={styles.actionableText}>
                  💡 Actionable insight
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Anomalies */}
      {anomalies.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Unusual Transactions</Text>
          <Text style={styles.sectionSubtitle}>
            These transactions are significantly different from your usual
            spending patterns
          </Text>

          {anomalies.map(transaction => {
            const category = getCategoryById(transaction.categoryId);
            return (
              <View key={transaction.id} style={styles.anomalyCard}>
                <View style={styles.anomalyHeader}>
                  <Text style={styles.anomalyIcon}>🔍</Text>
                  <View style={styles.anomalyInfo}>
                    <Text style={styles.anomalyDescription}>
                      {transaction.description}
                    </Text>
                    <Text style={styles.anomalyCategory}>
                      {category?.icon} {category?.name} •{' '}
                      {transaction.date.toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.anomalyAmount}>
                  ${transaction.amount.toFixed(2)}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* AI Features Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoIcon}>🤖</Text>
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>About Apple Intelligence</Text>
          <Text style={styles.infoText}>
            This app demonstrates Apple Intelligence capabilities:
          </Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>
              • Smart transaction categorization using NLP
            </Text>
            <Text style={styles.featureItem}>
              • Spending pattern analysis and predictions
            </Text>
            <Text style={styles.featureItem}>
              • Anomaly detection for unusual expenses
            </Text>
            <Text style={styles.featureItem}>
              • Personalized financial recommendations
            </Text>
            <Text style={styles.featureItem}>
              • Budget optimization suggestions
            </Text>
          </View>
          <Text style={styles.infoNote}>
            In production, this would integrate with Core ML, Natural Language
            framework, and on-device Apple Intelligence APIs.
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  refreshButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  insightCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  insightIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  insightHeaderText: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  insightMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  insightType: {
    fontSize: 11,
    fontWeight: '600',
  },
  insightPriority: {
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  insightMessage: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  actionableTag: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionableText: {
    fontSize: 13,
    color: '#2196F3',
    fontWeight: '500',
  },
  anomalyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF9C4',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FFF176',
  },
  anomalyHeader: {
    flexDirection: 'row',
    flex: 1,
  },
  anomalyIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  anomalyInfo: {
    flex: 1,
  },
  anomalyDescription: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  anomalyCategory: {
    fontSize: 12,
    color: '#666',
  },
  anomalyAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F57C00',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E8EAF6',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  infoIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3F51B5',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
    lineHeight: 20,
  },
  featureList: {
    marginBottom: 12,
  },
  featureItem: {
    fontSize: 13,
    color: '#666',
    lineHeight: 24,
  },
  infoNote: {
    fontSize: 12,
    color: '#777',
    fontStyle: 'italic',
    lineHeight: 18,
  },
});
