import React, { useState } from 'react';
import { Card, CardTitle, CardHeader, Button } from '@packages/ui';
import './index.css';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AppProps {
  user?: User;
  onUpdateProfile?: (data: { name?: string; email?: string }) => Promise<void>;
  onUpdatePassword?: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
  loading?: boolean;
  error?: string;
}

function App({ user, onUpdateProfile, onUpdatePassword, loading, error }: AppProps = {}) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!onUpdateProfile) return;

    try {
      await onUpdateProfile({ name, email });
      setIsEditingProfile(false);
      setSuccessMessage('Profile updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Update failed');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!onUpdatePassword) return;

    if (newPassword !== confirmPassword) {
      setFormError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    try {
      await onUpdatePassword({ currentPassword, newPassword });
      setIsEditingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMessage('Password updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Password update failed');
    }
  };

  const handleCancelProfile = () => {
    setIsEditingProfile(false);
    setName(user?.name || '');
    setEmail(user?.email || '');
    setFormError('');
  };

  const handleCancelPassword = () => {
    setIsEditingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setFormError('');
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          {(error || formError) && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error || formError}</p>
            </div>
          )}

          {successMessage && (
            <div className="rounded-md bg-green-50 p-4">
              <p className="text-sm text-green-800">{successMessage}</p>
            </div>
          )}

          {!isEditingProfile && !isEditingPassword && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-lg text-gray-900">{user?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-lg text-gray-900">{user?.email || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Member Since</label>
                <p className="mt-1 text-gray-700">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  onClick={() => setIsEditingProfile(true)}
                  disabled={loading}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditingPassword(true)}
                  disabled={loading}
                >
                  Change Password
                </Button>
              </div>
            </>
          )}

          {isEditingProfile && (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancelProfile} disabled={loading}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {isEditingPassword && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancelPassword} disabled={loading}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </Card>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Module Federation Remote:</strong> This Profile component is loaded from the remote MFE running on port 3001
        </p>
      </div>
    </div>
  );
}

export default App;
