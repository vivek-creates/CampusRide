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
