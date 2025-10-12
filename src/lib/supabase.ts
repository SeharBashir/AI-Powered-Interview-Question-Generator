import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface QuestionBank {
  id: string;
  category: string;
  subcategory: string | null;
  question: string;
  difficulty: string;
  role_type: string;
  created_at: string;
}

export interface InterviewProfile {
  id: string;
  job_title: string;
  job_description: string;
  required_skills: string[];
  linkedin_url: string | null;
  github_url: string | null;
  deployment_url: string | null;
  created_at: string;
}

export interface GeneratedQuestion {
  id: string;
  profile_id: string;
  question: string;
  category: string;
  difficulty: string;
  reasoning: string | null;
  created_at: string;
}
