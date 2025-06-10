
import ChartCard from '@/components/ChartCard';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Analytics = () => {
  const [timeframe, setTimeframe] = useState('monthly');

  const monthlyData = [
    { month: 'Jan', income: 50000, expenses: 35000, savings: 15000 },
    { month: 'Feb', income: 52000, expenses: 38000, savings: 14000 },
    { month: 'Mar', income: 50000, expenses: 42000, savings: 8000 },
    { month: 'Apr', income: 55000, expenses: 36000, savings: 19000 },
    { month: 'May', income: 50000, expenses: 41000, savings: 9000 },
    { month: 'Jun', income: 50000, expenses: 35000, savings: 15000 },
  ];

  const spendingTrend = [
    { date: 'Week 1', amount: 8000 },
    { date: 'Week 2', amount: 12000 },
    { date: 'Week 3', amount: 9500 },
    { date: 'Week 4', amount: 11200 },
  ];

  const categoryData = [
    { name: 'Food', value: 8000, percentage: 35 },
    { name: 'Transportation', value: 3500, percentage: 15 },
    { name: 'Entertainment', value: 2800, percentage: 12 },
    { name: 'Medical', value: 2200, percentage: 10 },
    { name: 'Utilities', value: 4500, percentage: 20 },
    { name: 'Others', value: 1800, percentage: 8 },
  ];

  const savingsRate = monthlyData.map(item => ({
    month: item.month,
    rate: ((item.savings / item.income) * 100).toFixed(1)
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
          <p className="text-2xl font-bold text-gray-900 mt-1">₹1,167</p>
          <p className="text-sm text-green-600 mt-1">-5% from last month</p>
        </Card>
        <Card className="p-6 bg-white shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Highest Expense</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">₹8,000</p>
          <p className="text-sm text-gray-600 mt-1">Food & Dining</p>
        </Card>
        <Card className="p-6 bg-white shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Most Frequent</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">Food</p>
          <p className="text-sm text-gray-600 mt-1">23 transactions</p>
        </Card>
        <Card className="p-6 bg-white shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Budget Status</h3>
          <p className="text-2xl font-bold text-green-600 mt-1">On Track</p>
          <p className="text-sm text-gray-600 mt-1">85% utilized</p>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Spending Trend</h3>
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
            <p className="text-gray-700">Your food expenses increased by 15% this month. Consider meal planning to reduce costs.</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <p className="text-gray-700">Great job! You're saving 30% of your income, which is above the recommended 20%.</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
            <p className="text-gray-700">You spend the most on Fridays. Consider setting a weekly entertainment budget.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
