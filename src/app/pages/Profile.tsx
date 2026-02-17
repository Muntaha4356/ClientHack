import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AIChat } from '../components/AIChat';
import { User, Mail, DollarSign, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import apiClient from '../../utils/apiClient';


export function Profile() {
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    monthlyIncome: ''
  });
  
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [loading, setLoading] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const response = await apiClient.get("/user/profile");
        const data = response.data.data;

        setProfile({
          fullName: data.fullName || "",
          email: data.email || "",
          monthlyIncome: data.monthlyIncome || "",
        });

      } catch (error: unknown) {
        console.error("Failed to fetch profile:", error);
        alert("Could not load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);


  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await apiClient.put("/user/profile", {
        fullName: profile.fullName,
        monthlyIncome: profile.monthlyIncome,
      });

      setProfile(prev => ({
        ...prev,
        ...response.data.data,
      }));

      alert("Profile updated successfully!");

    } catch (error: unknown) {
      console.error("Profile update failed:", error);
      alert("Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.new !== password.confirm) {
      alert("New passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      const response = await apiClient.post("/user/change-password", {
        current: password.current,
        new: password.new,
        confirm: password.confirm,
      });

      alert(response.data.message || "Password changed!");

      setPassword({
        current: "",
        new: "",
        confirm: "",
      });

    } catch (error: unknown) {
      console.error("Password change failed:", error);
      alert("Password change failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);

      await apiClient.delete("/user/account");

      toast.success('Account deleted successfully', {
        autoClose: 2000,
      });

      // Clear token from localStorage
      localStorage.removeItem('token');
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error: unknown) {
      console.error("Account deletion failed:", error);
      toast.error('Failed to delete account. Please try again.', {
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
      setShowDeleteConfirmation(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <Header userName={profile.fullName.split(' ')[0] || 'User'} />
        
        <main className="p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account information and preferences</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Picture */}
            <Card className="text-center">
              <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-16 h-16 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{profile.fullName || 'Student User'}</h3>
              <p className="text-sm text-muted-foreground mt-1">{profile.email || 'student@university.edu'}</p>
              
              <div className="mt-6 space-y-3">
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">Monthly Income</p>
                  <p className="text-2xl font-bold text-primary">${profile.monthlyIncome || '0'}</p>
                </div>
                
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-semibold">February 2026</p>
                </div>
              </div>
            </Card>

            {/* Profile Information */}
            <Card className="lg:col-span-2">
              <h3 className="text-xl font-bold mb-6">Personal Information</h3>
              
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="John Doe"
                  />
                </div>

                {/* <div className="space-y-2">
                  <label className="text-sm flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="john@university.edu"
                  />
                </div> */}

                <div className="space-y-2">
                  <label className="text-sm flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    Monthly Income
                  </label>
                  <input
                    type="number"
                    value={profile.monthlyIncome}
                    onChange={(e) => setProfile({ ...profile, monthlyIncome: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="3200"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Save Changes
                </Button>
              </form>
            </Card>
          </div>

          {/* Change Password */}
          <Card>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Change Password
            </h3>
            
            <form onSubmit={handleChangePassword} className="space-y-6 max-w-2xl">
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
                value={password.current}
                onChange={(e) => setPassword({ ...password, current: e.target.value })}
              />

              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={password.new}
                onChange={(e) => setPassword({ ...password, new: e.target.value })}
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                value={password.confirm}
                onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
              />

              <Button type="submit">
                Update Password
              </Button>
            </form>
          </Card>

          {/* Account Settings */}
          <Card className="bg-red-500/5 border-red-500/20">
            <h3 className="text-xl font-bold mb-4 text-red-400">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button 
              onClick={() => setShowDeleteConfirmation(true)}
              className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/20"
            >
              Delete Account
            </Button>
          </Card>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirmation && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="max-w-md p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-red-400 mb-2">Delete Account?</h2>
                  <p className="text-sm text-muted-foreground">
                    This action cannot be undone. All your data including transactions, chat history, and notifications will be permanently deleted.
                  </p>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-sm text-red-400 font-semibold">
                    ⚠️ Are you absolutely sure?
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={() => setShowDeleteConfirmation(false)}
                    className="flex-1 bg-muted text-foreground hover:bg-muted/80"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleDeleteAccount}
                    className="flex-1 bg-red-500 text-white hover:bg-red-600"
                    disabled={loading}
                  >
                    {loading ? 'Deleting...' : 'Delete Permanently'}
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>

      <AIChat />
    </div>
  );
}