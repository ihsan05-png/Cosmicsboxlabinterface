import { useState } from 'react';
import { Sparkles, Download, Grid3x3 } from 'lucide-react';
import { generateAffineSBox } from '../utils/sboxCrypto';
import { motion } from 'motion/react';

interface GeneratorPanelProps {
  activeSBox: number[] | null;
  setActiveSBox: (sbox: number[]) => void;
}

export function GeneratorPanel({ activeSBox, setActiveSBox }: GeneratorPanelProps) {
  const [matrix, setMatrix] = useState<number[][] | null>(null);
  const [vector, setVector] = useState<number[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const { sbox, matrix: m, vector: v } = generateAffineSBox();
      setActiveSBox(sbox);
      setMatrix(m);
      setVector(v);
      setIsGenerating(false);
    }, 800);
  };

  const handleDownload = () => {
    if (!activeSBox) return;

    const data = {
      sbox: activeSBox,
      matrix,
      vector,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cosmic-sbox-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl tracking-[0.2em] text-slate-100 mb-3">S-BOX GENERATOR</h2>
        <p className="text-slate-400/70 tracking-wide">
          Generate cryptographically strong substitution boxes using affine transformations
        </p>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <motion.button
          onClick={handleGenerate}
          disabled={isGenerating}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`group relative px-8 py-3 rounded-lg bg-gradient-to-r from-amber-500/20 to-amber-600/20 
            border border-amber-500/30 hover:border-amber-400/50
            transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <div className="flex items-center gap-3">
            <Sparkles className={`w-4 h-4 text-amber-400 ${isGenerating ? 'animate-spin' : ''}`} />
            <span className="text-sm tracking-wider text-slate-200">
              {isGenerating ? 'Generating...' : 'Generate New S-Box'}
            </span>
          </div>
        </motion.button>
      </div>

      {/* Results */}
      {activeSBox && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Affine Matrix */}
          {matrix && (
            <div className="bg-white/5 rounded-lg p-6 border border-cyan-400/20">
              <div className="flex items-center gap-2 mb-4">
                <Grid3x3 className="w-4 h-4 text-cyan-400/60" />
                <h3 className="text-sm text-cyan-300/80 tracking-wider uppercase">Affine Matrix (8×8)</h3>
              </div>
              <div className="grid grid-cols-8 gap-1 font-mono text-xs">
                {matrix.map((row, i) => (
                  row.map((val, j) => (
                    <div
                      key={`${i}-${j}`}
                      className="bg-black/30 border border-cyan-500/10 p-2 text-center rounded text-cyan-200/70 
                        hover:border-cyan-400/30 hover:bg-cyan-500/5 transition-all"
                    >
                      {val}
                    </div>
                  ))
                ))}
              </div>
            </div>
          )}

          {/* Vector */}
          {vector && (
            <div className="bg-white/5 rounded-lg p-6 border border-blue-400/20">
              <h3 className="text-sm text-blue-300/80 tracking-wider uppercase mb-4">Affine Vector (8-bit)</h3>
              <div className="grid grid-cols-8 gap-2 font-mono text-sm">
                {vector.map((val, i) => (
                  <div
                    key={i}
                    className="bg-black/30 border border-blue-500/10 p-3 text-center rounded text-blue-200/70
                      hover:border-blue-400/30 hover:bg-blue-500/5 transition-all"
                  >
                    {val}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* S-Box Grid */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-cyan-300/80 tracking-wider uppercase">Generated S-Box (16×16)</h3>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30
                  rounded-lg hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 text-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <div className="grid grid-cols-16 gap-0.5 font-mono text-xs min-w-max">
                {activeSBox.map((val, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.001 }}
                    className="bg-black/30 border border-white/5 p-2 text-center 
                      hover:border-cyan-400/40 hover:bg-cyan-500/5 
                      transition-all duration-200 text-cyan-100/60"
                  >
                    {val.toString(16).toUpperCase().padStart(2, '0')}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {!activeSBox && (
        <div className="text-center py-16 text-cyan-300/30">
          <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="text-sm">No S-Box generated yet</p>
        </div>
      )}
    </div>
  );
}