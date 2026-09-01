import React, { useState } from 'react';
import { X, Film, Sparkles, Check } from 'lucide-react';
import { MOVIE_CHARACTERS, MOVIE_CHARACTER_CATEGORIES } from '../movieCharacters';

export default function MovieCharactersModal({ isOpen, onClose, onCharacterSelected }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCharacter, setSelectedCharacter] = useState(MOVIE_CHARACTERS[0]);

  if (!isOpen) return null;

  const filteredCharacters = selectedCategory === 'all'
    ? MOVIE_CHARACTERS
    : MOVIE_CHARACTERS.filter(c => c.category === selectedCategory);

  const handleConfirmImport = () => {
    if (selectedCharacter) {
      onCharacterSelected({
        id: `movie-${selectedCharacter.id}-${Date.now()}`,
        name: selectedCharacter.name,
        width: selectedCharacter.presetGrid[0].length,
        height: selectedCharacter.presetGrid.length,
        palette: selectedCharacter.palette,
        grid: selectedCharacter.presetGrid
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-pink-400" />
            <h2 className="text-lg font-bold font-heading text-white">Personajes de Películas y Dibujos Animados</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos ({MOVIE_CHARACTERS.length})
          </button>

          {MOVIE_CHARACTER_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Characters Selection Grid & Preview */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Character Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredCharacters.map((char) => {
              const isSelected = selectedCharacter?.id === char.id;
              const gridW = char.presetGrid[0].length;
              const gridH = char.presetGrid.length;

              return (
                <button
                  key={char.id}
                  onClick={() => setSelectedCharacter(char)}
                  className={`flex flex-col items-center p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/70 ring-2 ring-indigo-500/50 shadow-md'
                      : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                  }`}
                >
                  {/* Grid Render Thumbnail */}
                  <div className="w-24 h-24 bg-white rounded-lg p-1 flex items-center justify-center mb-2 overflow-hidden border border-slate-700">
                    <div
                      className="grid gap-[0.5px] w-full h-full"
                      style={{
                        gridTemplateColumns: `repeat(${gridW}, minmax(0, 1fr))`
                      }}
                    >
                      {char.presetGrid.flatMap((row, rIdx) =>
                        row.map((cellVal, cIdx) => {
                          const colorObj = char.palette.find((p) => p.id === cellVal);
                          return (
                            <div
                              key={`${rIdx}-${cIdx}`}
                              style={{ backgroundColor: colorObj ? colorObj.hex : '#ffffff' }}
                            />
                          );
                        })
                      )}
                    </div>
                  </div>

                  <span className="font-bold text-xs text-slate-100 text-center truncate w-full">
                    {char.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {char.palette.length} Colores
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Character Detail & Palette Preview */}
          {selectedCharacter && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                  Personaje Seleccionado
                </span>
                <h3 className="text-base font-extrabold text-white font-heading">
                  {selectedCharacter.name}
                </h3>
                <div className="flex gap-1.5 mt-2">
                  {selectedCharacter.palette.map((p) => (
                    <div
                      key={p.id}
                      className="w-5 h-5 rounded-full border border-slate-700 shadow-sm"
                      style={{ backgroundColor: p.hex }}
                      title={p.name}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleConfirmImport}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Cargar en Editor</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
