# Guía de Implementación: Local Development Mode para Satélites

Esta guía te permitirá implementar el sistema de "Local Development Mode" en cualquier satélite de Asciende. Este sistema permite:
- Trabajar localmente sin conectar al HUB durante desarrollo
- Cambiar fácilmente entre modo desarrollo y producción con un toggle
- Crear perfiles de prueba (Admin, Coach, Athlete) instantáneamente
- Mantener la seguridad RLS en Supabase

---

## 📋 Tabla de Contenidos

1. [Variables de Entorno](#1-variables-de-entorno)
2. [Estructura de Base de Datos](#2-estructura-de-base-de-datos)
3. [Migraciones de Supabase](#3-migraciones-de-supabase)
4. [Cliente Supabase](#4-cliente-supabase)
5. [Context de Autenticación](#5-context-de-autenticación)
6. [Componentes UI](#6-componentes-ui)
7. [App Principal](#7-app-principal)
8. [Notas Finales](#8-notas-finales)

---

## 1. Variables de Entorno

Crea o actualiza tu archivo `.env`:

```env
VITE_SUPABASE_URL=https://TU-PROJECT-ID.supabase.co
VITE_SUPABASE_ANON_KEY=TU-ANON-KEY
VITE_FORCE_DEV_MODE=true
```

---

## 2. Estructura de Base de Datos

Tu base de datos necesita al menos una tabla `profiles` que funcione independientemente de `auth.users`.

**Tabla `profiles`:**
```sql
- id (uuid, primary key)
- email (text)
- full_name (text, nullable)
- role (text: 'athlete' | 'coach' | 'admin')
- hub_user_id (text, nullable) - conecta con el HUB en producción
- created_at (timestamptz)
- updated_at (timestamptz)
```

---

## 3. Migraciones de Supabase

### 3.1. Crear tabla profiles

```sql
/*
  # Create profiles table

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `full_name` (text, nullable)
      - `role` (text: athlete/coach/admin)
      - `hub_user_id` (text, nullable) - for HUB integration
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on profiles table
    - Add policies for authenticated and anonymous users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  role text NOT NULL CHECK (role IN ('athlete', 'coach', 'admin')),
  hub_user_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
```

### 3.2. Crear políticas RLS para modo desarrollo

```sql
/*
  # Allow anonymous profile management for local development

  1. Changes
    - Add policy to allow anonymous users to read profiles
    - Add policy to allow anonymous users to create profiles
    - Add policy to allow anonymous users to update profiles
    - Add policy to allow anonymous users to delete profiles

  2. Security
    - These policies enable local development mode
    - In production, these should be restricted
    - Profiles table still has RLS enabled
*/

-- Allow anonymous users to read profiles (for local development)
CREATE POLICY "Anonymous can read profiles"
  ON profiles FOR SELECT
  TO anon
  USING (true);

-- Allow anonymous users to insert profiles (for local development)
CREATE POLICY "Anonymous can create profiles"
  ON profiles FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to update profiles (for local development)
CREATE POLICY "Anonymous can update profiles"
  ON profiles FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to delete profiles (for local development)
CREATE POLICY "Anonymous can delete profiles"
  ON profiles FOR DELETE
  TO anon
  USING (true);
```

### 3.3. Ajustar Foreign Keys

**IMPORTANTE:** Si tienes otras tablas que referencian usuarios (como `athlete_ftp`, `cycling_sessions`, etc.), necesitas actualizar sus foreign keys para que apunten a `profiles` en lugar de `auth.users`.

```sql
/*
  # Fix Foreign Key References for Local Development

  1. Changes
    - Drop foreign key constraints that reference auth.users
    - Add new foreign key constraints that reference profiles table
    - This allows local development mode to work without auth.users entries

  2. Security
    - RLS policies remain unchanged and secure
    - Foreign keys now point to profiles table
*/

-- Ejemplo para una tabla "your_table"
ALTER TABLE your_table
  DROP CONSTRAINT IF EXISTS your_table_user_id_fkey;

ALTER TABLE your_table
  ADD CONSTRAINT your_table_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
```

### 3.4. Políticas RLS para tus tablas de negocio

Cada tabla de tu aplicación necesita políticas que permitan acceso anónimo en desarrollo:

```sql
-- Ejemplo para tu tabla de negocio
CREATE POLICY "Anonymous can read your_table"
  ON your_table FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous can create your_table"
  ON your_table FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous can update your_table"
  ON your_table FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anonymous can delete your_table"
  ON your_table FOR DELETE
  TO anon
  USING (true);
```

---

## 4. Cliente Supabase

Crea o actualiza `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: 'athlete' | 'coach' | 'admin';
  hub_user_id?: string | null;
  created_at: string;
  updated_at: string;
};

// Agrega aquí tus otros tipos de base de datos
```

---

## 5. Context de Autenticación

Crea `src/contexts/AuthContext.tsx`:

```typescript
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, Profile } from '../lib/supabase';

interface HubUser {
  id: string;
  email: string;
  role: string;
  active_plan: string[];
  issued_at: number;
  expires_at: number;
}

interface AuthContextType {
  user: HubUser | null;
  profile: Profile | null;
  loading: boolean;
  isDevMode: boolean;
  login: () => void;
  logout: () => Promise<void>;
  setDevProfile: (profile: Profile) => void;
  toggleDevMode: (enabled: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const HUB_URL = 'https://hub.asciende.pro';
const DEV_MODE_KEY = 'your_app_dev_mode'; // CAMBIAR ESTO por un nombre único

function getDevModePreference(): boolean {
  const localPref = localStorage.getItem(DEV_MODE_KEY);
  if (localPref !== null) {
    return localPref === 'true';
  }
  return true; // Por defecto en desarrollo
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<HubUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDevMode, setIsDevMode] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const devModeEnabled = getDevModePreference();

    if (devModeEnabled) {
      console.log('Dev mode is enabled, skipping HUB authentication');
      setIsDevMode(true);
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    // En producción, intenta autenticar con el HUB
    try {
      const response = await fetch(`${HUB_URL}/functions/v1/auth-me`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setIsDevMode(false);
          await loadProfile(data.user);
        } else {
          setUser(null);
          setProfile(null);
          setIsDevMode(false);
        }
      } else {
        setUser(null);
        setProfile(null);
        setIsDevMode(false);
      }
    } catch (error) {
      console.error('HUB not available:', error);
      setUser(null);
      setProfile(null);
      setIsDevMode(false);
    } finally {
      setLoading(false);
    }
  }

  async function loadProfile(hubUser: HubUser) {
    try {
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('hub_user_id', hubUser.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingProfile) {
        setProfile(existingProfile);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile(null);
    }
  }

  function login() {
    const currentUrl = window.location.href;
    window.location.href = `${HUB_URL}/login?redirect=${encodeURIComponent(currentUrl)}`;
  }

  async function logout() {
    if (isDevMode) {
      setProfile(null);
      setUser(null);
      window.location.reload();
    } else {
      try {
        await fetch(`${HUB_URL}/functions/v1/auth-logout`, {
          method: 'POST',
          credentials: 'include',
        });
        window.location.href = HUB_URL;
      } catch (error) {
        console.error('Error logging out:', error);
        window.location.href = HUB_URL;
      }
    }
  }

  function setDevProfile(devProfile: Profile) {
    setProfile(devProfile);
    const mockUser: HubUser = {
      id: devProfile.id,
      email: devProfile.email,
      role: devProfile.role,
      active_plan: [],
      issued_at: Date.now(),
      expires_at: Date.now() + 86400000
    };
    setUser(mockUser);
  }

  function toggleDevMode(enabled: boolean) {
    localStorage.setItem(DEV_MODE_KEY, String(enabled));
    window.location.reload();
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, isDevMode, login, logout, setDevProfile, toggleDevMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

---

## 6. Componentes UI

### 6.1. LocalDevMode.tsx

Crea `src/components/LocalDevMode.tsx`:

```typescript
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
```

### 6.2. ModeToggle.tsx

Crea `src/components/ModeToggle.tsx`:

```typescript
import { useAuth } from '../contexts/AuthContext';
import { Code, Globe } from 'lucide-react';

export default function ModeToggle() {
  const { isDevMode, toggleDevMode } = useAuth();

  const handleToggle = () => {
    const newMode = !isDevMode;
    const confirmMessage = newMode
      ? 'Switch to Development Mode?\n\nYou will be able to select test profiles without HUB authentication. The page will reload.'
      : 'Switch to Production Mode?\n\nYou will need to authenticate through the HUB (hub.asciende.pro). The page will reload.';

    if (confirm(confirmMessage)) {
      toggleDevMode(newMode);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        isDevMode
          ? 'bg-yellow-500 hover:bg-yellow-600 text-yellow-900'
          : 'bg-green-500 hover:bg-green-600 text-white'
      }`}
      title={isDevMode ? 'Currently in Development Mode - Click to switch to Production' : 'Currently in Production Mode - Click to switch to Development'}
    >
      {isDevMode ? (
        <>
          <Code className="w-4 h-4" />
          <span>Dev Mode</span>
        </>
      ) : (
        <>
          <Globe className="w-4 h-4" />
          <span>Production</span>
        </>
      )}
    </button>
  );
}
```

### 6.3. Settings.tsx

Crea o actualiza `src/components/Settings.tsx` para incluir el toggle:

```typescript
import { useAuth } from '../contexts/AuthContext';
import { Settings as SettingsIcon, LogOut, Home } from 'lucide-react';

type View = 'dashboard' | 'settings';

interface SettingsProps {
  onNavigate: (view: View) => void;
}

export default function Settings({ onNavigate }: SettingsProps) {
  const { logout, profile, isDevMode, toggleDevMode } = useAuth();

  const handleToggleDevMode = () => {
    const newMode = !isDevMode;
    const confirmMessage = newMode
      ? 'Switch to Development Mode? You will be able to select test profiles without HUB authentication.'
      : 'Switch to Production Mode? You will need to authenticate through the HUB (hub.asciende.pro). The page will reload.';

    if (confirm(confirmMessage)) {
      toggleDevMode(newMode);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#514163] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#fdda36] rounded-full flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-[#514163]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-purple-200 text-sm">Welcome, {profile?.full_name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center space-x-2 bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded-lg transition"
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={logout}
                className="flex items-center space-x-2 bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Info Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#514163] mb-6">Profile Information</h2>
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Role:</span>
                <span className="font-medium text-[#514163]">{profile?.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-[#514163]">{profile?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Full Name:</span>
                <span className="font-medium text-[#514163]">{profile?.full_name || 'Not set'}</span>
              </div>
            </div>
            <div className="border-t pt-6">
              <p className="text-sm text-gray-600">
                Authentication is managed centrally through the HUB. To update your profile or manage your account, please visit the main HUB portal.
              </p>
            </div>
          </div>
        </div>

        {/* Development Mode Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-[#514163] mb-4">Development Settings</h2>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800 mb-3">
              <strong>Development Mode</strong> allows you to work locally without connecting to the HUB.
              Use this during development and testing. Switch to <strong>Production Mode</strong> when deploying.
            </p>
            <div className="text-xs text-yellow-700 space-y-1 border-t border-yellow-300 pt-3">
              <p><strong>Development Mode:</strong> Select test profiles, no HUB connection required</p>
              <p><strong>Production Mode:</strong> Requires HUB authentication at hub.asciende.pro</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-[#514163] mb-1">Local Development Mode</h3>
              <p className="text-sm text-gray-600">
                {isDevMode
                  ? 'Currently working locally without HUB authentication'
                  : 'Currently using HUB authentication (Production)'}
              </p>
            </div>
            <button
              onClick={handleToggleDevMode}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#514163] focus:ring-offset-2 ${
                isDevMode ? 'bg-[#514163]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  isDevMode ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {isDevMode && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Dev Mode Active:</strong> You can select different profiles (Admin, Coach, Athlete) to test functionality.
                The app will not attempt to connect to the HUB.
              </p>
            </div>
          )}

          {!isDevMode && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Production Mode Active:</strong> The app is using HUB authentication.
                All users must authenticate through the central HUB portal.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
```

---

## 7. App Principal

Actualiza `src/App.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LocalDevMode from './components/LocalDevMode';
import Settings from './components/Settings';
// Importa tus otros componentes de dashboard aquí

type View = 'dashboard' | 'settings';

function AppContent() {
  const { user, profile, loading, isDevMode, login, setDevProfile } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');

  useEffect(() => {
    if (!loading && !user && !isDevMode) {
      const timer = setTimeout(() => {
        login();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, loading, isDevMode, login]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#514163] to-[#3a2e4a] flex items-center justify-center">
        <div className="text-white text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  // Dev mode without profile - show profile selector
  if (isDevMode && !profile) {
    return <LocalDevMode onProfileSelected={setDevProfile} />;
  }

  // Production mode without user - redirect to HUB
  if (!user && !isDevMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#514163] to-[#3a2e4a] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-3xl">🔐</span>
            </div>
            <h2 className="text-2xl font-bold text-[#514163] mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">
              Redirecting to HUB for authentication...
            </p>
            <button
              onClick={login}
              className="mt-6 bg-[#514163] hover:bg-[#3d2f4a] text-white px-6 py-2 rounded-lg transition font-medium"
            >
              Go to HUB Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // User exists but no profile - show error
  if (user && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#514163] to-[#3a2e4a] flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#514163] mb-2">No Local Profile Found</h2>
            <p className="text-gray-600 mb-4">
              Please contact your administrator to create a profile for you.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show settings view
  if (currentView === 'settings') {
    return <Settings onNavigate={setCurrentView} />;
  }

  // Show dashboard based on role
  // Implementa tu lógica de dashboard aquí basada en profile.role
  return (
    <div>
      <h1>Dashboard para {profile.role}</h1>
      <button onClick={() => setCurrentView('settings')}>Settings</button>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
```

---

## 8. Notas Finales

### ¿Qué hace este sistema?

1. **Modo Desarrollo (Local Dev Mode):**
   - No requiere conexión al HUB
   - Crea perfiles de prueba en la base de datos local
   - Perfecto para desarrollo y testing
   - Puedes cambiar entre Admin/Coach/Athlete fácilmente

2. **Modo Producción:**
   - Requiere autenticación del HUB
   - Usa el token JWT del HUB
   - Busca el perfil usando `hub_user_id`
   - Redirige al HUB si no hay autenticación

### Checklist de Implementación

- [ ] Configurar variables de entorno
- [ ] Crear tabla `profiles` con RLS
- [ ] Agregar políticas para usuario anónimo
- [ ] Ajustar foreign keys de otras tablas
- [ ] Implementar cliente Supabase
- [ ] Crear AuthContext
- [ ] Crear componentes LocalDevMode, ModeToggle, Settings
- [ ] Actualizar App.tsx
- [ ] Probar toggle entre modos
- [ ] Verificar que funcione en ambos modos

### Personalización

Recuerda personalizar:
- Los colores (#514163, #fdda36) según tu marca
- El nombre de la variable `DEV_MODE_KEY` en AuthContext
- Los roles según tu aplicación (puede ser otros además de athlete/coach/admin)
- Los textos y mensajes según tu contexto

### Seguridad

En **PRODUCCIÓN**, considera:
- Deshabilitar las políticas anónimas si no las necesitas
- Usar solo políticas restrictivas basadas en `authenticated`
- Verificar que `VITE_FORCE_DEV_MODE` esté en `false` o no exista
- Auditar accesos y permisos regularmente

---

¡Listo! Con esta guía puedes implementar el mismo sistema de Local Development Mode en cualquier satélite de Asciende.
