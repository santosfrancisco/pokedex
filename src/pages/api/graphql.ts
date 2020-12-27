import { ApolloServer, gql } from "apollo-server-micro";
import GraphQLJSON, { GraphQLJSONObject } from "graphql-type-json";

import { PokeAPI } from "@graphql/datasources/pokeAPI";

const typeDefs = gql`
  scalar JSON
  scalar JSONObject

  type Query {
    pokemons(page: Int, limit: Int): PokemonResponse
    pokemonById(id: Int!): Pokemon
    pokemonByName(name: String!): Pokemon
  }

  type PokemonResponse {
    count: Int
    results: [Pokemon]
  }

  type NamedAPIResource {
    name: String
  }

  type Ability {
    slot: Int
    ability: NamedAPIResource
  }

  type Stat {
    base_stat: Int
    stat: NamedAPIResource
  }

  type Type {
    slot: Int
    type: NamedAPIResource
  }

  type Pokemon {
    id: Int
    name: String
    base_experience: Int
    sprites: JSONObject
    abilities: [Ability]
    stats: [Stat]
    types: [Type]
  }
`;

const resolvers = {
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
  Query: {
    async pokemons(parent, args, context, info) {
      const { page, limit } = args;
      return await context.dataSources.pokeAPI.getPokemons(page, limit);
    },
    async pokemonById(parent, args, context, info) {
      const { id } = args;
      return context.dataSources.pokeAPI.getPokemonById(id);
    },
    async pokemonByName(parent, args, context, info) {
      const { name } = args;
      return context.dataSources.pokeAPI.getPokemonByName(name);
    },
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    pokeAPI: new PokeAPI(),
  }),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: "/api/graphql" });
