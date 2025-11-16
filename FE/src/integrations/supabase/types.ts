export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      presales: {
        Row: {
          created_at: string | null
          end_ts: number
          hard_cap_lamports: number
          id: string
          is_finalized: boolean | null
          max_deposit_lamports: number
          min_deposit_lamports: number
          mint: string | null
          raised_lamports: number | null
          soft_cap_lamports: number
          start_ts: number
          talent_id: string
          token_acquired: string | null
          updated_at: string | null
          vesting: Json | null
          whitelist_enabled: boolean | null
        }
        Insert: {
          created_at?: string | null
          end_ts: number
          hard_cap_lamports: number
          id?: string
          is_finalized?: boolean | null
          max_deposit_lamports: number
          min_deposit_lamports: number
          mint?: string | null
          raised_lamports?: number | null
          soft_cap_lamports: number
          start_ts: number
          talent_id: string
          token_acquired?: string | null
          updated_at?: string | null
          vesting?: Json | null
          whitelist_enabled?: boolean | null
        }
        Update: {
          created_at?: string | null
          end_ts?: number
          hard_cap_lamports?: number
          id?: string
          is_finalized?: boolean | null
          max_deposit_lamports?: number
          min_deposit_lamports?: number
          mint?: string | null
          raised_lamports?: number | null
          soft_cap_lamports?: number
          start_ts?: number
          talent_id?: string
          token_acquired?: string | null
          updated_at?: string | null
          vesting?: Json | null
          whitelist_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "presales_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "talents"
            referencedColumns: ["id"]
          },
        ]
      }
      processed_transactions: {
        Row: {
          amount_lamports: number
          created_at: string | null
          presale_id: string
          processed_at: string | null
          signature: string
          wallet_address: string
        }
        Insert: {
          amount_lamports: number
          created_at?: string | null
          presale_id: string
          processed_at?: string | null
          signature: string
          wallet_address: string
        }
        Update: {
          amount_lamports?: number
          created_at?: string | null
          presale_id?: string
          processed_at?: string | null
          signature?: string
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "processed_transactions_presale_id_fkey"
            columns: ["presale_id"]
            isOneToOne: false
            referencedRelation: "presales"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          updated_at: string | null
          wallet_address: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          updated_at?: string | null
          wallet_address?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      talents: {
        Row: {
          avatar_url: string | null
          banner_url: string | null
          created_at: string | null
          handle: string
          id: string
          logline: string | null
          name: string
          presale_id: string | null
          progress: Json | null
          socials: Json | null
          status: Database["public"]["Enums"]["talent_status"] | null
          tags: string[] | null
          updated_at: string | null
          user_id: string | null
          wallet_address: string | null
        }
        Insert: {
          avatar_url?: string | null
          banner_url?: string | null
          created_at?: string | null
          handle: string
          id?: string
          logline?: string | null
          name: string
          presale_id?: string | null
          progress?: Json | null
          socials?: Json | null
          status?: Database["public"]["Enums"]["talent_status"] | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          wallet_address?: string | null
        }
        Update: {
          avatar_url?: string | null
          banner_url?: string | null
          created_at?: string | null
          handle?: string
          id?: string
          logline?: string | null
          name?: string
          presale_id?: string | null
          progress?: Json | null
          socials?: Json | null
          status?: Database["public"]["Enums"]["talent_status"] | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_presale"
            columns: ["presale_id"]
            isOneToOne: false
            referencedRelation: "presales"
            referencedColumns: ["id"]
          },
        ]
      }
      user_positions: {
        Row: {
          claimed_tokens: string | null
          created_at: string | null
          deposited_lamports: number | null
          id: string
          presale_id: string
          pro_rata_share: string | null
          referral_code: string | null
          unlocked_tokens: string | null
          updated_at: string | null
          wallet_address: string
        }
        Insert: {
          claimed_tokens?: string | null
          created_at?: string | null
          deposited_lamports?: number | null
          id?: string
          presale_id: string
          pro_rata_share?: string | null
          referral_code?: string | null
          unlocked_tokens?: string | null
          updated_at?: string | null
          wallet_address: string
        }
        Update: {
          claimed_tokens?: string | null
          created_at?: string | null
          deposited_lamports?: number | null
          id?: string
          presale_id?: string
          pro_rata_share?: string | null
          referral_code?: string | null
          unlocked_tokens?: string | null
          updated_at?: string | null
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_positions_presale_id_fkey"
            columns: ["presale_id"]
            isOneToOne: false
            referencedRelation: "presales"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          talent_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          talent_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          talent_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "talents"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist_creators: {
        Row: {
          created_at: string
          email: string
          has_phantom_wallet: boolean | null
          id: string
          role: string | null
          socials: Json | null
          solana_experience: string | null
        }
        Insert: {
          created_at?: string
          email: string
          has_phantom_wallet?: boolean | null
          id?: string
          role?: string | null
          socials?: Json | null
          solana_experience?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          has_phantom_wallet?: boolean | null
          id?: string
          role?: string | null
          socials?: Json | null
          solana_experience?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "talent" | "fan"
      talent_status: "Rising" | "Breakout" | "A-List"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "talent", "fan"],
      talent_status: ["Rising", "Breakout", "A-List"],
    },
  },
} as const
