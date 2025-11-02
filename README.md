# Personal Finance App - React Native MVVM with Apple Intelligence

A prototype personal finance application built with React Native demonstrating the MVVM (Model-View-ViewModel) architectural pattern and Apple Intelligence integration.

## 🏗️ Architecture

This app implements a clean **MVVM (Model-View-ViewModel)** architecture:

```
src/
├── models/              # Data models and business entities
│   ├── Transaction.ts
│   ├── Budget.ts
│   ├── Category.ts
│   └── AIInsight.ts
│
├── viewmodels/          # Business logic and data transformation
│   ├── DashboardViewModel.ts
│   ├── TransactionsViewModel.ts
│   ├── BudgetViewModel.ts
│   └── AIInsightsViewModel.ts
│
├── views/               # UI components (React Native)
│   ├── DashboardView.tsx
│   ├── TransactionsView.tsx
│   ├── BudgetView.tsx
│   └── AIInsightsView.tsx
│
├── services/            # External services and integrations
│   └── AppleIntelligenceService.ts
│
└── utils/               # Utilities and helpers
    └── sampleData.ts
```

### MVVM Pattern Explanation

- **Model**: Represents data and business logic (Transaction, Budget, Category)
- **View**: UI components that display data and capture user input
- **ViewModel**: Acts as intermediary between View and Model, contains presentation logic

Benefits:
- ✅ Separation of concerns
- ✅ Testability
- ✅ Reusability
- ✅ Maintainability

## 🤖 Apple Intelligence Features

This app demonstrates several Apple Intelligence capabilities:

### 1. Smart Transaction Categorization
- Uses NLP-based keyword matching to automatically categorize transactions
- Provides confidence scores for AI suggestions
- Marks AI-categorized transactions with visual indicators

### 2. Financial Insights Generation
- Analyzes spending patterns across categories
- Generates personalized recommendations
- Provides budget alerts and warnings
- Celebrates financial achievements

### 3. Spending Predictions
- Forecasts monthly spending based on current patterns
- Calculates average daily spending
- Projects future expenses

### 4. Anomaly Detection
- Identifies unusual transactions using statistical analysis
- Flags expenses significantly different from normal patterns
- Helps detect potential fraud or mistakes

### 5. Budget Optimization
- Suggests optimal budget amounts based on historical data
- Recommends adjustments to improve financial health

## 📱 Features

### Dashboard
- Real-time balance overview
- Income vs. expenses visualization
- Budget progress indicators
- Recent transactions list

### Transactions
- Comprehensive transaction history
- Filter by income/expense
- AI-powered categorization indicators
- Recurring transaction markers
- Confidence scores for AI suggestions

### Budget Management
- Category-wise budget allocation
- Visual progress bars
- Over-budget warnings
- Budget utilization percentage
- Smart suggestions

### AI Insights
- Personalized financial insights
- Spending pattern analysis
- Unusual transaction detection
- Actionable recommendations
- Priority-based insights

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS) or Android Emulator (for Android)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd personal-finance-rn-mvvm-ai-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your platform:
```bash
npm run ios     # For iOS
npm run android # For Android
npm run web     # For web
```

## 📊 Data Models

### Transaction
```typescript
{
  id: string;
  amount: number;
  categoryId: string;
  description: string;
  date: Date;
  type: 'income' | 'expense';
  isRecurring?: boolean;
  aiCategorized?: boolean;
  aiConfidence?: number;
}
```

### Budget
```typescript
{
  id: string;
  categoryId: string;
  amount: number;
  spent: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  alertThreshold?: number;
}
```

### AIInsight
```typescript
{
  id: string;
  type: 'tip' | 'warning' | 'achievement' | 'prediction';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  date: Date;
  actionable?: boolean;
  relatedCategoryId?: string;
}
```

## 🔧 Technical Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation
- **UI Components**: React Native core components
- **Gradients**: expo-linear-gradient
- **Architecture**: MVVM pattern
- **AI Integration**: Custom Apple Intelligence service (simulation)
- **Testing**: Jest, React Testing Library, React Native Testing Library
- **Type Checking**: TypeScript with strict mode

## 🎨 Design Principles

- **Clean Architecture**: Separation of concerns using MVVM
- **Type Safety**: Full TypeScript implementation
- **Reusability**: Modular components and ViewModels
- **Testability**: Business logic isolated in ViewModels
- **User Experience**: Intuitive navigation and visual feedback

## 🔮 Apple Intelligence Integration Details

In a production environment, this app would integrate with:

1. **Core ML**: For on-device machine learning models
2. **Natural Language Framework**: For advanced text analysis and categorization
3. **Create ML**: For training custom financial models
4. **Vision Framework**: For receipt scanning (future feature)
5. **Apple Intelligence APIs**: For personalized insights and predictions

The current implementation uses a simulation service that demonstrates these capabilities using rule-based algorithms and statistical analysis.

## 📝 Sample Data

The app includes realistic sample data demonstrating:
- 15 sample transactions (income and expenses)
- 6 budget categories
- Multiple AI insights
- Recurring transaction examples
- AI categorization with confidence scores

## 🧪 Testing

This project includes comprehensive unit tests for the MVVM architecture components, demonstrating the testability benefits of the MVVM pattern.

### Test Coverage

The test suite covers:
- ✅ **Models**: Transaction, Budget, AIInsight business logic
- ✅ **ViewModels**: Dashboard, Transactions, Budget, AI Insights hooks
- ✅ **Services**: Apple Intelligence categorization and insights
- ✅ **Utilities**: Test helpers and mock data

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Structure

Tests are organized in the `src/__tests__/` directory:

```
src/__tests__/
├── models/
│   ├── Transaction.test.ts
│   ├── Budget.test.ts
│   └── AIInsight.test.ts
├── viewmodels/
│   ├── DashboardViewModel.test.ts
│   ├── TransactionsViewModel.test.ts
│   ├── BudgetViewModel.test.ts
│   └── AIInsightsViewModel.test.ts
├── services/
│   └── AppleIntelligenceService.test.ts
└── utils/
    └── testHelpers.ts
```

### Example Tests

**Testing Models:**
```typescript
describe('TransactionModel', () => {
  it('should format expense with negative prefix', () => {
    const transaction = new TransactionModel({
      amount: 100,
      type: 'expense',
      ...
    });
    expect(transaction.getFormattedAmount()).toBe('-$100.00');
  });
});
```

**Testing ViewModels:**
```typescript
describe('useDashboardViewModel', () => {
  it('should calculate balance correctly', async () => {
    const { result } = renderHook(() => useDashboardViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.balance).toBe(4805);
  });
});
```

**Testing Services:**
```typescript
describe('AppleIntelligenceService', () => {
  it('should categorize grocery transactions', () => {
    const result = service.categorizeTransaction('Whole Foods grocery');

    expect(result.categoryId).toBe('4');
    expect(result.confidence).toBeGreaterThan(0.7);
  });
});
```

### Coverage Thresholds

The project maintains the following coverage thresholds:
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Testing Philosophy

1. **Unit Tests**: Each component is tested in isolation
2. **Mock Data**: Consistent test data via helpers
3. **Async Testing**: Proper handling of async operations
4. **Type Safety**: Full TypeScript support in tests
5. **Readable Tests**: Clear, descriptive test names

## 🔐 Security & Privacy

- All processing happens on-device (simulated)
- No data is sent to external servers
- Financial data remains private
- Follows Apple's privacy guidelines

## 🚧 Future Enhancements

- [ ] Real Core ML model integration
- [ ] Receipt scanning with Vision framework
- [ ] Advanced spending predictions
- [ ] Multi-currency support
- [ ] Data export functionality
- [ ] Cloud sync with encryption
- [ ] Biometric authentication
- [ ] Widget support
- [ ] Apple Watch companion app

## 📄 License

See LICENSE file for details.

## 🤝 Contributing

This is a prototype demonstrating MVVM architecture and Apple Intelligence concepts. Feel free to fork and enhance!

## 📚 Resources

- [React Native Documentation](https://reactnative.dev/)
- [MVVM Pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel)
- [Apple Core ML](https://developer.apple.com/documentation/coreml)
- [Apple Natural Language](https://developer.apple.com/documentation/naturallanguage)
- [TypeScript](https://www.typescriptlang.org/)

---

Built with ❤️ demonstrating MVVM architecture and Apple Intelligence capabilities
