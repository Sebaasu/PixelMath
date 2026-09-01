import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import PresetGalleryModal from './components/PresetGalleryModal';
import ImageUploadModal from './components/ImageUploadModal';
import PokemonSearchModal from './components/PokemonSearchModal';
import MovieCharactersModal from './components/MovieCharactersModal';
import FanArtSearchModal from './components/FanArtSearchModal';
import PixelEditor from './components/PixelEditor';
import MathConfigPanel from './components/MathConfigPanel';
import PrintWorksheet from './components/PrintWorksheet';
import { PRESETS } from './presets';
import { generateMathForPalette, DEFAULT_MATH_CONFIG } from './mathEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'print'
  
  // Design state initialized with first preset (Corazón)
  const initialPreset = PRESETS[0];
  const [gridWidth, setGridWidth] = useState(initialPreset.width);
  const [gridHeight, setGridHeight] = useState(initialPreset.height);
  const [gridData, setGridData] = useState(initialPreset.grid);
  const [paletteData, setPaletteData] = useState(initialPreset.palette);
  
  // Math Configuration State
  const [mathConfig, setMathConfig] = useState(DEFAULT_MATH_CONFIG);
  const [worksheetTitle, setWorksheetTitle] = useState(initialPreset.name);
  const [studentName, setStudentName] = useState('');
  const [showAnswerKey, setShowAnswerKey] = useState(true);
  const [mathSeed, setMathSeed] = useState(0);

  // Modals state
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isPokemonOpen, setIsPokemonOpen] = useState(false);
  const [isMovieOpen, setIsMovieOpen] = useState(false);
  const [isFanArtOpen, setIsFanArtOpen] = useState(false);

  // Compute math equations for palette based on current custom config
  const paletteWithMath = useMemo(() => {
    return generateMathForPalette(paletteData, mathConfig);
  }, [paletteData, mathConfig, mathSeed]);

  const handleSelectPreset = (preset) => {
    setGridWidth(preset.width);
    setGridHeight(preset.height);
    setGridData(preset.grid);
    setPaletteData(preset.palette);
    setWorksheetTitle(preset.name);
  };

  const handleImageProcessed = (processed) => {
    setGridWidth(processed.width);
    setGridHeight(processed.height);
    setGridData(processed.grid);
    setPaletteData(processed.palette);
    setWorksheetTitle(processed.name);
  };

  const handleDimensionsChange = (newSize) => {
    setGridWidth(newSize);
    setGridHeight(newSize);
    
    const newGrid = Array.from({ length: newSize }, (_, r) =>
      Array.from({ length: newSize }, (_, c) =>
        gridData[r] && gridData[r][c] !== undefined ? gridData[r][c] : 0
      )
    );
    setGridData(newGrid);
  };

  const handlePrint = () => {
    setActiveTab('print');
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenPokemon={() => setIsPokemonOpen(true)}
        onOpenMovieCharacters={() => setIsMovieOpen(true)}
        onOpenFanArt={() => setIsFanArtOpen(true)}
        onPrint={handlePrint}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Math Settings Config Bar */}
        <MathConfigPanel
          mathConfig={mathConfig}
          onChangeMathConfig={setMathConfig}
          worksheetTitle={worksheetTitle}
          onChangeTitle={setWorksheetTitle}
          studentName={studentName}
          onChangeStudentName={setStudentName}
          showAnswerKey={showAnswerKey}
          onToggleAnswerKey={() => setShowAnswerKey(!showAnswerKey)}
          onRegenerateMath={() => setMathSeed((s) => s + 1)}
        />

        {/* Tab 1: Editor View */}
        {activeTab === 'editor' && (
          <div className="no-print space-y-6">
            <PixelEditor
              gridData={gridData}
              paletteData={paletteData}
              onChangeGrid={setGridData}
              onChangePalette={setPaletteData}
              gridWidth={gridWidth}
              gridHeight={gridHeight}
              onChangeDimensions={handleDimensionsChange}
            />

            {/* Switch to preview button banner */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between shadow-lg gap-4">
              <div>
                <h3 className="text-lg font-bold font-heading">¿Listo para ver tu hoja impresa en Horizontal (Landscape)?</h3>
                <p className="text-sm opacity-90">
                  Revisa el diseño aprovechado a 2 columnas con el arte a la derecha (2/3 de hoja) y la leyenda vertical a la izquierda.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('print')}
                className="px-5 py-2.5 bg-white text-indigo-900 font-bold rounded-xl shadow hover:bg-indigo-50 transition-colors shrink-0"
              >
                Ir a Vista Previa e Impresión
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Print & Preview View */}
        {activeTab === 'print' && (
          <div className="py-4">
            <PrintWorksheet
              gridData={gridData}
              paletteWithMath={paletteWithMath}
              gridWidth={gridWidth}
              gridHeight={gridHeight}
              title={worksheetTitle}
              studentName={studentName}
              showAnswerKey={showAnswerKey}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <PresetGalleryModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      <ImageUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onImageProcessed={handleImageProcessed}
      />

      <PokemonSearchModal
        isOpen={isPokemonOpen}
        onClose={() => setIsPokemonOpen(false)}
        onPokemonSelected={handleImageProcessed}
      />

      <MovieCharactersModal
        isOpen={isMovieOpen}
        onClose={() => setIsMovieOpen(false)}
        onCharacterSelected={handleImageProcessed}
      />

      <FanArtSearchModal
        isOpen={isFanArtOpen}
        onClose={() => setIsFanArtOpen(false)}
        onImageSelected={handleImageProcessed}
      />
    </div>
  );
}
