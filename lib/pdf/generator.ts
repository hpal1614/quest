// PDF Voucher Generator - Exact implementation from technical-architecture.md

import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { Reward } from '@/types/quest';

export async function generateVoucherPDF(
  questTitle: string,
  rewards: Reward[],
  voucherCode: string,
  expirationDate: string
): Promise<string> {
  
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('The Great Sydney Quest', 20, 20);
  doc.setFontSize(16);
  doc.text(`${questTitle} - Completed!`, 20, 30);
  
  // Voucher code
  doc.setFontSize(12);
  doc.text(`Code: ${voucherCode}`, 20, 45);
  doc.text(`Valid until: ${expirationDate}`, 20, 52);
  
  // QR code
  const qrCodeDataUrl = await QRCode.toDataURL(voucherCode, {
    width: 200,
    margin: 1,
    errorCorrectionLevel: 'M'
  });
  doc.addImage(qrCodeDataUrl, 'PNG', 150, 20, 40, 40);
  
  // Rewards section
  doc.setFontSize(14);
  doc.text('Your Rewards:', 20, 70);
  
  let y = 80;
  rewards.forEach((reward, i) => {
    doc.setFontSize(12);
    doc.text(`${i + 1}. ${reward.offer}`, 20, y);
    doc.setFontSize(10);
    doc.text(`   ${reward.business}`, 20, y + 5);
    y += 15;
  });
  
  // Redemption instructions
  y += 10;
  doc.setFontSize(11);
  doc.text('How to Redeem:', 20, y);
  doc.setFontSize(9);
  doc.text('1. Show this voucher (PDF or screenshot) to staff', 20, y + 7);
  doc.text('2. Present your QR code for scanning', 20, y + 13);
  doc.text('3. One-time use only - cannot be combined with other offers', 20, y + 19);
  
  // Terms & conditions
  doc.setFontSize(8);
  doc.text('This voucher is single-use only. Show to staff for redemption.', 20, 260);
  doc.text('Valid at participating businesses only. Subject to availability.', 20, 265);
  doc.text('© 2024 The Great Sydney Quest. All rights reserved.', 20, 270);
  
  // Return as blob URL
  return String(doc.output('bloburl'));
}

/**
 * Generate unique voucher code
 */
export function generateVoucherCode(questId: string, deviceId: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const questPrefix = questId.split('_')[1].substring(0, 2).toUpperCase();
  
  return `SQ-${questPrefix}-${timestamp}-${random}`;
}

/**
 * Generate device fingerprint for unique identification
 */
export function generateDeviceFingerprint(): string {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage
  ];
  
  const fingerprint = components.join('|');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}


