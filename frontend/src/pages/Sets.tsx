import React, { useEffect, useState } from 'react';

const Sets = () => {
  const [sets, setSets] = useState([]);

  useEffect(() => {
    const fetchSets = async () => {
      const response = await fetch('https://api.pokemontcg.io/v2/sets');
      const data = await response.json();
      setSets(data.sets);
    };
    fetchSets();
  }, []);

  return (
    <div>
      <h1>Liste des Sets Pokémon</h1>
      <div className="set-grid">
        {sets.map(set => (
          <div key={set.id} className="set-item">
            <img src={set.images.logo} alt={set.name} />
            <p>{set.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sets;
