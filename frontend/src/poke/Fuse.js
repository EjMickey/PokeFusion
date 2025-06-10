import { useEffect, useState } from 'react';
import './Fuse.css';

function Fuse() {
  const [pokeList, setPokeList] = useState([]);
  const [selected1, setSelected1] = useState('');
  const [selected2, setSelected2] = useState('');
  const [fusionContent, setFusionContent] = useState(null);
  const [lastFusionDate, setLastFusionDate] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isPremium, setIsPremium] = useState(false);

  const FUSION_COOLDOWN_SECONDS = 60;

  useEffect(() => {
    async function fetchPokemonList() {
      try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000');
        const data = await res.json();
        const pokemonsWithId = data.results
          .map((pokemon) => {
            const idMatch = pokemon.url.match(/\/pokemon\/(\d+)\//);
            const id = idMatch ? parseInt(idMatch[1]) : null;
            return id ? { ...pokemon, id } : null;
          })
          .filter(Boolean);
        setPokeList(pokemonsWithId);
      } catch (err) {
        console.error('Błąd przy pobieraniu Pokémonów:', err);
      }
    }

    async function fetchLastFusion() {
      try {
        const res = await fetch('http://localhost:3001/last-fusion', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) {
          setLastFusionDate('Spróbuj swojej pierwszej fuzji!');
          return;
        }
        const data = await res.json();
        if (data.premium) {
          setIsPremium(true);
        }
        setLastFusionDate(data.date);
      } catch (err) {
        console.error('Błąd pobierania ostatniej fuzji:', err);
        setLastFusionDate('Spróbuj swojej pierwszej fuzji!');
      }
    }

    fetchPokemonList();
    fetchLastFusion();
  }, []);

  useEffect(() => {
    if (pokeList.length > 0) {
      setSelected1(pokeList[0].id.toString());
      setSelected2(pokeList[0].id.toString());
    }
  }, [pokeList]);

  useEffect(() => {
    if (
      isPremium ||
      !lastFusionDate ||
      (typeof lastFusionDate === 'string' && lastFusionDate.includes('Spróbuj'))
    )
      return;

    const interval = setInterval(() => {
      const diff = Math.floor(
        new Date(lastFusionDate).getTime() + FUSION_COOLDOWN_SECONDS * 1000 - Date.now()
      );
      setSecondsLeft(diff > 0 ? Math.ceil(diff / 1000) : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastFusionDate, isPremium]);

  useEffect(() => {
    if (isPremium) setSecondsLeft(0);
  }, [isPremium]);

  async function fuseSelected() {
    const token = localStorage.getItem('token');
    if (!token) return alert('Zaloguj się, aby wykonać fuzję.');
    if (!isPremium && secondsLeft > 0) return alert(`Musisz poczekać jeszcze ${secondsLeft} sekund.`);

    const pokemon1 = pokeList.find((p) => p.id === parseInt(selected1));
    const pokemon2 = pokeList.find((p) => p.id === parseInt(selected2));

    if (!pokemon1 || !pokemon2) {
      return alert('Wybierz poprawne Pokemony do fuzji.');
    }

    const fused = (
      <div className="fuse-fusion">
        <img
          src={`https://images.alexonsager.net/pokemon/fused/${selected1}/${selected1}.${selected2}.png`}
          alt="Fuzja Pokemona"
          className="fuse-img"
        />
        <div className="fuse-fusion-text">
          {pokemon1.name.slice(0, 3)}
          {pokemon2.name.slice(-3)}
        </div>
      </div>
    );

    setFusionContent(fused);

    try {
      const res = await fetch('http://localhost:3001/fuse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pokemon1: selected1, pokemon2: selected2 }),
      });

      if (!res.ok) {
        console.error('Nie udało się zapisać fuzji');
      } else {
        const fusionData = await res.json();
        const now = new Date().toISOString();
        setLastFusionDate(fusionData.date || now);
        setSecondsLeft(FUSION_COOLDOWN_SECONDS);
      }
    } catch (err) {
      console.error('Błąd zapisu fuzji:', err);
    }
  }

  return (
    <div className="fuse-container">
      <div className="fuse-status">
        {typeof lastFusionDate === 'string' && lastFusionDate.includes('Spróbuj')
          ? lastFusionDate
          : isPremium
          ? 'Jesteś premium! Fuzjuj bez limitu'
          : secondsLeft > 0
          ? `Odczekaj jeszcze: ${secondsLeft}s`
          : 'Możesz teraz wykonać fuzję!'}
      </div>

      <div className="fuse-columns">
        <div className="fuse-column">
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selected1}.png`}
            alt="Pokemon 1"
            className="fuse-img"
          />
          <select value={selected1} onChange={(e) => setSelected1(e.target.value)} className="fuse-select">
            {pokeList.map((pokemon) => (
              <option key={pokemon.id} value={pokemon.id}>
                #{pokemon.id} {pokemon.name}
              </option>
            ))}
          </select>
        </div>

        <div className="fuse-column fuse-center">
          {fusionContent ? (
            fusionContent
          ) : (
            <div className="fuse-preview">Wybierz Pokemony i kliknij "Fuse"</div>
          )}
          <button
            onClick={fuseSelected}
            disabled={!isPremium && secondsLeft > 0}
            className="fuse-button"
          >
            Fuse
          </button>
        </div>

        <div className="fuse-column">
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selected2}.png`}
            alt="Pokemon 2"
            className="fuse-img"
          />
          <select value={selected2} onChange={(e) => setSelected2(e.target.value)} className="fuse-select">
            {pokeList.map((pokemon) => (
              <option key={pokemon.id} value={pokemon.id}>
                #{pokemon.id} {pokemon.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default Fuse;
