import { http, HttpResponse } from 'msw';
import { MatchRecord } from '../api/types';

const STORAGE_KEY = 'pirate_battle_matches';

// Carrega dados salvos no localStorage ou inicia com lista vazia
function getStoredMatches(): MatchRecord[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveMatch(match: MatchRecord): void {
  const matches = getStoredMatches();
  // Evita duplicados verificando o ID da partida
  if (!matches.some((m) => m.id === match.id)) {
    matches.push(match);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
  }
}

export const handlers = [
  // 1. GET /api/ranking - Retorna os melhores resultados ordenados por pontuação
  http.get('/api/ranking', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || 1);
    const limit = 10;

    const matches = getStoredMatches();
    
    // Ordena por Pontuação (Maior -> Menor) e por Duração como critério de desempate
    const sorted = [...matches].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.duration - b.duration;
    });

    const totalPages = Math.max(1, Math.ceil(sorted.length / limit));
    const start = (page - 1) * limit;
    const paginatedData = sorted.slice(start, start + limit);

    return HttpResponse.json({
      data: paginatedData,
      page,
      totalPages,
      totalItems: sorted.length,
    });
  }),

  // 2. GET /api/history - Retorna o histórico de partidas ordenado por data
  http.get('/api/history', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || 1);
    const limit = 10;

    const matches = getStoredMatches();
    const sorted = [...matches].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const totalPages = Math.max(1, Math.ceil(sorted.length / limit));
    const start = (page - 1) * limit;
    const paginatedData = sorted.slice(start, start + limit);

    return HttpResponse.json({
      data: paginatedData,
      page,
      totalPages,
      totalItems: sorted.length,
    });
  }),

  // 3. POST /api/matches - Regista uma nova partida concluída
  http.post('/api/matches', async ({ request }) => {
    const match = (await request.json()) as MatchRecord;
    saveMatch(match);
    return HttpResponse.json(match, { status: 201 });
  }),
];