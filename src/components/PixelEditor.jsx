import React, { useState } from 'react';
import { Paintbrush, PaintBucket, Eraser, Plus, Trash2, RotateCcw, Grid } from 'lucide-react';

export default function PixelEditor({
  gridData,
  paletteData,
  onChangeGrid,
  onChangePalette,
  gridWidth,
  gridHeight,
  onChangeDimensions
}) {
  const [activeColorId, setActiveColorId] = useState(1);
  const [tool, setTool] = useState('pencil'); // 'pencil', 'bucket', 'eraser'
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleCellClick = (rIdx, cIdx) => {
    applyTool(rIdx, cIdx);
  };

  const handleMouseEnter = (rIdx, cIdx) => {
    if (isMouseDown && tool !== 'bucket') {
      applyTool(rIdx, cIdx);
    }
  };

  const applyTool = (rIdx, cIdx) => {
    const newGrid = gridData.map((row) => [...row]);

    if (tool === 'eraser') {
      newGrid[rIdx][cIdx] = 0;
    } else if (tool === 'pencil') {
      newGrid[rIdx][cIdx] = activeColorId;
    } else if (tool === 'bucket') {
      const targetVal = newGrid[rIdx][cIdx];
      if (targetVal !== activeColorId) {
        floodFill(newGrid, rIdx, cIdx, targetVal, activeColorId);
      }
    }

    onChangeGrid(newGrid);
  };

  const floodFill = (grid, r, c, targetColor, replacementColor) => {
    if (r < 0 || r >= gridHeight || c < 0 || c >= gridWidth) return;
    if (grid[r][c] !== targetColor) return;

    grid[r][c] = replacementColor;

    floodFill(grid, r + 1, c, targetColor, replacementColor);
    floodFill(grid, r - 1, c, targetColor, replacementColor);
    floodFill(grid, r, c + 1, targetColor, replacementColor);
    floodFill(grid, r, c - 1, targetColor, replacementColor);
  };

  const handleClearGrid = () => {
    const emptyGrid = Array.from({ length: gridHeight }, () =>
      Array.from({ length: gridWidth }, () => 0)
    );
    onChangeGrid(emptyGrid);
  };

  const handleColorHexChange = (id, newHex) => {
    const newPalette = paletteData.map((p) =>
      p.id === id ? { ...p, hex: newHex } : p
    );
    onChangePalette(newPalette);
  };

  const handleAddColor = () => {
    const newId = paletteData.length > 0 ? Math.max(...paletteData.map((p) => p.id)) + 1 : 1;
    const defaultHexes = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];
    const nextHex = defaultHexes[newId % defaultHexes.length];
    
    const newPalette = [
      ...paletteData,
      { id: newId, hex: nextHex, name: `Color ${newId}` }
    ];
    onChangePalette(newPalette);
    setActiveColorId(newId);
  };

  const handleRemoveColor = (id) => {
    if (paletteData.length <= 2) {
      alert('Se necesitan al menos 2 colores en la paleta.');
      return;
    }
    const newPalette = paletteData.filter((p) => p.id !== id);
    onChangePalette(newPalette);
    if (activeColorId === id) {
      setActiveColorId(newPalette[0].id);
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-md flex flex-col lg:flex-row gap-8 text-slate-100">
      {/* Left: Interactive Pixel Grid Canvas */}
      <div className="flex-1 flex flex-col items-center">
        {/* Editor Toolbar Header */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800">
          {/* Tool selectors */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl gap-1 border border-slate-800">
            <button
              onClick={() => setTool('pencil')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                tool === 'pencil' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Paintbrush className="w-4 h-4" />
              <span>Pincel</span>
            </button>
            <button
              onClick={() => setTool('bucket')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                tool === 'bucket' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <PaintBucket className="w-4 h-4" />
              <span>Relleno</span>
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                tool === 'eraser' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eraser className="w-4 h-4" />
              <span>Borrador</span>
            </button>
          </div>

          {/* Canvas Size and Reset */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-300">
              <Grid className="w-4 h-4 text-slate-400" />
              <span>Tamaño:</span>
              <select
                value={gridWidth}
                onChange={(e) => onChangeDimensions(Number(e.target.value))}
                className="bg-slate-800 border border-slate-700 text-xs rounded-lg px-2 py-1 font-semibold text-slate-200 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value={12}>12 x 12</option>
                <option value={16}>16 x 16</option>
                <option value={24}>24 x 24</option>
                <option value={32}>32 x 32</option>
              </select>
            </div>

            <button
              onClick={handleClearGrid}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
              title="Limpiar todo el lienzo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          </div>
        </div>

        {/* The Grid Canvas Container with strict 1:1 aspect ratio per cell */}
        <div
          className="select-none bg-slate-950 p-2.5 rounded-2xl shadow-xl border border-slate-800 touch-none max-w-full overflow-auto"
          onMouseDown={() => setIsMouseDown(true)}
          onMouseUp={() => setIsMouseDown(false)}
          onMouseLeave={() => setIsMouseDown(false)}
        >
          <div
            className="grid bg-slate-800 border border-slate-700 shadow-inner"
            style={{
              gridTemplateColumns: `repeat(${gridWidth}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${gridHeight}, minmax(0, 1fr))`,
              width: gridWidth <= 16 ? '340px' : gridWidth <= 24 ? '400px' : '440px',
              height: gridWidth <= 16 ? '340px' : gridWidth <= 24 ? '400px' : '440px',
              aspectRatio: '1 / 1'
            }}
          >
            {gridData.flatMap((row, rIdx) =>
              row.map((colorId, cIdx) => {
                const colorObj = paletteData.find((p) => p.id === colorId);
                const bgHex = colorObj ? colorObj.hex : '#ffffff';

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    onMouseDown={() => handleCellClick(rIdx, cIdx)}
                    onMouseEnter={() => handleMouseEnter(rIdx, cIdx)}
                    className="cursor-pointer transition-colors relative flex items-center justify-center font-mono text-[9px] font-bold select-none border-[0.5px] border-slate-700/60 hover:opacity-80"
                    style={{
                      backgroundColor: bgHex,
                      aspectRatio: '1 / 1'
                    }}
                  >
                    {/* Show palette number if not blank */}
                    {colorId !== 0 && (
                      <span
                        className="pointer-events-none drop-shadow-sm opacity-70"
                        style={{
                          color: getContrastColor(bgHex),
                          fontSize: gridWidth <= 16 ? '10px' : gridWidth <= 24 ? '8px' : '6px'
                        }}
                      >
                        {colorId}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">Haz clic o arrastra sobre los píxeles para pintar</p>
      </div>

      {/* Right: Color Palette Control */}
      <div className="w-full lg:w-72 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-700">
            <h3 className="font-bold text-sm font-heading text-slate-200">Paleta de Colores</h3>
            <button
              onClick={handleAddColor}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-300 hover:text-indigo-200 bg-indigo-950/60 border border-indigo-700/50 px-2 py-1 rounded-lg"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Color</span>
            </button>
          </div>

          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {paletteData.map((colorItem) => {
              const isActive = activeColorId === colorItem.id && tool !== 'eraser';
              return (
                <div
                  key={colorItem.id}
                  onClick={() => {
                    setActiveColorId(colorItem.id);
                    if (tool === 'eraser') setTool('pencil');
                  }}
                  className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-all ${
                    isActive
                      ? 'border-indigo-500 bg-slate-900 ring-2 ring-indigo-500/30 shadow-sm'
                      : 'border-slate-700/80 bg-slate-900/60 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative group">
                      <input
                        type="color"
                        value={colorItem.hex}
                        onChange={(e) => handleColorHexChange(colorItem.id, e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 overflow-hidden"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-100">ID #{colorItem.id}</span>
                        <span className="text-[10px] text-slate-400 font-mono uppercase">{colorItem.hex}</span>
                      </div>
                      <span className="text-[11px] text-slate-300 font-medium">{colorItem.name}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveColor(colorItem.id);
                    }}
                    className="p-1 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                    title="Eliminar este color"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-700/60 text-center">
          <p className="text-xs text-slate-400">
            Cada ID de color corresponderá a un resultado matemático en la leyenda final.
          </p>
        </div>
      </div>
    </div>
  );
}

function getContrastColor(hexcolor) {
  if (!hexcolor || hexcolor === '#ffffff') return '#000000';
  const hex = hexcolor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#ffffff';
}
