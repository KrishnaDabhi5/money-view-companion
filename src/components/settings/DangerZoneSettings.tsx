
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useAccountDeletion } from '@/hooks/useAccountDeletion';

export const DangerZoneSettings = () => {
  const { isDeleting, deleteAccount } = useAccountDeletion();

  return (
    <Card className="p-4 md:p-6 border-red-200 bg-red-50/50">
      <div className="flex items-center space-x-2 mb-4 md:mb-6">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-red-200 rounded-lg bg-white gap-4">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-red-900 mb-1">Delete Account</h4>
            <p className="text-sm text-red-700">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <div className="flex-shrink-0">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  disabled={isDeleting}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="mx-4 max-w-lg">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-2">
                    <p>This action cannot be undone. This will permanently delete your account and remove all your data from our servers.</p>
                    <p className="font-medium">This includes:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>All your financial records and transactions</li>
                      <li>Budget plans and goals</li>
                      <li>Analytics and reports</li>
                      <li>Profile information and settings</li>
                    </ul>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                  <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={deleteAccount}
                    className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Yes, delete my account'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </Card>
  );
};
