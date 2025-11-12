import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { Suspense, lazy, useState } from 'react';
import { Spinner } from '@packages/ui';

const ProfileApp = lazy(() => import('profile/App'));

export function ProfileWrapper() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdateProfile = async (data: { name?: string; email?: string }) => {
    setLoading(true);
    setError('');
    try {
      await authService.updateProfile(data);
      await refreshUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (data: { currentPassword: string; newPassword: string }) => {
    setLoading(true);
    setError('');
    try {
      await authService.updatePassword(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="flex justify-center p-8"><Spinner size="lg" /></div>;

  return (
    <Suspense fallback={<div className="flex justify-center p-8"><Spinner size="lg" /></div>}>
      <ProfileApp
        user={user}
        onUpdateProfile={handleUpdateProfile}
        onUpdatePassword={handleUpdatePassword}
        loading={loading}
        error={error}
      />
    </Suspense>
  );
}
