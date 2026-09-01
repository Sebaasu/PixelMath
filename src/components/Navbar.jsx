import React from 'react';
import { Palette, Printer, Image as ImageIcon, Sparkles, Sliders } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenPresets, onOpenUpload, onPrint }) {
  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md font-pixel text-2xl font-bold">
              PM
            </div>
            <div>
              <h1 className="text-xl font-bold font-heading text-slate-900 tracking-wide flex items-center gap-2">
                PixelMath <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-sans font-semibold">Generator</span>
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">Aprende matemáticas coloreando tu Pixel Art favorito</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onOpenPresets}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Plantillas</span>
            </button>

            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <ImageIcon className="w-4 h-4 text-blue-500" />
              <span>Subir Foto</span>
            </button>

            <div className="h-6 w-px bg-slate-200 my-auto hidden sm:block" />

            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('editor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
                  activeTab === 'editor'
                    ? 'bg-white text-indigo-600 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Editor</span>
              </button>

              <button
                onClick={() => setActiveTab('print')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
                  activeTab === 'print'
                    ? 'bg-white text-indigo-600 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Printer className="w-4 h-4" />
                <span>Vista Previa</span>
              </button>
            </div>

            <button
              onClick={onPrint}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium text-xs sm:text-sm rounded-lg shadow hover:from-indigo-500 hover:to-violet-500 transition-all transform active:scale-95"
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
