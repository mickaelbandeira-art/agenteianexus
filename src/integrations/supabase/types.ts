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
      avaliacoes_instrutor: {
        Row: {
          aula_duracao_segundos: number | null
          aula_video_url: string | null
          avaliacao_ia: Json | null
          created_at: string | null
          data_gravacao: string | null
          erro_mensagem: string | null
          feedback_melhorias: string | null
          feedback_positivo: string | null
          id: string
          instrutor_id: string
          pontuacao_clareza: number | null
          pontuacao_didatica: number | null
          pontuacao_dominio: number | null
          pontuacao_engajamento: number | null
          pontuacao_geral: number | null
          recomendacoes: string | null
          status: string | null
          titulo_aula: string
          transcricao: string | null
          updated_at: string | null
        }
        Insert: {
          aula_duracao_segundos?: number | null
          aula_video_url?: string | null
          avaliacao_ia?: Json | null
          created_at?: string | null
          data_gravacao?: string | null
          erro_mensagem?: string | null
          feedback_melhorias?: string | null
          feedback_positivo?: string | null
          id?: string
          instrutor_id: string
          pontuacao_clareza?: number | null
          pontuacao_didatica?: number | null
          pontuacao_dominio?: number | null
          pontuacao_engajamento?: number | null
          pontuacao_geral?: number | null
          recomendacoes?: string | null
          status?: string | null
          titulo_aula: string
          transcricao?: string | null
          updated_at?: string | null
        }
        Update: {
          aula_duracao_segundos?: number | null
          aula_video_url?: string | null
          avaliacao_ia?: Json | null
          created_at?: string | null
          data_gravacao?: string | null
          erro_mensagem?: string | null
          feedback_melhorias?: string | null
          feedback_positivo?: string | null
          id?: string
          instrutor_id?: string
          pontuacao_clareza?: number | null
          pontuacao_didatica?: number | null
          pontuacao_dominio?: number | null
          pontuacao_engajamento?: number | null
          pontuacao_geral?: number | null
          recomendacoes?: string | null
          status?: string | null
          titulo_aula?: string
          transcricao?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_instrutor_instrutor_id_fkey"
            columns: ["instrutor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_history: {
        Row: {
          agente_utilizado: string | null
          contexto: Json | null
          created_at: string | null
          id: string
          mensagem_usuario: string
          resposta_nexus: string
          satisfacao_usuario: number | null
          tempo_resposta_ms: number | null
          user_id: string
        }
        Insert: {
          agente_utilizado?: string | null
          contexto?: Json | null
          created_at?: string | null
          id?: string
          mensagem_usuario: string
          resposta_nexus: string
          satisfacao_usuario?: number | null
          tempo_resposta_ms?: number | null
          user_id: string
        }
        Update: {
          agente_utilizado?: string | null
          contexto?: Json | null
          created_at?: string | null
          id?: string
          mensagem_usuario?: string
          resposta_nexus?: string
          satisfacao_usuario?: number | null
          tempo_resposta_ms?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      desempenho_usuarios: {
        Row: {
          created_at: string | null
          csat_score: number | null
          data_conclusao_formacao: string | null
          data_inicio_formacao: string | null
          horas_treinamento: number | null
          id: string
          perfil_comportamental: string | null
          skill_digitacao: number | null
          skill_portugues: number | null
          status_formacao: string | null
          taxa_reincidencia: number | null
          tmo_medio: number | null
          total_faltas: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          csat_score?: number | null
          data_conclusao_formacao?: string | null
          data_inicio_formacao?: string | null
          horas_treinamento?: number | null
          id?: string
          perfil_comportamental?: string | null
          skill_digitacao?: number | null
          skill_portugues?: number | null
          status_formacao?: string | null
          taxa_reincidencia?: number | null
          tmo_medio?: number | null
          total_faltas?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          csat_score?: number | null
          data_conclusao_formacao?: string | null
          data_inicio_formacao?: string | null
          horas_treinamento?: number | null
          id?: string
          perfil_comportamental?: string | null
          skill_digitacao?: number | null
          skill_portugues?: number | null
          status_formacao?: string | null
          taxa_reincidencia?: number | null
          tmo_medio?: number | null
          total_faltas?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "desempenho_usuarios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      participants: {
        Row: {
          cargo: string
          coordinator: string
          created_at: string | null
          email: string
          hierarchy_level: Database["public"]["Enums"]["hierarchy_level"]
          id: string
          is_active: boolean | null
          manager: string | null
          name: string
          network_login: string | null
          registration: string
          supervisor: string | null
          updated_at: string | null
        }
        Insert: {
          cargo: string
          coordinator: string
          created_at?: string | null
          email: string
          hierarchy_level: Database["public"]["Enums"]["hierarchy_level"]
          id?: string
          is_active?: boolean | null
          manager?: string | null
          name: string
          network_login?: string | null
          registration: string
          supervisor?: string | null
          updated_at?: string | null
        }
        Update: {
          cargo?: string
          coordinator?: string
          created_at?: string | null
          email?: string
          hierarchy_level?: Database["public"]["Enums"]["hierarchy_level"]
          id?: string
          is_active?: boolean | null
          manager?: string | null
          name?: string
          network_login?: string | null
          registration?: string
          supervisor?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cargo: string | null
          cpf: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          matricula: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          cargo?: string | null
          cpf?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          matricula?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          cargo?: string | null
          cpf?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          matricula?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reciclagens: {
        Row: {
          aprovado: boolean | null
          created_at: string | null
          data_conclusao: string | null
          data_inicio: string | null
          data_prevista_conclusao: string | null
          descricao: string | null
          gestor_responsavel: string | null
          id: string
          instrutor_responsavel: string | null
          motivo: string
          nota_final: number | null
          observacoes: string | null
          prioridade: string | null
          status: string | null
          tipo_reciclagem: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          aprovado?: boolean | null
          created_at?: string | null
          data_conclusao?: string | null
          data_inicio?: string | null
          data_prevista_conclusao?: string | null
          descricao?: string | null
          gestor_responsavel?: string | null
          id?: string
          instrutor_responsavel?: string | null
          motivo: string
          nota_final?: number | null
          observacoes?: string | null
          prioridade?: string | null
          status?: string | null
          tipo_reciclagem: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          aprovado?: boolean | null
          created_at?: string | null
          data_conclusao?: string | null
          data_inicio?: string | null
          data_prevista_conclusao?: string | null
          descricao?: string | null
          gestor_responsavel?: string | null
          id?: string
          instrutor_responsavel?: string | null
          motivo?: string
          nota_final?: number | null
          observacoes?: string | null
          prioridade?: string | null
          status?: string | null
          tipo_reciclagem?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reciclagens_gestor_responsavel_fkey"
            columns: ["gestor_responsavel"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reciclagens_instrutor_responsavel_fkey"
            columns: ["instrutor_responsavel"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reciclagens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      test_results: {
        Row: {
          answers: Json | null
          completed_at: string | null
          created_at: string | null
          dominant_profile: string
          email: string
          id: string
          name: string
          participant_id: string | null
          registration: string
          score_c: number
          score_d: number
          score_i: number
          score_s: number
          test_duration_seconds: number | null
        }
        Insert: {
          answers?: Json | null
          completed_at?: string | null
          created_at?: string | null
          dominant_profile: string
          email: string
          id?: string
          name: string
          participant_id?: string | null
          registration: string
          score_c: number
          score_d: number
          score_i: number
          score_s: number
          test_duration_seconds?: number | null
        }
        Update: {
          answers?: Json | null
          completed_at?: string | null
          created_at?: string | null
          dominant_profile?: string
          email?: string
          id?: string
          name?: string
          participant_id?: string | null
          registration?: string
          score_c?: number
          score_d?: number
          score_i?: number
          score_s?: number
          test_duration_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_results_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      dashboard_stats: {
        Row: {
          completion_rate: number | null
          pending_tests: number | null
          total_completed_tests: number | null
          total_participants: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      search_participants: {
        Args: {
          filter_cargo?: string
          filter_coordinator?: string
          filter_status?: string
          search_text?: string
        }
        Returns: {
          cargo: string
          coordinator: string
          dominant_profile: string
          email: string
          has_completed_test: boolean
          id: string
          name: string
          registration: string
          score_c: number
          score_d: number
          score_i: number
          score_s: number
        }[]
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "viewer"
        | "manager"
        | "coordinator"
        | "gestor"
        | "instrutor"
        | "veterano"
        | "novato"
      hierarchy_level: "gerente" | "coordenador" | "supervisor" | "colaborador"
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
      app_role: [
        "admin",
        "viewer",
        "manager",
        "coordinator",
        "gestor",
        "instrutor",
        "veterano",
        "novato",
      ],
      hierarchy_level: ["gerente", "coordenador", "supervisor", "colaborador"],
    },
  },
} as const
