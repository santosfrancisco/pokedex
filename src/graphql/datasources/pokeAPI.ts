import { RESTDataSource } from "apollo-datasource-rest";

export class PokeAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://pokeapi.co/api/v2/";
  }

  async getPokemons(page = 1, limit = 10) {
    const offset = page > 0 ? (page - 1) * limit : 0;
    return this.get(`pokemon?offset=${offset}&limit=${limit}`)
      .then((response) => {
        let results = [];
        if (response?.results.length) {
          results = response.results.map(async (pokemon) => {
            const info = await this.getPokemonByName(pokemon.name);
            return info;
          });
        }
        return { count: response.count, results };
      })
      .catch((error) => {
        console.error("getPokemons -> error: ", error);
        return { count: 0, results: [] };
      });
  }

  async getPokemonById(id: number) {
    return this.get(`pokemon/${id}`);
  }

  async getPokemonByName(name: string) {
    return this.get(`pokemon/${name}`);
  }
}
