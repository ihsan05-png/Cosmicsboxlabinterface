import { useState } from 'react';
import { Lock, Unlock, Zap, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { aesEncrypt, aesDecrypt } from '../utils/aes';

interface CipherPanelProps {
  activeSBox: number[] | null;
}

export function CipherPanel({ activeSBox }: CipherPanelProps) {
  const [plaintext, setPlaintext] = useState('');
  const [key, setKey] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [decrypted, setDecrypted] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [useCustomSBox, setUseCustomSBox] = useState(true);

  const handleEncrypt = () => {
    if (!plaintext || !key) {
      alert('Please provide both plaintext and key');
      return;
    }

    setIsEncrypting(true);

    setTimeout(() => {
      try {
        const encrypted = aesEncrypt(
          plaintext,
          key,
          useCustomSBox && activeSBox ? activeSBox : undefined
        );
        setCiphertext(encrypted);
        setDecrypted('');
      } catch (error) {
        alert('Encryption error: ' + (error as Error).message);
      } finally {
        setIsEncrypting(false);
      }
    }, 500);
  };

  const handleDecrypt = () => {
    if (!ciphertext || !key) {
      alert('Please provide both ciphertext and key');
      return;
    }

    setIsDecrypting(true);

    setTimeout(() => {
      try {
        const decryptedText = aesDecrypt(
          ciphertext,
          key,
          useCustomSBox && activeSBox ? activeSBox : undefined
        );
        setDecrypted(decryptedText);
      } catch (error) {
        alert('Decryption error: ' + (error as Error).message);
      } finally {
        setIsDecrypting(false);
      }
    }, 500);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl tracking-[0.2em] text-slate-100 mb-3">CIPHER DEMO</h2>
        <p className="text-slate-400/70 tracking-wide">
          AES-128 encryption with custom S-Box support
        </p>
      </div>

      {/* S-Box Selector */}
      <div className="bg-white/5 rounded-lg p-6 border border-amber-500/20">
        <h3 className="text-sm text-amber-300/80 tracking-wider uppercase mb-4">S-Box Configuration</h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              checked={useCustomSBox}
              onChange={() => setUseCustomSBox(true)}
              disabled={!activeSBox}
              className="w-4 h-4 accent-amber-500"
            />
            <span className={`text-sm ${useCustomSBox ? 'text-slate-200' : 'text-slate-500'}`}>
              Custom S-Box {!activeSBox && '(Generate first)'}
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              checked={!useCustomSBox}
              onChange={() => setUseCustomSBox(false)}
              className="w-4 h-4 accent-amber-500"
            />
            <span className={`text-sm ${!useCustomSBox ? 'text-slate-200' : 'text-slate-500'}`}>
              AES Standard S-Box
            </span>
          </label>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Encryption Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 rounded-lg p-6 border border-cyan-400/20"
        >
          <div className="flex items-center gap-2 mb-5">
            <Lock className="w-4 h-4 text-cyan-400/60" />
            <h3 className="text-sm text-cyan-300/80 tracking-wider uppercase">Encryption</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400/60 mb-2 uppercase tracking-wider">Plaintext</label>
              <textarea
                value={plaintext}
                onChange={(e) => setPlaintext(e.target.value)}
                placeholder="Enter message to encrypt..."
                rows={3}
                className="w-full bg-black/30 border border-slate-600/20 rounded-lg px-4 py-3 text-sm text-slate-100/80 
                  placeholder-slate-500/30 focus:outline-none focus:border-cyan-400/40 
                  transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400/60 mb-2 uppercase tracking-wider">Key (16 characters)</label>
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter 16-character key..."
                maxLength={16}
                className="w-full bg-black/30 border border-slate-600/20 rounded-lg px-4 py-3 text-sm text-slate-100/80 
                  placeholder-slate-500/30 focus:outline-none focus:border-cyan-400/40 transition-all"
              />
              <div className="text-xs text-cyan-400/40 mt-1.5">{key.length}/16</div>
            </div>

            <motion.button
              onClick={handleEncrypt}
              disabled={isEncrypting || !plaintext || !key}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500/10 border border-cyan-500/30
                rounded-lg hover:bg-cyan-500/20 hover:border-cyan-400/40
                transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
            >
              <Lock className={`w-4 h-4 ${isEncrypting ? 'animate-pulse' : ''}`} />
              <span>{isEncrypting ? 'Encrypting...' : 'Encrypt'}</span>
            </motion.button>

            {ciphertext && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <label className="block text-xs text-slate-400/60 mb-2 uppercase tracking-wider">Ciphertext</label>
                <div className="bg-black/40 border border-cyan-400/30 rounded-lg p-4 text-sm text-cyan-200/70 break-all font-mono">
                  {ciphertext}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Decryption Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 rounded-lg p-6 border border-blue-400/20"
        >
          <div className="flex items-center gap-2 mb-5">
            <Unlock className="w-4 h-4 text-blue-400/60" />
            <h3 className="text-sm text-blue-300/80 tracking-wider uppercase">Decryption</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-blue-300/60 mb-2 uppercase tracking-wider">Ciphertext</label>
              <textarea
                value={ciphertext}
                onChange={(e) => setCiphertext(e.target.value)}
                placeholder="Paste ciphertext..."
                rows={3}
                className="w-full bg-black/30 border border-blue-500/20 rounded-lg px-4 py-3 text-sm text-blue-100/80 
                  placeholder-blue-500/20 focus:outline-none focus:border-blue-400/40 
                  transition-all resize-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs text-blue-300/60 mb-2 uppercase tracking-wider">Key</label>
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Same key used for encryption..."
                maxLength={16}
                className="w-full bg-black/30 border border-blue-500/20 rounded-lg px-4 py-3 text-sm text-blue-100/80 
                  placeholder-blue-500/20 focus:outline-none focus:border-blue-400/40 transition-all"
              />
              <div className="text-xs text-blue-400/40 mt-1.5">{key.length}/16</div>
            </div>

            <motion.button
              onClick={handleDecrypt}
              disabled={isDecrypting || !ciphertext || !key}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-500/10 border border-blue-500/30
                rounded-lg hover:bg-blue-500/20 hover:border-blue-400/40
                transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
            >
              <Unlock className={`w-4 h-4 ${isDecrypting ? 'animate-pulse' : ''}`} />
              <span>{isDecrypting ? 'Decrypting...' : 'Decrypt'}</span>
            </motion.button>

            {decrypted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <label className="block text-xs text-blue-300/60 mb-2 uppercase tracking-wider">Plaintext</label>
                <div className="bg-black/40 border border-blue-400/30 rounded-lg p-4 text-sm text-blue-200/70 break-all">
                  {decrypted}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 rounded-lg p-5 border border-white/10"
      >
        <h4 className="text-xs text-cyan-300/70 tracking-wider uppercase mb-3">Implementation Details</h4>
        <div className="space-y-1.5 text-xs text-cyan-300/40 leading-relaxed">
          <p>• AES-128 with 10 rounds, 128-bit block and key size</p>
          <p>• Custom S-Box integration for substitution layer modification</p>
          <p>• Symmetric encryption requires identical key for decryption</p>
        </div>
      </motion.div>
    </div>
  );
}