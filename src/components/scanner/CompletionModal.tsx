'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (isOpen && voucherCode) {
      // Generate QR code using QR Server API
      const qrData = encodeURIComponent(`VOUCHER:${voucherCode}`);
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrData}`;
      setQrCodeUrl(qrUrl);
    }
  }, [isOpen, voucherCode]);

  const handleBackToQuests = () => {
    router.push('/');
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      // Dynamically import jsPDF to reduce initial bundle size
      const { jsPDF } = await import('jspdf');

      // Create new PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Set up colors and fonts
      const primaryColor = [147, 51, 234]; // Purple
      const textColor = [0, 0, 0];

      // Add header with gradient background effect
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 40, 'F');

      // Add title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('Congratulations!', 105, 20, { align: 'center' });
      doc.setFontSize(16);
      doc.text('Quest Complete', 105, 32, { align: 'center' });

      // Add quest title
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFontSize(14);
      doc.text(`Quest: ${questTitle}`, 105, 50, { align: 'center' });

      // Add reward section
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('You\'ve Won a Free Coffee!', 105, 65, { align: 'center' });

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Show this voucher at any participating shop', 105, 73, { align: 'center' });

      // Add QR code
      if (qrCodeUrl) {
        // Fetch QR code image
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        const reader = new FileReader();

        await new Promise<void>((resolve) => {
          reader.onloadend = () => {
            const base64data = reader.result as string;
            // Add QR code image to PDF (centered, 80mm x 80mm)
            doc.addImage(base64data, 'PNG', 65, 85, 80, 80);
            resolve();
          };
          reader.readAsDataURL(blob);
        });
      }

      // Add voucher code
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('VOUCHER CODE', 105, 175, { align: 'center' });

      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.text(voucherCode, 105, 185, { align: 'center' });

      // Add redemption instructions
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('How to redeem:', 20, 200);
      doc.text('• Visit any participating coffee shop', 25, 207);
      doc.text('• Show this QR code or voucher code', 25, 214);
      doc.text('• Enjoy your free coffee!', 25, 221);
      doc.text('• Valid for 30 days from today', 25, 228);

      // Add footer
      doc.setFontSize(8);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 280, { align: 'center' });
      doc.text('The Great Sydney Quest', 105, 285, { align: 'center' });

      // Save the PDF
      doc.save(`coffee-voucher-${voucherCode}.pdf`);

      console.log('✅ PDF downloaded successfully');
    } catch (error) {
      console.error('❌ Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

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

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Download PDF Button */}
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="py-3 px-4 border-2 border-purple-600 text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isDownloading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                        <span>Download PDF</span>
                      </>
                    )}
                  </button>

                  {/* Back to Quests Button */}
                  <button
                    onClick={handleBackToQuests}
                    className={`bg-gradient-to-r ${questTheme.gradient} text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>All Quests</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
