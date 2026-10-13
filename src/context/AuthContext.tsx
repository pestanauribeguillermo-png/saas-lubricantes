import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, DEFAULT_ORG_ID } from '../lib/supabase';
import { Organization, Profile, UserRole } from '../types/database';

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  organization: Organization | null;
  currentRole: UserRole;
  isLoading: boolean;
  isDemoMode: boolean;
  switchDemoRole: (role: UserRole) => void;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, orgName: string, ruc: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateOrganization: (updates: Partial<Organization>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(true);

  // Demo profile definitions
  const demoProfiles: Record<UserRole, Profile> = {
    admin: {
      id: '10000000-0000-0000-0000-000000000001',
      organization_id: DEFAULT_ORG_ID,
      full_name: 'Carlos Mendoza',
      email: 'admin@lubriexpress.com',
      role: 'admin',
      commission_percentage: 0,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'
    },
    mechanic: {
      id: '10000000-0000-0000-0000-000000000002',
      organization_id: DEFAULT_ORG_ID,
      full_name: 'David Villacís (Mecánico)',
      email: 'david.mecanico@lubriexpress.com',
      role: 'mechanic',
      commission_percentage: 10,
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces'
    },
    cashier: {
      id: '10000000-0000-0000-0000-000000000004',
      organization_id: DEFAULT_ORG_ID,
      full_name: 'Andrea Salazar (Cajera)',
      email: 'andrea.caja@lubriexpress.com',
      role: 'cashier',
      commission_percentage: 2,
      avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces'
    }
  };

  const defaultDemoOrg: Organization = {
    id: DEFAULT_ORG_ID,
    name: 'LubriExpress Pro - Centro Automotriz',
    ruc_nit: '1792458921001',
    phone: '+593 99 876 5432',
    email: 'gerencia@lubriexpress.com',
    address: 'Av. de los Granados E12-40 y Eloy Alfaro',
    city: 'Quito',
    country: 'Ecuador',
    currency: 'USD',
    tax_percentage: 15,
    tax_name: 'IVA',
    invoice_prefix: 'FAC',
    receipt_footer: '¡Gracias por confiar en nosotros! Recuerde revisar el nivel de aceite cada 1,000 km.',
    whatsapp_template: 'Hola {cliente}, le recordamos de {taller} que su vehículo {vehiculo} está próximo a su cambio de aceite en {km} km. ¡Agende su cita hoy!'
  };

  const fetchProfileAndOrg = async (userId: string) => {
    try {
      const { data: profData, error: profErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (profData) {
        setProfile(profData as Profile);
        setCurrentRole(profData.role as UserRole);

        if (profData.organization_id) {
          const { data: orgData } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', profData.organization_id)
            .maybeSingle();

          if (orgData) setOrganization(orgData as Organization);
        }
        setIsDemoMode(false);
      } else {
        // Fallback to active demo state
        setProfile(demoProfiles['admin']);
        setOrganization(defaultDemoOrg);
      }
    } catch (err) {
      console.warn('Error fetching profile:', err);
      setProfile(demoProfiles['admin']);
      setOrganization(defaultDemoOrg);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchProfileAndOrg(session.user.id);
        } else {
          // Initialize demo state by default so everything is immediately functional
          setUser(null);
          setProfile(demoProfiles['admin']);
          setOrganization(defaultDemoOrg);
          setIsDemoMode(true);
        }
      } catch (e) {
        console.error('Auth initialization error:', e);
        setProfile(demoProfiles['admin']);
        setOrganization(defaultDemoOrg);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfileAndOrg(session.user.id);
      } else {
        setUser(null);
        if (!isDemoMode) {
          setProfile(demoProfiles['admin']);
          setOrganization(defaultDemoOrg);
          setIsDemoMode(true);
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const switchDemoRole = (role: UserRole) => {
    setCurrentRole(role);
    setProfile(demoProfiles[role]);
    setIsDemoMode(true);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error && data?.user) {
      setUser(data.user);
      await fetchProfileAndOrg(data.user.id);
    }
    setIsLoading(false);
    return { error };
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    orgName: string,
    ruc: string
  ) => {
    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setIsLoading(false);
        return { error: authError };
      }

      if (authData.user) {
        // Create Organization in Supabase
        const { data: newOrg, error: orgError } = await supabase
          .from('organizations')
          .insert({
            name: orgName,
            ruc_nit: ruc,
            email: email,
          })
          .select()
          .single();

        if (orgError) {
          console.error('Org create error:', orgError);
        }

        // Create Profile in Supabase
        const { data: newProfile, error: profError } = await supabase.from('profiles').insert({
          user_id: authData.user.id,
          organization_id: newOrg?.id || DEFAULT_ORG_ID,
          full_name: fullName,
          email: email,
          role: 'admin',
          commission_percentage: 0,
        }).select().single();

        if (profError) {
          console.error('Profile create error:', profError);
        }

        setUser(authData.user);
        if (newOrg) setOrganization(newOrg);
        if (newProfile) {
          setProfile(newProfile as Profile);
        } else {
          setProfile({
            id: authData.user.id,
            user_id: authData.user.id,
            organization_id: newOrg?.id || DEFAULT_ORG_ID,
            full_name: fullName,
            email: email,
            role: 'admin',
            commission_percentage: 0,
          });
        }
        setCurrentRole('admin');
        setIsDemoMode(false);
      }

      setIsLoading(false);
      return { error: null };
    } catch (err: any) {
      setIsLoading(false);
      return { error: err };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem('lubrix_view');
    setUser(null);
    setProfile(demoProfiles['admin']);
    setOrganization(defaultDemoOrg);
    setIsDemoMode(true);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfileAndOrg(user.id);
    }
  };

  const updateOrganization = async (updates: Partial<Organization>) => {
    try {
      if (!organization?.id) return { error: new Error('No hay organización activa') };
      
      const { error } = await supabase
        .from('organizations')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', organization.id);

      if (error) throw error;

      // Update local state immediately
      setOrganization((prev) => (prev ? { ...prev, ...updates } : prev));
      return { error: null };
    } catch (err: any) {
      console.error('Error updating organization:', err);
      return { error: err };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        organization,
        currentRole,
        isLoading,
        isDemoMode,
        switchDemoRole,
        login,
        signUp,
        logout,
        refreshProfile,
        updateOrganization,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
