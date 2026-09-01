import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { PRESETS } from '../presets';

export default function PresetGalleryModal({ isOpen, onClose, onSelectPreset }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold font-heading text-slate-800">Galería de Plantillas Pixel Art</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-4">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                onSelectPreset(preset);
                onClose();
              }}
              className="group flex flex-col items-center p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:ring-2 hover:ring-indigo-100 bg-white hover:bg-indigo-50/20 transition-all text-left"
            >
              {/* Thumbnail rendering */}
              <div className="w-24 h-24 bg-slate-100 rounded-lg p-1 flex items-center justify-center mb-2 overflow-hidden border border-slate-200 group-hover:scale-105 transition-transform">
                <div
                  className="grid gap-[0.5px]"
                  style={{
                    gridTemplateColumns: `repeat(${preset.width}, minmax(0, 1fr))`,
                    width: '100%',
                    height: '100%'
                  }}
                >
                  {preset.grid.flatMap((row, rowIndex) =>
                    row.map((cellValue, colIndex) => {
                      const colorObj = preset.palette.find((p) => p.id === cellValue);
                      return (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          style={{
                            backgroundColor: colorObj ? colorObj.hex : '#ffffff'
                          }}
                        />
                      );
                    })
                  )}
                </div>
              </div>

              <div className="w-full text-center">
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block mb-0.5">
                  {preset.category}
                </span>
                <span className="font-semibold text-slate-800 text-sm block truncate group-hover:text-indigo-600">
                  {preset.name}
                </span>
                <span className="text-xs text-slate-400">
                  {preset.width}x{preset.height} px • {preset.palette.length} colores
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
