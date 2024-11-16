export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      pdf_documents: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          content: string
          file_path: string
          file_size: number
          user_id: string
          status: 'pending' | 'processed' | 'error'
          error_message?: string
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          content: string
          file_path: string
          file_size: number
          user_id: string
          status?: 'pending' | 'processed' | 'error'
          error_message?: string
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          content?: string
          file_path?: string
          file_size?: number
          user_id?: string
          status?: 'pending' | 'processed' | 'error'
          error_message?: string
          metadata?: Json
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
          theme: string
          notifications_enabled: boolean
          settings: Json
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          theme?: string
          notifications_enabled?: boolean
          settings?: Json
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          theme?: string
          notifications_enabled?: boolean
          settings?: Json
        }
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
  }
}
