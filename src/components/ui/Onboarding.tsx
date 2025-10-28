// Onboarding Component - First-time user experience

'use client';

import { motion } from 'framer-motion';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center"
      >
        {/* Mascot/Hero */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="text-8xl mb-6"
        >
          🗺️
        </motion.div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          The Great Sydney Quest
        </h1>

        {/* Description */}
        <div className="space-y-3 text-gray-700 mb-8">
          <p className="text-lg">
            Explore Sydney through AR scavenger hunts.
          </p>
          <p>
            🔍 Scan mascots at locations<br/>
            🧩 Solve puzzles and challenges<br/>
            🎁 Earn amazing rewards
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={onComplete}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Get Started
        </button>

        {/* Footer note */}
        <p className="text-xs text-gray-500 mt-6">
          No sign-up required • Privacy-first • Local storage only
        </p>
      </motion.div>
    </div>
  );
}


