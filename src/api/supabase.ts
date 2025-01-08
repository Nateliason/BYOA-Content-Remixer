import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface SavedTweet {
  id: number
  content: string
  created_at: string
}

export const saveTweet = async (content: string) => {
  const { data, error } = await supabase
    .from('saved_tweets')
    .insert([{ content }])
    .select()
  
  if (error) throw error
  return data[0]
}

export const getSavedTweets = async () => {
  const { data, error } = await supabase
    .from('saved_tweets')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as SavedTweet[]
}

export const deleteSavedTweet = async (id: number) => {
  const { error } = await supabase
    .from('saved_tweets')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export const updateSavedTweet = async (id: number, content: string) => {
  const { error } = await supabase
    .from('saved_tweets')
    .update({ content })
    .eq('id', id)
  
  if (error) throw error
} 