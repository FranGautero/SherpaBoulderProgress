export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          created_at?: string;
        };
      };
      boulders: {
        Row: {
          id: string;
          color: string;
          zone: string;
          points: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          color: string;
          zone: string;
          points?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          color?: string;
          zone?: string;
          points?: number;
          created_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          boulder_id: string;
          boulder_count: number;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          boulder_id: string;
          boulder_count?: number;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          boulder_id?: string;
          boulder_count?: number;
          completed_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_user_count: {
        Args: {};
        Returns: number;
      };
      upsert_boulder_progress: {
        Args: {
          p_user_id: string;
          p_boulder_id: string;
          p_count: number;
        };
        Returns: {
          id: string;
          user_id: string;
          boulder_id: string;
          boulder_count: number;
          completed_at: string;
        };
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
