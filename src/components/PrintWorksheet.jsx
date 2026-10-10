import React, { useState } from 'react';
import { Pencil, CheckSquare, Square } from 'lucide-react';

export default function PrintWorksheet({
  gridData,
  paletteWithMath,
  gridWidth,
  gridHeight,
  title,
  onChangeTitle,
  studentName,
  onChangeStudentName,
  showAnswerKey,
  onToggleAnswerKey
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-6xl mx-auto">
      {/* Quick toggle bar visible in browser preview (not printed) */}
      <div className="no-print w-full flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-300">
        <span className="text-slate-400 font-medium">Opciones de Impresión:</span>
        <button
          type="button"
          onClick={onToggleAnswerKey}
          className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-800"
        >
          {showAnswerKey ? (
            <CheckSquare className="w-4 h-4 text-indigo-400 shrink-0" />
          ) : (
            <Square className="w-4 h-4 text-slate-500 shrink-0" />
          )}
          <span className="font-semibold">
            {showAnswerKey ? 'Hoja de solución activada (Pág. 2)' : 'Hoja de solución desactivada (solo Pág. 1)'}
          </span>
        </button>
      </div>

      {/* PAGE 1: Coloring Worksheet - LANDSCAPE (1/3 Left Legend | 2/3 Right PixelArt) */}
      <div className="print-page bg-white p-5 border border-slate-300 shadow-xl rounded-2xl w-full flex flex-col justify-between h-[590px] print:h-screen print:max-h-screen box-border overflow-hidden">
        
        {/* Main Split: Left (1/3 Width Legend & Header) | Right (2/3 Width PixelArt Grid) */}
        <div className="flex flex-row items-stretch gap-5 h-full flex-1 overflow-hidden">
          
          {/* LEFT COLUMN (1/3 Width ~34%): Header Info & Vertical Stack Legend */}
          <div className="w-[34%] flex flex-col justify-between shrink-0 border-r border-slate-200 pr-3 h-full overflow-hidden">
            
            {/* Header info - Ink-friendly minimalist design (No heavy black block) */}
            <div>
              <div className="border-b border-slate-300 pb-2 mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-pixel text-xl font-bold text-slate-800 tracking-wider">
                    PixelMath
                  </span>
                  
                  {/* Editable Title */}
                  <div className="flex-1 min-w-0 flex items-center gap-1.5 group">
                    {isEditingTitle ? (
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => onChangeTitle && onChangeTitle(e.target.value)}
                        onBlur={() => setIsEditingTitle(false)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') setIsEditingTitle(false);
                        }}
                        autoFocus
                        className="text-base font-extrabold text-slate-900 font-heading border border-indigo-400 rounded px-1.5 py-0.5 w-full bg-slate-50 focus:outline-none"
                      />
                    ) : (
                      <div
                        onClick={() => setIsEditingTitle(true)}
                        className="flex items-center gap-1 cursor-pointer truncate"
                        title="Haz clic para editar el título"
                      >
                        <h1 className="text-base font-extrabold text-slate-900 font-heading truncate">
                          {title || 'Colorea por Operación'}
                        </h1>
                        <Pencil className="w-3.5 h-3.5 text-slate-400 no-print opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1 text-xs font-semibold text-slate-800 mt-1.5">
                  <div className="flex items-center gap-1">
                    <span>Alumno:</span>
                    <span className="border-b border-slate-400 inline-block w-[130px] px-1 font-normal text-slate-900">
                      {studentName || '____________'}
                    </span>
                  </div>
                  <div>
                    Fecha: <span className="border-b border-slate-400 inline-block w-[130px] px-1">________________</span>
                  </div>
                </div>
              </div>

              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                Leyenda de Colores
              </h3>
            </div>

            {/* Completely Vertical Legend Stack */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-1.5">
              {paletteWithMath.map((item) => {
                const singleEq = item.equation || (item.equations && item.equations[0]) || `${item.targetValue} + 0`;
                const displayEq = `${singleEq} = ___`;

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-1.5 rounded-lg border border-slate-300 bg-slate-50/70 shadow-sm"
                  >
                    {/* Color Swatch (Clean, NO number inside to avoid cheating!) */}
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded border border-slate-800 shadow-sm shrink-0"
                        style={{
                          backgroundColor: item.hex
                        }}
                      />
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-slate-900 truncate max-w-[85px]">
                          {item.name}
                        </div>
                      </div>
                    </div>

                    {/* Single Math Operation with '= ___' */}
                    <div className="font-mono font-extrabold text-xs text-indigo-950 bg-white px-2 py-0.5 rounded border border-slate-300 shadow-inner whitespace-nowrap">
                      {displayEq}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Instructions Footer */}
            <div className="pt-1.5 border-t border-slate-200 text-[10px] text-slate-500 italic leading-tight shrink-0 mt-1">
              Resuelve cada operación escribiendo el resultado en la línea y pinta las casillas coincidentes.
            </div>
          </div>

          {/* RIGHT COLUMN (2/3 Width ~66%): Large Pixel Art Grid */}
          <div className="w-[66%] flex flex-col items-center justify-center bg-slate-50/60 p-3 rounded-xl border border-slate-200 shrink-0 h-full overflow-hidden">
            <div className="w-full h-full max-w-[480px] max-h-[480px] aspect-square flex items-center justify-center p-1 bg-white border border-slate-400 shadow-sm">
              <div
                className="w-full h-full grid bg-white"
                style={{
                  gridTemplateColumns: `repeat(${gridWidth}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${gridHeight}, minmax(0, 1fr))`,
                  aspectRatio: '1 / 1'
                }}
              >
                {gridData.flatMap((row, rIdx) =>
                  row.map((colorId, cIdx) => {
                    const item = paletteWithMath.find((p) => p.id === colorId);
                    // If color is white or not in active palette, leave cell empty without number
                    const targetNum = item ? item.targetValue : '';

                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className="border-[0.5px] border-slate-400 flex items-center justify-center bg-white text-slate-900 font-mono font-bold select-none p-0 overflow-hidden box-border"
                        style={{
                          aspectRatio: '1 / 1',
                          fontSize: gridWidth <= 12 ? '15px' : gridWidth <= 16 ? '12px' : gridWidth <= 24 ? '9px' : '7px',
                          lineHeight: '1'
                        }}
                      >
                        {targetNum || ''}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* PAGE 2: Answer Key (Hoja de Solución Resuelta - LANDSCAPE 1/3 Left Summary | 2/3 Right Grid) */}
      {showAnswerKey && (
        <div className="print-page bg-white p-5 border border-slate-300 shadow-xl rounded-2xl w-full flex flex-col justify-between h-[590px] print:h-screen print:max-h-screen box-border overflow-hidden">
          
          <div className="flex justify-between items-center border-b border-slate-300 pb-2 mb-2 shrink-0">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                Clave de Respuestas (Página 2)
              </span>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Solución: {title || 'PixelArt Completo'}
              </h2>
            </div>
            <span className="text-xs font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full">
              Vista a Todo Color
            </span>
          </div>

          <div className="flex flex-row items-stretch gap-5 flex-1 overflow-hidden">
            {/* Left Summary Stack (1/3 Width) */}
            <div className="w-[34%] bg-slate-50/60 p-3 rounded-xl border border-slate-200 flex flex-col justify-between shrink-0 h-full overflow-hidden">
              <div className="overflow-y-auto">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-center pb-1.5 border-b border-slate-200 mb-2">
                  Resumen de Solución
                </h4>
                <div className="flex flex-col gap-1.5">
                  {paletteWithMath.map((item) => (
                    <div
                      key={`sol-sum-${item.id}`}
                      className="flex items-center justify-between p-1.5 rounded bg-white border border-slate-200 text-xs font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border border-slate-400 shrink-0"
                          style={{ backgroundColor: item.hex }}
                        />
                        <span className="text-slate-900 truncate max-w-[90px]">{item.name}</span>
                      </div>
                      <span className="font-mono font-bold text-indigo-600"># {item.targetValue}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 text-center shrink-0 pt-1">PixelMath Answer Key</div>
            </div>

            {/* Right Colored Grid (2/3 Width) */}
            <div className="w-[66%] flex items-center justify-center bg-slate-50/60 p-3 rounded-xl border border-slate-200 shrink-0 h-full overflow-hidden">
              <div className="w-full h-full max-w-[480px] max-h-[480px] aspect-square flex items-center justify-center p-1 bg-white border border-slate-400 shadow-sm">
                <div
                  className="w-full h-full grid bg-white"
                  style={{
                    gridTemplateColumns: `repeat(${gridWidth}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${gridHeight}, minmax(0, 1fr))`,
                    aspectRatio: '1 / 1'
                  }}
                >
                  {gridData.flatMap((row, rIdx) =>
                    row.map((colorId, cIdx) => {
                      const item = paletteWithMath.find((p) => p.id === colorId);
                      const bgHex = item ? item.hex : '#ffffff';
                      const targetNum = item ? item.targetValue : '';

                      return (
                        <div
                          key={`sol-${rIdx}-${cIdx}`}
                          className="border-[0.5px] border-slate-300 flex items-center justify-center font-mono font-bold"
                          style={{
                            backgroundColor: bgHex,
                            color: getContrastColor(bgHex),
                            aspectRatio: '1 / 1',
                            fontSize: gridWidth <= 16 ? '12px' : '7.5px'
                          }}
                        >
                          {targetNum || ''}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
