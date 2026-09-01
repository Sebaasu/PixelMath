import React from 'react';
import { BookOpen, RefreshCw, CheckSquare, Square, Sliders, Sparkles } from 'lucide-react';
import { MATH_PRESETS } from '../mathEngine';

export default function MathConfigPanel({
  mathConfig,
  onChangeMathConfig,
  worksheetTitle,
  onChangeTitle,
  studentName,
  onChangeStudentName,
  showAnswerKey,
  onToggleAnswerKey,
  onRegenerateMath
}) {
  const handleOperatorToggle = (op) => {
    const currentOps = mathConfig.operators || ['+'];
    let newOps;
    if (currentOps.includes(op)) {
      if (currentOps.length === 1) return;
      newOps = currentOps.filter((o) => o !== op);
    } else {
      newOps = [...currentOps, op];
    }
    onChangeMathConfig({ ...mathConfig, operators: newOps });
  };

  const handleApplyPreset = (presetId) => {
    const preset = MATH_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      onChangeMathConfig({ ...preset.config });
    }
  };

  return (
    <div className="no-print bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold font-heading text-slate-800">
            Personalización de Operaciones Matemáticas y Hoja
          </h2>
        </div>

        {/* Quick Presets Dropdown */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-semibold text-slate-600">Plantillas Rápidas:</span>
          <select
            onChange={(e) => handleApplyPreset(e.target.value)}
            className="bg-slate-100 border-none text-xs rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            defaultValue=""
          >
            <option value="" disabled>Seleccionar Nivel Escolar...</option>
            {MATH_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Allowed Operations Checkboxes */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Operaciones Permitidas
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: '+', label: 'Suma (+)' },
              { id: '-', label: 'Resta (-)' },
              { id: '×', label: 'Multiplicación (×)' },
              { id: '÷', label: 'División (÷)' }
            ].map((op) => {
              const isChecked = mathConfig.operators?.includes(op.id);
              return (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => handleOperatorToggle(op.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                    isChecked
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span>{op.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Column 2: Custom Number Range & Equations Count */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Rango de Números y Leyenda
          </label>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mínimo Valor</label>
              <input
                type="number"
                min="1"
                max="50"
                value={mathConfig.minTarget}
                onChange={(e) =>
                  onChangeMathConfig({ ...mathConfig, minTarget: Math.max(1, Number(e.target.value)) })
                }
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Máximo Valor</label>
              <input
                type="number"
                min="5"
                max="200"
                value={mathConfig.maxTarget}
                onChange={(e) =>
                  onChangeMathConfig({ ...mathConfig, maxTarget: Math.max(mathConfig.minTarget + 1, Number(e.target.value)) })
                }
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Operaciones por cada Color en Leyenda
            </label>
            <select
              value={mathConfig.equationsCount}
              onChange={(e) =>
                onChangeMathConfig({ ...mathConfig, equationsCount: Number(e.target.value) })
              }
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800"
            >
              <option value={1}>1 operación por color (Recomendado)</option>
              <option value={2}>2 operaciones por color</option>
              <option value={3}>3 operaciones por color</option>
            </select>
          </div>
        </div>

        {/* Column 3: Header Texts & Answer Key */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Título del Dibujo / Hoja
              </label>
              <input
                type="text"
                value={worksheetTitle}
                onChange={(e) => onChangeTitle(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Nombre del Alumno
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => onChangeStudentName(e.target.value)}
                placeholder="Nombre..."
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800"
              />
            </div>

            <button
              type="button"
              onClick={onToggleAnswerKey}
              className="flex items-center gap-2 text-xs font-medium text-slate-700 hover:text-indigo-600 transition-colors pt-1"
            >
              {showAnswerKey ? (
                <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-400 shrink-0" />
              )}
              <span>Incluir Hoja de Solución a color (Pág. 2)</span>
            </button>
          </div>

          <button
            onClick={onRegenerateMath}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors w-full shadow"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Regenerar Operaciones</span>
          </button>
        </div>
      </div>
    </div>
  );
}
