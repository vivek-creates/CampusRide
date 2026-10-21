export const COLLEGE_CANONICAL = 'COLLEGE';
export const COLLEGE_DISPLAY_EN = 'Oriental College';
export const COLLEGE_DISPLAY_HI = 'ओरिएंटल कॉलेज';

/**
 * Checks if a stop name refers to Oriental College
 */
export const isCollegeStop = (stop: string | null | undefined): boolean => {
  if (!stop) return false;
  const norm = stop.toLowerCase().trim();
  return (
    norm === 'college' ||
    norm === 'oriental college' ||
    norm === 'your college' ||
    norm === 'ओरिएंटल कॉलेज' ||
    norm === 'आपका कॉलेज'
  );
};

/**
 * Formats a stop name for display, mapping CANONICAL 'COLLEGE' to 'Oriental College'
 */
export const formatStopName = (stop: string, isHindi: boolean = false): string => {
  if (!stop) return '';
  if (isCollegeStop(stop)) {
    return isHindi ? COLLEGE_DISPLAY_HI : COLLEGE_DISPLAY_EN;
  }
  return stop;
};

export const COLLEGE_TIMEZONE = 'Asia/Kolkata';

/**
 * Returns YYYY-MM-DD date string in college timezone (Asia/Kolkata)
 */
export const getKolkataDateString = (dateOrTimestamp: number | Date = Date.now()): string => {
  const date = typeof dateOrTimestamp === 'number' ? new Date(dateOrTimestamp) : dateOrTimestamp;
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: COLLEGE_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

/**
 * Determines whether a given timestamp occurred today in college timezone (Asia/Kolkata)
 */
export const isTodayInKolkata = (timestamp: number | undefined | null): boolean => {
  if (!timestamp || typeof timestamp !== 'number' || isNaN(timestamp)) return false;
  const todayKolkata = getKolkataDateString(Date.now());
  const targetKolkata = getKolkataDateString(timestamp);
  return todayKolkata === targetKolkata;
};
