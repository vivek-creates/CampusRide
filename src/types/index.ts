export type BoardingStatus = 'Preparing' | 'Boarding' | 'Departed' | 'Cancelled';

export type TravelDirection = 'to_college' | 'to_home';

export interface RouteData {
  id: string;
  routeNumber: string; // e.g. "Route 01"
  busNumber: string;   // e.g. "MP 0501"
  stops: string[];     // Ordered stops
  assignedStand: string; // e.g. "Stand 1", "Stand 2"
  departureTime: string; // e.g. "5:00 PM"
  boardingStatus: BoardingStatus;
  isOperatingToday: boolean;
  busesScheduledCount?: number; // Total buses for this route
  yesterdayBusNumber?: string; // If changed from yesterday
  lastPublishedAt?: number; // Timestamp of verified publication
}

export interface PublishedScheduleUpdate {
  busNumber: string;
  routeNumber?: string;
  routeId?: string;
  departureTime?: string;
  publishedAt: number;
  status: 'published';
}

export interface DraftScheduleUpdate {
  busNumber: string;
  routeNumber?: string;
  routeId?: string;
  departureTime?: string;
  draftedAt: number;
  status: 'draft';
}

export interface SearchResult {
  route: RouteData;
  source: string;
  destination: string;
  direction: TravelDirection;
  stops: string[];
  matchedStopIndex: number;
  hasBusChanged: boolean;
  yesterdayBus?: string;
  todayBus?: string;
}

export interface VerificationRecord {
  id: string;
  busNumber: string;
  routeNumber: string;
  assignedStand: string;
  userAnswer: 'YES' | 'NO';
  timestamp: number;
  timeString: string;
  isEvaluated?: boolean;
  isCorrect?: boolean;
}

export interface FeedbackRecord {
  id: string;
  category: 'problem' | 'bus_request' | 'allocation_issue' | 'suggestion';
  routeNumber?: string;
  title: string;
  description: string;
  createdAt: number;
  status: 'Under Review' | 'Resolved';
}

export interface UserSession {
  email: string;
  username: string;
  isAuthenticated: boolean;
  loginTime: number;
  isDemoUser: boolean;
}

export type AppTheme = 'dark' | 'light' | 'system';
export type AppLanguage = 'en' | 'hi';

export interface UserPreferences {
  theme: AppTheme;
  language: AppLanguage;
  departureAlerts: boolean;
  standChangeAlerts: boolean;
  pushEnabled: boolean;
}

export interface StudentScoreData {
  correctCount: number;
  incorrectCount: number;
  accuracyRate: number;
  ratingLabel: string;
  hasHistory: boolean;
}
