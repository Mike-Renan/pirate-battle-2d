import { useState, useCallback } from 'react';

export const useRanking = (page = 1) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRanking = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/ranking?page=${page}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // Falha silenciosa
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  return { data, isLoading, refetch: fetchRanking };
};

export const useMatchHistory = (page = 1) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/matches?page=${page}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // Falha silenciosa
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  return { data, isLoading, refetch: fetchHistory };
};

export const useSaveMatch = () => {
  const [loading, setLoading] = useState(false);

  const mutate = useCallback(async (matchData: any) => {
    setLoading(true);
    try {
      await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchData),
      });
    } catch {
      // Evita travar a aplicação em falhas de API
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, isLoading: loading };
};

export const useGameApi = () => {
  const { mutate, isLoading } = useSaveMatch();
  return { saveMatch: mutate, loading: isLoading };
};