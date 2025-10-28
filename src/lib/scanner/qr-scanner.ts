// QR Scanner Service using html5-qrcode

import { Html5Qrcode } from 'html5-qrcode';

export class QRScannerService {
  private scanner: Html5Qrcode | null = null;
  private isScanning: boolean = false;

  async startScanning(
    elementId: string,
    onScanSuccess: (decodedText: string) => void,
    onScanError?: (error: string) => void
  ): Promise<void> {
    try {
      if (this.isScanning) {
        console.warn('Scanner already running');
        return;
      }

      console.log('Creating Html5Qrcode scanner for element:', elementId);
      
      // Check if element exists
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with id '${elementId}' not found`);
      }
      console.log('Element found:', element);

      this.scanner = new Html5Qrcode(elementId);
      this.isScanning = true;

      console.log('Starting camera with getUserMedia...');
      await this.scanner.start(
        { facingMode: 'environment' }, // Use back camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText) => {
          console.log('QR code detected:', decodedText);
          onScanSuccess(decodedText);
        },
        (errorMessage) => {
          console.log('QR scanner error:', errorMessage);
          // Scanner errors are frequent (no QR in view), only log important ones
          if (onScanError && !errorMessage.includes('NotFoundException')) {
            onScanError(errorMessage);
          }
        }
      );
      console.log('QR scanner started successfully');
    } catch (error) {
      console.error('QR scanner start failed:', error);
      this.isScanning = false;
      throw new Error(`Failed to start scanner: ${error}`);
    }
  }

  async stopScanning(): Promise<void> {
    if (this.scanner && this.isScanning) {
      try {
        await this.scanner.stop();
        await this.scanner.clear();
      } catch (error) {
        console.error('Error stopping scanner:', error);
      } finally {
        this.isScanning = false;
        this.scanner = null;
      }
    }
  }

  isCurrentlyScanning(): boolean {
    return this.isScanning;
  }

  async checkCameraPermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const qrScannerService = new QRScannerService();

