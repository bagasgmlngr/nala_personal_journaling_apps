// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database Types
export type Story = {
  id: number
  user_id: string
  title: string
  content: string
  mood: string
  created_at: string
}

export type User = {
  id: string
  email: string
  created_at: string
}

// Mood Options
export const moodOptions = [
  { value: "😊 Happy", emoji: "😊", label: "Happy" },
  { value: "😢 Sad", emoji: "😢", label: "Sad" },
  { value: "😐 Neutral", emoji: "😐", label: "Neutral" },
  { value: "😍 Excited", emoji: "😍", label: "Excited" },
  { value: "🤔 Thoughtful", emoji: "🤔", label: "Thoughtful" },
  { value: "😴 Tired", emoji: "😴", label: "Tired" },
  { value: "🚀 Motivated", emoji: "🚀", label: "Motivated" },
  { value: "☕ Relaxed", emoji: "☕", label: "Relaxed" }
];

// Utility function for date formatting
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};