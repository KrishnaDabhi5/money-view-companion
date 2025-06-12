
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Mail, Phone, MapPin, Edit, Target, Save, X, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRealtimeProfile } from '@/hooks/useRealtimeProfile';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Profile = () => {
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useRealtimeProfile();
  const [editing, setEditing] = useState(false);
  const [editingGoal, setEditingGoal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    current_monthly_goal: 0,
  });

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        current_monthly_goal: profile.current_monthly_goal || 0,
      });
    }
  }, [profile]);

  const handleEdit = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        current_monthly_goal: profile.current_monthly_goal || 0,
      });
    }
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditingGoal(false);
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        current_monthly_goal: profile.current_monthly_goal || 0,
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await updateProfile(formData);
      if (error) {
        toast.error('Failed to update profile: ' + error);
      } else {
        toast.success('Profile updated successfully!');
        setEditing(false);
        setEditingGoal(false);
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleAddGoal = () => {
    setEditingGoal(true);
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        current_monthly_goal: profile.current_monthly_goal || 0,
      });
    }
  };

  const handleUpdateGoal = async () => {
    setSaving(true);
    try {
      const { error } = await updateProfile({
        current_monthly_goal: formData.current_monthly_goal
      });
      if (error) {
        toast.error('Failed to update goal: ' + error);
      } else {
        toast.success('Monthly goal updated successfully!');
        setEditingGoal(false);
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
        </div>
      </div>
    );
  }

  const memberSince = new Date(profile.created_at).getFullYear();
  const displayName = profile.full_name || profile.email || 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();

  const stats = [
    { label: 'Monthly Goal', value: `₹${profile.current_monthly_goal.toLocaleString()}`, icon: Target },
    { label: 'Member Since', value: memberSince, icon: Calendar },
    { label: 'Account Type', value: 'Premium', icon: User },
    { label: 'Status', value: 'Active', icon: User },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center space-x-6">
          <Avatar className="h-24 w-24 border-4 border-white">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="text-2xl bg-white text-blue-600">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{displayName}</h1>
            <p className="text-blue-100 mt-1">Personal Finance Tracker User</p>
            <div className="flex items-center space-x-4 mt-3">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Calendar className="h-3 w-3 mr-1" />
                Member since {memberSince}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Target className="h-3 w-3 mr-1" />
                Goal: ₹{profile.current_monthly_goal.toLocaleString()}
              </Badge>
            </div>
          </div>
          <div className="flex space-x-2">
            {editing || editingGoal ? (
              <>
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  className="bg-green-600/20 border-green-400/20 text-white hover:bg-green-600/30"
                  onClick={editingGoal ? handleUpdateGoal : handleSave}
                  disabled={saving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="bg-green-600/20 border-green-400/20 text-white hover:bg-green-600/30"
                  onClick={handleAddGoal}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="p-6 bg-white shadow-sm text-center">
              <div className="flex items-center justify-center mb-2">
                <IconComponent className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              {editing ? (
                <div className="flex-1">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium">{profile.full_name || 'Not set'}</p>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{profile.email}</p>
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              {editing ? (
                <div className="flex-1">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{profile.phone || 'Not set'}</p>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              {editing ? (
                <div className="flex-1">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter your address"
                  />
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">{profile.address || 'Not set'}</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Financial Goals */}
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Financial Goals</h3>
            {!editingGoal && !editing && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddGoal}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Goal
              </Button>
            )}
          </div>
          
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-gray-900">Current Monthly Goal</h4>
              {editing || editingGoal ? (
                <div className="mt-2">
                  <Label htmlFor="goal">Monthly Savings Goal (₹)</Label>
                  <Input
                    id="goal"
                    type="number"
                    value={formData.current_monthly_goal}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      current_monthly_goal: parseFloat(e.target.value) || 0 
                    })}
                    placeholder="Enter your monthly goal"
                    min="0"
                    step="100"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Set a realistic monthly savings target to track your progress
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-2xl font-bold text-blue-600">₹{profile.current_monthly_goal.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {profile.current_monthly_goal > 0 ? 'Active Goal' : 'No goal set yet'}
                  </p>
                  {profile.current_monthly_goal === 0 && (
                    <p className="text-sm text-orange-600 mt-1">
                      Click "Add Goal" to set your first savings target!
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium text-gray-900">Account Status</h4>
              <p className="text-2xl font-bold text-green-600">Active</p>
              <p className="text-sm text-gray-600 mt-1">All features enabled</p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium text-gray-900">Member Since</h4>
              <p className="text-2xl font-bold text-purple-600">{memberSince}</p>
              <p className="text-sm text-gray-600 mt-1">
                {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
