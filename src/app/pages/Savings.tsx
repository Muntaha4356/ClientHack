import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AIChat } from '../components/AIChat';
import { Plus, Trash2, DollarSign, Target, Calendar, Edit2 } from 'lucide-react';
import { toast } from 'react-toastify';
import apiClient from '../../utils/apiClient';

export function Savings() {
  const [goals, setGoals] = useState<any[]>([]);
  const [savings, setSavings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);

  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    target_amount: '',
    target_date: '',
  });

  const [allocateAmount, setAllocateAmount] = useState('');

  useEffect(() => {
    fetchGoals();
    fetchSavings();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await apiClient.get('/goals');
      setGoals(response.data.data);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
      toast.error('Failed to load goals');
    }
  };

  const fetchSavings = async () => {
    try {
      const response = await apiClient.get('/savings');
      setSavings(response.data.data);
    } catch (error) {
      console.error('Failed to fetch savings:', error);
      toast.error('Failed to load savings');
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newGoal.title || !newGoal.target_amount || !newGoal.target_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await apiClient.post('/goals', {
        title: newGoal.title,
        description: newGoal.description,
        target_amount: parseFloat(newGoal.target_amount),
        target_date: newGoal.target_date,
      });

      toast.success('Goal created successfully!');
      setNewGoal({ title: '', description: '', target_amount: '', target_date: '' });
      setShowCreateGoal(false);
      fetchGoals();
    } catch (error) {
      console.error('Failed to create goal:', error);
      toast.error('Failed to create goal');
    } finally {
      setLoading(false);
    }
  };

  const handleAllocateSaving = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!allocateAmount || parseFloat(allocateAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.post('/savings/allocate', {
        goal_id: selectedGoal._id,
        amount: parseFloat(allocateAmount),
      });

      const { goalCompleted, completionSaving } = response.data.data;

      if (goalCompleted) {
        toast.success('🎉 Goal completed! Amazing work!', { autoClose: 4000 });
        // Trigger animation on the saving card
        setTimeout(() => {
          fetchGoals();
          fetchSavings();
        }, 500);
      } else {
        toast.success('Saving allocated successfully!');
        fetchGoals();
        fetchSavings();
      }

      setAllocateAmount('');
      setShowAllocateModal(false);
    } catch (error: any) {
      console.error('Failed to allocate saving:', error);
      const errorMsg = error.response?.data?.message || 'Failed to allocate saving';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal and all associated savings?')) return;

    try {
      setLoading(true);
      await apiClient.delete(`/goals/${goalId}`);
      toast.success('Goal deleted successfully');
      fetchGoals();
      fetchSavings();
    } catch (error) {
      console.error('Failed to delete goal:', error);
      toast.error('Failed to delete goal');
    } finally {
      setLoading(false);
    }
  };

  const handleRefundSaving = async (savingId: string) => {
    if (!confirm('Are you sure you want to refund this saving?')) return;

    try {
      setLoading(true);
      await apiClient.put(`/savings/${savingId}/refund`);
      toast.success('Saving refunded successfully');
      fetchGoals();
      fetchSavings();
    } catch (error) {
      console.error('Failed to refund saving:', error);
      toast.error('Failed to refund saving');
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = (achieved: number, target: number) => {
    return Math.min((achieved / target) * 100, 100);
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <Header userName="User" />

        <main className="p-8 space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Savings Goals</h1>
              <p className="text-muted-foreground mt-1">Track and achieve your financial goals</p>
            </div>
            <Button onClick={() => setShowCreateGoal(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Goal
            </Button>
          </div>

          {/* Active Goals */}
          <div>
            <h2 className="text-xl font-bold mb-4">Active Goals</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.filter(g => g.status === 'active').map((goal) => {
                const progress = getProgressPercentage(goal.achieved_amount, goal.target_amount);
                const remaining = goal.target_amount - goal.achieved_amount;

                return (
                  <Card key={goal._id} className="flex flex-col group hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{goal.title}</h3>
                        {goal.description && <p className="text-sm text-muted-foreground">{goal.description}</p>}
                      </div>
                      <button onClick={() => handleDeleteGoal(goal._id)} className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2 mb-4">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{formatCurrency(goal.achieved_amount)}</span>
                        <span className="font-semibold">{Math.round(progress)}%</span>
                        <span className="text-muted-foreground">{formatCurrency(goal.target_amount)}</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="w-4 h-4" />
                        <span>Need {formatCurrency(remaining)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(goal.target_date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        setSelectedGoal(goal);
                        setShowAllocateModal(true);
                      }}
                      className="mt-auto w-full"
                    >
                      Add Savings
                    </Button>
                  </Card>
                );
              })}

              {goals.filter(g => g.status === 'active').length === 0 && (
                <Card className="col-span-full text-center py-12 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No active goals yet. Create one to get started!</p>
                </Card>
              )}
            </div>
          </div>

          {/* Completed Goals */}
          {goals.filter(g => g.status === 'completed').length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Completed Goals 🎉</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.filter(g => g.status === 'completed').map((goal) => (
                  <Card key={goal._id} className="bg-green-500/5 border-green-500/20">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="text-2xl">✅</div>
                      <div className="flex-1">
                        <h3 className="font-bold">{goal.title}</h3>
                        <p className="text-sm text-muted-foreground">Completed!</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-green-600 mt-2">{formatCurrency(goal.achieved_amount)}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Savings History */}
          <div>
            <h2 className="text-xl font-bold mb-4">Savings History</h2>
            <Card>
              {savings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Goal</th>
                        <th className="text-left py-3 px-4">Amount</th>
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {savings.map((saving) => (
                        <tr key={saving._id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{saving.goal_id?.title}</td>
                          <td className="py-3 px-4 font-semibold">{formatCurrency(saving.amount)}</td>
                          <td className="py-3 px-4">{new Date(saving.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${saving.status === 'allocated' ? 'bg-blue-500/10 text-blue-600' : 'bg-red-500/10 text-red-600'}`}>
                              {saving.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {saving.status === 'allocated' && (
                              <button onClick={() => handleRefundSaving(saving._id)} className="text-sm text-red-500 hover:underline">
                                Refund
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No savings yet. Start allocating money to your goals!</p>
                </div>
              )}
            </Card>
          </div>

          {/* Create Goal Modal */}
          {showCreateGoal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="max-w-md w-full p-6 space-y-6">
                <h2 className="text-2xl font-bold">Create New Goal</h2>

                <form onSubmit={handleCreateGoal} className="space-y-4">
                  <Input
                    label="Goal Title"
                    placeholder="e.g., Vacation Fund"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    required
                  />

                  <div>
                    <label className="text-sm block mb-2">Description (Optional)</label>
                    <textarea
                      placeholder="Why do you want to save?"
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      rows={3}
                    />
                  </div>

                  <Input
                    label="Target Amount ($)"
                    type="number"
                    placeholder="5000"
                    value={newGoal.target_amount}
                    onChange={(e) => setNewGoal({ ...newGoal, target_amount: e.target.value })}
                    required
                  />

                  <Input
                    label="Target Date"
                    type="date"
                    value={newGoal.target_date}
                    onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })}
                    required
                  />

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      onClick={() => setShowCreateGoal(false)}
                      className="flex-1 bg-muted text-foreground hover:bg-muted/80"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1" disabled={loading}>
                      {loading ? 'Creating...' : 'Create Goal'}
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}

          {/* Allocate Savings Modal */}
          {showAllocateModal && selectedGoal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="max-w-md w-full p-6 space-y-6">
                <h2 className="text-2xl font-bold">Add Savings to "{selectedGoal.title}"</h2>

                <div className="bg-primary/10 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${getProgressPercentage(selectedGoal.achieved_amount, selectedGoal.target_amount)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(selectedGoal.achieved_amount)} / {formatCurrency(selectedGoal.target_amount)}
                  </p>
                </div>

                <form onSubmit={handleAllocateSaving} className="space-y-4">
                  <Input
                    label="Amount to Allocate ($)"
                    type="number"
                    placeholder="100"
                    value={allocateAmount}
                    onChange={(e) => setAllocateAmount(e.target.value)}
                    required
                  />

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={() => {
                        setShowAllocateModal(false);
                        setSelectedGoal(null);
                        setAllocateAmount('');
                      }}
                      className="flex-1 bg-muted text-foreground hover:bg-muted/80"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1" disabled={loading}>
                      {loading ? 'Allocating...' : 'Add Savings'}
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}
        </main>
      </div>

      <AIChat />
    </div>
  );
}
