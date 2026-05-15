// src/services/favoriteService.js
import { supabase } from '../config/supabase';

/** Helper: get current user via Supabase v2 async API */
const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user ?? null;
};

/** Add a job to the current user's favourites */
export const addFavorite = async (jobId) => {
  const user = await getCurrentUser();
  if (!user) return { data: null, error: new Error('User not logged in') };

  const { data, error } = await supabase
    .from('favorite_jobs')
    .insert({ user_id: user.id, job_id: jobId })
    .select('id, created_at, jobs(*)')
    .single();
  return { data, error };
};

/** Remove a favourite by its row id */
export const removeFavorite = async (favId) => {
  const { error } = await supabase
    .from('favorite_jobs')
    .delete()
    .eq('id', favId);
  return { error };
};

/** Fetch all favourites for the current user, including job details */
export const fetchFavorites = async () => {
  const user = await getCurrentUser();
  if (!user) return { data: [], error: null };

  const { data, error } = await supabase
    .from('favorite_jobs')
    .select('id, created_at, jobs(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return { data: data ?? [], error };
};

/** Return favourite row id if exists, otherwise null */
export const getFavouriteId = async (jobId) => {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('favorite_jobs')
    .select('id')
    .eq('user_id', user.id)
    .eq('job_id', jobId)
    .single();

  if (error) return null;
  return data?.id ?? null;
};
