import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AIChat } from '../components/AIChat';
import { Plus, Trash2, CheckCircle2, Clock, AlertCircle, X } from 'lucide-react';
import { toast } from 'react-toastify';
import apiClient from '../../utils/apiClient';

export function Reminders() {
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateReminder, setShowCreateReminder] = useState(false);

  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    frequency: 'once',
  });

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await apiClient.get('/reminders');
      setReminders(response.data.data);
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
      toast.error('Failed to load reminders');
    }
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newReminder.title || !newReminder.date || !newReminder.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await apiClient.post('/reminders', {
        title: newReminder.title,
        description: newReminder.description,
        date: newReminder.date,
        time: newReminder.time,
        frequency: newReminder.frequency,
      });

      toast.success('Reminder created successfully!');
      setNewReminder({ title: '', description: '', date: '', time: '', frequency: 'once' });
      setShowCreateReminder(false);
      fetchReminders();
    } catch (error) {
      console.error('Failed to create reminder:', error);
      toast.error('Failed to create reminder');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (reminderId: string) => {
    try {
      setLoading(true);
      await apiClient.put(`/reminders/${reminderId}/complete`);
      toast.success('Reminder marked as completed');
      fetchReminders();
    } catch (error) {
      console.error('Failed to mark reminder completed:', error);
      toast.error('Failed to mark reminder completed');
    } finally {
      setLoading(false);
    }
  };

  const handleEndReminder = async (reminderId: string) => {
    if (!confirm('End this recurring reminder?')) return;

    try {
      setLoading(true);
      await apiClient.put(`/reminders/${reminderId}/end`);
      toast.success('Recurring reminder ended');
      fetchReminders();
    } catch (error) {
      console.error('Failed to end reminder:', error);
      toast.error('Failed to end reminder');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    if (!confirm('Are you sure you want to delete this reminder?')) return;

    try {
      setLoading(true);
      await apiClient.delete(`/reminders/${reminderId}`);
      toast.success('Reminder deleted');
      fetchReminders();
    } catch (error) {
      console.error('Failed to delete reminder:', error);
      toast.error('Failed to delete reminder');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();
  const formatDateTime = (dateString: string, timeString: string) => {
    return `${formatDate(dateString)} at ${timeString}`;
  };

  // Separate notified and not-yet-notified reminders
  const activeReminders = reminders.filter(r => !r.notified && r.active);
  const notifiedReminders = reminders.filter(r => r.notified);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <Header userName="User" />

        <main className="p-8 space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Reminders</h1>
              <p className="text-muted-foreground mt-1">Set reminders for important tasks and bills</p>
            </div>
            <Button onClick={() => setShowCreateReminder(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Reminder
            </Button>
          </div>

          {/* Active Reminders */}
          <div>
            <h2 className="text-xl font-bold mb-4">Active Reminders</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeReminders.length > 0 ? (
                activeReminders.map((reminder) => (
                  <Card key={reminder._id} className="flex flex-col group hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{reminder.title}</h3>
                        {reminder.description && <p className="text-sm text-muted-foreground">{reminder.description}</p>}
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{formatDateTime(reminder.date, reminder.time)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <AlertCircle className="w-4 h-4" />
                        <span className="capitalize">{reminder.frequency}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => handleMarkCompleted(reminder._id)}
                        className="bg-green-500/10 text-green-600 hover:bg-green-500/20 flex items-center justify-center gap-1 text-sm"
                        disabled={loading}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Done
                      </Button>
                      {reminder.frequency !== 'once' && reminder.active && (
                        <Button
                          onClick={() => handleEndReminder(reminder._id)}
                          className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 flex items-center justify-center gap-1 text-sm"
                          disabled={loading}
                        >
                          <X className="w-4 h-4" />
                          End
                        </Button>
                      )}
                      {reminder.frequency === 'once' && (
                        <Button
                          onClick={() => handleDeleteReminder(reminder._id)}
                          className="bg-red-500/10 text-red-600 hover:bg-red-500/20 flex items-center justify-center gap-1 text-sm"
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      )}
                      {reminder.frequency !== 'once' && (
                        <Button
                          onClick={() => handleDeleteReminder(reminder._id)}
                          className="col-span-2 bg-red-500/10 text-red-600 hover:bg-red-500/20 flex items-center justify-center gap-1 text-sm"
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Reminder
                        </Button>
                      )}
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full text-center py-12 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No active reminders. Create one to get started!</p>
                </Card>
              )}
            </div>
          </div>

          {/* Notified Reminders */}
          {notifiedReminders.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Completed Reminders
              </h2>
              <Card>
                <div className="space-y-2">
                  {notifiedReminders.map((reminder) => (
                    <div key={reminder._id} className="flex items-center justify-between p-4 bg-green-500/5 border border-green-500/20 rounded-lg hover:bg-green-500/10 transition">
                      <div className="flex items-center gap-3 flex-1">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{reminder.title}</p>
                          <p className="text-xs text-muted-foreground">{formatDateTime(reminder.date, reminder.time)}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDeleteReminder(reminder._id)}
                        className="bg-red-500/10 text-red-600 hover:bg-red-500/20 px-3 ml-2 flex-shrink-0"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Create Reminder Modal */}
          {showCreateReminder && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="max-w-md w-full p-6 space-y-6">
                <h2 className="text-2xl font-bold">Create New Reminder</h2>

                <form onSubmit={handleCreateReminder} className="space-y-4">
                  <Input
                    label="Reminder Title"
                    placeholder="e.g., Netflix Bill Payment"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                    required
                  />

                  <div>
                    <label className="text-sm block mb-2">Description (Optional)</label>
                    <textarea
                      placeholder="Add details about this reminder"
                      value={newReminder.description}
                      onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      rows={3}
                    />
                  </div>

                  <Input
                    label="Date"
                    type="date"
                    value={newReminder.date}
                    onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
                    required
                  />

                  <Input
                    label="Time (HH:MM)"
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                    required
                  />

                  <div>
                    <label className="text-sm block mb-2">Frequency</label>
                    <select
                      value={newReminder.frequency}
                      onChange={(e) => setNewReminder({ ...newReminder, frequency: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="once">Once</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      onClick={() => setShowCreateReminder(false)}
                      className="flex-1 bg-muted text-foreground hover:bg-muted/80"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1" disabled={loading}>
                      {loading ? 'Creating...' : 'Create Reminder'}
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
