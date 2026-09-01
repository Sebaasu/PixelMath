// Collection of famous children's movie & cartoon pixel art characters hosted on open CDN

export const MOVIE_CHARACTER_CATEGORIES = [
  { id: 'cine_disney', name: '🎬 Disney & Pixar' },
  { id: 'superheroes', name: '🦸 Superhéroes & Cine' },
  { id: 'videojuegos_cine', name: '🎮 Mario, Sonic & Minecraft' },
  { id: 'anime_cartoons', name: '📺 Bob Esponja, Minions & Anime' }
];

export const MOVIE_CHARACTERS = [
  // 🎬 Disney & Pixar
  {
    id: 'mickey',
    name: 'Mickey Mouse (Disney)',
    category: 'cine_disney',
    url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', // fallback test
    hexColor: '#ef4444',
    presetGrid: [
      [0,1,1,0,0,0,0,1,1,0],
      [1,1,1,1,0,0,1,1,1,1],
      [1,1,1,1,0,0,1,1,1,1],
      [0,1,1,0,2,2,0,1,1,0],
      [0,0,2,2,2,2,2,2,0,0],
      [0,2,3,2,2,2,2,3,2,0],
      [0,2,2,2,4,4,2,2,2,0],
      [0,0,2,4,4,4,4,2,0,0],
      [0,0,1,1,1,1,1,1,0,0],
      [0,0,1,5,1,1,5,1,0,0]
    ],
    palette: [
      { id: 1, hex: '#1e293b', name: 'Negro' },
      { id: 2, hex: '#fde047', name: 'Crema / Piel' },
      { id: 3, hex: '#000000', name: 'Negro (Ojos)' },
      { id: 4, hex: '#f43f5e', name: 'Boca Rosa' },
      { id: 5, hex: '#ffffff', name: 'Blanco (Botones)' }
    ]
  },
  {
    id: 'stitch',
    name: 'Stitch (Lilo & Stitch)',
    category: 'cine_disney',
    presetGrid: [
      [1,1,0,0,0,0,0,0,1,1],
      [1,1,1,0,0,0,0,1,1,1],
      [0,1,1,2,2,2,2,1,1,0],
      [0,2,2,2,2,2,2,2,2,0],
      [2,2,3,3,2,2,3,3,2,2],
      [2,2,3,4,2,2,3,4,2,2],
      [2,2,2,2,5,5,2,2,2,2],
      [0,2,2,5,5,5,5,2,2,0],
      [0,0,2,2,2,2,2,2,0,0],
      [0,0,2,2,0,0,2,2,0,0]
    ],
    palette: [
      { id: 1, hex: '#f43f5e', name: 'Rosa Orejas' },
      { id: 2, hex: '#2563eb', name: 'Azul Stitch' },
      { id: 3, hex: '#0f172a', name: 'Negro Ojos' },
      { id: 4, hex: '#ffffff', name: 'Blanco Brillo' },
      { id: 5, hex: '#1e40af', name: 'Azul Oscuro Nariz' }
    ]
  },

  // 🦸 Superhéroes & Cine
  {
    id: 'spiderman',
    name: 'Spider-Man (Marvel)',
    category: 'superheroes',
    presetGrid: [
      [0,0,1,1,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,1,1,1],
      [1,1,2,2,1,1,2,2,1,1],
      [1,1,2,2,1,1,2,2,1,1],
      [1,1,1,1,1,1,1,1,1,1],
      [0,1,1,1,1,1,1,1,1,0],
      [0,0,3,3,1,1,3,3,0,0],
      [0,3,3,3,3,3,3,3,3,0],
      [0,3,3,3,3,3,3,3,3,0]
    ],
    palette: [
      { id: 1, hex: '#dc2626', name: 'Rojo Spider-Man' },
      { id: 2, hex: '#ffffff', name: 'Blanco Máscara' },
      { id: 3, hex: '#2563eb', name: 'Azul Traje' }
    ]
  },
  {
    id: 'ironman',
    name: 'Iron Man (Avengers)',
    category: 'superheroes',
    presetGrid: [
      [0,0,1,1,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,1,1,0],
      [1,1,2,2,2,2,2,2,1,1],
      [1,1,2,3,2,2,3,2,1,1],
      [1,1,2,2,2,2,2,2,1,1],
      [0,1,2,2,2,2,2,2,1,0],
      [0,0,1,1,1,1,1,1,0,0],
      [0,1,1,3,3,3,3,1,1,0],
      [1,1,1,3,3,3,3,1,1,1],
      [1,1,1,1,1,1,1,1,1,1]
    ],
    palette: [
      { id: 1, hex: '#991b1b', name: 'Rojo Carmesí Iron Man' },
      { id: 2, hex: '#eab308', name: 'Dorado Máscara' },
      { id: 3, hex: '#38bdf8', name: 'Azul Reactor' }
    ]
  },
  {
    id: 'baby_yoda',
    name: 'Grogu / Baby Yoda (Star Wars)',
    category: 'superheroes',
    presetGrid: [
      [1,1,0,0,0,0,0,0,1,1],
      [1,1,1,0,2,2,0,1,1,1],
      [0,1,1,2,2,2,2,1,1,0],
      [0,0,2,3,2,2,3,2,0,0],
      [0,0,2,2,2,2,2,2,0,0],
      [0,0,0,4,4,4,4,0,0,0],
      [0,0,4,4,4,4,4,4,0,0],
      [0,0,4,4,4,4,4,4,0,0],
      [0,0,4,4,4,4,4,4,0,0],
      [0,0,0,4,4,4,4,0,0,0]
    ],
    palette: [
      { id: 1, hex: '#f472b6', name: 'Rosa Orejas' },
      { id: 2, hex: '#4ade80', name: 'Verde Grogu' },
      { id: 3, hex: '#0f172a', name: 'Negro Ojos' },
      { id: 4, hex: '#d97706', name: 'Marrón Túnica' }
    ]
  },

  // 🎮 Mario, Sonic & Minecraft
  {
    id: 'mario',
    name: 'Super Mario (Nintendo)',
    category: 'videojuegos_cine',
    presetGrid: [
      [0,0,0,1,1,1,1,1,0,0],
      [0,0,1,1,1,1,1,1,1,1],
      [0,0,2,2,2,3,3,2,0,0],
      [0,2,3,2,3,3,3,2,3,3],
      [0,2,3,2,2,3,3,3,2,3],
      [0,2,2,3,3,3,3,2,2,0],
      [0,0,0,3,3,3,3,3,0,0],
      [0,0,1,1,4,1,1,0,0,0],
      [0,1,1,1,4,1,1,1,0,0],
      [1,1,1,1,4,1,1,1,1,0],
      [2,2,1,4,5,4,1,2,2,0],
      [2,2,2,4,4,4,2,2,2,0],
      [0,0,4,4,4,4,4,4,0,0],
      [0,2,2,2,0,0,2,2,2,0],
      [2,2,2,2,0,0,2,2,2,2]
    ],
    palette: [
      { id: 1, hex: '#ef4444', name: 'Rojo Gorra/Camisa' },
      { id: 2, hex: '#78350f', name: 'Marrón Cabello/Zapatos' },
      { id: 3, hex: '#fde047', name: 'Piel Mario' },
      { id: 4, hex: '#2563eb', name: 'Azul Overol' },
      { id: 5, hex: '#eab308', name: 'Amarillo Botones' }
    ]
  },
  {
    id: 'creeper',
    name: 'Creeper (Minecraft)',
    category: 'videojuegos_cine',
    presetGrid: [
      [1,1,1,1,1,1,1,1],
      [1,2,1,1,1,1,2,1],
      [1,1,1,1,1,1,1,1],
      [1,1,3,3,3,3,1,1],
      [1,3,3,3,3,3,3,1],
      [1,3,3,3,3,3,3,1],
      [1,3,1,3,3,1,3,1],
      [1,1,1,3,3,1,1,1]
    ],
    palette: [
      { id: 1, hex: '#22c55e', name: 'Verde Minecraft' },
      { id: 2, hex: '#166534', name: 'Verde Oscuro' },
      { id: 3, hex: '#0f172a', name: 'Negro Creeper' }
    ]
  },
  {
    id: 'sonic',
    name: 'Sonic the Hedgehog',
    category: 'videojuegos_cine',
    presetGrid: [
      [0,0,1,1,1,1,0,0,0],
      [0,1,1,1,1,1,1,1,0],
      [1,1,2,2,1,1,1,1,1],
      [1,2,3,3,2,1,1,1,1],
      [1,2,3,4,2,2,1,1,0],
      [1,2,2,2,2,2,1,0,0],
      [0,1,2,5,2,2,1,0,0],
      [0,0,1,1,1,1,0,0,0]
    ],
    palette: [
      { id: 1, hex: '#2563eb', name: 'Azul Sonic' },
      { id: 2, hex: '#fde047', name: 'Piel Hocico' },
      { id: 3, hex: '#ffffff', name: 'Blanco Ojos' },
      { id: 4, hex: '#22c55e', name: 'Verde Ojo' },
      { id: 5, hex: '#0f172a', name: 'Negro Nariz' }
    ]
  },

  // 📺 Bob Esponja, Minions & Anime
  {
    id: 'bob_esponja',
    name: 'Bob Esponja (Nickelodeon)',
    category: 'anime_cartoons',
    presetGrid: [
      [1,1,1,1,1,1,1,1,1,1],
      [1,2,1,1,1,1,2,1,1,1],
      [1,1,3,3,1,3,3,1,1,1],
      [1,1,3,4,1,3,4,1,1,1],
      [1,1,1,1,1,1,1,1,1,1],
      [1,1,1,5,5,5,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1],
      [6,6,6,6,6,6,6,6,6,6],
      [6,6,7,6,6,7,6,6,6,6],
      [8,8,8,8,8,8,8,8,8,8]
    ],
    palette: [
      { id: 1, hex: '#facc15', name: 'Amarillo Esponja' },
      { id: 2, hex: '#ca8a04', name: 'Poro Oscuro' },
      { id: 3, hex: '#ffffff', name: 'Blanco Ojos' },
      { id: 4, hex: '#38bdf8', name: 'Azul Ojo' },
      { id: 5, hex: '#ef4444', name: 'Boca Roja' },
      { id: 6, hex: '#ffffff', name: 'Camisa Blanca' },
      { id: 7, hex: '#dc2626', name: 'Corbata Roja' },
      { id: 8, hex: '#78350f', name: 'Pantalón Marrón' }
    ]
  },
  {
    id: 'minion',
    name: 'Minion (Mi Villano Favorito)',
    category: 'anime_cartoons',
    presetGrid: [
      [0,0,1,1,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,1,1,0],
      [2,2,3,3,2,2,3,3,2,2],
      [2,3,4,5,3,3,4,5,3,2],
      [0,1,1,1,1,1,1,1,1,0],
      [0,1,1,6,6,6,6,1,1,0],
      [0,1,1,1,1,1,1,1,1,0],
      [0,7,7,7,7,7,7,7,7,0],
      [0,7,7,7,7,7,7,7,7,0],
      [0,7,7,0,0,0,0,7,7,0]
    ],
    palette: [
      { id: 1, hex: '#facc15', name: 'Amarillo Minion' },
      { id: 2, hex: '#475569', name: 'Gris Lentes' },
      { id: 3, hex: '#ffffff', name: 'Blanco Ojo' },
      { id: 4, hex: '#78350f', name: 'Marrón Ojo' },
      { id: 5, hex: '#0f172a', name: 'Negro Pupila' },
      { id: 6, hex: '#000000', name: 'Boca Negra' },
      { id: 7, hex: '#1d4ed8', name: 'Azul Overol' }
    ]
  },
  {
    id: 'goku',
    name: 'Goku (Dragon Ball)',
    category: 'anime_cartoons',
    presetGrid: [
      [1,1,0,1,1,1,1,0,1,1],
      [1,1,1,1,1,1,1,1,1,1],
      [0,1,1,2,2,2,2,1,1,0],
      [0,2,2,2,2,2,2,2,2,0],
      [0,2,3,3,2,2,3,3,2,0],
      [0,2,2,2,4,4,2,2,2,0],
      [0,0,2,2,2,2,2,2,0,0],
      [0,5,5,6,6,6,6,5,5,0],
      [5,5,5,6,6,6,6,5,5,5],
      [5,5,5,5,5,5,5,5,5,5]
    ],
    palette: [
      { id: 1, hex: '#0f172a', name: 'Cabello Negro Goku' },
      { id: 2, hex: '#fde047', name: 'Piel' },
      { id: 3, hex: '#000000', name: 'Negro Ojos' },
      { id: 4, hex: '#ef4444', name: 'Boca' },
      { id: 5, hex: '#ea580c', name: 'Naranja Traje Kame' },
      { id: 6, hex: '#1e40af', name: 'Azul Camiseta' }
    ]
  }
];
