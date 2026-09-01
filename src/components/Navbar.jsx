import React from 'react';
import { Palette, Printer, Image as ImageIcon, Sparkles, Zap, Film } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenPresets,
  onOpenUpload,
  onOpenPokemon,
  onOpenMovieCharacters,
  onPrint
}) {
  return (
    <header className="no-print bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md font-pixel text-2xl font-bold">
              PM
            </div>
            <div>
              <h1 className="text-xl font-bold font-heading text-white tracking-wide flex items-center gap-2">
                PixelMath <span className="text-xs bg-indigo-900/80 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded-full font-sans font-semibold">Generator</span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">Aprende matemáticas coloreando tu Pixel Art favorito</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onOpenMovieCharacters}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-pink-300 bg-pink-950/40 hover:bg-pink-900/60 border border-pink-700/50 rounded-xl transition-all shadow-sm"
              title="Personajes de Películas (Mickey, Stitch, Spider-Man, Mario, Bob Esponja, Grogu)"
            >
              <Film className="w-4 h-4 text-pink-400" />
              <span className="hidden sm:inline">Películas</span>
            </button>

            <button
              onClick={onOpenPokemon}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-700/50 rounded-xl transition-all shadow-sm"
              title="Buscar sprites de Pokémon en PokeAPI"
            >
              <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="hidden sm:inline">Pokémon</span>
            </button>

            <button
              onClick={onOpenPresets}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Plantillas</span>
            </button>

            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
            >
              <ImageIcon className="w-4 h-4 text-blue-400" />
              <span>Subir / URL</span>
            </button>

            <div className="h-6 w-px bg-slate-800 my-auto hidden sm:block" />

            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('editor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                  activeTab === 'editor'
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Editor</span>
              </button>

              <button
                onClick={() => setActiveTab('print')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                  activeTab === 'print'
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Printer className="w-4 h-4" />
                <span>Vista Previa</span>
              </button>
            </div>

            <button
              onClick={onPrint}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium text-xs sm:text-sm rounded-xl shadow hover:from-indigo-500 hover:to-violet-500 transition-all transform active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir PDF</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
