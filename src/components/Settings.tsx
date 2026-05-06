import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Settings as SettingsIcon,
  LogOut, User, Shield, Code2, CheckCircle, AlertCircle,
  ChevronRight, Mail, Tag, Monitor, Globe,
  Sparkles, ToggleLeft, ToggleRight, Key, Eye, EyeOff, Save,
  BarChart2,
} from 'lucide-react';
import { useAIBlock } from '../hooks/useAIBlock';
import { invalidatePlannerTokenCache } from '../lib/hubApi';
import { supabase } from '../lib/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function fetchAdminConfig(hubToken: string, key: string): Promise<string> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/admin-config?key=${key}`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'X-Hub-Token': hubToken,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const json = await res.json();
  return json.data?.value || '';
}

async function saveAdminConfig(hubToken: string, key: string, value: string): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/admin-config?key=${key}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'X-Hub-Token': hubToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ value }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error || `Error ${res.status}`);
  }
}

export default function Settings() {
  const { logout, profile, user, isDevMode, toggleDevMode, refreshProfile } = useAuth();
  const { t } = useLanguage();
  const isAdmin = profile?.role === 'admin';

  const handleToggleDevMode = () => {
    const newMode = !isDevMode;
    const confirmMessage = newMode
      ? 'Switch to Development Mode? You will be able to select test profiles without HUB authentication.'
      : 'Switch to Production Mode? You will need to authenticate through the HUB. The page will reload.';
    if (confirm(confirmMessage)) {
      toggleDevMode(newMode);
    }
  };

  const roleLabel = profile?.role === 'coach' ? 'Coach' : profile?.role === 'admin' ? 'Admin' : 'Athlete';
  const roleColor = profile?.role === 'coach'
    ? 'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-900/20 dark:border-blue-800'
    : profile?.role === 'admin'
    ? 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-900/20 dark:border-amber-800'
    : 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-900/20 dark:border-emerald-800';

  const membershipLabel = user?.membership_name || 'Asciende Inicia';
  const membershipColor = user?.membership_slug === 'pro'
    ? 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-900/20 dark:border-amber-800'
    : user?.membership_slug === 'intermediate'
    ? 'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-900/20 dark:border-blue-800'
    : 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gray-900 dark:bg-white flex items-center justify-center">
          <SettingsIcon className="w-5 h-5 text-white dark:text-gray-900" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-body">Account & preferences</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#fdda36] flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-2xl font-bold text-gray-900">
                {profile?.full_name?.charAt(0).toUpperCase() || '?'}
              </span>
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-white truncate">{profile?.full_name || 'User'}</h2>
              <p className="text-gray-400 text-sm mt-0.5 truncate">{profile?.email}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${roleColor}`}>
                  {roleLabel}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${membershipColor}`}>
                  {membershipLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          <div className="flex items-center gap-3 px-6 py-4">
            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Full Name</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5 truncate">
                {profile?.full_name || 'Not set'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-6 py-4">
            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Email</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5 truncate">
                {profile?.email || 'Not set'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-6 py-4">
            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Role</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{roleLabel}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-6 py-4">
            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
              <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Membership</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{membershipLabel}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Profile and account management is handled through the HUB portal at{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-300">hub.asciende.pro</span>.
          </p>
        </div>
      </div>

      {/* Admin-only sections */}
      {isAdmin && (
        <>
          <AdminHubTokenCard adminId={profile?.id || ''} />
          <AdminAISettingsCard adminId={profile?.id || ''} />
        </>
      )}

      {/* Zone System Preference Card */}
      <ZoneSystemCard profileId={profile?.id || ''} currentZoneSystem={profile?.preferred_zone_system ?? '5'} onSaved={refreshProfile} />

      {/* Dev Mode Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Developer Settings</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Testing and development configuration</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                isDevMode ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-gray-100 dark:bg-gray-800'
              }`}>
                <Monitor className={`w-4 h-4 ${isDevMode ? 'text-amber-600' : 'text-gray-500 dark:text-gray-400'}`} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Local Development Mode</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {isDevMode
                    ? 'Active — Select test profiles without HUB authentication'
                    : 'Inactive — Using HUB authentication (production)'}
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleDevMode}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none flex-shrink-0 ${
                isDevMode ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                  isDevMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {isDevMode && (
            <div className="mt-4 flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                <span className="font-semibold">Dev Mode Active:</span> Switch between Admin, Coach, and Athlete profiles for testing. HUB connection is disabled.
              </p>
            </div>
          )}

          {!isDevMode && (
            <div className="mt-4 flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-800">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                <span className="font-semibold">Production Mode:</span> Authenticated via hub.asciende.pro. All users must go through the HUB portal.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sign Out */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        <button
          onClick={logout}
          className="w-full flex items-center justify-between px-6 py-4 group hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <LogOut className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-red-600 dark:text-red-400">{t('settings.signOut')}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('settings.signOutDesc')}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 pb-4">
        <Globe className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
        <p className="text-xs text-gray-400 dark:text-gray-600">{t('settings.footer')}</p>
      </div>
    </div>
  );
}

// ─── Zone System Preference Card ──────────────────────────────────────────────

function ZoneSystemCard({
  profileId,
  currentZoneSystem,
  onSaved,
}: {
  profileId: string;
  currentZoneSystem: '5' | '7';
  onSaved: () => Promise<void>;
}) {
  const [selected, setSelected] = useState<'5' | '7'>(currentZoneSystem);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSelected(currentZoneSystem);
  }, [currentZoneSystem]);

  const isDirty = selected !== currentZoneSystem;

  const handleSave = async () => {
    if (!profileId) return;
    setSaving(true);
    setError(null);
    const { error: err } = await supabase
      .from('profiles')
      .update({ preferred_zone_system: selected })
      .eq('id', profileId);
    if (err) {
      setError(err.message);
    } else {
      await onSaved();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    setSaving(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <BarChart2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Zone System Preference</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Choose how training zones are displayed in workouts</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 space-y-4">
        <div className="flex gap-3">
          {(['5', '7'] as const).map(sys => (
            <button
              key={sys}
              type="button"
              onClick={() => setSelected(sys)}
              className={`flex-1 flex flex-col items-center gap-2 px-4 py-4 rounded-xl border-2 transition ${
                selected === sys
                  ? 'border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex gap-1">
                {Array.from({ length: parseInt(sys) }, (_, i) => (
                  <div
                    key={i}
                    className={`h-5 rounded-sm transition-all ${selected === sys ? 'bg-current opacity-80' : 'bg-gray-300 dark:bg-gray-600'}`}
                    style={{ width: `${Math.max(6, 40 / parseInt(sys))}px` }}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold">{sys} Zones</span>
              <span className={`text-xs ${selected === sys ? 'opacity-70' : 'text-gray-400 dark:text-gray-500'}`}>
                {sys === '5' ? 'Classic 5-zone model' : 'Extended 7-zone model'}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-400 dark:text-gray-500">
            {selected === '5'
              ? 'Z1 Recovery · Z2 Aerobic · Z3 Tempo · Z4 Threshold · Z5 VO2max'
              : 'Z1–Z2 Aerobic · Z3 Tempo · Z4 SubThreshold · Z5 Threshold · Z6 VO2max · Z7 Neuro'}
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !isDirty || !profileId}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 dark:bg-white hover:bg-gray-700 dark:hover:bg-gray-100 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white dark:text-gray-900 disabled:text-gray-400 text-sm font-semibold transition flex-shrink-0"
          >
            <Save size={14} />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
            <AlertCircle size={14} />
            {error}
          </div>
        )}
        {saved && (
          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle size={14} />
            Preference saved. Zones updated throughout the app.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Admin: Hub Token Card ─────────────────────────────────────────────────────

function AdminHubTokenCard({ adminId: _ }: { adminId: string }) {
  const [token, setToken] = useState('');
  const [originalToken, setOriginalToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHubToken = () => localStorage.getItem('hub_session_token') || '';

  const loadToken = useCallback(async () => {
    const hubToken = getHubToken();
    if (!hubToken) return;
    try {
      const val = await fetchAdminConfig(hubToken, 'hub_planner_token');
      setToken(val);
      setOriginalToken(val);
    } catch {
      // token may not exist yet — leave empty
    }
  }, []);

  useEffect(() => { loadToken(); }, [loadToken]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const hubToken = getHubToken();
    if (!hubToken) {
      setError('No hub session token found. Please re-authenticate.');
      setSaving(false);
      return;
    }
    try {
      await saveAdminConfig(hubToken, 'hub_planner_token', token);
      setOriginalToken(token);
      invalidatePlannerTokenCache();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
    setSaving(false);
  };

  const isDirty = token !== originalToken;

  const maskedToken = token
    ? token.length > 12
      ? token.slice(0, 6) + '••••••••••••' + token.slice(-4)
      : '••••••••••••'
    : '';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-amber-200 dark:border-amber-800/50 overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-amber-100 dark:border-amber-800/40 bg-amber-50/50 dark:bg-amber-900/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Key className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Hub Planner Token
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-full uppercase tracking-wider">
                Admin only
              </span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Token de tipo "endurance" emitido por el Hub (X-Planner-Token)</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-2">
            Token value
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showToken ? 'text' : 'password'}
                value={token}
                onChange={e => setToken(e.target.value)}
                placeholder="Pega el token recibido del Hub..."
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent font-mono"
              />
              <button
                type="button"
                onClick={() => setShowToken(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
              >
                {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button
              onClick={handleSave}
              disabled={saving || !isDirty}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white disabled:text-gray-400 text-sm font-semibold transition flex-shrink-0"
            >
              <Save size={15} />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {!showToken && originalToken && (
          <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">
            Current: {maskedToken}
          </p>
        )}

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        {saved && (
          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle size={14} />
            Token guardado. El cache fue invalidado.
          </div>
        )}

        <div className="pt-1 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Este token se usa en todas las llamadas a <span className="font-mono">planner-hub-api/*</span> como header <span className="font-mono">X-Planner-Token</span>. Pedilo al Hub (tipo: "endurance").
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Admin: AI Settings Card ───────────────────────────────────────────────────

function AdminAISettingsCard({ adminId }: { adminId: string }) {
  const { settings, updateAdminSettings } = useAIBlock(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleToggleAI = async () => {
    if (!settings) return;
    setSaving(true);
    const ok = await updateAdminSettings({ ai_enabled: !settings.ai_enabled }, adminId);
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
    setSaving(false);
  };

  const handleToggleCoachSend = async () => {
    if (!settings) return;
    setSaving(true);
    await updateAdminSettings({ coaches_can_send: !settings.coaches_can_send }, adminId);
    setSaving(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              AI Block Generation
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-full uppercase tracking-wider">
                Admin only
              </span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Control de acceso a la generacion de bloques con IA</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        {settings ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">AI Feature Enabled</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Cuando esta desactivado ningun usuario puede generar bloques IA
                </p>
              </div>
              <button
                onClick={handleToggleAI}
                disabled={saving}
                className="flex items-center gap-2 transition-all disabled:opacity-60"
              >
                {settings.ai_enabled ? (
                  <ToggleRight size={36} className="text-emerald-500 hover:text-emerald-600 transition-colors" />
                ) : (
                  <ToggleLeft size={36} className="text-gray-400 hover:text-gray-500 transition-colors" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">Coaches Can Send AI Blocks</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Permite a los coaches generar y enviar bloques IA a sus atletas
                </p>
              </div>
              <button
                onClick={handleToggleCoachSend}
                disabled={saving || !settings.ai_enabled}
                className="flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {settings.coaches_can_send ? (
                  <ToggleRight size={36} className="text-emerald-500 hover:text-emerald-600 transition-colors" />
                ) : (
                  <ToggleLeft size={36} className="text-gray-400 hover:text-gray-500 transition-colors" />
                )}
              </button>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
              <p className="font-medium text-gray-900 dark:text-white text-sm mb-2">Allowed Membership Tiers</p>
              <div className="flex flex-wrap gap-2">
                {settings.membership_tier_allowlist.map(tier => (
                  <span key={tier} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full font-medium border border-amber-200 dark:border-amber-800/50">
                    <Sparkles size={10} />
                    {tier}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Los tiers se gestionan desde el Hub. Los atletas deben tener uno de estos planes.
              </p>
            </div>

            {!settings.ai_enabled && (
              <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl px-4 py-3">
                <AlertCircle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  La generacion de bloques IA esta <strong>desactivada</strong>. Ningun usuario puede generar bloques hasta que lo reactives.
                </p>
              </div>
            )}

            {saved && (
              <div className="text-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Configuracion guardada
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">Loading AI settings...</div>
        )}
      </div>
    </div>
  );
}
