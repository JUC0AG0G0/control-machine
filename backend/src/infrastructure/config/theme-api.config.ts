// src/infrastructure/config/theme-api.config.ts
export const THEME_API_CONFIG = {
  pokemon: [
    'https://filrouge.uha4point0.fr/V2/pokemon/types',
    'https://filrouge.uha4point0.fr/V2/pokemon/pokemons'
  ],
  miyasaki: [
    'https://filrouge.uha4point0.fr/V2/miyasaki/films',
    'https://filrouge.uha4point0.fr/V2/miyasaki/heros'
  ],
  music: [
    'https://filrouge.uha4point0.fr/V2/music/groupes',
    'https://filrouge.uha4point0.fr/V2/music/albums'
  ],
  ocean: [
    'https://filrouge.uha4point0.fr/V2/ocean/especes',
    'https://filrouge.uha4point0.fr/V2/ocean/poissons'
  ],
  shop: [
    'https://filrouge.uha4point0.fr/V2/shop/clients',
    'https://filrouge.uha4point0.fr/V2/shop/commandes'
  ],
  basketball: [
    'https://filrouge.uha4point0.fr/V2/basketball/equipes',
    'https://filrouge.uha4point0.fr/V2/basketball/joueurs'
  ],
  UHA40: [
    'https://filrouge.uha4point0.fr/V2/UHA40/annees',
    'https://filrouge.uha4point0.fr/V2/UHA40/certifications'
  ],
  browseShop: [
    'https://filrouge.uha4point0.fr/V2/browseShop/categories',
    'https://filrouge.uha4point0.fr/V2/browseShop/produits'
  ],
  UNIX: [
    'https://filrouge.uha4point0.fr/V2/UNIX/utilisateurs',
    'https://filrouge.uha4point0.fr/V2/UNIX/images'
  ],
  car: [
    'https://filrouge.uha4point0.fr/V2/car/constructeurs',
    'https://filrouge.uha4point0.fr/V2/car/voitures'
  ],
  arbres: [
    'https://filrouge.uha4point0.fr/V2/arbres/types',
    'https://filrouge.uha4point0.fr/V2/arbres/especes'
  ],
  livres: [
    'https://filrouge.uha4point0.fr/V2/livres/auteurs',
    'https://filrouge.uha4point0.fr/V2/livres/livres'
  ]
} as const;

export type ThemeName = keyof typeof THEME_API_CONFIG;