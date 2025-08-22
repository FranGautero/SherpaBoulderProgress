export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  total_points?: number;
}

export interface Boulder {
  id: string;
  color: BoulderColor;
  zone: BoulderZone;
  points: number;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  boulder_id: string;
  boulder_count: number;
  completed_at: string;
  boulder?: Boulder;
  boulders?: Boulder; // For Supabase join compatibility
}

export type BoulderColor = 'verdes' | 'amarillos' | 'rojos' | 'lilas' | 'negros';

export type BoulderZone = 
  | 'proa' 
  | 'popa' 
  | 'babor' 
  | 'estribor' 
  | 'desplome-de-los-loros' 
  | 'amazonia';

export interface BoulderGrid {
  [key: string]: { // color-zone combination
    boulder: Boulder;
    completed: boolean;
  };
}

export interface SessionData {
  user: User | null;
  progress: UserProgress[];
  totalPoints: number;
}
