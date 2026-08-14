// api/search-places.js
// Rota serverless da Vercel: /api/search-places?q=texto&categoria=cafe
//
// Usada como FALLBACK: só é chamada quando a busca na lista local (JSON/banco
// do app) não encontrou nada. Faz uma Text Search real no Google Places para
// que a tela nunca fique em branco.
//
// Configuração necessária na Vercel:
//   Project Settings > Environment Variables > GOOGLE_PLACES_API_KEY
// (nunca exponha essa chave no front-end — por isso ela mora numa function)

export default async function handler(req, res) {
  const { q, categoria } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(400).json({ erro: 'Informe um termo de busca (q).' });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ erro: 'GOOGLE_PLACES_API_KEY não configurada.' });
  }

  // Ancora a busca no Rio de Janeiro e, opcionalmente, guia o tipo de lugar
  // pela categoria da aba (cafe da manhã, restaurante, diversão, hospedagem...)
  const termosPorCategoria = {
    cafe: 'café da manhã',
    restaurante: 'restaurante',
    hospedagem: 'hotel',
    diversao: 'bar ou casa de show',
    praia: 'praia',
  };
  const sufixo = termosPorCategoria[categoria] ? ` ${termosPorCategoria[categoria]}` : '';
  const query = `${q}${sufixo} Rio de Janeiro`;

  const url = new URL('https://places.googleapis.com/v1/places:searchText');

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        // Só pedimos os campos que a UI realmente usa, pra economizar cota
        'X-Goog-FieldMask':
          'places.id,places.displayName,places.formattedAddress,places.rating,' +
          'places.userRatingCount,places.location,places.priceLevel,places.currentOpeningHours',
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: 'pt-BR',
        regionCode: 'BR',
        // Viés de localização: Zona Sul + Centro do Rio
        locationBias: {
          circle: {
            center: { latitude: -22.955, longitude: -43.19 },
            radius: 12000,
          },
        },
      }),
    });

    if (!resp.ok) {
      const detalhe = await resp.text();
      return res.status(resp.status).json({ erro: 'Falha na busca do Google Places', detalhe });
    }

    const data = await resp.json();
    const lugares = (data.places || []).map((p) => ({
      id: p.id,
      nome: p.displayName?.text ?? '',
      endereco: p.formattedAddress ?? '',
      avaliacao: p.rating ?? null,
      numAvaliacoes: p.userRatingCount ?? 0,
      lat: p.location?.latitude ?? null,
      lng: p.location?.longitude ?? null,
      aberto: p.currentOpeningHours?.openNow ?? null,
      origem: 'google', // marca visual: "resultado do Google, ainda não conferido pelo RamonGuia"
    }));

    return res.status(200).json({ lugares });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao consultar o Google Places', detalhe: err.message });
  }
}
