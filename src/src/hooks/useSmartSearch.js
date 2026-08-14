// src/hooks/useSmartSearch.js
//
// Hook genérico de busca pra usar em QUALQUER aba do app
// (café da manhã, restaurantes, hotéis, diversão, praias...).
//
// Fluxo:
//  1) filtra a lista local (texto simples em nome/bairro/tags)
//  2) se NADA local combinar, busca no Google Places (fallback) — a tela
//     nunca fica em branco
//
// (Sem IA por enquanto — dá pra adicionar depois reativando o ai-search.js
// e a função buscarComIA, se quiser no futuro.)
//
// Uso:
//   const { resultados, carregando, origem, buscar } = useSmartSearch(listaLocalDeCafes, 'cafe');
//   <input onChange={(e) => buscar(e.target.value)} />

import { useCallback, useMemo, useState } from 'react';

function normalizar(txt = '') {
  return txt
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // remove acentos pra busca mais tolerante
}

function filtroLocalSimples(lista, termo) {
  const termoNorm = normalizar(termo);
  return lista.filter((item) => {
    const alvo = normalizar(`${item.nome} ${item.bairro} ${(item.tags || []).join(' ')}`);
    return alvo.includes(termoNorm);
  });
}

export function useSmartSearch(listaLocal, categoria) {
  const [termo, setTermo] = useState('');
  const [resultados, setResultados] = useState(listaLocal);
  const [carregando, setCarregando] = useState(false);
  const [origem, setOrigem] = useState('local'); // 'local' | 'google' | 'vazio'
  const [erro, setErro] = useState(null);

  const listaOrdenadaPorNota = useMemo(
    () => [...listaLocal].sort((a, b) => (b.avaliacao || 0) - (a.avaliacao || 0)),
    [listaLocal]
  );

  const buscar = useCallback(
    async (novoTermo) => {
      setTermo(novoTermo);
      setErro(null);

      if (!novoTermo || novoTermo.trim().length === 0) {
        setResultados(listaOrdenadaPorNota);
        setOrigem('local');
        return;
      }

      // 1) tenta o filtro local primeiro (rápido, sem custo de API)
      const localMatch = filtroLocalSimples(listaLocal, novoTermo);
      if (localMatch.length > 0) {
        setResultados(localMatch);
        setOrigem('local');
        return;
      }

      // 2) nada bateu localmente -> pergunta pro Google Places, pra tela
      //    nunca ficar em branco
      setCarregando(true);
      try {
        const resp = await fetch(
          `/api/search-places?q=${encodeURIComponent(novoTermo)}&categoria=${categoria}`
        );
        const data = await resp.json();

        if (resp.ok && data.lugares?.length > 0) {
          setResultados(data.lugares);
          setOrigem('google');
        } else {
          setResultados([]);
          setOrigem('vazio');
        }
      } catch (e) {
        setErro('Não foi possível buscar agora. Tente novamente.');
        setResultados([]);
        setOrigem('vazio');
      } finally {
        setCarregando(false);
      }
    },
    [listaLocal, listaOrdenadaPorNota, categoria]
  );

  return { termo, resultados, carregando, origem, erro, buscar };
}
