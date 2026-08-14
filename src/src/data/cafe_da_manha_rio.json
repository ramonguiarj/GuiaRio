// src/components/CafeSearch.jsx
//
// Exemplo de uso do useSmartSearch na aba de Café da Manhã.
// Troque `cafesLocais` pelo import do seu JSON/banco real
// (ex: cafe_da_manha_rio.json) e reaproveite este mesmo padrão
// nas outras abas (Restaurantes, Hotéis, Diversão...).

import { useSmartSearch } from '../hooks/useSmartSearch';
import cafesLocais from '../data/cafe_da_manha_rio.json';

export default function CafeSearch() {
  const { resultados, carregando, origem, erro, buscar } = useSmartSearch(
    cafesLocais,
    'cafe'
  );

  const handleChange = (e) => {
    buscar(e.target.value);
  };

  return (
    <div className="cafe-search">
      <div className="cafe-search__barra">
        <input
          type="text"
          placeholder="Buscar café da manhã (nome ou bairro)"
          onChange={handleChange}
          className="cafe-search__input"
        />
      </div>

      {carregando && <p className="cafe-search__status">Buscando...</p>}
      {erro && <p className="cafe-search__status cafe-search__status--erro">{erro}</p>}

      {origem === 'google' && (
        <p className="cafe-search__aviso">
          Não encontramos esse lugar na nossa lista, mas achamos no Google:
        </p>
      )}

      {origem === 'vazio' && !carregando && (
        <div className="cafe-search__vazio">
          <p>Não encontramos nenhum resultado para essa busca.</p>
          <p>Tente outro nome de bairro ou tipo de comida.</p>
        </div>
      )}

      <ul className="cafe-search__lista">
        {resultados.map((lugar) => (
          <li key={lugar.id} className="cafe-card">
            <h3>{lugar.nome}</h3>
            <p>{lugar.bairro || lugar.endereco}</p>
            {lugar.avaliacao != null && (
              <p>⭐ {lugar.avaliacao} ({lugar.numAvaliacoes ?? lugar.num_avaliacoes ?? 0} avaliações)</p>
            )}
            {lugar.origem === 'google' && (
              <span className="cafe-card__tag">Encontrado no Google</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
