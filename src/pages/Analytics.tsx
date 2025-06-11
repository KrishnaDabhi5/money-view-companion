
import ChartCard from '@/components/ChartCard';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useRealtimeAnalytics } from '@/hooks/useRealtimeAnalytics';

const Analytics = () => {
  const [timeframe, setTimeframe] = useState('monthly');
  const { analyticsData, loading } = useRealtimeAnalytics(timeframe);

  if (loading || !analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const { monthlyData, spendingTrend, categoryData, keyMetrics } = analyticsData;

  const savingsRate = monthlyData.map(item => ({
    month: item.month,
    rate: item.income > 0 ? ((item.savings / item.income) * 100).toFixed(1) : '0'
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Financial Analytics</h2>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-white shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Average Daily Spend</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">₹{keyMetrics.averageDailySpend.toLocaleString()}</p>
          <p className="text-sm text-blue-600 mt-1">Real-time data</p>
        </Card>
        <Card className="p-6 bg-white shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Highest Expense</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">₹{keyMetrics.highestExpense.amount.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">{keyMetrics.highestExpense.category}</p>
        </Card>
        <Card className="p-6 bg-white shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Most Frequent</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{keyMetrics.mostFrequent.category}</p>
          <p className="text-sm text-gray-600 mt-1">{keyMetrics.mostFrequent.count} transactions</p>
        </Card>
        <Card className="p-6 bg-white shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Budget Status</h3>
          <p className={`text-2xl font-bold mt-1 ${keyMetrics.budgetUtilization <= 100 ? 'text-green-600' : 'text-red-600'}`}>
            {keyMetrics.budgetUtilization <= 100 ? 'On Track' : 'Over Budget'}
          </p>
          <p className="text-sm text-gray-600 mt-1">{keyMetrics.budgetUtilization}% utilized</p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses */}
        <Card className="p-6 bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Income vs Expenses</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#10B981" name="Income" />
                <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Breakdown */}
        <ChartCard
          title="Spending by Category"
          data={categoryData}
          type="pie"
        />

        {/* Spending Trend */}
        <Card className="p-6 bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spendingTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Savings Rate */}
        <Card className="p-6 bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Rate Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={savingsRate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Smart Insights</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-gray-700">
              {categoryData.length > 0 
                ? `Your top spending category is ${categoryData[0]?.name} at ₹${categoryData[0]?.value?.toLocaleString()}.`
                : 'Start tracking expenses to see insights.'}
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <p className="text-gray-700">
              {monthlyData.length > 0 && monthlyData[monthlyData.length - 1]?.savings > 0
                ? `Great job! You saved ₹${monthlyData[monthlyData.length - 1]?.savings?.toLocaleString()} this period.`
                : 'Consider setting a savings target to improve your financial health.'}
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
            <p className="text-gray-700">
              Your budget utilization is {keyMetrics.budgetUtilization}%. 
              {keyMetrics.budgetUtilization > 100 
                ? ' Consider reviewing your spending or adjusting your budget.'
                : ' You\'re staying within your budget limits.'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
