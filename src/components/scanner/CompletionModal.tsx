'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  questTitle: string;
  voucherCode: string;
  questTheme: {
    gradient: string;
    icon: string;
  };
}

export function CompletionModal({
  isOpen,
  onClose,
  questTitle,
  voucherCode,
  questTheme
}: CompletionModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (isOpen && voucherCode) {
      // Generate QR code using QR Server API
      const qrData = encodeURIComponent(`VOUCHER:${voucherCode}`);
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrData}`;
      setQrCodeUrl(qrUrl);
    }
  }, [isOpen, voucherCode]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-[101] flex items-center justify-center"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-h-[90vh] overflow-y-auto">
              {/* Header with confetti effect */}
              <div className={`bg-gradient-to-r ${questTheme.gradient} p-6 text-white relative overflow-hidden`}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="text-center"
                >
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
                  <p className="text-lg text-white/90">Quest Complete!</p>
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Quest Info */}
                <div className="text-center">
                  <p className="text-gray-700 mb-2">You've completed</p>
                  <h3 className="text-xl font-bold text-gray-900">{questTitle}</h3>
                </div>

                {/* Reward Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">☕</div>
                    <p className="text-lg font-bold text-gray-900 mb-1">You've Won a Free Coffee!</p>
                    <p className="text-sm text-gray-600">Show this voucher at any participating shop</p>
                  </div>
                </motion.div>

                {/* QR Code */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white border-4 border-gray-200 rounded-xl p-6 text-center"
                >
                  <p className="text-sm font-medium text-gray-600 mb-4">Scan this QR code at the shop</p>
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="Voucher QR Code"
                      className="w-64 h-64 mx-auto"
                    />
                  ) : (
                    <div className="w-64 h-64 mx-auto bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
                      <p className="text-gray-400">Generating QR code...</p>
                    </div>
                  )}
                </motion.div>

                {/* Voucher Code */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-4"
                >
                  <p className="text-xs font-medium text-gray-500 mb-2 text-center">VOUCHER CODE</p>
                  <p className="text-2xl font-mono font-bold text-center text-gray-900 tracking-wider">
                    {voucherCode}
                  </p>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Can't scan? Show this code to the barista
                  </p>
                </motion.div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900 font-medium mb-2">📍 How to redeem:</p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Visit any participating coffee shop</li>
                    <li>• Show this QR code or voucher code</li>
                    <li>• Enjoy your free coffee!</li>
                    <li>• Valid for 30 days from today</li>
                  </ul>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className={`w-full bg-gradient-to-r ${questTheme.gradient} text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all`}
                >
                  Back to Quests
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
