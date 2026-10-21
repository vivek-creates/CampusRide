import {
  UserSession,
  UserPreferences,
  VerificationRecord,
  FeedbackRecord,
  StudentScoreData,
  PublishedScheduleUpdate,
  DraftScheduleUpdate,
  RouteData
} from '../types';
import { isCollegeStop, isTodayInKolkata } from '../utils/collegeHelper';

const STORAGE_KEYS = {
  SESSION: 'campusride_user_session',
  OPENINGS: 'campusride_openings_count',
  TAB_SESSION: 'campusride_tab_session',
  RECENTS: 'campusride_recent_searches',
  VERIFICATIONS: 'campusride_verifications',
  FEEDBACKS: 'campusride_feedbacks',
  PREFERENCES: 'campusride_preferences',
  PUBLISHED_SCHEDULES: 'campusride_published_schedules',
  DRAFT_SCHEDULES: 'campusride_draft_schedules'
};

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  language: 'en',
  departureAlerts: true,
  standChangeAlerts: true,
  pushEnabled: true
};

const DEFAULT_INITIAL_VERIFICATIONS: VerificationRecord[] = [
  // Initial historical reports to support the verified score card (46 correct, 4 incorrect = 92% Reliable)
  ...Array.from({ length: 46 }).map((_, i) => ({
    id: `ver-c-${i + 1}`,
    busNumber: `MP 050${(i % 9) + 1}`,
    routeNumber: `Route 0${(i % 9) + 1}`,
    assignedStand: `Stand ${(i % 5) + 1}`,
    userAnswer: 'YES' as const,
    timestamp: Date.now() - (i + 1) * 3600000 * 5,
    timeString: `${((i + 1) % 12) || 12}:15 PM`,
    isEvaluated: true,
    isCorrect: true
  })),
  ...Array.from({ length: 4 }).map((_, i) => ({
    id: `ver-w-${i + 1}`,
    busNumber: `MP 051${i + 1}`,
    routeNumber: `Route 1${i + 1}`,
    assignedStand: `Stand ${(i % 4) + 1}`,
    userAnswer: 'NO' as const,
    timestamp: Date.now() - (i + 10) * 3600000 * 6,
    timeString: '4:45 PM',
    isEvaluated: true,
    isCorrect: false
  }))
];

const DEFAULT_INITIAL_FEEDBACKS: FeedbackRecord[] = [
  {
    id: 'fb-01',
    category: 'bus_request',
    routeNumber: 'Route 13',
    title: 'High passenger volume at Mandideep',
    description: 'Buses get overcrowded after 5:15 PM. Requesting an additional bus during peak departure hours.',
    createdAt: Date.now() - 86400000 * 2,
    status: 'Under Review'
  },
  {
    id: 'fb-02',
    category: 'allocation_issue',
    routeNumber: 'Route 04',
    title: 'Stand 2 boarding queue coordination',
    description: 'Students crowding bay entrance, suggested line markings near Stand 2 curb.',
    createdAt: Date.now() - 86400000 * 4,
    status: 'Resolved'
  }
];

export class StorageService {
  /**
   * Safe JSON parse helper
   */
  private static safeGet<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn(`Error reading localStorage key ${key}:`, e);
      return fallback;
    }
  }

  private static safeSet<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error writing localStorage key ${key}:`, e);
    }
  }

  /**
   * Track distinct app openings (refreshing must not increment)
   */
  static getOpeningsCount(): number {
    try {
      const isNewTabOrAppLaunch = !sessionStorage.getItem(STORAGE_KEYS.TAB_SESSION);
      let count = parseInt(localStorage.getItem(STORAGE_KEYS.OPENINGS) || '0', 10);
      if (isNaN(count)) count = 0;

      if (isNewTabOrAppLaunch) {
        count += 1;
        localStorage.setItem(STORAGE_KEYS.OPENINGS, count.toString());
        sessionStorage.setItem(STORAGE_KEYS.TAB_SESSION, 'active');
      }
      return count;
    } catch (e) {
      return 1;
    }
  }

  static shouldShowIntro(): boolean {
    const count = this.getOpeningsCount();
    return count <= 2;
  }

  static resetOpeningCountForDemo(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.OPENINGS, '1');
      sessionStorage.removeItem(STORAGE_KEYS.TAB_SESSION);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * User Session
   */
  static getSession(): UserSession | null {
    return this.safeGet<UserSession | null>(STORAGE_KEYS.SESSION, null);
  }

  static setSession(session: UserSession): void {
    this.safeSet(STORAGE_KEYS.SESSION, session);
  }

  static clearSession(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch (e) {
      console.warn(e);
    }
  }

  /**
   * User Preferences
   */
  static getPreferences(): UserPreferences {
    return this.safeGet<UserPreferences>(STORAGE_KEYS.PREFERENCES, DEFAULT_PREFERENCES);
  }

  static setPreferences(prefs: UserPreferences): void {
    this.safeSet(STORAGE_KEYS.PREFERENCES, prefs);
    this.applyTheme(prefs.theme);
  }

  static applyTheme(theme: 'dark' | 'light' | 'system'): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (theme === 'system') {
      const systemDark = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : true;
      if (systemDark) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    } else if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
  }

  /**
   * Recent Searches (strictly authentic Bhopal stops from the 20 routes)
   */
  static getRecentSearches(): string[] {
    const defaultBhopalStops = [
      'Bairagarh Bus Stand',
      'Nizamuddin Tea Point',
      'Karond Chouraha',
      'Bansal Hospital',
      'Ashoka Garden Mandi',
      'Lal Ghati'
    ];

    const stored = this.safeGet<string[]>(STORAGE_KEYS.RECENTS, defaultBhopalStops);

    // Clean any legacy demo cities like Indore, Ujjain, or raw college keywords
    const cleaned = stored.filter(d => {
      const lower = d.toLowerCase().trim();
      return (
        lower !== 'indore' &&
        lower !== 'ujjain' &&
        !isCollegeStop(d) &&
        d.trim() !== ''
      );
    });

    if (cleaned.length === 0) {
      this.safeSet(STORAGE_KEYS.RECENTS, defaultBhopalStops);
      return defaultBhopalStops;
    }

    if (cleaned.length !== stored.length) {
      this.safeSet(STORAGE_KEYS.RECENTS, cleaned);
    }

    return cleaned;
  }

  static addRecentSearch(destination: string): void {
    if (!destination || destination.trim() === '' || isCollegeStop(destination)) return;
    const lowerDest = destination.toLowerCase().trim();
    if (lowerDest === 'indore' || lowerDest === 'ujjain') return;

    const current = this.getRecentSearches();
    const updated = [
      destination,
      ...current.filter(d => d.toLowerCase() !== lowerDest)
    ].slice(0, 8);
    this.safeSet(STORAGE_KEYS.RECENTS, updated);
  }

  /**
   * Stand Verification Records
   */
  static getVerifications(): VerificationRecord[] {
    const stored = this.safeGet<VerificationRecord[] | null>(STORAGE_KEYS.VERIFICATIONS, null);
    if (!stored) {
      this.safeSet(STORAGE_KEYS.VERIFICATIONS, DEFAULT_INITIAL_VERIFICATIONS);
      return DEFAULT_INITIAL_VERIFICATIONS;
    }
    return stored;
  }

  static addVerification(record: Omit<VerificationRecord, 'id' | 'timestamp' | 'timeString'>): VerificationRecord {
    const all = this.getVerifications();
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newRecord: VerificationRecord = {
      ...record,
      id: `ver-${Date.now()}`,
      timestamp: Date.now(),
      timeString,
      isEvaluated: true,
      isCorrect: true // student confirmation matches ground truth in demo
    };

    const updated = [newRecord, ...all];
    this.safeSet(STORAGE_KEYS.VERIFICATIONS, updated);
    return newRecord;
  }

  static hasVerifiedBus(busNumber: string): boolean {
    const all = this.getVerifications();
    // Check if verified today / recent within 4 hours
    const fourHoursAgo = Date.now() - 4 * 60 * 60 * 1000;
    return all.some(v => v.busNumber === busNumber && v.timestamp > fourHoursAgo);
  }

  /**
   * Calculate Student Score
   */
  static getStudentScore(): StudentScoreData {
    const verifications = this.getVerifications();
    const evaluated = verifications.filter(v => v.isEvaluated);

    if (evaluated.length === 0) {
      return {
        correctCount: 0,
        incorrectCount: 0,
        accuracyRate: 0,
        ratingLabel: 'New Scout',
        hasHistory: false
      };
    }

    const correctCount = evaluated.filter(v => v.isCorrect).length;
    const incorrectCount = evaluated.filter(v => !v.isCorrect).length;
    const total = correctCount + incorrectCount;
    const accuracyRate = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    let ratingLabel = 'Active Scout';
    if (accuracyRate >= 90) ratingLabel = 'Reliable';
    else if (accuracyRate >= 75) ratingLabel = 'Good Standing';
    else ratingLabel = 'Contributor';

    return {
      correctCount,
      incorrectCount,
      accuracyRate,
      ratingLabel,
      hasHistory: true
    };
  }

  /**
   * Transport Feedback Submissions
   */
  static getFeedbacks(): FeedbackRecord[] {
    const stored = this.safeGet<FeedbackRecord[] | null>(STORAGE_KEYS.FEEDBACKS, null);
    if (!stored) {
      this.safeSet(STORAGE_KEYS.FEEDBACKS, DEFAULT_INITIAL_FEEDBACKS);
      return DEFAULT_INITIAL_FEEDBACKS;
    }
    return stored;
  }

  static addFeedback(feedback: Omit<FeedbackRecord, 'id' | 'createdAt' | 'status'>): FeedbackRecord {
    const all = this.getFeedbacks();
    const newRecord: FeedbackRecord = {
      ...feedback,
      id: `fb-${Date.now()}`,
      createdAt: Date.now(),
      status: 'Under Review'
    };
    const updated = [newRecord, ...all];
    this.safeSet(STORAGE_KEYS.FEEDBACKS, updated);
    return newRecord;
  }

  /**
   * Published Schedule Updates (Admin & Shared State)
   */
  static getPublishedSchedules(): Record<string, PublishedScheduleUpdate> {
    return this.safeGet<Record<string, PublishedScheduleUpdate>>(STORAGE_KEYS.PUBLISHED_SCHEDULES, {});
  }

  static getPublishedScheduleUpdate(busNumber?: string, routeNumber?: string, routeId?: string): PublishedScheduleUpdate | null {
    const published = this.getPublishedSchedules();
    if (busNumber && published[busNumber] && published[busNumber].status === 'published') {
      return published[busNumber];
    }
    if (routeNumber && published[routeNumber] && published[routeNumber].status === 'published') {
      return published[routeNumber];
    }
    if (routeId && published[routeId] && published[routeId].status === 'published') {
      return published[routeId];
    }
    return null;
  }

  static publishScheduleUpdate(update: {
    busNumber: string;
    routeNumber?: string;
    routeId?: string;
    departureTime?: string;
    publishedAt?: number;
  }): PublishedScheduleUpdate {
    const published = this.getPublishedSchedules();
    const record: PublishedScheduleUpdate = {
      busNumber: update.busNumber,
      routeNumber: update.routeNumber,
      routeId: update.routeId,
      departureTime: update.departureTime,
      publishedAt: update.publishedAt !== undefined ? update.publishedAt : Date.now(),
      status: 'published'
    };
    if (record.busNumber) published[record.busNumber] = record;
    if (record.routeNumber) published[record.routeNumber] = record;
    if (record.routeId) published[record.routeId] = record;
    this.safeSet(STORAGE_KEYS.PUBLISHED_SCHEDULES, published);

    // Remove any draft for this bus/route
    this.removeDraftScheduleUpdate(record.busNumber, record.routeNumber);
    return record;
  }

  /**
   * Draft Schedule Updates (Must NOT count as published)
   */
  static getDraftSchedules(): Record<string, DraftScheduleUpdate> {
    return this.safeGet<Record<string, DraftScheduleUpdate>>(STORAGE_KEYS.DRAFT_SCHEDULES, {});
  }

  static saveDraftScheduleUpdate(draft: {
    busNumber: string;
    routeNumber?: string;
    routeId?: string;
    departureTime?: string;
    draftedAt?: number;
  }): DraftScheduleUpdate {
    const drafts = this.getDraftSchedules();
    const record: DraftScheduleUpdate = {
      busNumber: draft.busNumber,
      routeNumber: draft.routeNumber,
      routeId: draft.routeId,
      departureTime: draft.departureTime,
      draftedAt: draft.draftedAt || Date.now(),
      status: 'draft'
    };
    if (record.busNumber) drafts[record.busNumber] = record;
    if (record.routeNumber) drafts[record.routeNumber] = record;
    this.safeSet(STORAGE_KEYS.DRAFT_SCHEDULES, drafts);
    return record;
  }

  static removeDraftScheduleUpdate(busNumber?: string, routeNumber?: string): void {
    const drafts = this.getDraftSchedules();
    let changed = false;
    if (busNumber && drafts[busNumber]) {
      delete drafts[busNumber];
      changed = true;
    }
    if (routeNumber && drafts[routeNumber]) {
      delete drafts[routeNumber];
      changed = true;
    }
    if (changed) {
      this.safeSet(STORAGE_KEYS.DRAFT_SCHEDULES, drafts);
    }
  }

  /**
   * Determine bus update status for student UI using Asia/Kolkata timezone
   */
  static getBusScheduleStatus(route: RouteData): {
    isUpdatedToday: boolean;
    departureTime: string;
    publishedAt?: number;
  } {
    // 1. Check for published update in localStorage (from admin publish flow)
    const published = this.getPublishedScheduleUpdate(route.busNumber, route.routeNumber, route.id);
    if (published && published.status === 'published') {
      const isToday = isTodayInKolkata(published.publishedAt);
      return {
        isUpdatedToday: isToday,
        departureTime: published.departureTime || route.departureTime,
        publishedAt: published.publishedAt
      };
    }

    // 2. Check route-level lastPublishedAt timestamp
    if (route.lastPublishedAt) {
      const isToday = isTodayInKolkata(route.lastPublishedAt);
      return {
        isUpdatedToday: isToday,
        departureTime: route.departureTime,
        publishedAt: route.lastPublishedAt
      };
    }

    // 3. Fallback: No update published today (truthful fallback, do not imply cancelled or delayed)
    return {
      isUpdatedToday: false,
      departureTime: route.departureTime
    };
  }
}
