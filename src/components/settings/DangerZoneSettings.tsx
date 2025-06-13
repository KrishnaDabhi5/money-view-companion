
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useAccountDeletion } from '@/hooks/useAccountDeletion';
import { toast } from 'sonner';

export const DangerZoneSettings = () => {
  const { deleteAccount, isDeleting } = useAccountDeletion();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleDeleteAccount = async () => {
    if (!confirmPassword) {
      toast.error('Please enter your password to confirm account deletion');
      return;
    }
    
    setShowConfirmPassword(false);
    setConfirmPassword('');
    await deleteAccount();
  };

  return (
    <Card className="p-4 md:p-6 bg-red-50 border-red-200">
      <div className="flex items-center space-x-2 mb-4">
        <Trash2 className="h-5 w-5 text-red-600" />
        <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
      </div>
      
      <div className="space-y-3">
        <p className="text-sm text-red-700">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full" disabled={isDeleting}>
              {isDeleting ? 'Deleting Account...' : 'Delete Account'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove all your data from our servers including:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>All your expense and income records</li>
                  <li>Budget settings and goals</li>
                  <li>Profile information</li>
                  <li>App preferences and settings</li>
                </ul>
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="space-y-3 my-4">
              <Label htmlFor="confirm-password">Enter your password to confirm:</Label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700"
                disabled={!confirmPassword || isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
};
