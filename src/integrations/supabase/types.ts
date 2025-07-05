export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      azioni_personalizzate: {
        Row: {
          creato_il: string
          descrizione_user: string | null
          id: string
          nome_azione: string
          prompt_ai: string | null
          prompt_enhanced: string | null
          utente_id: string
        }
        Insert: {
          creato_il?: string
          descrizione_user?: string | null
          id?: string
          nome_azione: string
          prompt_ai?: string | null
          prompt_enhanced?: string | null
          utente_id: string
        }
        Update: {
          creato_il?: string
          descrizione_user?: string | null
          id?: string
          nome_azione?: string
          prompt_ai?: string | null
          prompt_enhanced?: string | null
          utente_id?: string
        }
        Relationships: []
      }
      cartelle: {
        Row: {
          cartella_padre_id: string | null
          creata_il: string
          id: string
          nome_cartella: string
          utente_id: string
        }
        Insert: {
          cartella_padre_id?: string | null
          creata_il?: string
          id?: string
          nome_cartella: string
          utente_id: string
        }
        Update: {
          cartella_padre_id?: string | null
          creata_il?: string
          id?: string
          nome_cartella?: string
          utente_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cartelle_cartella_padre_id_fkey"
            columns: ["cartella_padre_id"]
            isOneToOne: false
            referencedRelation: "cartelle"
            referencedColumns: ["id"]
          },
        ]
      }
      collaboratori: {
        Row: {
          documento_id: string
          id: string
          invitato_il: string
          ruolo: Database["public"]["Enums"]["collaboratore_ruolo"]
          stato_invito: Database["public"]["Enums"]["invito_stato"]
          utente_id: string
        }
        Insert: {
          documento_id: string
          id?: string
          invitato_il?: string
          ruolo: Database["public"]["Enums"]["collaboratore_ruolo"]
          stato_invito?: Database["public"]["Enums"]["invito_stato"]
          utente_id: string
        }
        Update: {
          documento_id?: string
          id?: string
          invitato_il?: string
          ruolo?: Database["public"]["Enums"]["collaboratore_ruolo"]
          stato_invito?: Database["public"]["Enums"]["invito_stato"]
          utente_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaboratori_documento_id_fkey"
            columns: ["documento_id"]
            isOneToOne: false
            referencedRelation: "documenti"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_prompts: {
        Row: {
          creato_il: string
          id: string
          prompt_text: string
          titolo: string
          utente_id: string
        }
        Insert: {
          creato_il?: string
          id?: string
          prompt_text: string
          titolo: string
          utente_id: string
        }
        Update: {
          creato_il?: string
          id?: string
          prompt_text?: string
          titolo?: string
          utente_id?: string
        }
        Relationships: []
      }
      documenti: {
        Row: {
          anteprima_ai: string | null
          cartella_id: string | null
          contenuto: string | null
          creato_il: string
          id: string
          modificato_il: string
          pinned: boolean
          stato_ai: Database["public"]["Enums"]["documento_stato_ai"]
          tipo_documento: Database["public"]["Enums"]["documento_tipo"]
          titolo: string
          utente_id: string
        }
        Insert: {
          anteprima_ai?: string | null
          cartella_id?: string | null
          contenuto?: string | null
          creato_il?: string
          id?: string
          modificato_il?: string
          pinned?: boolean
          stato_ai?: Database["public"]["Enums"]["documento_stato_ai"]
          tipo_documento: Database["public"]["Enums"]["documento_tipo"]
          titolo: string
          utente_id: string
        }
        Update: {
          anteprima_ai?: string | null
          cartella_id?: string | null
          contenuto?: string | null
          creato_il?: string
          id?: string
          modificato_il?: string
          pinned?: boolean
          stato_ai?: Database["public"]["Enums"]["documento_stato_ai"]
          tipo_documento?: Database["public"]["Enums"]["documento_tipo"]
          titolo?: string
          utente_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documenti_cartella_id_fkey"
            columns: ["cartella_id"]
            isOneToOne: false
            referencedRelation: "cartelle"
            referencedColumns: ["id"]
          },
        ]
      }
      documenti_tag: {
        Row: {
          documento_id: string
          id: string
          tag_id: string
        }
        Insert: {
          documento_id: string
          id?: string
          tag_id: string
        }
        Update: {
          documento_id?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documenti_tag_documento_id_fkey"
            columns: ["documento_id"]
            isOneToOne: false
            referencedRelation: "documenti"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documenti_tag_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tag"
            referencedColumns: ["id"]
          },
        ]
      }
      tag: {
        Row: {
          id: string
          nome: string
          utente_id: string
        }
        Insert: {
          id?: string
          nome: string
          utente_id: string
        }
        Update: {
          id?: string
          nome?: string
          utente_id?: string
        }
        Relationships: []
      }
      versioni: {
        Row: {
          contenuto_output: string
          creato_da: string
          creato_il: string
          documento_id: string
          id: string
          refined_from_version_id: string | null
          tipo_output: Database["public"]["Enums"]["versione_tipo"]
          workflow_id: string | null
        }
        Insert: {
          contenuto_output: string
          creato_da: string
          creato_il?: string
          documento_id: string
          id?: string
          refined_from_version_id?: string | null
          tipo_output: Database["public"]["Enums"]["versione_tipo"]
          workflow_id?: string | null
        }
        Update: {
          contenuto_output?: string
          creato_da?: string
          creato_il?: string
          documento_id?: string
          id?: string
          refined_from_version_id?: string | null
          tipo_output?: Database["public"]["Enums"]["versione_tipo"]
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "versioni_documento_id_fkey"
            columns: ["documento_id"]
            isOneToOne: false
            referencedRelation: "documenti"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "versioni_refined_from_version_id_fkey"
            columns: ["refined_from_version_id"]
            isOneToOne: false
            referencedRelation: "versioni"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "versioni_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_azioni: {
        Row: {
          azione_id: string
          id: string
          ordine: number
          workflow_id: string
        }
        Insert: {
          azione_id: string
          id?: string
          ordine: number
          workflow_id: string
        }
        Update: {
          azione_id?: string
          id?: string
          ordine?: number
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_azioni_azione_id_fkey"
            columns: ["azione_id"]
            isOneToOne: false
            referencedRelation: "azioni_personalizzate"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_azioni_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows_ai"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_steps: {
        Row: {
          id: string
          nome: string
          ordine: number
          prompt_template: string | null
          tipo_azione: string
          workflow_id: string
        }
        Insert: {
          id?: string
          nome?: string
          ordine: number
          prompt_template?: string | null
          tipo_azione: string
          workflow_id: string
        }
        Update: {
          id?: string
          nome?: string
          ordine?: number
          prompt_template?: string | null
          tipo_azione?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_steps_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          creato_il: string
          descrizione: string | null
          id: string
          modificato_il: string
          nome: string
          stato: string
          utente_id: string
        }
        Insert: {
          creato_il?: string
          descrizione?: string | null
          id?: string
          modificato_il?: string
          nome: string
          stato?: string
          utente_id: string
        }
        Update: {
          creato_il?: string
          descrizione?: string | null
          id?: string
          modificato_il?: string
          nome?: string
          stato?: string
          utente_id?: string
        }
        Relationships: []
      }
      workflows_ai: {
        Row: {
          creato_il: string
          id: string
          nome_workflow: string
          utente_id: string
        }
        Insert: {
          creato_il?: string
          id?: string
          nome_workflow: string
          utente_id: string
        }
        Update: {
          creato_il?: string
          id?: string
          nome_workflow?: string
          utente_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      user_has_document_access: {
        Args: { doc_id: string; user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      collaboratore_ruolo: "editor" | "visualizzatore"
      documento_stato_ai:
        | "nessuna"
        | "sommario"
        | "punti"
        | "note"
        | "personalizzato"
      documento_tipo: "trascrizione" | "testo" | "video"
      invito_stato: "attivo" | "in_sospeso"
      versione_tipo: "sommario" | "punti" | "note" | "personalizzato"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      collaboratore_ruolo: ["editor", "visualizzatore"],
      documento_stato_ai: [
        "nessuna",
        "sommario",
        "punti",
        "note",
        "personalizzato",
      ],
      documento_tipo: ["trascrizione", "testo", "video"],
      invito_stato: ["attivo", "in_sospeso"],
      versione_tipo: ["sommario", "punti", "note", "personalizzato"],
    },
  },
} as const
