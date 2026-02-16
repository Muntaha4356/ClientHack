import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AIChat } from '../components/AIChat';
import { Plus, Edit2, Trash2, Filter } from 'lucide-react';

interface Transaction {
  id: number;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, description: 'Salary Deposit', category: 'Salary', amount: 3200, type: 'income', date: '2026-02-10' },
    { id: 2, description: 'Grocery Shopping', category: 'Food', amount: 45.50, type: 'expense', date: '2026-02-14' },
    { id: 3, description: 'Netflix', category: 'Entertainment', amount: 15.99, type: 'expense', date: '2026-02-12' },
    { id: 4, description: 'Uber Ride', category: 'Transportation', amount: 12.30, type: 'expense', date: '2026-02-11' },
    { id: 5, description: 'Freelance Work', category: 'Income', amount: 500, type: 'income', date: '2026-02-13' },
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    category: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Utilities', 'Salary', 'Income', 'Other'];

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const transaction: Transaction = {
      id: Date.now(),
      description: newTransaction.description,
      category: newTransaction.category,
      amount: parseFloat(newTransaction.amount),
      type: newTransaction.type,
      date: newTransaction.date
    };
    setTransactions([transaction, ...transactions]);
    setShowModal(false);
    setNewTransaction({
      description: '',
      category: '',
      amount: '',
      type: 'expense',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const filteredTransactions = transactions.filter(t => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <Header userName="Alex" />
        
        <main className="p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Your Transactions</h1>
              <p className="text-muted-foreground mt-1">Track and manage all your transactions</p>
            </div>
            <Button onClick={() => setShowModal(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Add Transaction
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-semibold">Filters:</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-xl text-sm transition-all ${
                    filterType === 'all' ? 'bg-primary text-white' : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('income')}
                  className={`px-4 py-2 rounded-xl text-sm transition-all ${
                    filterType === 'income' ? 'bg-green-500 text-white' : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  Income
                </button>
                <button
                  onClick={() => setFilterType('expense')}
                  className={`px-4 py-2 rounded-xl text-sm transition-all ${
                    filterType === 'expense' ? 'bg-red-500 text-white' : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  Expense
                </button>
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </Card>

          {/* Transactions Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground">Description</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground">Category</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground">Amount</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground">Date</th>
                    <th className="text-right py-4 px-4 text-sm font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-4">{transaction.description}</td>
                      <td className="py-4 px-4">
                        <Badge variant={transaction.type === 'income' ? 'success' : 'default'}>
                          {transaction.category}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-semibold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4 text-primary" />
                          </button>
                          <button 
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>

      {/* Add Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Add Transaction</h2>
            
            <form onSubmit={handleAddTransaction} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm">Type</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewTransaction({ ...newTransaction, type: 'expense' })}
                    className={`flex-1 px-4 py-2 rounded-xl transition-all ${
                      newTransaction.type === 'expense' ? 'bg-red-500 text-white' : 'bg-muted/50'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTransaction({ ...newTransaction, type: 'income' })}
                    className={`flex-1 px-4 py-2 rounded-xl transition-all ${
                      newTransaction.type === 'income' ? 'bg-green-500 text-white' : 'bg-muted/50'
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              <Input
                label="Description"
                placeholder="e.g., Grocery shopping"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                required
              />

              <div className="space-y-2">
                <label className="text-sm">Category</label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                required
              />

              <Input
                label="Date"
                type="date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                required
              />

              <div className="flex gap-3">
                <Button type="submit" className="flex-1">
                  Add Transaction
                </Button>
                <Button 
                  type="button"
                  variant="secondary" 
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <AIChat />
    </div>
  );
}