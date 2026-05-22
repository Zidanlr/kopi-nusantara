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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      about: {
        Row: {
          created_at: string
          deskripsi: string | null
          gambar: string | null
          id: string
          judul: string
        }
        Insert: {
          created_at?: string
          deskripsi?: string | null
          gambar?: string | null
          id?: string
          judul: string
        }
        Update: {
          created_at?: string
          deskripsi?: string | null
          gambar?: string | null
          id?: string
          judul?: string
        }
        Relationships: []
      }
      hero: {
        Row: {
          background_image: string | null
          created_at: string
          cta_text: string | null
          headline: string
          id: string
          subheadline: string | null
        }
        Insert: {
          background_image?: string | null
          created_at?: string
          cta_text?: string | null
          headline: string
          id?: string
          subheadline?: string | null
        }
        Update: {
          background_image?: string | null
          created_at?: string
          cta_text?: string | null
          headline?: string
          id?: string
          subheadline?: string | null
        }
        Relationships: []
      }
      menu: {
        Row: {
          allow_sugar_level: boolean
          created_at: string
          deskripsi: string | null
          gambar_url: string | null
          harga: number
          id: string
          kategori: string | null
          nama_menu: string
          sort_order: number
        }
        Insert: {
          allow_sugar_level?: boolean
          created_at?: string
          deskripsi?: string | null
          gambar_url?: string | null
          harga?: number
          id?: string
          kategori?: string | null
          nama_menu: string
          sort_order?: number
        }
        Update: {
          allow_sugar_level?: boolean
          created_at?: string
          deskripsi?: string | null
          gambar_url?: string | null
          harga?: number
          id?: string
          kategori?: string | null
          nama_menu?: string
          sort_order?: number
        }
        Relationships: []
      }
      pesanan: {
        Row: {
          bank_selected: string | null
          catatan: string | null
          created_at: string
          id: string
          items: Json
          kode_pesanan: string
          metode_pembayaran: string
          nama_pelanggan: string | null
          payment_reference: string | null
          status: string
          subtotal: number
        }
        Insert: {
          bank_selected?: string | null
          catatan?: string | null
          created_at?: string
          id?: string
          items?: Json
          kode_pesanan: string
          metode_pembayaran: string
          nama_pelanggan?: string | null
          payment_reference?: string | null
          status?: string
          subtotal?: number
        }
        Update: {
          bank_selected?: string | null
          catatan?: string | null
          created_at?: string
          id?: string
          items?: Json
          kode_pesanan?: string
          metode_pembayaran?: string
          nama_pelanggan?: string | null
          payment_reference?: string | null
          status?: string
          subtotal?: number
        }
        Relationships: []
      }
      sosial_media: {
        Row: {
          alamat: string | null
          created_at: string
          id: string
          instagram: string | null
          jam_operasional: string | null
          whatsapp: string | null
        }
        Insert: {
          alamat?: string | null
          created_at?: string
          id?: string
          instagram?: string | null
          jam_operasional?: string | null
          whatsapp?: string | null
        }
        Update: {
          alamat?: string | null
          created_at?: string
          id?: string
          instagram?: string | null
          jam_operasional?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string
          foto: string | null
          id: string
          nama: string
          review: string
        }
        Insert: {
          created_at?: string
          foto?: string | null
          id?: string
          nama: string
          review: string
        }
        Update: {
          created_at?: string
          foto?: string | null
          id?: string
          nama?: string
          review?: string
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
