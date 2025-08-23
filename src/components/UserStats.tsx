'use client';

import { useState, useEffect } from 'react';
import type { User, UserProgress } from '@/types';

interface UserStatsProps {
  user: User;
  userProgress: UserProgress[];
}

export default function UserStats({ user, userProgress }: UserStatsProps) {
  const [stats, setStats] = useState({
    totalBoulders: 0,
    totalPoints: 0,
    completedToday: 0,
    completedThisWeek: 0,
    completedThisMonth: 0,
    byColor: {
      verdes: 0,
      amarillos: 0,
      rojos: 0,
      lilas: 0,
      negros: 0
    }
  });

  useEffect(() => {
    calculateStats();
  }, [userProgress]);

  const calculateStats = () => {
    if (!userProgress || userProgress.length === 0) {
      setStats({
        totalBoulders: 0,
        totalPoints: 0,
        completedToday: 0,
        completedThisWeek: 0,
        completedThisMonth: 0,
        byColor: {
          verdes: 0,
          amarillos: 0,
          rojos: 0,
          lilas: 0,
          negros: 0
        }
      });
      return;
    }

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    
    // Get start of current month
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthStart = new Date(currentYear, currentMonth, 1).toISOString();

    const totalBoulders = userProgress.reduce((sum: number, p: any) => sum + (p.boulder_count || 0), 0);
    const totalPoints = totalBoulders * 100; // 100 points per boulder

    const completedToday = userProgress
      .filter((p: any) => p.completed_at.startsWith(today))
      .reduce((sum: number, p: any) => sum + (p.boulder_count || 0), 0);

    const completedThisWeek = userProgress
      .filter((p: any) => p.completed_at >= weekAgo)
      .reduce((sum: number, p: any) => sum + (p.boulder_count || 0), 0);

    const completedThisMonth = userProgress
      .filter((p: any) => p.completed_at >= monthStart)
      .reduce((sum: number, p: any) => sum + (p.boulder_count || 0), 0);

    const byColor = {
      verdes: 0,
      amarillos: 0,
      rojos: 0,
      lilas: 0,
      negros: 0
    };

    userProgress.forEach((progress: any) => {
      // Try different ways to access the color data
      let color = null;
      
      // Method 1: Direct boulders object (Supabase join format)
      if (progress.boulders && progress.boulders.color) {
        color = progress.boulders.color;
      }
      // Method 2: Nested boulder object (internal format)
      else if (progress.boulder && progress.boulder.color) {
        color = progress.boulder.color;
      }
      // Method 3: Array of boulders (alternative format)
      else if (Array.isArray(progress.boulders) && progress.boulders.length > 0) {
        color = progress.boulders[0].color;
      }
      
      if (color && color in byColor) {
        byColor[color as keyof typeof byColor] += progress.boulder_count || 0;
      }
    });

    setStats({
      totalBoulders,
      totalPoints,
      completedToday,
      completedThisWeek,
      completedThisMonth,
      byColor
    });
  };



  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
          📊 Estadísticas
        </h3>
        
        <div className="space-y-3 md:space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base text-gray-600">Total Boulders:</span>
            <span className="text-xl md:text-2xl font-bold text-blue-600">{stats.totalBoulders}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base text-gray-600">Puntos Totales:</span>
            <span className="text-xl md:text-2xl font-bold text-green-600">{stats.totalPoints}</span>
          </div>
          
          <hr className="my-3 md:my-4" />
          
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base text-gray-600">Hoy:</span>
            <span className="text-base md:text-lg font-semibold text-orange-600">{stats.completedToday}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base text-gray-600">Esta semana:</span>
            <span className="text-base md:text-lg font-semibold text-purple-600">{stats.completedThisWeek}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base text-gray-600">Este mes:</span>
            <span className="text-base md:text-lg font-semibold text-indigo-600">{stats.completedThisMonth}</span>
          </div>
        </div>
      </div>

      {/* By Color Stats */}
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
          🎨 Por Color
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-600">Verdes:</span>
            </div>
            <span className="font-semibold">{stats.byColor.verdes}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-gray-600">Amarillos:</span>
            </div>
            <span className="font-semibold">{stats.byColor.amarillos}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-gray-600">Rojos:</span>
            </div>
            <span className="font-semibold">{stats.byColor.rojos}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className="text-gray-600">Lilas:</span>
            </div>
            <span className="font-semibold">{stats.byColor.lilas}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-800 rounded"></div>
              <span className="text-gray-600">Negros:</span>
            </div>
            <span className="font-semibold">{stats.byColor.negros}</span>
          </div>
        </div>
      </div>

      {/* Achievement Levels */}
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
          🏆 Nivel de Progreso
        </h3>
        
        <div className="space-y-3">
          {(() => {
            const points = stats.totalPoints;
            
            // Maestro Escalador with stars (4000+ points)
            if (points >= 4000) {
              const extraThousands = Math.floor((points - 4000) / 1000);
              const stars = Math.min(extraThousands, 5);
              const starsDisplay = '⭐'.repeat(stars);
              
              return (
                <div className="flex items-center space-x-2 text-yellow-600">
                  <span>🥇</span>
                  <span className="font-semibold">Maestro Escalador {starsDisplay}</span>
                </div>
              );
            }
            
            // Escalador Experto (3000-3999)
            if (points >= 3000) {
              return (
                <div className="flex items-center space-x-2 text-purple-600">
                  <span>💎</span>
                  <span className="font-semibold">Escalador Experto</span>
                </div>
              );
            }
            
            // Escalador Avanzado (2000-2999)
            if (points >= 2000) {
              return (
                <div className="flex items-center space-x-2 text-gray-500">
                  <span>🥈</span>
                  <span className="font-semibold">Escalador Avanzado</span>
                </div>
              );
            }
            
            // Escalador Intermedio (1000-1999)
            if (points >= 1000) {
              return (
                <div className="flex items-center space-x-2 text-orange-600">
                  <span>🥉</span>
                  <span className="font-semibold">Escalador Intermedio</span>
                </div>
              );
            }
            
            // Escalador Principiante (0-999)
            return (
              <div className="flex items-center space-x-2 text-green-600">
                <span>🌱</span>
                <span className="font-semibold">Escalador Principiante</span>
              </div>
            );
          })()}
          
          <div className="mt-4">
            <div className="text-sm text-gray-500 mb-2">
              {(() => {
                const points = stats.totalPoints;
                
                if (points >= 9000) {
                  return 'Nivel máximo alcanzado! (5 ⭐)';
                }
                
                if (points >= 4000) {
                  const nextStarPoints = Math.ceil((points + 1) / 1000) * 1000;
                  const currentStars = Math.min(Math.floor((points - 4000) / 1000), 5);
                  if (currentStars < 5) {
                    return `Próxima ⭐: ${nextStarPoints - points} puntos`;
                  } else {
                    return 'Nivel máximo alcanzado! (5 ⭐)';
                  }
                }
                
                const nextLevel = Math.ceil((points + 1) / 1000) * 1000;
                return `Próximo nivel: ${nextLevel - points} puntos`;
              })()}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (stats.totalPoints % 1000) / 10)}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
