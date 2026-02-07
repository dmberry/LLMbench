/**
 * Supabase Database Types for LLMbench
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AnnotationType =
  | "observation"
  | "question"
  | "metaphor"
  | "pattern"
  | "context"
  | "critique";

export type LinkType =
  | "related"
  | "contrast"
  | "elaboration"
  | "contradiction"
  | "parallel";

export type PanelId = "A" | "B";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          initials: string | null;
          affiliation: string | null;
          avatar_url: string | null;
          profile_color: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          initials?: string | null;
          affiliation?: string | null;
          avatar_url?: string | null;
          profile_color?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          initials?: string | null;
          affiliation?: string | null;
          avatar_url?: string | null;
          profile_color?: string | null;
          created_at?: string;
        };
      };
      comparisons: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          owner_id: string;
          prompt: string;
          system_prompt: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          owner_id: string;
          prompt: string;
          system_prompt?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          owner_id?: string;
          prompt?: string;
          system_prompt?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      outputs: {
        Row: {
          id: string;
          comparison_id: string;
          panel: PanelId;
          content: string;
          provider: string;
          model: string;
          model_display_name: string | null;
          temperature: number | null;
          max_tokens: number | null;
          system_prompt: string | null;
          response_time_ms: number | null;
          token_count_prompt: number | null;
          token_count_response: number | null;
          generated_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          comparison_id: string;
          panel: PanelId;
          content: string;
          provider: string;
          model: string;
          model_display_name?: string | null;
          temperature?: number | null;
          max_tokens?: number | null;
          system_prompt?: string | null;
          response_time_ms?: number | null;
          token_count_prompt?: number | null;
          token_count_response?: number | null;
          generated_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          comparison_id?: string;
          panel?: PanelId;
          content?: string;
          provider?: string;
          model?: string;
          model_display_name?: string | null;
          temperature?: number | null;
          max_tokens?: number | null;
          system_prompt?: string | null;
          response_time_ms?: number | null;
          token_count_prompt?: number | null;
          token_count_response?: number | null;
          generated_at?: string;
          created_at?: string;
        };
      };
      annotations: {
        Row: {
          id: string;
          output_id: string;
          comparison_id: string;
          user_id: string | null;
          line_number: number;
          end_line_number: number | null;
          line_content: string | null;
          type: AnnotationType;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          output_id: string;
          comparison_id: string;
          user_id?: string | null;
          line_number: number;
          end_line_number?: number | null;
          line_content?: string | null;
          type: AnnotationType;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          output_id?: string;
          comparison_id?: string;
          user_id?: string | null;
          line_number?: number;
          end_line_number?: number | null;
          line_content?: string | null;
          type?: AnnotationType;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      annotation_replies: {
        Row: {
          id: string;
          annotation_id: string;
          comparison_id: string;
          user_id: string | null;
          added_by_initials: string | null;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          annotation_id: string;
          comparison_id: string;
          user_id?: string | null;
          added_by_initials?: string | null;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          annotation_id?: string;
          comparison_id?: string;
          user_id?: string | null;
          added_by_initials?: string | null;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      annotation_links: {
        Row: {
          id: string;
          comparison_id: string;
          source_annotation_id: string;
          target_annotation_id: string;
          link_type: LinkType;
          content: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          comparison_id: string;
          source_annotation_id: string;
          target_annotation_id: string;
          link_type?: LinkType;
          content?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          comparison_id?: string;
          source_annotation_id?: string;
          target_annotation_id?: string;
          link_type?: LinkType;
          content?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      annotation_type: AnnotationType;
      link_type: LinkType;
      panel_id: PanelId;
    };
  };
}

// Convenience types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Comparison = Database["public"]["Tables"]["comparisons"]["Row"];
export type Output = Database["public"]["Tables"]["outputs"]["Row"];
export type Annotation = Database["public"]["Tables"]["annotations"]["Row"];
export type AnnotationReply = Database["public"]["Tables"]["annotation_replies"]["Row"];
export type AnnotationLink = Database["public"]["Tables"]["annotation_links"]["Row"];

export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ComparisonInsert = Database["public"]["Tables"]["comparisons"]["Insert"];
export type OutputInsert = Database["public"]["Tables"]["outputs"]["Insert"];
export type AnnotationInsert = Database["public"]["Tables"]["annotations"]["Insert"];
export type AnnotationReplyInsert = Database["public"]["Tables"]["annotation_replies"]["Insert"];
export type AnnotationLinkInsert = Database["public"]["Tables"]["annotation_links"]["Insert"];

// Extended types
export interface ComparisonWithOutputs extends Comparison {
  outputs?: Output[];
}

export interface OutputWithAnnotations extends Output {
  annotations?: Annotation[];
}
