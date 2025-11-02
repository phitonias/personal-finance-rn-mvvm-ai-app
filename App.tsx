import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import DashboardView from './src/views/DashboardView';
import TransactionsView from './src/views/TransactionsView';
import BudgetView from './src/views/BudgetView';
import AIInsightsView from './src/views/AIInsightsView';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardView}
          options={{
            tabBarLabel: '📊 Dashboard',
          }}
        />
        <Tab.Screen
          name="Transactions"
          component={TransactionsView}
          options={{
            tabBarLabel: '💰 Transactions',
          }}
        />
        <Tab.Screen
          name="Budget"
          component={BudgetView}
          options={{
            tabBarLabel: '🎯 Budget',
          }}
        />
        <Tab.Screen
          name="AI Insights"
          component={AIInsightsView}
          options={{
            tabBarLabel: '🤖 AI Insights',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
