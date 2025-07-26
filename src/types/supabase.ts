export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      scanner_history: {
        Row: {
          execution_time_ms: number | null
          id: string
          scan_date: string | null
          scan_results: Json | null
          screening_rule_id: string | null
          stocks_passed: number | null
          total_stocks_scanned: number | null
          user_id: string | null
        }
        Insert: {
          execution_time_ms?: number | null
          id?: string
          scan_date?: string | null
          scan_results?: Json | null
          screening_rule_id?: string | null
          stocks_passed?: number | null
          total_stocks_scanned?: number | null
          user_id?: string | null
        }
        Update: {
          execution_time_ms?: number | null
          id?: string
          scan_date?: string | null
          scan_results?: Json | null
          screening_rule_id?: string | null
          stocks_passed?: number | null
          total_stocks_scanned?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scanner_history_screening_rule_id_fkey"
            columns: ["screening_rule_id"]
            isOneToOne: false
            referencedRelation: "screening_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      screening_rules: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          rules: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          rules?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          rules?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      stock_analysis: {
        Row: {
          ai_analysis: Json | null
          ai_score: number | null
          company_name: string | null
          created_at: string | null
          current_price: number | null
          debt_to_equity: number | null
          dividend_yield: number | null
          id: string
          market_cap: number | null
          news_sentiment: Json | null
          pb_ratio: number | null
          pe_ratio: number | null
          profit_growth: number | null
          recommendation: string | null
          revenue_growth: number | null
          risk_level: string | null
          roe: number | null
          screening_rule_id: string | null
          sector: string | null
          stop_loss: number | null
          symbol: string
          target_price: number | null
          technical_indicators: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ai_analysis?: Json | null
          ai_score?: number | null
          company_name?: string | null
          created_at?: string | null
          current_price?: number | null
          debt_to_equity?: number | null
          dividend_yield?: number | null
          id?: string
          market_cap?: number | null
          news_sentiment?: Json | null
          pb_ratio?: number | null
          pe_ratio?: number | null
          profit_growth?: number | null
          recommendation?: string | null
          revenue_growth?: number | null
          risk_level?: string | null
          roe?: number | null
          screening_rule_id?: string | null
          sector?: string | null
          stop_loss?: number | null
          symbol: string
          target_price?: number | null
          technical_indicators?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ai_analysis?: Json | null
          ai_score?: number | null
          company_name?: string | null
          created_at?: string | null
          current_price?: number | null
          debt_to_equity?: number | null
          dividend_yield?: number | null
          id?: string
          market_cap?: number | null
          news_sentiment?: Json | null
          pb_ratio?: number | null
          pe_ratio?: number | null
          profit_growth?: number | null
          recommendation?: string | null
          revenue_growth?: number | null
          risk_level?: string | null
          roe?: number | null
          screening_rule_id?: string | null
          sector?: string | null
          stop_loss?: number | null
          symbol?: string
          target_price?: number | null
          technical_indicators?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_analysis_screening_rule_id_fkey"
            columns: ["screening_rule_id"]
            isOneToOne: false
            referencedRelation: "screening_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_watchlist: {
        Row: {
          added_price: number | null
          company_name: string | null
          created_at: string | null
          id: string
          notes: string | null
          stop_loss: number | null
          symbol: string
          target_price: number | null
          user_id: string | null
        }
        Insert: {
          added_price?: number | null
          company_name?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          stop_loss?: number | null
          symbol: string
          target_price?: number | null
          user_id?: string | null
        }
        Update: {
          added_price?: number | null
          company_name?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          stop_loss?: number | null
          symbol?: string
          target_price?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          image: string | null
          name: string | null
          token_identifier: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          image?: string | null
          name?: string | null
          token_identifier: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          image?: string | null
          name?: string | null
          token_identifier?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
