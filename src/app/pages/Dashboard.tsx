import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { ProgressRing } from '../components/ProgressRing';
import { AIChat } from '../components/AIChat';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const expenseData = [
  { name: 'Food & Dining', value: 450, color: '#3B82F6' },
  { name: 'Transportation', value: 200, color: '#8B5CF6' },
  { name: 'Entertainment', value: 150, color: '#10B981' },
  { name: 'Shopping', value: 300, color: '#F59E0B' },
  { name: 'Utilities', value: 100, color: '#EF4444' },
];

export function Dashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <Header userName="Alex" />
        
        <main className="p-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Income</p>
                  <p className="text-3xl font-bold">$3,200</p>
                  <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +12% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Expense</p>
                  <p className="text-3xl font-bold">$1,200</p>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    -3% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-400" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Remaining Balance</p>
                  <p className="text-3xl font-bold text-primary">$2,000</p>
                  <p className="text-xs text-muted-foreground mt-2">62.5% of income</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-center">
                <ProgressRing progress={85} />
              </div>
              <p className="text-center text-sm text-muted-foreground mt-2">Financial Health</p>
            </Card>
          </div>

          {/* Charts and Alerts */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Expense Breakdown */}
            <Card className="lg:col-span-2">
              <h3 className="text-xl font-bold mb-6">Expense Breakdown</h3>
              
              <div className="flex items-center gap-8">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1E293B', 
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                          borderRadius: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {expenseData.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <div className="flex-1">
                        <p className="text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">${item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Alerts Panel */}
            <Card>
              <h3 className="text-xl font-bold mb-6">Alerts</h3>
              
              <div className="space-y-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-400">Suspicious Transaction</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        $459.99 charged to "TechStore Online"
                      </p>
                    </div>
                  </div>
                  <Badge variant="danger" className="text-xs">High Risk</Badge>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-yellow-400">Budget Warning</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        You've spent 85% of your food budget
                      </p>
                    </div>
                  </div>
                  <Badge variant="warning" className="text-xs">Medium Risk</Badge>
                </div>

                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-400">Great Progress!</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        You've saved $200 more than last month
                      </p>
                    </div>
                  </div>
                  <Badge variant="success" className="text-xs">Achievement</Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Recent Transactions</h3>
              <button className="text-sm text-primary hover:underline">View All</button>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Grocery Store', category: 'Food', amount: -45.50, date: 'Today' },
                { name: 'Salary Deposit', category: 'Income', amount: 3200.00, date: 'Yesterday' },
                { name: 'Netflix Subscription', category: 'Entertainment', amount: -15.99, date: '2 days ago' },
                { name: 'Uber Ride', category: 'Transportation', amount: -12.30, date: '3 days ago' },
              ].map((transaction, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      transaction.amount > 0 ? 'bg-green-500/10' : 'bg-muted'
                    }`}>
                      {transaction.amount > 0 ? (
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      ) : (
                        <TrendingDown className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{transaction.name}</p>
                      <p className="text-xs text-muted-foreground">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${transaction.amount > 0 ? 'text-green-400' : ''}`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </main>
      </div>

      <AIChat />
    </div>
  );
}