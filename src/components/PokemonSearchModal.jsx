import React, { useState, useEffect } from 'react';
import { X, Search, Zap, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { processImageUrl } from '../imageProcessor';

// Popular default Pokémon choices for quick selection
const POPULAR_POKEMON = [
  { id: 25, name: 'Pikachu', color: '#facc15' },
  { id: 4, name: 'Charmander', color: '#f97316' },
  { id: 7, name: 'Squirtle', color: '#38bdf8' },
  { id: 1, name: 'Bulbasaur', color: '#4ade80' },
  { id: 133, name: 'Eevee', color: '#b45309' },
  { id: 94, name: 'Gengar', color: '#8b5cf6' },
  { id: 143, name: 'Snorlax', color: '#0f766e' },
  { id: 6, name: 'Charizard', color: '#ea580c' },
  { id: 39, name: 'Jigglypuff', color: '#f472b6' },
  { id: 150, name: 'Mewtwo', color: '#a855f7' },
  { id: 448, name: 'Lucario', color: '#0284c7' },
  { id: 658, name: 'Greninja', color: '#1d4ed8' }
];

export default function PokemonSearchModal({ isOpen, onClose, onPokemonSelected }) {
  const [query, setQuery] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [gridSize, setGridSize] = useState(24);
  const [maxColors, setMaxColors] = useState(6);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [processedPreview, setProcessedPreview] = useState(null);

  useEffect(() => {
    if (isOpen && !selectedPokemon) {
      fetchPokemon(25); // Default to Pikachu
    }
  }, [isOpen]);

  const fetchPokemon = async (idOrName) => {
    if (!idOrName) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${String(idOrName).toLowerCase()}`);
      if (!res.ok) throw new Error('Pokémon no encontrado en la Pokédex.');
      const data = await res.json();
      
      // Extract official 8-bit sprite URL
      const spriteUrl =
        data.sprites.front_default ||
        data.sprites.other?.['official-artwork']?.front_default;

      if (!spriteUrl) throw new Error('No se encontró sprite gráfico para este Pokémon.');

      const pokemonObj = {
        id: data.id,
        name: capitalize(data.name),
        spriteUrl,
        types: data.types.map((t) => t.type.name)
      };

      setSelectedPokemon(pokemonObj);
      runSpriteProcessing(pokemonObj.spriteUrl, gridSize, maxColors);
    } catch (err) {
      setError(err.message || 'Error al buscar Pokémon en PokeAPI.');
    } finally {
      setLoading(false);
    }
  };

  const runSpriteProcessing = async (url, size, colors) => {
    setProcessing(true);
    setError(null);
    try {
      const result = await processImageUrl(url, size, size, colors);
      setProcessedPreview(result);
    } catch (err) {
      setError(err.message || 'Error al procesar el sprite del Pokémon.');
    } finally {
      setProcessing(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      fetchPokemon(query.trim());
    }
  };

  const handleSizeChange = (newSize) => {
    setGridSize(newSize);
    if (selectedPokemon) {
      runSpriteProcessing(selectedPokemon.spriteUrl, newSize, maxColors);
    }
  };

  const handleColorsChange = (newColors) => {
    setMaxColors(newColors);
    if (selectedPokemon) {
      runSpriteProcessing(selectedPokemon.spriteUrl, gridSize, newColors);
    }
  };

  const handleConfirmImport = () => {
    if (processedPreview && selectedPokemon) {
      onPokemonSelected({
        id: `poke-${selectedPokemon.id}-${Date.now()}`,
        name: `Pokémon: ${selectedPokemon.name}`,
        width: processedPreview.width,
        height: processedPreview.height,
        palette: processedPreview.palette,
        grid: processedPreview.grid
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-red-500 to-rose-600 text-white">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 fill-yellow-300 text-yellow-300" />
            <h2 className="text-lg font-bold font-heading">Buscador Pokédex de Sprites (PokeAPI)</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Quick Picks */}
        <div className="p-6 space-y-4 border-b border-slate-100 bg-slate-50">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busca por nombre o número de Pokédex (ej: Pikachu, Charmander, 150)..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Buscar</span>
            </button>
          </form>

          {/* Quick Selection Buttons */}
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Populares en 1 Clic:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_POKEMON.map((p) => (
                <button
                  key={p.id}
                  onClick={() => fetchPokemon(p.id)}
                  className="px-2.5 py-1 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-300 rounded-lg text-xs font-semibold text-slate-700 transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Body & Preview */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {selectedPokemon && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Left: Original Sprite View */}
              <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 flex flex-col items-center justify-center min-h-[220px]">
                <span className="text-xs font-bold text-slate-500 uppercase mb-2">Sprite Original (8-Bit)</span>
                {loading ? (
                  <RefreshCw className="w-8 h-8 text-red-500 animate-spin" />
                ) : (
                  <>
                    <img
                      src={selectedPokemon.spriteUrl}
                      alt={selectedPokemon.name}
                      className="w-32 h-32 object-contain image-rendering-pixelated drop-shadow-md"
                    />
                    <div className="text-center mt-2">
                      <span className="font-bold text-sm text-slate-900">
                        #{selectedPokemon.id} {selectedPokemon.name}
                      </span>
                      <div className="flex gap-1 justify-center mt-1">
                        {selectedPokemon.types.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Right: Quantized PixelMath Preview */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col items-center justify-center min-h-[220px]">
                <span className="text-xs font-bold text-indigo-600 uppercase mb-2">Vista Previa PixelMath</span>
                {processing ? (
                  <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Pixelando sprite...</span>
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                ) : processedPreview ? (
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="border border-slate-400 bg-white rounded shadow-sm overflow-hidden"
                      style={{ width: '140px', height: '140px' }}
                    >
                      <div
                        className="grid gap-[0.5px] w-full h-full"
                        style={{
                          gridTemplateColumns: `repeat(${processedPreview.width}, minmax(0, 1fr))`
                        }}
                      >
                        {processedPreview.grid.flatMap((row, rIdx) =>
                          row.map((cellVal, cIdx) => {
                            const colorObj = processedPreview.palette.find((p) => p.id === cellVal);
                            return (
                              <div
                                key={`poke-prev-${rIdx}-${cIdx}`}
                                style={{ backgroundColor: colorObj ? colorObj.hex : '#ffffff' }}
                              />
                            );
                          })
                        )}
                      </div>
                    </div>

                    <div className="flex gap-1 flex-wrap justify-center mt-1">
                      {processedPreview.palette.map((p) => (
                        <div
                          key={p.id}
                          className="w-4 h-4 rounded-full border border-slate-400"
                          style={{ backgroundColor: p.hex }}
                          title={p.name}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Controls: Resolution & Colors Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">Resolución de Grilla</label>
                <span className="text-xs font-bold text-indigo-600">{gridSize}x{gridSize} px</span>
              </div>
              <input
                type="range"
                min="16"
                max="32"
                step="8"
                value={gridSize}
                onChange={(e) => handleSizeChange(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>16x16</span>
                <span>24x24</span>
                <span>32x32</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">Cantidad de Colores</label>
                <span className="text-xs font-bold text-indigo-600">{maxColors} Colores</span>
              </div>
              <input
                type="range"
                min="3"
                max="8"
                value={maxColors}
                onChange={(e) => handleColorsChange(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>3 min</span>
                <span>6 medio</span>
                <span>8 max</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmImport}
            disabled={!processedPreview || processing || loading}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow transition-colors"
          >
            Cargar Pokémon en Editor
          </button>
        </div>
      </div>
    </div>
  );
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
