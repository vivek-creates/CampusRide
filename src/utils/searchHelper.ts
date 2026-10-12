import { RouteData, SearchResult, TravelDirection } from '../types';
import { INITIAL_ROUTES } from '../data/routesData';
import { isCollegeStop, COLLEGE_DISPLAY_EN } from './collegeHelper';

export const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const matchesStop = (target: string, query: string): boolean => {
  if (!query || !target) return false;
  // If either refers to College
  if (isCollegeStop(target) && isCollegeStop(query)) {
    return true;
  }
  const nTarget = normalizeString(target);
  const nQuery = normalizeString(query);
  return nTarget.includes(nQuery) || nQuery.includes(nTarget);
};

export const findBusesForJourney = (
  source: string,
  destination: string,
  routes: RouteData[] = INITIAL_ROUTES
): SearchResult[] => {
  const isSourceCollege = isCollegeStop(source);
  const isDestCollege = isCollegeStop(destination);

  const results: SearchResult[] = [];

  for (const route of routes) {
    if (!route.isOperatingToday) continue;

    let direction: TravelDirection = 'to_home';
    let effectiveStops: string[] = [];

    if (isSourceCollege) {
      // Journey from Oriental College to Home -> reverse stop order starting from COLLEGE
      direction = 'to_home';
      // In canonical order, COLLEGE is at the end. In reversed order, COLLEGE is first.
      effectiveStops = [...route.stops].reverse();

      // Check if destination matches any stop in effectiveStops
      const matchIndex = effectiveStops.findIndex(stop => matchesStop(stop, destination));
      if (matchIndex > 0) {
        results.push({
          route,
          source: COLLEGE_DISPLAY_EN,
          destination: effectiveStops[matchIndex] === 'COLLEGE' ? COLLEGE_DISPLAY_EN : effectiveStops[matchIndex],
          direction,
          stops: effectiveStops,
          matchedStopIndex: matchIndex,
          hasBusChanged: Boolean(route.yesterdayBusNumber && route.yesterdayBusNumber !== route.busNumber),
          yesterdayBus: route.yesterdayBusNumber,
          todayBus: route.busNumber
        });
      }
    } else if (isDestCollege) {
      // Journey from Home to Oriental College -> original stop order ending at COLLEGE
      direction = 'to_college';
      effectiveStops = [...route.stops];

      const matchIndex = effectiveStops.findIndex(stop => matchesStop(stop, source));
      if (matchIndex >= 0 && matchIndex < effectiveStops.length - 1) {
        results.push({
          route,
          source: effectiveStops[matchIndex] === 'COLLEGE' ? COLLEGE_DISPLAY_EN : effectiveStops[matchIndex],
          destination: COLLEGE_DISPLAY_EN,
          direction,
          stops: effectiveStops,
          matchedStopIndex: matchIndex,
          hasBusChanged: Boolean(route.yesterdayBusNumber && route.yesterdayBusNumber !== route.busNumber),
          yesterdayBus: route.yesterdayBusNumber,
          todayBus: route.busNumber
        });
      }
    } else {
      // Neither is college
      // Check original direction (to_college)
      const srcIdxOrig = route.stops.findIndex(s => matchesStop(s, source));
      const dstIdxOrig = route.stops.findIndex(s => matchesStop(s, destination));

      if (srcIdxOrig !== -1 && dstIdxOrig !== -1 && srcIdxOrig < dstIdxOrig) {
        results.push({
          route,
          source: route.stops[srcIdxOrig] === 'COLLEGE' ? COLLEGE_DISPLAY_EN : route.stops[srcIdxOrig],
          destination: route.stops[dstIdxOrig] === 'COLLEGE' ? COLLEGE_DISPLAY_EN : route.stops[dstIdxOrig],
          direction: 'to_college',
          stops: [...route.stops],
          matchedStopIndex: dstIdxOrig,
          hasBusChanged: Boolean(route.yesterdayBusNumber && route.yesterdayBusNumber !== route.busNumber),
          yesterdayBus: route.yesterdayBusNumber,
          todayBus: route.busNumber
        });
      } else {
        // Check reversed direction (to_home)
        const revStops = [...route.stops].reverse();
        const srcIdxRev = revStops.findIndex(s => matchesStop(s, source));
        const dstIdxRev = revStops.findIndex(s => matchesStop(s, destination));

        if (srcIdxRev !== -1 && dstIdxRev !== -1 && srcIdxRev < dstIdxRev) {
          results.push({
            route,
            source: revStops[srcIdxRev] === 'COLLEGE' ? COLLEGE_DISPLAY_EN : revStops[srcIdxRev],
            destination: revStops[dstIdxRev] === 'COLLEGE' ? COLLEGE_DISPLAY_EN : revStops[dstIdxRev],
            direction: 'to_home',
            stops: revStops,
            matchedStopIndex: dstIdxRev,
            hasBusChanged: Boolean(route.yesterdayBusNumber && route.yesterdayBusNumber !== route.busNumber),
            yesterdayBus: route.yesterdayBusNumber,
            todayBus: route.busNumber
          });
        }
      }
    }
  }

  return results;
};
