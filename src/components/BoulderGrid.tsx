'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import type { User, Boulder, UserProgress, BoulderColor, BoulderZone } from '@/types';

const BOULDER_COLORS: BoulderColor[] = ['verdes', 'amarillos', 'rojos', 'lilas', 'negros'];
const BOULDER_ZONES: BoulderZone[] = [
  'proa', 
  'popa', 
  'babor', 
  'estribor', 
  'desplome-de-los-loros', 
  'amazonia'
];

const COLOR_LABELS = {
  verdes: 'Verdes',
  amarillos: 'Amarillos',
  rojos: 'Rojos',
  lilas: 'Lilas',
  negros: 'Negros'
};

const ZONE_LABELS = {
  proa: 'Proa',
  popa: 'Popa',
  babor: 'Babor',
  estribor: 'Estribor',
  'desplome-de-los-loros': 'Desplome de los Loros',
  amazonia: 'Amazonía'
};

interface BoulderGridProps {
  user: User;
  userProgress: UserProgress[];
  setUserProgress: React.Dispatch<React.SetStateAction<UserProgress[]>>;
}

export default function BoulderGrid({ user, userProgress, setUserProgress }: BoulderGridProps) {
  const [boulders, setBoulders] = useState<Boulder[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Get current month name in Spanish
  const getCurrentMonth = () => {
    const months = [
      'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
      'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
    ];
    return months[new Date().getMonth()];
  };

  useEffect(() => {
    loadBoulders();
  }, []);

  const loadBoulders = async () => {
    try {
      // Load boulders
      const { data: bouldersData } = await supabase
        .from('boulders')
        .select('*')
        .order('color, zone');

      if (bouldersData) setBoulders(bouldersData);
    } catch (error) {
      console.error('Error loading boulders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBoulderCount = async (boulder: Boulder, newCount: number) => {
    // Ensure count is never negative
    const safeCount = Math.max(0, newCount);
    
    try {
      // Use the upsert function we created
      const { data, error } = await supabase
        .rpc('upsert_boulder_progress', {
          p_user_id: user.id,
          p_boulder_id: boulder.id,
          p_count: safeCount
        });

      if (error) throw error;

      // Update local state
      if (safeCount === 0) {
        // Remove from progress if count is 0
        setUserProgress(prev => prev.filter(p => p.boulder_id !== boulder.id));
      } else {
        // Update or add progress
        setUserProgress(prev => {
          const existingIndex = prev.findIndex(p => p.boulder_id === boulder.id);
          if (existingIndex >= 0) {
            // Update existing
            const newProgress = [...prev];
            newProgress[existingIndex] = {
              ...newProgress[existingIndex],
              boulder_count: safeCount,
              completed_at: new Date().toISOString(),
              boulder: boulder,
              boulders: boulder // Ensure boulder info is always present
            };
            return newProgress;
          } else {
            // Add new
            return [...prev, {
              id: data?.id || '',
              user_id: user.id,
              boulder_id: boulder.id,
              boulder_count: safeCount,
              completed_at: new Date().toISOString(),
              boulder: boulder,
              boulders: boulder // Add both boulder and boulders for compatibility
            }];
          }
        });
      }
    } catch (error) {
      console.error('Error updating boulder count:', error);
    }
  };

  const getBoulder = (color: BoulderColor, zone: BoulderZone): Boulder | null => {
    return boulders.find(b => b.color === color && b.zone === zone) || null;
  };

  const getBoulderCount = (boulder: Boulder): number => {
    const progress = userProgress.find(p => p.boulder_id === boulder.id);
    return progress?.boulder_count || 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Boulder Progress</h2>
          <div className="flex items-center space-x-4">
            <div className="text-lg font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
              {getCurrentMonth()}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          Usa los botones + y - para indicar cuántos boulders has completado en cada zona
        </p>
        <p className="text-sm font-medium text-gray-800">
          Cada boulder completado vale 100 puntos
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div className="grid grid-cols-7 gap-1 text-sm">
            {/* Header row */}
            <div className="font-bold text-center py-3 bg-gray-100 rounded">
              Rutas / Zonas
            </div>
            {BOULDER_ZONES.map(zone => (
              <div key={zone} className="font-bold text-center py-3 bg-gray-100 rounded text-xs sm:text-sm">
                {ZONE_LABELS[zone]}
              </div>
            ))}

            {/* Boulder grid */}
            {BOULDER_COLORS.map(color => (
              <div key={color} className="contents">
                <div className="font-bold py-3 bg-gray-50 rounded text-center text-xs sm:text-sm">
                  {COLOR_LABELS[color]}
                </div>
                {BOULDER_ZONES.map(zone => {
                  const boulder = getBoulder(color, zone);
                  const currentCount = boulder ? getBoulderCount(boulder) : 0;
                  
                  return (
                    <div
                      key={`${color}-${zone}`}
                      className={`
                        boulder-cell-full ${color} 
                        ${currentCount > 0 ? 'completed bg-green-100 border-green-500' : ''}
                        ${!boulder ? 'opacity-50' : ''}
                        text-xs font-medium p-2
                      `}
                      title={boulder ? `${COLOR_LABELS[color]} - ${ZONE_LABELS[zone]} (100 puntos cada uno)` : 'Boulder no disponible'}
                    >
                      {boulder ? (
                        <div className="flex items-center justify-center h-full space-x-2">
                          <span className="text-xl font-bold text-center flex-shrink-0">
                            {currentCount}
                          </span>
                          <div className="flex flex-col space-y-1">
                            <button
                              onClick={() => updateBoulderCount(boulder, currentCount + 1)}
                              className="w-5 h-5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded flex items-center justify-center font-bold leading-none transition-colors"
                              title="Agregar boulder"
                            >
                              +
                            </button>
                            <button
                              onClick={() => updateBoulderCount(boulder, currentCount - 1)}
                              disabled={currentCount === 0}
                              className="w-5 h-5 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs rounded flex items-center justify-center font-bold leading-none transition-colors"
                              title="Quitar boulder"
                            >
                              -
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">N/A</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
