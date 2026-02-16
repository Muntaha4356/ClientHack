import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { ProgressRing } from '../components/ProgressRing';
import { AIChat } from '../components/AIChat';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import apiClient from '../../utils/apiClient';







export function Dashboard() {

  //User Info State
  const [userInfo, setUserInfo] = useState({
    total_income: 0,
    total_expense: 0,
    remaining_balance: 0,
    financial_health: 0,
  });
  

  const [categoricalExpenses, setCategoricalExpenses] = useState<
    { category_name: string; money: number; color: string }[]
  >([]);

  

  //Colors
  const categoryColors: { [key: string]: string } = {
    Food: '#F59E0B',            // amber-500
    Transportation: '#3B82F6',  // blue-500
    Entertainment: '#8B5CF6',   // purple-500
    Shopping: '#EC4899',        // pink-500
    Utilities: '#10B981',       // green-500
    Salary: '#6366F1',          // indigo-500
    Income: '#14B8A6',          // teal-500
    Other: '#9CA3AF',           // gray-400
  };



  async function getUserInfo() {

    try {
      const response = await apiClient.get('/user/info');
      return response.data.data; // Returns: total_income, total_expense, remaining_balance, financial_health
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  }


  //Get Categorical Expenses for Pie Chart
  async function getCategoricalExpenses() {
    try {
      const response = await apiClient.get('/expenses/categorical');
      const data = response.data.data; 
      const updatedData = data.map((item) => ({ ...item, color: categoryColors[item.category_name] || categoryColors["Other"], }));
      return updatedData;
    } catch (error) {
      console.error('Failed to fetch categorical expenses:', error);
      return [];
    }
  }


  //get Recent Transactions for Recent Transactions List (not implemented yet)
  const [recentTransactions, setRecentTransactions] = useState<
    { name: string; category: string; amount: number; date: string }[]
  >([]);

  //Get Recent Transactions
  async function getRecentTransactions(limit = 10) {
    try {
      const response = await apiClient.get(`/transactions/recent?limit=${limit}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch recent transactions:', error);
      return [];
    }
  }



  useEffect(() => {
    async function fetchData() {
      const userData = await getUserInfo();
      if (userData) {
        setUserInfo({
          total_income: userData.total_income ?? 0,
          total_expense: userData.total_expense ?? 0,
          remaining_balance: userData.remaining_balance ?? 0,
          financial_health: userData.financial_health ?? 0,
        });
      }

      const expensesData = await getCategoricalExpenses(); 
      if (expensesData && expensesData.length > 0) { 
        setCategoricalExpenses(expensesData); }


      const transactionsData = await getRecentTransactions(10);
      if (transactionsData && transactionsData.length > 0) {
        setRecentTransactions(transactionsData);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <Header userName="Alex" />

        <main className="p-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card  >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Income</p>
                  <p className="text-3xl font-bold">${userInfo.total_income}</p>
                  {/* <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +12% from last month
                  </p> */}
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
                  <p className="text-3xl font-bold">${userInfo.total_expense}</p>
                  {/* <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" /> -3% from last month
                  </p> */}
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
                  <p className="text-3xl font-bold text-primary">${userInfo.remaining_balance}</p>
                  {/* <p className="text-xs text-muted-foreground mt-2">62.5% of income</p> */}
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-center">
                <ProgressRing progress={userInfo.financial_health}  />
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
                        data={categoricalExpenses}          // <-- use API data
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="money"                     // <-- matches API response
                        nameKey="category_name"             // <-- for tooltip/labels
                      >
                        {categoricalExpenses.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1E293B',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                          borderRadius: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {categoricalExpenses.map((item) => (
                    <div key={item.category_name} className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex-1">
                        <p className="text-sm">{item.category_name}</p>
                        <p className="text-xs text-muted-foreground">${item.money}</p>
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
                {/* Suspicious Transaction */}
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
                  <Badge variant="danger" className="text-xs">
                    High Risk
                  </Badge>
                </div>

                {/* Budget Warning */}
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
                  <Badge variant="warning" className="text-xs">
                    Medium Risk
                  </Badge>
                </div>

                {/* Achievement */}
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
                  <Badge variant="success" className="text-xs">
                    Achievement
                  </Badge>
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
              {recentTransactions.map((transaction, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${transaction.amount > 0 ? 'bg-green-500/10' : 'bg-muted'
                        }`}
                    >
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
