import React from "react";
import useSWR from "swr";
import dynamic from "next/dynamic";

const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });

const fetcher = (query) =>
  fetch("/api/graphql", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  })
    .then((res) => res.json())
    .then((json) => json.data);

const Home = () => {
  const [page, setPage] = React.useState(1);
  const { data, error } = useSWR(
    `{ pokemons(page: ${page}, limit: 1) { 
      count 
      results { 
        id 
        name 
        sprites 
        abilities {
          slot
          ability {
            name
          }
        }
        stats {
          base_stat
          stat {
            name
          }
        }
        types {
          slot
          type {
            name
          }
        }
        base_experience
      } 
    } 
  }`,
    fetcher
  );

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const {
    pokemons: { count, results },
  } = data;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <h1>Total de Pokémons na API: {count}</h1>
        <h2>
          <a href="/api/graphql">Playground graphql</a>
        </h2>
      </div>
      {results?.map((pokemon) => (
        <div key={pokemon.name}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              padding: 24,
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <button onClick={() => page > 0 && setPage(page - 1)}>
                Anterior
              </button>
              <span style={{ padding: "0 16px" }}>
                {pokemon.id} - {pokemon.name}
              </span>
              <button onClick={() => page < count && setPage(page + 1)}>
                Próximo
              </button>
            </div>
            <div>
              <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            </div>
          </div>
          <DynamicReactJson
            style={{ padding: 16 }}
            src={pokemon}
            theme="monokai"
          />
        </div>
      ))}
    </div>
  );
};

export default Home;
