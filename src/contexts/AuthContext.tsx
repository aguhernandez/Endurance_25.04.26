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
  assigned_athletes?: string[];
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
  preferred_zone_system?: '5' | '7';
}

interface AuthContextType {
  user: HubUser | null;
  profile: Profile | null;
  loading: boolean;
  hasToken: boolean;
  isDevMode: boolean;
  login: () => void;
  logout: () => void;
  toggleDevMode: (enable: boolean) => void;
  setDevProfile: (profile: Profile) => void;
  setUser: (user: HubUser) => void;
  setProfile: (profile: Profile) => void;
  refreshProfile: () => Promise<void>;
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
          membership_slug: parsed.membership_slug ?? 'inicia',
          membership_name: parsed.membership_name ?? 'Asciende Inicia',
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
            id: hubUser.id,
            email: hubUser.email,
            full_name: hubUser.email,
            hub_user_id: hubUser.id,
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

  const toggleDevMode = (enable: boolean) => {
    localStorage.setItem('dev_mode', enable ? 'true' : 'false');
    setIsDevMode(enable);
    if (!enable) {
      sessionStorage.removeItem('user_profile');
      window.location.reload();
    }
  };

  const setUser = (newUser: HubUser) => {
    setUserState(newUser);
  };

  const setProfile = (newProfile: Profile) => {
    setProfileState(newProfile);
  };

  const refreshProfile = async () => {
    const currentUser = user ?? hubUser;
    if (!currentUser) return;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('hub_user_id', currentUser.id)
      .maybeSingle();
    if (data) setProfileState(data);
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
      toggleDevMode,
      setDevProfile,
      setUser,
      setProfile,
      refreshProfile,
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
