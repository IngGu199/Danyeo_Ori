export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      community_comments: {
        Row: {
          author_id: string | null
          author_nickname: string
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          author_nickname?: string
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          author_nickname?: string
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_likes: {
        Row: {
          created_at: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          author_id: string | null
          author_nickname: string
          comment_count: number
          content: string
          created_at: string
          festival_id: string
          id: string
          image_path: string | null
          kind: string
          like_count: number
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          author_id?: string | null
          author_nickname?: string
          comment_count?: number
          content: string
          created_at?: string
          festival_id: string
          id?: string
          image_path?: string | null
          kind?: string
          like_count?: number
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          author_id?: string | null
          author_nickname?: string
          comment_count?: number
          content?: string
          created_at?: string
          festival_id?: string
          id?: string
          image_path?: string | null
          kind?: string
          like_count?: number
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_festival_id_fkey"
            columns: ["festival_id"]
            isOneToOne: false
            referencedRelation: "community_festival_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_posts_festival_id_fkey"
            columns: ["festival_id"]
            isOneToOne: false
            referencedRelation: "festivals"
            referencedColumns: ["id"]
          },
        ]
      }
      festival_games: {
        Row: {
          code: string
          created_at: string
          description: string
          ends_at: string | null
          festival_id: string
          game_type: Database["public"]["Enums"]["game_type"]
          id: string
          reward_config: Json
          rules: Json
          starts_at: string | null
          status: Database["public"]["Enums"]["game_status"]
          title: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description: string
          ends_at?: string | null
          festival_id: string
          game_type: Database["public"]["Enums"]["game_type"]
          id?: string
          reward_config?: Json
          rules?: Json
          starts_at?: string | null
          status?: Database["public"]["Enums"]["game_status"]
          title: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string
          ends_at?: string | null
          festival_id?: string
          game_type?: Database["public"]["Enums"]["game_type"]
          id?: string
          reward_config?: Json
          rules?: Json
          starts_at?: string | null
          status?: Database["public"]["Enums"]["game_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "festival_games_festival_id_fkey"
            columns: ["festival_id"]
            isOneToOne: false
            referencedRelation: "community_festival_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "festival_games_festival_id_fkey"
            columns: ["festival_id"]
            isOneToOne: false
            referencedRelation: "festivals"
            referencedColumns: ["id"]
          },
        ]
      }
      festivals: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          data_status: Database["public"]["Enums"]["data_status"]
          description: string
          end_date: string
          id: string
          image_path: string | null
          name: string
          region: string
          slug: string
          source_checked_at: string | null
          source_url: string | null
          start_date: string
          status: Database["public"]["Enums"]["festival_status"]
          summary: string
          updated_at: string
          updated_by: string | null
          venue: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          data_status?: Database["public"]["Enums"]["data_status"]
          description: string
          end_date: string
          id?: string
          image_path?: string | null
          name: string
          region: string
          slug: string
          source_checked_at?: string | null
          source_url?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["festival_status"]
          summary: string
          updated_at?: string
          updated_by?: string | null
          venue: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          data_status?: Database["public"]["Enums"]["data_status"]
          description?: string
          end_date?: string
          id?: string
          image_path?: string | null
          name?: string
          region?: string
          slug?: string
          source_checked_at?: string | null
          source_url?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["festival_status"]
          summary?: string
          updated_at?: string
          updated_by?: string | null
          venue?: string
        }
        Relationships: []
      }
      game_attempts: {
        Row: {
          completion_idempotency_key: string | null
          deleted_at: string | null
          expires_at: string
          finished_at: string | null
          game_id: string
          id: string
          idempotency_key: string
          review_status: Database["public"]["Enums"]["game_review_status"]
          rewarded_at: string | null
          score: number | null
          server_result: Json
          started_at: string
          status: Database["public"]["Enums"]["game_attempt_status"]
          user_id: string
          verified_at: string | null
        }
        Insert: {
          completion_idempotency_key?: string | null
          deleted_at?: string | null
          expires_at: string
          finished_at?: string | null
          game_id: string
          id?: string
          idempotency_key: string
          review_status?: Database["public"]["Enums"]["game_review_status"]
          rewarded_at?: string | null
          score?: number | null
          server_result?: Json
          started_at?: string
          status?: Database["public"]["Enums"]["game_attempt_status"]
          user_id: string
          verified_at?: string | null
        }
        Update: {
          completion_idempotency_key?: string | null
          deleted_at?: string | null
          expires_at?: string
          finished_at?: string | null
          game_id?: string
          id?: string
          idempotency_key?: string
          review_status?: Database["public"]["Enums"]["game_review_status"]
          rewarded_at?: string | null
          score?: number | null
          server_result?: Json
          started_at?: string
          status?: Database["public"]["Enums"]["game_attempt_status"]
          user_id?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_attempts_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "festival_games"
            referencedColumns: ["id"]
          },
        ]
      }
      point_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          deleted_at: string | null
          expires_at: string
          festival_id: string | null
          game_attempt_id: string | null
          id: string
          idempotency_key: string
          reason_code: string
          reward_id: string | null
          source_event_ref: string
          transaction_type: Database["public"]["Enums"]["point_transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          deleted_at?: string | null
          expires_at?: string
          festival_id?: string | null
          game_attempt_id?: string | null
          id?: string
          idempotency_key: string
          reason_code: string
          reward_id?: string | null
          source_event_ref: string
          transaction_type: Database["public"]["Enums"]["point_transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          deleted_at?: string | null
          expires_at?: string
          festival_id?: string | null
          game_attempt_id?: string | null
          id?: string
          idempotency_key?: string
          reason_code?: string
          reward_id?: string | null
          source_event_ref?: string
          transaction_type?: Database["public"]["Enums"]["point_transaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "point_transactions_festival_id_fkey"
            columns: ["festival_id"]
            isOneToOne: false
            referencedRelation: "community_festival_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "point_transactions_festival_id_fkey"
            columns: ["festival_id"]
            isOneToOne: false
            referencedRelation: "festivals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "point_transactions_game_attempt_id_fkey"
            columns: ["game_attempt_id"]
            isOneToOne: false
            referencedRelation: "game_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "point_transactions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "point_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "point_wallets"
            referencedColumns: ["user_id"]
          },
        ]
      }
      point_wallets: {
        Row: {
          balance: number
          updated_at: string
          user_id: string
          version: number
        }
        Insert: {
          balance?: number
          updated_at?: string
          user_id: string
          version?: number
        }
        Update: {
          balance?: number
          updated_at?: string
          user_id?: string
          version?: number
        }
        Relationships: []
      }
      pre_registrations: {
        Row: {
          consent_version: string
          consented_at: string
          created_at: string
          deleted_at: string | null
          expires_at: string
          id: string
          name_ciphertext: string
          phone_ciphertext: string
          phone_lookup_hash: string
          status: Database["public"]["Enums"]["pre_registration_status"]
        }
        Insert: {
          consent_version: string
          consented_at: string
          created_at?: string
          deleted_at?: string | null
          expires_at: string
          id?: string
          name_ciphertext: string
          phone_ciphertext: string
          phone_lookup_hash: string
          status?: Database["public"]["Enums"]["pre_registration_status"]
        }
        Update: {
          consent_version?: string
          consented_at?: string
          created_at?: string
          deleted_at?: string | null
          expires_at?: string
          id?: string
          name_ciphertext?: string
          phone_ciphertext?: string
          phone_lookup_hash?: string
          status?: Database["public"]["Enums"]["pre_registration_status"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          deleted_at: string | null
          game_data_expires_at: string
          id: string
          last_active_at: string
          nickname: string | null
          status: Database["public"]["Enums"]["profile_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          game_data_expires_at?: string
          id: string
          last_active_at?: string
          nickname?: string | null
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          game_data_expires_at?: string
          id?: string
          last_active_at?: string
          nickname?: string | null
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
        }
        Relationships: []
      }
      rewards: {
        Row: {
          coupon_code_ciphertext: string | null
          expires_at: string
          festival_id: string | null
          game_attempt_id: string | null
          id: string
          idempotency_key: string
          issued_at: string
          metadata: Json
          point_amount: number | null
          redeem_by: string | null
          reward_type: Database["public"]["Enums"]["reward_type"]
          status: Database["public"]["Enums"]["reward_status"]
          used_at: string | null
          user_id: string
        }
        Insert: {
          coupon_code_ciphertext?: string | null
          expires_at: string
          festival_id?: string | null
          game_attempt_id?: string | null
          id?: string
          idempotency_key: string
          issued_at?: string
          metadata?: Json
          point_amount?: number | null
          redeem_by?: string | null
          reward_type: Database["public"]["Enums"]["reward_type"]
          status?: Database["public"]["Enums"]["reward_status"]
          used_at?: string | null
          user_id: string
        }
        Update: {
          coupon_code_ciphertext?: string | null
          expires_at?: string
          festival_id?: string | null
          game_attempt_id?: string | null
          id?: string
          idempotency_key?: string
          issued_at?: string
          metadata?: Json
          point_amount?: number | null
          redeem_by?: string | null
          reward_type?: Database["public"]["Enums"]["reward_type"]
          status?: Database["public"]["Enums"]["reward_status"]
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rewards_festival_id_fkey"
            columns: ["festival_id"]
            isOneToOne: false
            referencedRelation: "community_festival_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rewards_festival_id_fkey"
            columns: ["festival_id"]
            isOneToOne: false
            referencedRelation: "festivals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rewards_game_attempt_id_fkey"
            columns: ["game_attempt_id"]
            isOneToOne: false
            referencedRelation: "game_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      community_festival_categories: {
        Row: {
          category: string | null
          created_at: string | null
          id: string | null
          image_path: string | null
          name: string | null
          region: string | null
          slug: string | null
          status: Database["public"]["Enums"]["festival_status"] | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string | null
          image_path?: string | null
          name?: string | null
          region?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["festival_status"] | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string | null
          image_path?: string | null
          name?: string | null
          region?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["festival_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      current_admin_access: {
        Row: {
          is_admin: boolean | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_pre_registration_count: { Args: never; Returns: number }
      increment_community_post_view: {
        Args: { p_post_id: string }
        Returns: number
      }
      internal_bootstrap_owners: {
        Args: { p_owner_one: string; p_owner_two: string; p_reason: string }
        Returns: undefined
      }
      internal_claim_reward: {
        Args: {
          p_attempt_id: string
          p_idempotency_key: string
          p_user_id: string
        }
        Returns: Json
      }
      internal_complete_game_attempt: {
        Args: {
          p_attempt_id: string
          p_client_event_count?: number
          p_idempotency_key: string
          p_score: number
          p_user_id: string
        }
        Returns: {
          completion_idempotency_key: string | null
          deleted_at: string | null
          expires_at: string
          finished_at: string | null
          game_id: string
          id: string
          idempotency_key: string
          review_status: Database["public"]["Enums"]["game_review_status"]
          rewarded_at: string | null
          score: number | null
          server_result: Json
          started_at: string
          status: Database["public"]["Enums"]["game_attempt_status"]
          user_id: string
          verified_at: string | null
        }
        SetofOptions: {
          from: "*"
          to: "game_attempts"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      internal_grant_admin: {
        Args: {
          p_actor_user_id: string
          p_reason: string
          p_role: string
          p_target_user_id: string
        }
        Returns: undefined
      }
      internal_record_security_event: {
        Args: {
          p_event_type: string
          p_ip_prefix_hash: string
          p_metadata?: Json
          p_request_result: string
          p_subject_ref: string
          p_user_id: string
        }
        Returns: undefined
      }
      internal_revoke_admin: {
        Args: {
          p_actor_user_id: string
          p_reason: string
          p_target_user_id: string
        }
        Returns: undefined
      }
      internal_start_game_attempt: {
        Args: {
          p_game_id: string
          p_idempotency_key: string
          p_user_id: string
        }
        Returns: {
          completion_idempotency_key: string | null
          deleted_at: string | null
          expires_at: string
          finished_at: string | null
          game_id: string
          id: string
          idempotency_key: string
          review_status: Database["public"]["Enums"]["game_review_status"]
          rewarded_at: string | null
          score: number | null
          server_result: Json
          started_at: string
          status: Database["public"]["Enums"]["game_attempt_status"]
          user_id: string
          verified_at: string | null
        }
        SetofOptions: {
          from: "*"
          to: "game_attempts"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      internal_submit_pre_registration: {
        Args: {
          p_consent_version: string
          p_consented_at: string
          p_name_ciphertext: string
          p_phone_ciphertext: string
          p_phone_lookup_hash: string
        }
        Returns: string
      }
      internal_withdraw_user_data: {
        Args: { p_user_id: string }
        Returns: string
      }
    }
    Enums: {
      data_status: "sample" | "verified"
      festival_status: "draft" | "published" | "archived"
      game_attempt_status: "started" | "verified" | "rejected"
      game_review_status: "pending" | "cleared" | "flagged"
      game_status: "draft" | "active" | "inactive"
      game_type: "click" | "quiz" | "roulette" | "timing" | "puzzle"
      point_transaction_type: "earn" | "spend" | "expire" | "adjust"
      pre_registration_status: "submitted" | "confirmed" | "cancelled"
      profile_status: "active" | "withdrawn" | "suspended"
      reward_status: "issued" | "used" | "expired" | "revoked"
      reward_type: "points" | "coupon" | "benefit"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      data_status: ["sample", "verified"],
      festival_status: ["draft", "published", "archived"],
      game_attempt_status: ["started", "verified", "rejected"],
      game_review_status: ["pending", "cleared", "flagged"],
      game_status: ["draft", "active", "inactive"],
      game_type: ["click", "quiz", "roulette", "timing", "puzzle"],
      point_transaction_type: ["earn", "spend", "expire", "adjust"],
      pre_registration_status: ["submitted", "confirmed", "cancelled"],
      profile_status: ["active", "withdrawn", "suspended"],
      reward_status: ["issued", "used", "expired", "revoked"],
      reward_type: ["points", "coupon", "benefit"],
    },
  },
} as const
