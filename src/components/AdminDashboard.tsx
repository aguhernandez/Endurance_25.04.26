import { useEffect, useState } from 'react';
import { supabase, Profile } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Users, Shield, UserCog } from 'lucide-react';

type View = 'dashboard' | 'settings';

interface AdminDashboardProps {
  onNavigate: (view: View) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { profile } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, athletes: 0, coaches: 0, admins: 0 });

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      const profiles = data || [];
      setUsers(profiles);
      setStats({
        totalUsers: profiles.length,
        athletes: profiles.filter(p => p.role === 'athlete').length,
        coaches: profiles.filter(p => p.role === 'coach').length,
        admins: profiles.filter(p => p.role === 'admin').length,
      });
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'badge-red';
      case 'coach': return 'badge-blue';
      case 'athlete': return 'badge-green';
      default: return 'badge';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-primary-purple dark:text-white text-xl font-body">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-heading text-primary-purple dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 font-body mt-1">Welcome, {profile?.full_name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400 text-sm font-body">Total Users</span>
            <Users className="w-5 h-5 text-primary-yellow" />
          </div>
          <p className="text-3xl font-bold text-primary-purple dark:text-white">{stats.totalUsers}</p>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400 text-sm font-body">Athletes</span>
            <Users className="w-5 h-5 text-accent-green" />
          </div>
          <p className="text-3xl font-bold text-primary-purple dark:text-white">{stats.athletes}</p>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400 text-sm font-body">Coaches</span>
            <UserCog className="w-5 h-5 text-accent-blue" />
          </div>
          <p className="text-3xl font-bold text-primary-purple dark:text-white">{stats.coaches}</p>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400 text-sm font-body">Admins</span>
            <Shield className="w-5 h-5 text-accent-red" />
          </div>
          <p className="text-3xl font-bold text-primary-purple dark:text-white">{stats.admins}</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-heading font-semibold text-primary-purple dark:text-white mb-6">All Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-body font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-body font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-body font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-body font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created At</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-body font-medium text-gray-900 dark:text-white">{user.full_name || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-body text-gray-500 dark:text-gray-400">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getRoleBadgeColor(user.role)}>{user.role}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-body text-gray-500 dark:text-gray-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
