// src/hooks/useFavorites.js
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { toast } from 'react-toastify';
import {
  fetchFavorites,
  addFavorite,
  removeFavorite,
  getFavouriteId,
} from '../services/favoriteService';

/**
 * Central hook that provides:
 *   - favorites list (joined with job data)
 *   - isFav(jobId) boolean
 *   - toggleFav(jobId) – optimistic UI
 *   - loading flag for the initial fetch
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favMap, setFavMap] = useState({}); // jobId -> favourite row id (or null)

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    const { data, error } = await fetchFavorites();
    if (error) {
      toast.error('Failed to load favourite jobs');
    } else {
      setFavorites(data);
      const map = {};
      data.forEach((row) => {
        map[row.jobs.id] = row.id;
      });
      setFavMap(map);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadFavorites();
    // Supabase v2: onAuthStateChange returns { data: { subscription } }
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => loadFavorites());
    return () => subscription?.unsubscribe();
  }, [loadFavorites]);

  const isFav = (jobId) => Boolean(favMap[jobId]);

  const toggleFav = async (jobId) => {
    // Supabase v2: getSession() is async
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) {
      toast.error('Please login first');
      return;
    }

    const alreadyFav = isFav(jobId);
    // optimistic UI – set placeholder while request runs
    setFavMap((prev) => ({ ...prev, [jobId]: alreadyFav ? null : 'temp' }));

    if (alreadyFav) {
      const favId = favMap[jobId];
      const { error } = await removeFavorite(favId);
      if (error) {
        toast.error('Could not remove from favourites');
        setFavMap((prev) => ({ ...prev, [jobId]: favId })); // revert
      } else {
        setFavorites((prev) => prev.filter((f) => f.id !== favId));
        setFavMap((prev) => ({ ...prev, [jobId]: null }));
        toast.success('Removed from favourites');
      }
    } else {
      const { data, error } = await addFavorite(jobId);
      if (error) {
        toast.error('Could not add to favourites');
        setFavMap((prev) => ({ ...prev, [jobId]: null })); // revert
      } else {
        // data may not contain the joined job – we fetch the job via getFavouriteId if needed
        const newFavId = data.id;
        setFavorites((prev) => [{ id: newFavId, created_at: data.created_at, jobs: data.jobs }, ...prev]);
        setFavMap((prev) => ({ ...prev, [jobId]: newFavId }));
        toast.success('Added to favourites');
      }
    }
  };

  return { favorites, loading, isFav, toggleFav, reload: loadFavorites };
};
