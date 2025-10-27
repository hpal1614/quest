// Mock Scanner for Testing - Type card codes instead of scanning

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface MockScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const CARD_CODES = [
  'ACE-HEARTS',
  'KING-SPADES',
  'QUEEN-HEARTS',
  'JACK-DIAMONDS',
  'JOKER'
];

export function MockScanner({ onScan, onClose }: MockScannerProps) {
  const [selectedCard, setSelectedCard] = useState('');

  const handleScan = () => {
    if (selectedCard) {
      onScan(selectedCard);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">🃏 Select Card to Scan</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Card Selection */}
        <div className="space-y-3 mb-6">
          <p className="text-sm text-gray-600 mb-3">
            Select which card you want to "scan":
          </p>
          {CARD_CODES.map((code) => (
            <button
              key={code}
              onClick={() => setSelectedCard(code)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                selectedCard === code
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">{code}</span>
                {selectedCard === code && (
                  <span className="text-green-500 text-xl">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-xs text-blue-900">
            💡 <strong>Testing Mode:</strong> Click a card above to simulate scanning it. 
            In production, you'd scan actual QR codes with the camera.
          </p>
        </div>

        {/* Scan Button */}
        <button
          onClick={handleScan}
          disabled={!selectedCard}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 px-6 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {selectedCard ? `Scan ${selectedCard}` : 'Select a card first'}
        </button>

        {/* Alternative: Type code */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-2">Or type a custom code:</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g., ACE-HEARTS"
              onChange={(e) => setSelectedCard(e.target.value.toUpperCase())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <button
              onClick={handleScan}
              disabled={!selectedCard}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium disabled:opacity-50"
            >
              Go
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

