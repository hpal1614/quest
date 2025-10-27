// Quest Type Definitions

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Question {
  text: string;
  answer: string;
  alternativeAnswers: string[];
  hints: [string, string, string]; // Exactly 3 hints
}

export interface Location {
  id: string;
  name: string;
  type: 'start' | 'checkpoint' | 'finish';
  coordinates: Coordinates;
  radius: number; // meters
  clue: string;
  qrCode: string;
  question: Question | null; // Start location has no question
}

export interface Reward {
  id: string;
  business: string;
  offer: string;
  code: string;
}

export interface QuestTheme {
  color: string;
  mascot: string;
  icon: string;
  gradient: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'expired';
  theme: QuestTheme;
  locations: Location[];
  rewards: {
    vouchers: Reward[];
    expirationDate: string;
  };
  estimatedDuration: number; // minutes
}

// User Progress Types
export interface UserProgress {
  questId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  startedAt: string;
  currentLocationId: string;
  completedLocationIds: string[];
  hintsUsed: Record<string, number>; // locationId -> hint count
  questStarted: boolean;
}

export interface CompletedQuest {
  questId: string;
  completedAt: string;
  duration: number; // minutes
  totalHintsUsed: number;
  voucherCode: string;
  voucherPdfUrl?: string;
}

export interface UserData {
  userId: string; // Browser fingerprint
  deviceId: string;
  onboardingCompleted: boolean;
  permissions: {
    gps: PermissionState;
    camera: PermissionState;
  };
  activeQuests: UserProgress[];
  completedQuests: CompletedQuest[];
  lastLocation: {
    lat: number;
    lng: number;
    timestamp: string;
  } | null;
}

// Validation Types
export interface ValidationResult {
  isValid: boolean;
  location?: Location;
  errorMessage?: string;
  distance?: number;
}

export interface QRValidation {
  scannedCode: string;
  expectedFormat: string;
  validation: {
    isValid: boolean;
    belongsToQuest: string | null;
    locationId: string | null;
    isCorrectSequence: boolean;
    isWithinRadius: boolean;
    errorMessage: string | null;
  };
}


