# Instrucciones Completas para Implementar Autenticación HUB en el Satélite LAB

## 📋 Contexto General

Este documento contiene TODA la información necesaria para implementar el sistema de autenticación centralizada del HUB en el satélite LAB (lab.asciende.pro).

### Arquitectura del Sistema

```
┌─────────────────────┐
│   hub.asciende.pro  │  ← Sistema central de autenticación
│   (HUB Principal)    │
└──────────┬──────────┘
           │
           ├─────────────────┬─────────────────┐
           │                 │                 │
           ▼                 ▼                 ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ cycling.asciende │  │  lab.asciende    │  │  otros satélites │
│      .pro        │  │      .pro        │  │                  │
│   (Satélite 1)   │  │   (Satélite 2)   │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

### Principios Clave

1. **El HUB es la fuente única de verdad para autenticación**
2. **Los satélites NO tienen su propio sistema de login**
3. **Los satélites validan tokens contra el HUB**
4. **Cada satélite tiene su propia base de datos Supabase para sus datos específicos**
5. **Los perfiles locales se crean automáticamente basados en los usuarios del HUB**

---

## 🔧 Variables de Entorno Requeridas

Crea o actualiza tu archivo `.env` con:

```bash
# URL del frontend del HUB (para redirigir al login y al logout)
VITE_HUB_FRONTEND_URL=https://hub.asciende.pro

# URL de Supabase del satélite (cada satélite tiene su PROPIA instancia)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui

# Modo desarrollo local (opcional, solo para testing sin HUB)
# VITE_FORCE_DEV_MODE=true
```

> **NOTA v2**: Ya no se necesita `VITE_HUB_API_URL`. El token se decodifica localmente sin llamadas al HUB.

⚠️ **IMPORTANTE**: Cada satélite tiene su PROPIA instancia de Supabase. NO compartas la base de datos con otros satélites.

---

## 📁 Archivos que Necesitas Crear/Modificar

### 1. `/src/hooks/useSatelliteAuth.ts`

**Crear este archivo nuevo:**

```typescript
import { useState, useEffect } from 'react';

const HUB_FRONTEND_URL = import.meta.env.VITE_HUB_FRONTEND_URL || 'https://hub.asciende.pro';
const SESSION_TOKEN_KEY = 'hub_session_token';

export type MembershipSlug = 'inicia' | 'intermediate' | 'pro';

export interface HubUser {
  id: string;
  email: string;
  name?: string;
  role: 'athlete' | 'trainer' | 'admin';
  active_plan?: string[];
  membership_slug: MembershipSlug;
  membership_name: string;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function isTokenExpired(payload: Record<string, unknown>): boolean {
  if (typeof payload.exp !== 'number') return false;
  return Date.now() / 1000 > payload.exp;
}

function extractUserFromPayload(payload: Record<string, unknown>): HubUser | null {
  const sub = payload.sub ?? payload.user_id ?? payload.id;
  const email = payload.email;
  if (!sub || !email) return null;
  return {
    id: String(sub),
    email: String(email),
    name: payload.name ? String(payload.name) : undefined,
    role: (payload.role as HubUser['role']) ?? 'athlete',
    active_plan: Array.isArray(payload.active_plan) ? payload.active_plan : undefined,
    membership_slug: (payload.membership_slug as MembershipSlug) ?? 'inicia',
    membership_name: payload.membership_name ? String(payload.membership_name) : 'Asciende Inicia',
  };
}

export function useSatelliteAuth() {
  const [user, setUser] = useState<HubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('session_token');

    if (tokenFromUrl) {
      console.log('[Auth] session_token found in URL, storing...');
      localStorage.setItem(SESSION_TOKEN_KEY, tokenFromUrl);
      const cleanUrl = window.location.href.split('?')[0];
      window.history.replaceState({}, '', cleanUrl);
    }

    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem(SESSION_TOKEN_KEY);

      if (!token) {
        console.log('[Auth] No session token found');
        setUser(null);
        return;
      }

      console.log('[Auth] Decoding session token...');
      const payload = decodeJwtPayload(token);

      if (!payload) {
        console.log('[Auth] Invalid JWT format');
        localStorage.removeItem(SESSION_TOKEN_KEY);
        setUser(null);
        return;
      }

      if (isTokenExpired(payload)) {
        console.log('[Auth] Token expired');
        localStorage.removeItem(SESSION_TOKEN_KEY);
        setUser(null);
        return;
      }

      console.log('[Auth] JWT payload:', payload);
      const hubUser = extractUserFromPayload(payload);

      if (hubUser) {
        console.log('[Auth] User authenticated from token:', hubUser.email);
        setUser(hubUser);
      } else {
        console.log('[Auth] Could not extract user from token payload');
        localStorage.removeItem(SESSION_TOKEN_KEY);
        setUser(null);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      console.error('[Auth] Check failed:', errorMsg);
      setAuthError(errorMsg);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    const currentUrl = window.location.href.split('?')[0];
    const hubAuthUrl = `${HUB_FRONTEND_URL}?redirect=${encodeURIComponent(currentUrl)}`;
    console.log('[Auth] Redirecting to HUB auth:', hubAuthUrl);
    window.location.href = hubAuthUrl;
  };

  const logout = () => {
    localStorage.removeItem(SESSION_TOKEN_KEY);
    setUser(null);
    window.location.href = HUB_FRONTEND_URL;
  };

  const hasToken = user !== null;

  return { user, loading, hasToken, authError, login, logout };
}
```

> **CAMBIO CRÍTICO v2**: Esta versión decodifica el JWT **localmente** sin hacer ningún fetch al HUB.
> La versión anterior llamaba a `hub.asciende.pro/functions/v1/auth-me` y fallaba con CORS o HTML response.
> La nueva versión extrae `sub`, `email`, `role`, `membership_slug` directamente del payload del JWT.

---

## 🎫 Sistema de Membresías

### Valores de `membership_slug`

| Slug | Descripción |
|------|-------------|
| `inicia` | Nivel gratuito (default si el campo no existe en token antiguo) |
| `intermediate` | Primer nivel pago |
| `pro` | Nivel premium |

### Helpers de acceso por membresía

```typescript
export type MembershipSlug = 'inicia' | 'intermediate' | 'pro';

export function hasAIAccess(membershipSlug?: MembershipSlug): boolean {
  return membershipSlug === 'intermediate' || membershipSlug === 'pro';
}

export function hasMembershipAccess(userSlug: MembershipSlug | undefined, requiredSlugs: MembershipSlug[]): boolean {
  if (!userSlug) return false;
  return requiredSlugs.includes(userSlug);
}
```

### Uso en componentes

```typescript
// Acceso a una feature según slug
const canUseFeatureX = hasMembershipAccess(user?.membership_slug, ['intermediate', 'pro']);
const canUseProOnly = hasMembershipAccess(user?.membership_slug, ['pro']);

// Mostrar nombre legible de membresía
<span>{user?.membership_name}</span> // ej: "Asciende Pro"
```

### Fallback para tokens antiguos

El satélite SIEMPRE debe aplicar fallback al recibir la respuesta del HUB:

```typescript
setUser({
  ...rawUser,
  membership_slug: rawUser.membership_slug ?? 'inicia',
  membership_name: rawUser.membership_name ?? 'Asciende Inicia',
});
```

Esto garantiza que tokens generados antes de esta actualización del HUB no rompan el satélite.

---

### 2. `/src/contexts/AuthContext.tsx`

**Crear o modificar este archivo:**

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSatelliteAuth } from '../hooks/useSatelliteAuth';
import { supabase } from '../lib/supabase';

export type MembershipSlug = 'inicia' | 'intermediate' | 'pro';

export interface HubUser {
  id: string;
  email: string;
  name?: string;
  role: 'athlete' | 'trainer' | 'admin';
  active_plan?: string[];
  membership_slug: MembershipSlug;
  membership_name: string;
}

export function hasAIAccess(membershipSlug?: MembershipSlug): boolean {
  return membershipSlug === 'intermediate' || membershipSlug === 'pro';
}

export function hasMembershipAccess(userSlug: MembershipSlug | undefined, requiredSlugs: MembershipSlug[]): boolean {
  if (!userSlug) return false;
  return requiredSlugs.includes(userSlug);
}

interface Profile {
  id: string;
  hub_user_id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'coach' | 'athlete';
  // Agrega aquí cualquier campo adicional específico de LAB
}

interface AuthContextType {
  user: HubUser | null;
  profile: Profile | null;
  loading: boolean;
  hasToken: boolean;
  isDevMode: boolean;
  login: () => void;
  logout: () => void;
  setDevProfile: (profile: Profile) => void;
  setUser: (user: HubUser) => void;
  setProfile: (profile: Profile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<Profile | null>(null);
  const [isDevMode, setIsDevMode] = useState(false);

  const { user: hubUser, loading: hubLoading, hasToken, login: hubLogin, logout: hubLogout } = useSatelliteAuth();

  const [user, setUserState] = useState<HubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [localHasToken, setLocalHasToken] = useState(false);

  useEffect(() => {
    const devMode = localStorage.getItem('dev_mode') === 'true' ||
                    import.meta.env.VITE_FORCE_DEV_MODE === 'true';
    setIsDevMode(devMode);

    if (devMode) {
      const storedProfile = sessionStorage.getItem('user_profile');
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        setProfileState(parsed);
        setUserState({
          id: parsed.hub_user_id,
          email: parsed.email,
          role: parsed.role === 'coach' ? 'trainer' : parsed.role,
          membership_slug: parsed.membership_slug ?? 'pro',
          membership_name: parsed.membership_name ?? 'Asciende Pro (Dev Mode)',
        });
        setLocalHasToken(true);
      }
      setLoading(false);
    } else {
      setUserState(hubUser);
      setLoading(hubLoading);
      setLocalHasToken(hasToken);
    }
  }, [hubUser, hubLoading, hasToken]);

  useEffect(() => {
    if (!isDevMode && hubUser && !hubLoading) {
      syncProfile(hubUser);
    }
  }, [hubUser, hubLoading, isDevMode]);

  const syncProfile = async (hubUser: HubUser) => {
    try {
      console.log('🔄 Syncing profile for HUB user:', hubUser.id);

      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('hub_user_id', hubUser.id)
        .maybeSingle();

      if (fetchError) {
        console.error('❌ Error fetching profile:', fetchError);
        return;
      }

      if (existingProfile) {
        console.log('✅ Profile found:', existingProfile);
        setProfileState(existingProfile);
      } else {
        console.log('🆕 Creating new profile for user:', hubUser.email);

        const normalizedRole = hubUser.role === 'trainer' ? 'coach' : hubUser.role;

        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            hub_user_id: hubUser.id,
            email: hubUser.email,
            full_name: hubUser.name || hubUser.email,
            role: normalizedRole,
          })
          .select()
          .single();

        if (createError) {
          console.error('❌ Error creating profile:', createError);
          return;
        }

        console.log('✅ Profile created:', newProfile);
        setProfileState(newProfile);
      }
    } catch (error) {
      console.error('💥 Profile sync failed:', error);
    }
  };

  const login = () => {
    if (isDevMode) {
      return;
    }
    hubLogin();
  };

  const logout = () => {
    if (isDevMode) {
      sessionStorage.removeItem('user_profile');
      setUserState(null);
      setProfileState(null);
      return;
    }
    hubLogout();
  };

  const setDevProfile = (devProfile: Profile) => {
    setProfileState(devProfile);
    sessionStorage.setItem('user_profile', JSON.stringify(devProfile));
    setUserState({
      id: devProfile.hub_user_id,
      email: devProfile.email,
      role: devProfile.role === 'coach' ? 'trainer' : devProfile.role,
      membership_slug: 'pro',
      membership_name: 'Asciende Pro (Dev Mode)',
    });
  };

  const setUser = (newUser: HubUser) => {
    setUserState(newUser);
  };

  const setProfile = (newProfile: Profile) => {
    setProfileState(newProfile);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      hasToken: localHasToken,
      isDevMode,
      login,
      logout,
      setDevProfile,
      setUser,
      setProfile
    }}>
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

### 3. `/src/App.tsx`

**Modifica tu App.tsx para incluir la lógica de autenticación:**

```typescript
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
// Importa tus componentes aquí

function AppContent() {
  const { user, profile, loading, hasToken, isDevMode, login, logout } = useAuth();

  // Redirigir al HUB si no hay token y no está en dev mode
  useEffect(() => {
    if (!loading && !user && !hasToken && !isDevMode) {
      login();
    }
  }, [user, loading, hasToken, isDevMode, login]);

  // Pantalla de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
        <div className="text-white text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  // Si no hay usuario y no está en dev mode, mostrar pantalla de redirección
  if (!user && !isDevMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-3xl">🔐</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">
              Redirecting to HUB for authentication...
            </p>
            <p className="text-sm text-gray-500">
              If you're not redirected automatically, click the button below.
            </p>
            <button
              onClick={login}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition font-medium"
            >
              Go to HUB Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si hay usuario pero no hay perfil local
  if (user && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-3xl">⚠</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Local Profile Found</h2>
            <p className="text-gray-600 mb-4">
              You are authenticated in the HUB, but you don't have a local profile in this satellite application.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Please contact your administrator to create a profile for you.
            </p>
            <button
              onClick={logout}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition font-medium"
            >
              Return to HUB
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Renderiza tu aplicación aquí
  return (
    <div>
      {/* Tu aplicación LAB aquí */}
      <div className="p-4">
        <h1>Welcome to LAB Satellite</h1>
        <p>User: {user?.email}</p>
        <p>Role: {profile?.role}</p>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="*" element={<AppContent />} />
    </Routes>
  );
}

export default App;
```

---

### 4. `/src/main.tsx`

**Asegúrate de envolver tu app con los providers necesarios:**

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
```

---

### 5. `/src/lib/supabase.ts`

**Cliente de Supabase (si no lo tienes):**

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 🗄️ Migraciones de Base de Datos

### Migración 1: Crear tabla de perfiles

**Archivo:** `supabase/migrations/YYYYMMDDHHMMSS_create_profiles.sql`

```sql
/*
  # Create profiles table for LAB satellite

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - Matches HUB user ID
      - `hub_user_id` (text, unique, not null) - Reference to HUB user
      - `email` (text, not null)
      - `full_name` (text, not null)
      - `role` (text, not null) - 'admin', 'coach', or 'athlete'
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `profiles` table
    - Add policies for authenticated access
    - Allow anonymous read/write for HUB integration
*/

-- Create profiles table
-- IMPORTANT: Do NOT add REFERENCES auth.users(id) — satellites use HUB auth, not Supabase Auth
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_user_id text UNIQUE NOT NULL,
  email text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'coach', 'athlete')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- CRITICAL: Drop any FK to auth.users if it exists (common mistake when using Bolt templates)
-- Without this, INSERT fails with 409 because auth.users is always empty in satellite apps
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_hub_user_id ON profiles(hub_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow all operations (satellites use HUB auth, not Supabase auth)
CREATE POLICY "Allow all operations on profiles"
  ON profiles
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

⚠️ **NOTA CRÍTICA SOBRE RLS**: Esta política permisiva es porque NO estás usando Supabase Auth para autenticación de usuarios. La autenticación real la maneja el HUB.

**Si tus satélites nuevos no crean el perfil**, revisa que:

1. **La tabla `profiles` tiene RLS habilitado**: `ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;`
2. **Las políticas permiten operaciones anónimas**:
   ```sql
   CREATE POLICY "Allow all operations on profiles"
     ON profiles
     FOR ALL
     TO anon, authenticated
     USING (true)
     WITH CHECK (true);
   ```
3. **NO hay otras políticas más restrictivas** que compitan (revisa en Supabase Dashboard → Security)

Si el perfil no se crea, verás este error en la consola:
```
❌ Error creating profile: [error detail from Supabase]
```

Causas comunes:
- RLS bloqueando inserts
- Variables de entorno (`VITE_SUPABASE_URL` o `VITE_SUPABASE_ANON_KEY`) incorrectas
- Tabla no existe o tiene estructura diferente

---

## 📦 Dependencias Necesarias

**Agrega estas dependencias si no las tienes:**

```bash
npm install @supabase/supabase-js react-router-dom
```

**package.json debe incluir:**

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.57.4",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.12.0"
  }
}
```

---

## 🔄 Flujos de Autenticación

### Flujo 1: Usuario accede directamente a lab.asciende.pro

```
1. Usuario abre lab.asciende.pro
2. No hay token → App detecta esto
3. App redirige a: hub.asciende.pro/auth?redirect=https://lab.asciende.pro
4. Usuario se autentica en el HUB
5. HUB redirige a: lab.asciende.pro?session_token=XXX
6. LAB captura el token del URL
7. LAB guarda token en localStorage
8. LAB valida token contra hub.asciende.pro/functions/v1/auth-me
9. LAB obtiene datos del usuario
10. LAB sincroniza o crea perfil local en Supabase
11. Usuario ve la aplicación LAB
```

### Flujo 2: Usuario autenticado en HUB abre LAB mediante botón

```
1. Usuario ya autenticado en HUB
2. Usuario hace click en botón "Abrir LAB"
3. HUB abre: lab.asciende.pro?session_token=XXX (nueva pestaña)
4. LAB captura token del URL
5. LAB establece hasToken=true INMEDIATAMENTE
6. LAB guarda token en localStorage
7. LAB limpia URL (quita token por seguridad)
8. LAB valida token en background contra auth-me
9. LAB obtiene datos del usuario
10. LAB sincroniza o crea perfil local
11. Usuario ve la aplicación LAB SIN necesidad de re-login ✅
```

---

## 🎯 Qué Necesita Hacer el HUB

**El HUB ya tiene implementadas estas edge functions:**

1. **`/functions/v1/auth-me`** - Valida token y devuelve datos del usuario
2. **`/functions/v1/auth-logout`** - Invalida el token de sesión
3. **`/auth`** - Página de login que acepta parámetro `?redirect=`

**Código del botón en el HUB para abrir LAB:**

```typescript
const openLabSatellite = () => {
  const sessionToken = localStorage.getItem('session_token'); // O como guardes el token en el HUB
  const satelliteUrl = 'https://lab.asciende.pro';
  window.open(`${satelliteUrl}?session_token=${sessionToken}`, '_blank');
};
```

---

## 🧪 Modo Desarrollo Local (Opcional)

Para trabajar sin el HUB durante desarrollo:

1. **Agregar en `.env`:**
```bash
VITE_FORCE_DEV_MODE=true
```

2. **Crear componente de selección de perfil:**

```typescript
// src/components/LocalDevMode.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  hub_user_id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'coach' | 'athlete';
}

export default function LocalDevMode({ onProfileSelected }: { onProfileSelected: (profile: Profile) => void }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    const { data } = await supabase.from('profiles').select('*');
    if (data) setProfiles(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">DEV MODE - Select Profile</h1>
        <div className="space-y-2">
          {profiles.map(profile => (
            <button
              key={profile.id}
              onClick={() => onProfileSelected(profile)}
              className="w-full text-left p-4 border rounded hover:bg-gray-50"
            >
              <div className="font-semibold">{profile.full_name}</div>
              <div className="text-sm text-gray-600">{profile.email} - {profile.role}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

3. **Modificar AuthContext para soportar dev mode** (ya incluido en el código de arriba)

---

## ✅ Checklist de Implementación

### Paso 1: Configuración Básica
- [ ] Crear `.env` con las 3 variables obligatorias:
  ```bash
  VITE_HUB_API_URL=https://hub.asciende.pro
  VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co  ← NUEVA INSTANCIA
  VITE_SUPABASE_ANON_KEY=eyJ...  ← NUEVA INSTANCIA
  ```

### Paso 2: Código de Autenticación
- [ ] Instalar dependencias: `npm install @supabase/supabase-js react-router-dom`
- [ ] Crear `/src/lib/supabase.ts`
- [ ] Crear `/src/hooks/useSatelliteAuth.ts`
- [ ] Crear o modificar `/src/contexts/AuthContext.tsx`
- [ ] Modificar `/src/App.tsx` con la lógica de auth
- [ ] Modificar `/src/main.tsx` para incluir providers

### Paso 3: Base de Datos
- [ ] **Crear nueva instancia Supabase para este satélite** (NO compartida)
- [ ] Crear migración de BD para tabla `profiles`
- [ ] Aplicar migración
- [ ] Verificar que la tabla existe: `SELECT * FROM profiles;`
- [ ] Verificar que la política RLS permite ALL:
  ```sql
  SELECT * FROM pg_policies WHERE tablename = 'profiles';
  ```

### Paso 4: Testing
- [ ] Probar flujo 1: Acceso directo a satellite.asciende.pro
  - Debe redirigir a HUB
  - Autenticar
  - Volver con token en URL
  - Crear perfil automáticamente
  - **NO debe redirigir nuevamente al HUB**

- [ ] Probar flujo 2: Apertura desde botón en el HUB
  - Token debe venir en URL
  - Debe capturarse inmediatamente
  - Debe validarse contra HUB
  - Debe crear perfil si no existe

- [ ] Verificar logs en consola DevTools (F12 → Console)
- [ ] Implementar resto de tu aplicación

---

## 🐛 Debugging

### Flujo normal de logs

```
🔍 Token from URL: <token-si-viene-del-url>
💾 Saved token to localStorage
🔍 Token from localStorage: exists
🔄 Validating token with: https://hub.asciende.pro/functions/v1/auth-me
📡 Response status: 200
✅ Auth successful, user data: { user: {...} }
🔄 Syncing profile for HUB user: <user-id>
✅ Profile found: {...}
```

### Problema: "Redirige al HUB después de autenticarse"

**Esto significa que el perfil local NO se está creando o NO se está encontrando.**

**Checklist:**

1. ✅ **Abre DevTools (F12) → Console y busca estos logs:**
   - Si ves `❌ Error creating profile:` → Es un problema de Supabase
   - Si ves `🆕 Creating new profile` pero luego nada → La creación falló silenciosamente

2. ✅ **Verifica que `user && !profile` en App.tsx:**
   ```
   Si App.tsx muestra la pantalla "No Local Profile Found"
   → La creación de perfil está fallando
   ```

3. ✅ **Variables de entorno en el satélite nuevo:**
   ```bash
   VITE_HUB_API_URL=https://hub.asciende.pro
   VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...  # Correcta para TU instancia
   ```
   **⚠️ CADA SATÉLITE TIENE SU PROPIA INSTANCIA DE SUPABASE**

4. ✅ **En Supabase Dashboard del satélite:**
   - Ve a "SQL Editor"
   - Ejecuta: `SELECT * FROM profiles;`
   - Si está vacío, no se están creando perfiles
   - Revisa en "Security" → "Policies" que la política de `profiles` es correcta

5. ✅ **Verifica que la tabla `profiles` existe:**
   ```sql
   SELECT * FROM information_schema.tables
   WHERE table_name = 'profiles';
   ```

6. ✅ **Revisa estructura de la tabla:**
   ```sql
   SELECT column_name, data_type FROM information_schema.columns
   WHERE table_name = 'profiles'
   ORDER BY ordinal_position;
   ```
   Debe tener: `id`, `hub_user_id`, `email`, `full_name`, `role`

7. ✅ **Comando SQL para diagnosticar RLS (ejecuta en Supabase SQL Editor):**
   ```sql
   -- Verifica si RLS está habilitado
   SELECT tablename, rowsecurity
   FROM pg_tables
   WHERE tablename = 'profiles';

   -- Verifica las políticas
   SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
   FROM pg_policies
   WHERE tablename = 'profiles';

   -- Verifica que puedas insertar manualmente (como anónimo)
   INSERT INTO profiles (hub_user_id, email, full_name, role)
   VALUES ('test-user-123', 'test@example.com', 'Test User', 'athlete')
   RETURNING *;
   ```

   Si el INSERT falla con error de RLS, necesitas revisar la política.

### Si el token NO se captura del URL

**Logs que verías:**
```
🔍 Token from URL: null
🔍 Token from localStorage: not found
```

**Causas:**
- El HUB no está pasando el parámetro `?session_token=`
- Revisa el URL en la barra del navegador después del redirect
- En el HUB, verifica que el botón para abrir el satélite usa este código:
  ```typescript
  const openSatellite = () => {
    const token = localStorage.getItem('session_token');
    window.open(`https://nuevo-satelite.asciende.pro?session_token=${token}`, '_blank');
  };
  ```

### Si el token NO valida contra el HUB

**Logs que verías:**
```
❌ Auth failed, clearing token
```

**Causas:**
- El token es inválido o expirado
- El HUB está offline
- `VITE_HUB_API_URL` es incorrecta
- La edge function `auth-me` en el HUB está rota

**Para verificar:**
```javascript
// En DevTools console:
const token = localStorage.getItem('hub_session_token');
fetch('https://hub.asciende.pro/functions/v1/auth-me', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json()).then(console.log);
```

---

## 🔐 Seguridad

### Puntos Importantes

1. **El token se limpia del URL inmediatamente** después de capturarlo
2. **El token se guarda en localStorage** (persiste entre sesiones)
3. **El token se valida en cada carga** contra el HUB
4. **No usar `supabase.auth.setSession()`** - El token NO es de Supabase
5. **Las políticas RLS son permisivas** porque la auth real la maneja el HUB

### Mejoras Futuras (Opcional)

- Implementar refresh de tokens
- Agregar timeout de sesión
- Encriptar token en localStorage
- Implementar políticas RLS más restrictivas si es necesario

---

## 📝 Notas Finales

1. **NO intentes usar `supabase.auth.setSession()`** - No funcionará con tokens del HUB
2. **El orden es crucial**: Capturar token → Establecer hasToken → Validar en background
3. **Cada satélite es independiente** - Tiene su propia base de datos y lógica
4. **El HUB es la única fuente de verdad** para autenticación
5. **Los perfiles se sincronizan automáticamente** cuando un usuario del HUB accede por primera vez

---

## 🆘 Soporte

Si algo no funciona:

1. Revisar logs en la consola del navegador
2. Verificar que el HUB esté respondiendo correctamente
3. Verificar variables de entorno
4. Verificar que la tabla `profiles` existe y tiene las políticas correctas
5. Verificar que el token se esté capturando del URL

---

**¡Listo! Con esto deberías tener TODO lo necesario para implementar la autenticación HUB en el satélite LAB.**
