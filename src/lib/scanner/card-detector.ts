// Card Detection Service - Detects playing cards using camera feed

export interface CardMatch {
  cardId: string;
  confidence: number;
  location?: { x: number; y: number; width: number; height: number };
}

export interface CardTemplate {
  id: string;
  qrCode: string;
  imagePath: string;
  name: string;
}

export class CardDetectionService {
  private templates: CardTemplate[] = [
    {
      id: 'ace-hearts',
      qrCode: 'ACE-HEARTS-NEWTOWN',
      imagePath: '/cards/ace-hearts.png',
      name: 'Ace of Hearts'
    },
    {
      id: 'king-spades',
      qrCode: 'KING-SPADES-NEWTOWN',
      imagePath: '/cards/king-spades.png',
      name: 'King of Spades'
    }
  ];

  private templateImages: Map<string, HTMLImageElement> = new Map();
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Load template images
    const loadPromises = this.templates.map(template => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          this.templateImages.set(template.id, img);
          console.log(`✓ Loaded template: ${template.name}`);
          resolve();
        };
        img.onerror = () => {
          console.error(`✗ Failed to load template: ${template.name}`);
          reject(new Error(`Failed to load ${template.name}`));
        };
        img.src = template.imagePath;
      });
    });

    await Promise.all(loadPromises);
    this.isInitialized = true;
    console.log('Card detection service initialized');
  }

  /**
   * Detect cards in a video frame
   * @param video - Video element with camera feed
   * @param canvas - Canvas for processing
   * @returns Detected card match or null
   */
  detectCard(video: HTMLVideoElement, canvas: HTMLCanvasElement): CardMatch | null {
    if (!this.isInitialized) {
      console.warn('Card detector not initialized');
      return null;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data for analysis
    const frameData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Try to match each template
    let bestMatch: CardMatch | null = null;
    let highestConfidence = 0;

    for (const template of this.templates) {
      const templateImg = this.templateImages.get(template.id);
      if (!templateImg) continue;

      const confidence = this.matchTemplate(frameData, templateImg, ctx);

      if (confidence > highestConfidence && confidence > 0.4) {
        highestConfidence = confidence;
        bestMatch = {
          cardId: template.qrCode,
          confidence: confidence
        };
      }
    }

    return bestMatch;
  }

  /**
   * Simple template matching using color histogram comparison
   * For production, consider using TensorFlow.js or feature detection
   */
  private matchTemplate(
    frameData: ImageData,
    templateImg: HTMLImageElement,
    ctx: CanvasRenderingContext2D
  ): number {
    // Create temporary canvas for template
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return 0;

    // Scale template to reasonable size for comparison
    const maxSize = 300;
    const scale = Math.min(maxSize / templateImg.width, maxSize / templateImg.height);
    tempCanvas.width = templateImg.width * scale;
    tempCanvas.height = templateImg.height * scale;

    // Draw template
    tempCtx.drawImage(templateImg, 0, 0, tempCanvas.width, tempCanvas.height);
    const templateData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

    // Calculate color histograms
    const frameHistogram = this.calculateColorHistogram(frameData);
    const templateHistogram = this.calculateColorHistogram(templateData);

    // Compare histograms
    const similarity = this.compareHistograms(frameHistogram, templateHistogram);

    return similarity;
  }

  /**
   * Calculate color histogram from image data
   */
  private calculateColorHistogram(imageData: ImageData): number[] {
    const histogram = new Array(256).fill(0);
    const data = imageData.data;

    // Sample every 4th pixel for performance
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Convert to grayscale
      const gray = Math.floor(0.299 * r + 0.587 * g + 0.114 * b);
      histogram[gray]++;
    }

    // Normalize
    const total = histogram.reduce((sum, val) => sum + val, 0);
    return histogram.map(val => val / total);
  }

  /**
   * Compare two histograms using correlation
   */
  private compareHistograms(hist1: number[], hist2: number[]): number {
    let correlation = 0;

    for (let i = 0; i < hist1.length; i++) {
      correlation += Math.min(hist1[i], hist2[i]);
    }

    return correlation;
  }

  /**
   * Detect dominant colors in image (red for hearts, black for spades)
   */
  detectDominantColor(imageData: ImageData): 'red' | 'black' | 'unknown' {
    let redCount = 0;
    let blackCount = 0;
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Detect red (hearts)
      if (r > 180 && g < 100 && b < 100) {
        redCount++;
      }
      // Detect black (spades)
      else if (r < 50 && g < 50 && b < 50) {
        blackCount++;
      }
    }

    if (redCount > blackCount * 1.5) return 'red';
    if (blackCount > redCount * 1.5) return 'black';
    return 'unknown';
  }
}

export const cardDetector = new CardDetectionService();
