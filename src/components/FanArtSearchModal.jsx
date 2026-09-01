import React, { useState, useEffect } from 'react';
import { X, Search, Sparkles, RefreshCw, AlertCircle, Image as ImageIcon, Check } from 'lucide-react';
import { processImageUrl } from '../imageProcessor';

// Popular movie & character search shortcuts
const POPULAR_SEARCHES = [
  { label: '🎬 Disney & Pixar', query: 'pixel art disney' },
  { label: '🕷️ Spider-Man', query: 'pixel art spiderman' },
  { label: '⛏️ Minecraft', query: 'pixel art minecraft' },
  { label: '🌟 Star Wars', query: 'pixel art star wars' },
  { label: '💛 Minions', query: 'pixel art minions' },
  { label: '❄️ Frozen', query: 'pixel art frozen' },
  { label: '🐉 Dragon Ball', query: 'pixel art dragon ball' },
  { label: '🦔 Sonic', query: 'pixel art sonic' },
  { label: '🍄 Super Mario', query: 'pixel art mario' }
];

export default function FanArtSearchModal({ isOpen, onClose, onImageSelected }) {
  const [searchQuery, setSearchQuery] = useState('pixel art disney');
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [gridSize, setGridSize] = useState(24);
  const [maxColors, setMaxColors] = useState(6);
  const [searching, setSearching] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (isOpen && results.length === 0) {
      fetchFanArt('pixel art disney');
    }
  }, [isOpen]);

  const fetchFanArt = async (queryStr) => {
    if (!queryStr.trim()) return;
    setSearching(true);
    setError(null);
    setSelectedResult(null);
    setPreview(null);

    try {
      // Query Openverse Open Media API
      const searchUrl = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(queryStr)}&page_size=16`;
      const res = await fetch(searchUrl);
      if (!res.ok) throw new Error('No se pudieron obtener resultados de la API de Openverse.');
      
      const data = await res.json();
      if (!data.results || data.results.length === 0) {
        throw new Error('No se encontraron imágenes de fan-art para esa búsqueda.');
      }

      const formatted = data.results.map((item) => ({
        id: item.id,
        title: item.title || 'Fan Art',
        url: item.url || item.thumbnail,
        thumbnail: item.thumbnail || item.url,
        creator: item.creator || 'Artista Fan'
      }));

      setResults(formatted);
      if (formatted.length > 0) {
        setSelectedResult(formatted[0]);
        runProcessing(formatted[0].url, gridSize, maxColors);
      }
    } catch (err) {
      setError(err.message || 'Error al buscar en la API de arte fan.');
    } fontally: {
      setSearching(false);
    }
  };

  const runProcessing = async (url, size, colors) => {
    setProcessing(true);
    setError(null);
    try {
      const result = await processImageUrl(url, size, size, colors, true); // autoCrop = true
      setPreview(result);
    } catch (err) {
      setError(err.message || 'Error al procesar la imagen seleccionada.');
    } finally {
      setProcessing(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchFanArt(searchQuery.trim());
    }
  };

  const handleSelectResult = (item) => {
    setSelectedResult(item);
    runProcessing(item.url, gridSize, maxColors);
  };

  const handleSizeChange = (newSize) => {
    setGridSize(newSize);
    if (selectedResult) {
      runProcessing(selectedResult.url, newSize, maxColors);
    }
  };

  const handleColorsChange = (newColors) => {
    setMaxColors(newColors);
    if (selectedResult) {
      runProcessing(selectedResult.url, gridSize, newColors);
    }
  };

  const handleConfirmImport = () => {
    if (preview && selectedResult) {
      onImageSelected({
        id: `fanart-${selectedResult.id}-${Date.now()}`,
        name: selectedResult.title.slice(0, 30),
        width: preview.width,
        height: preview.height,
        palette: preview.palette,
        grid: preview.grid
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold font-heading text-white">Buscador de Fan-Art y Películas (API Openverse)</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Shortcuts */}
        <div className="p-6 space-y-4 border-b border-slate-800 bg-slate-950">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busca cualquier película o personaje (ej: Frozen, Spider-Man, Minions, Minecraft)..."
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-100 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow"
            >
              {searching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Buscar</span>
            </button>
          </form>

          {/* Quick Search Tags */}
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SEARCHES.map((tag) => (
              <button
                key={tag.query}
                onClick={() => {
                  setSearchQuery(tag.query);
                  fetchFanArt(tag.query);
                }}
                className="px-2.5 py-1 bg-slate-900 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-700 rounded-lg text-xs font-semibold text-slate-300 transition-all shadow-sm"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Gallery & Preview */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {searching ? (
            <div className="flex flex-col items-center justify-center py-12 text-indigo-400 gap-2">
              <RefreshCw className="w-8 h-8 animate-spin" />
              <span className="text-sm font-semibold">Buscando arte en la API de Openverse...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center gap-2 text-red-400 py-10 text-sm">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left 2 Cols: Search Results Grid */}
              <div className="md:col-span-2 grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto pr-1">
                {results.map((item) => {
                  const isSelected = selectedResult?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectResult(item)}
                      className={`relative aspect-square rounded-xl overflow-hidden border transition-all ${
                        isSelected
                          ? 'border-indigo-500 ring-2 ring-indigo-500/50 shadow-md'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>

              {/* Right 1 Col: Processed PixelMath Preview */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center min-h-[220px]">
                <span className="text-xs font-bold text-indigo-400 uppercase mb-2">Vista Previa PixelMath</span>
                {processing ? (
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Pixelando...</span>
                  </div>
                ) : preview ? (
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="border border-slate-700 bg-white rounded overflow-hidden shadow-sm"
                      style={{ width: '140px', height: '140px' }}
                    >
                      <div
                        className="grid gap-[0.5px] w-full h-full"
                        style={{
                          gridTemplateColumns: `repeat(${preview.width}, minmax(0, 1fr))`
                        }}
                      >
                        {preview.grid.flatMap((row, rIdx) =>
                          row.map((cellVal, cIdx) => {
                            const colorObj = preview.palette.find((p) => p.id === cellVal);
                            return (
                              <div
                                key={`fan-prev-${rIdx}-${cIdx}`}
                                style={{ backgroundColor: colorObj ? colorObj.hex : '#ffffff' }}
                              />
                            );
                          })
                        )}
                      </div>
                    </div>

                    <div className="flex gap-1 flex-wrap justify-center mt-1">
                      {preview.palette.map((p) => (
                        <div
                          key={p.id}
                          className="w-4 h-4 rounded-full border border-slate-700"
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

          {/* Controls Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">Resolución Grilla</label>
                <span className="text-xs font-bold text-indigo-400">{gridSize}x{gridSize} px</span>
              </div>
              <input
                type="range"
                min="16"
                max="32"
                step="8"
                value={gridSize}
                onChange={(e) => handleSizeChange(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>16x16</span>
                <span>24x24</span>
                <span>32x32</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">Cantidad de Colores</label>
                <span className="text-xs font-bold text-indigo-400">{maxColors} Colores</span>
              </div>
              <input
                type="range"
                min="3"
                max="8"
                value={maxColors}
                onChange={(e) => handleColorsChange(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>3 min</span>
                <span>6 medio</span>
                <span>8 max</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmImport}
            disabled={!preview || processing || searching}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl disabled:opacity-50 shadow transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Cargar en Editor</span>
          </button>
        </div>
      </div>
    </div>
  );
}
