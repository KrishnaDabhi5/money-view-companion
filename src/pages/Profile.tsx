
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Mail, Phone, MapPin, Edit } from 'lucide-react';
import { useState } from 'react';

const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+91 98765 43210',
    address: 'Mumbai, Maharashtra',
    memberSince: '2024-01-15',
    totalTransactions: 156,
    currentSavingsGoal: 50000,
    achievedGoals: 3,
  });

  const handleSave = () => {
    setEditing(false);
    // In a real app, you would save to backend here
  };

  const stats = [
    { label: 'Total Transactions', value: profile.totalTransactions },
    { label: 'Current Goal', value: `₹${profile.currentSavingsGoal.toLocaleString()}` },
    { label: 'Goals Achieved', value: profile.achievedGoals },
    { label: 'Member Since', value: new Date(profile.memberSince).getFullYear() },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center space-x-6">
          <Avatar className="h-24 w-24 border-4 border-white">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="text-2xl bg-white text-blue-600">
              {profile.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <p className="text-blue-100 mt-1">Personal Finance Tracker User</p>
            <div className="flex items-center space-x-4 mt-3">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Calendar className="h-3 w-3 mr-1" />
                Member since {new Date(profile.memberSince).getFullYear()}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <User className="h-3 w-3 mr-1" />
                {profile.totalTransactions} transactions
              </Badge>
            </div>
          </div>
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={() => setEditing(!editing)}
          >
            <Edit className="h-4 w-4 mr-2" />
            {editing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 bg-white shadow-sm text-center">
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
          </Card>
        ))}
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
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium">{profile.name}</p>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              {editing ? (
                <div className="flex-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{profile.email}</p>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              {editing ? (
                <div className="flex-1">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{profile.phone}</p>
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
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  />
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">{profile.address}</p>
                </div>
              )}
            </div>

            {editing && (
              <div className="pt-4">
                <Button onClick={handleSave} className="w-full">
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Financial Goals */}
        <Card className="p-6 bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Financial Goals</h3>
          
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-gray-900">Current Savings Goal</h4>
              <p className="text-2xl font-bold text-blue-600">₹{profile.currentSavingsGoal.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-1">Emergency Fund - 75% Complete</p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium text-gray-900">Goals Achieved</h4>
              <p className="text-2xl font-bold text-green-600">{profile.achievedGoals}</p>
              <p className="text-sm text-gray-600 mt-1">Vacation Fund, Laptop Fund, Health Insurance</p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium text-gray-900">Next Goal</h4>
              <p className="text-2xl font-bold text-purple-600">₹1,00,000</p>
              <p className="text-sm text-gray-600 mt-1">Investment Portfolio</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
