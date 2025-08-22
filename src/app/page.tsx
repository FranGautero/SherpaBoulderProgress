'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import type { User, UserProgress, BoulderColor, BoulderZone } from '@/types';
import BoulderGrid from '@/components/BoulderGrid';
import UserStats from '@/components/UserStats';

const BOULDER_COLORS: BoulderColor[] = ['verdes', 'amarillos', 'rojos', 'lilas', 'negros'];
const BOULDER_ZONES: BoulderZone[] = [
  'proa', 
  'popa', 
  'babor', 
  'estribor', 
  'desplome-de-los-loros', 
  'amazonia'
];

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const loadUserProgress = async (userId: string) => {
    try {
      const { data: progressData } = await supabase
        .from('user_progress')
        .select(`
          *,
          boulders (
            id,
            color,
            zone,
            points
          )
        `)
        .eq('user_id', userId);

      if (progressData) {
        // Ensure we have the boulder data in the right format
        const enhancedData = progressData.map((progress: any) => ({
          ...progress,
          boulder: progress.boulders, // Add boulder property for compatibility
        }));
        
        setUserProgress(enhancedData);
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Get user profile from our profiles table
        const { data: userData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (userData) {
          setUser(userData);
          // Load user progress
          await loadUserProgress(userData.id);
        }
      }
      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      if (event === 'SIGNED_IN' && session?.user) {
        checkUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserProgress([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="text-8xl mb-6">🧗‍♂️</div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              Sherpa Boulder Progress
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Lleva el registro de tu progreso en boulder de manera digital.
            </p>
          </div>
          
          <div className="space-y-4">
            <a 
              href="/login" 
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Iniciar Sesión
            </a>
            <a 
              href="/register" 
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Registrarse
            </a>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Para el club de escalada • Registro limitado a 200 usuarios
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Boulder Progress 🧗‍♂️
        </h1>
        <p className="text-gray-600">
          Marca los boulders que has completado y sigue tu progreso.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <BoulderGrid user={user} userProgress={userProgress} setUserProgress={setUserProgress} />
        </div>
        <div className="lg:col-span-1">
          <UserStats user={user} userProgress={userProgress} />
        </div>
      </div>
    </div>
  );
}
