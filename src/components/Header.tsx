'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import type { User } from '@/types';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

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
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            <div className="flex items-center space-x-1 md:space-x-2">
              <div className="text-xl md:text-2xl">🧗‍♂️</div>
              <h1 className="text-sm md:text-xl font-bold text-gray-900">
                Sherpa Boulder Progress
              </h1>
            </div>
            <div className="w-6 h-6 md:w-8 md:h-8 animate-pulse bg-gray-200 rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          <div className="flex items-center space-x-1 md:space-x-2">
            <div className="text-xl md:text-2xl">🧗‍♂️</div>
            <h1 className="text-sm md:text-xl font-bold text-gray-900">
              Sherpa Boulder Progress
            </h1>
          </div>
          
          <nav className="flex items-center space-x-2 md:space-x-4">
            {user ? (
              <div className="flex items-center space-x-2 md:space-x-4">
                <span className="text-xs md:text-sm text-gray-600 hidden sm:inline">
                  ¡Hola, {user.name}!
                </span>
                <span className="text-xs text-gray-600 sm:hidden">
                  ¡Hola!
                </span>
                <button
                  onClick={handleSignOut}
                  className="px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <a href="/login" className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors">
                Iniciar Sesión
              </a>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
