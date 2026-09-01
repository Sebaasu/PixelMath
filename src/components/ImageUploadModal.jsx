import React, { useState } from 'react';
import { X, Upload, Globe, Sliders, AlertCircle, RefreshCw } from 'lucide-react';
import { processImageFile, processImageUrl } from '../imageProcessor';

export default function ImageUploadModal({ isOpen, onClose, onImageProcessed }) {
  const [activeSourceTab, setActiveSourceTab] = useState('file'); // 'file' | 'url'
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [gridSize, setGridSize] = useState(16);
  const [maxColors, setMaxColors] = useState(6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      runFileProcessing(file, gridSize, maxColors);
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      runUrlProcessing(imageUrl.trim(), gridSize, maxColors);
    }
  };

  const runFileProcessing = async (file, size, colors) => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const result = await processImageFile(file, size, size, colors);
      setPreview(result);
    } catch (err) {
      setError(err.message || 'Error al procesar el archivo de imagen.');
    } finally {
      setLoading(false);
    }
  };

  const runUrlProcessing = async (url, size, colors) => {
    if (!url) return;
    setLoading(true);
    setError(null);
    try {
      const result = await processImageUrl(url, size, size, colors);
      setPreview(result);
    } catch (err) {
      setError(err.message || 'Error al procesar la imagen desde la URL.');
    } finally {
      setLoading(false);
    }
  };

  const handleSizeChange = (newSize) => {
    setGridSize(newSize);
    if (activeSourceTab === 'file' && selectedFile) {
      runFileProcessing(selectedFile, newSize, maxColors);
    } else if (activeSourceTab === 'url' && imageUrl) {
      runUrlProcessing(imageUrl, newSize, maxColors);
    }
  };

  const handleColorsChange = (newColors) => {
    setMaxColors(newColors);
    if (activeSourceTab === 'file' && selectedFile) {
      runFileProcessing(selectedFile, gridSize, newColors);
    } else if (activeSourceTab === 'url' && imageUrl) {
      runUrlProcessing(imageUrl, gridSize, newColors);
    }
  };

  const handleConfirm = () => {
    if (preview) {
      onImageProcessed({
        id: 'custom-' + Date.now(),
        name: selectedFile
          ? selectedFile.name.replace(/\.[^/.]+$/, "")
          : 'Imagen Web',
        width: preview.width,
        height: preview.height,
        palette: preview.palette,
        grid: preview.grid
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold font-heading text-slate-800">Importar Imagen o Foto Web</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs: File vs URL */}
        <div className="px-6 pt-4 bg-slate-50 flex gap-2 border-b border-slate-200">
          <button
            onClick={() => {
              setActiveSourceTab('file');
              setPreview(null);
              setError(null);
            }}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-t-xl transition-all ${
              activeSourceTab === 'file'
                ? 'bg-white text-indigo-600 border-t-2 border-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Subir Archivo</span>
          </button>

          <button
            onClick={() => {
              setActiveSourceTab('url');
              setPreview(null);
              setError(null);
            }}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-t-xl transition-all ${
              activeSourceTab === 'url'
                ? 'bg-white text-indigo-600 border-t-2 border-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Pegar URL Web</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* TAB 1: File Upload */}
          {activeSourceTab === 'file' && (
            <div>
              {!selectedFile ? (
                <label className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-indigo-50/30 transition-all text-center">
                  <Upload className="w-10 h-10 text-slate-400 mb-3" />
                  <span className="text-sm font-semibold text-slate-700">Haz clic para elegir un archivo de tu PC</span>
                  <span className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP (Se pixelará automáticamente)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="flex justify-between items-center bg-slate-100 p-2.5 rounded-xl text-xs font-semibold text-slate-700">
                  <span>Archivo: {selectedFile.name}</span>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreview(null);
                    }}
                    className="text-indigo-600 hover:underline"
                  >
                    Cambiar
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Direct URL Import */}
          {activeSourceTab === 'url' && (
            <form onSubmit={handleUrlSubmit} className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                Pega el enlace de la imagen desde internet:
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Ej: https://ejemplo.com/dibujo.png"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={loading || !imageUrl.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl disabled:opacity-50 transition-colors shadow"
                >
                  Cargar URL
                </button>
              </div>
            </form>
          )}

          {/* Controls Sliders */}
          {(selectedFile || preview || activeSourceTab === 'url') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">Resolución Grilla</label>
                  <span className="text-xs font-bold text-indigo-600">{gridSize}x{gridSize} px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="32"
                  step="4"
                  value={gridSize}
                  onChange={(e) => handleSizeChange(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>12x12</span>
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
                  max="10"
                  value={maxColors}
                  onChange={(e) => handleColorsChange(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>3 min</span>
                  <span>6 medio</span>
                  <span>10 max</span>
                </div>
              </div>
            </div>
          )}

          {/* Preview Box */}
          <div className="flex flex-col items-center justify-center min-h-[180px] border border-slate-200 rounded-xl p-4 bg-slate-100">
            {loading ? (
              <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Pixelando imagen...</span>
              </div>
            ) : error ? (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            ) : preview ? (
              <div className="flex flex-col items-center gap-3">
                <div
                  className="border border-slate-300 shadow-md bg-white rounded-lg p-1 overflow-hidden"
                  style={{ width: '160px', height: '160px' }}
                >
                  <div
                    className="grid gap-[0.5px] w-full h-full"
                    style={{
                      gridTemplateColumns: `repeat(${preview.width}, minmax(0, 1fr))`
                    }}
                  >
                    {preview.grid.flatMap((row, rIdx) =>
                      row.map((cellVal, cIdx) => {
                        const colorObj = preview.palette.find(p => p.id === cellVal);
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

                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  {preview.palette.map((p) => (
                    <div
                      key={p.id}
                      className="w-5 h-5 rounded-full border border-slate-300 shadow-sm"
                      style={{ backgroundColor: p.hex }}
                      title={p.name}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <span className="text-xs text-slate-400">Sube un archivo o pega una URL para ver la vista previa</span>
            )}
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
            onClick={handleConfirm}
            disabled={!preview || loading}
            className="px-5 py-2 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow transition-colors"
          >
            Cargar en Editor
          </button>
        </div>
      </div>
    </div>
  );
}
