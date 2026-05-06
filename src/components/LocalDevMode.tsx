import { useState } from 'react';
import { User, Shield, Award } from 'lucide-react';
import { supabase, Profile } from '../lib/supabase';

interface LocalDevModeProps {
  onProfileSelected: (profile: Profile) => void;
}

export default function LocalDevMode({ onProfileSelected }: LocalDevModeProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDevProfile = async (role: 'athlete' | 'coach' | 'admin') => {
    setLoading(true);
    setError(null);

    try {
      const devEmail = `dev-${role}@local.dev`;
      const devName = role === 'athlete' ? 'Test Athlete' : role === 'coach' ? 'Test Coach' : 'Test Admin';

      const { data: existing, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', devEmail)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existing) {
        onProfileSelected(existing);
      } else {
        const newId = crypto.randomUUID();
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: newId,
            email: devEmail,
            full_name: devName,
            role,
            hub_user_id: `dev-${role}-${Date.now()}`
          })
          .select()
          .single();

        if (insertError) throw insertError;

        onProfileSelected(newProfile);
      }
    } catch (err) {
      console.error('Error creating dev profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to create dev profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#514163] to-[#3a2e4a] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-yellow-600 text-3xl">⚙</span>
          </div>
          <h1 className="text-3xl font-bold text-[#514163] mb-2">Local Development Mode</h1>
          <p className="text-gray-600">
            Select a profile type to continue development
          </p>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => createDevProfile('athlete')}
            disabled={loading}
            className="group p-6 border-2 border-gray-200 rounded-xl hover:border-[#514163] hover:bg-[#514163] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 group-hover:bg-white rounded-full flex items-center justify-center mb-3 transition">
                <User className="w-8 h-8 text-blue-600 group-hover:text-[#514163] transition" />
              </div>
              <h3 className="text-lg font-semibold text-[#514163] group-hover:text-white transition mb-1">
                Athlete
              </h3>
              <p className="text-sm text-gray-500 group-hover:text-gray-200 transition text-center">
                View sessions and track performance
              </p>
            </div>
          </button>

          <button
            onClick={() => createDevProfile('coach')}
            disabled={loading}
            className="group p-6 border-2 border-gray-200 rounded-xl hover:border-[#514163] hover:bg-[#514163] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 group-hover:bg-white rounded-full flex items-center justify-center mb-3 transition">
                <Award className="w-8 h-8 text-green-600 group-hover:text-[#514163] transition" />
              </div>
              <h3 className="text-lg font-semibold text-[#514163] group-hover:text-white transition mb-1">
                Coach
              </h3>
              <p className="text-sm text-gray-500 group-hover:text-gray-200 transition text-center">
                Create and manage training sessions
              </p>
            </div>
          </button>

          <button
            onClick={() => createDevProfile('admin')}
            disabled={loading}
            className="group p-6 border-2 border-gray-200 rounded-xl hover:border-[#514163] hover:bg-[#514163] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 group-hover:bg-white rounded-full flex items-center justify-center mb-3 transition">
                <Shield className="w-8 h-8 text-purple-600 group-hover:text-[#514163] transition" />
              </div>
              <h3 className="text-lg font-semibold text-[#514163] group-hover:text-white transition mb-1">
                Admin
              </h3>
              <p className="text-sm text-gray-500 group-hover:text-gray-200 transition text-center">
                Full system management access
              </p>
            </div>
          </button>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>Note:</strong> This mode is for local development only. In production, authentication will be handled by the HUB.
          </p>
        </div>
      </div>
    </div>
  );
}
