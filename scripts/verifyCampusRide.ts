import { findBusesForJourney } from '../src/utils/searchHelper';
import { INITIAL_ROUTES } from '../src/data/routesData';
import { StorageService } from '../src/services/storageService';
import { isCollegeStop, formatStopName, COLLEGE_DISPLAY_EN, COLLEGE_DISPLAY_HI } from '../src/utils/collegeHelper';
import { TRANSLATIONS, translate } from '../src/utils/translations';
import { AppTheme, AppLanguage } from '../src/types';

// Mock localStorage and window in node environment if needed
if (typeof globalThis.localStorage === 'undefined') {
  const store: Record<string, string> = {};
  globalThis.localStorage = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
    key: (index: number) => Object.keys(store)[index] || null,
    length: 0
  } as any;
}

if (typeof globalThis.sessionStorage === 'undefined') {
  const store: Record<string, string> = {};
  globalThis.sessionStorage = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
    key: (index: number) => Object.keys(store)[index] || null,
    length: 0
  } as any;
}

console.log('==============================================');
console.log('🧪 CAMPUSRIDE FULL INTEGRATION VERIFICATION');
console.log('==============================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string, detail: string = '') {
  if (condition) {
    console.log(`✅ PASS: ${testName} ${detail ? `(${detail})` : ''}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
    failCount++;
  }
}

// -------------------------------------------------------------
// SECTION 1: BHOPAL ROUTE DATA INTEGRITY & SEARCH DISCOVERABILITY
// -------------------------------------------------------------
console.log('--- SECTION 1: Bhopal Routes & Search Discoverability ---');

// 1. All 20 Routes check
assert(INITIAL_ROUTES.length === 20, 'Route Count Verification', `Found ${INITIAL_ROUTES.length} routes`);

// 2. Route 18: Nizamuddin Tea Point
const nizamuddinResults = findBusesForJourney('Oriental College', 'Nizamuddin Tea Point');
const hasRoute18 = nizamuddinResults.some(r => r.route.routeNumber === 'Route 18' && r.route.busNumber === 'MP 0518');
assert(hasRoute18, 'Query: Nizamuddin Tea Point (Route 18 MP 0518)', `Found matches: ${nizamuddinResults.map(r => r.route.busNumber).join(', ')}`);

// 3. State Bank: Route 01, Route 14 (and Route 15)
const stateBankResults = findBusesForJourney('Oriental College', 'State Bank');
const hasRoute01 = stateBankResults.some(r => r.route.routeNumber === 'Route 01' && r.route.busNumber === 'MP 0501');
const hasRoute14 = stateBankResults.some(r => r.route.routeNumber === 'Route 14' && r.route.busNumber === 'MP 0514');
assert(hasRoute01 && hasRoute14, 'Query: State Bank (Routes 01 and 14)', `Matches: ${stateBankResults.map(r => `${r.route.routeNumber} (${r.route.busNumber})`).join(', ')}`);

// 4. Direction Reversal: Home -> College
const homeToCollegeResults = findBusesForJourney('Nizamuddin Tea Point', 'Oriental College');
const hasReverseRoute18 = homeToCollegeResults.some(r => r.route.routeNumber === 'Route 18' && r.direction === 'to_college');
assert(hasReverseRoute18, 'Direction Reversal: Nizamuddin -> Oriental College', 'Correctly identified to_college journey');

// 5. Bus Change Detection: Route 04 changed from 4050 to MP 0504
const route04Results = findBusesForJourney('Oriental College', 'ITI GATE');
const route04Result = route04Results.find(r => r.route.routeNumber === 'Route 04');
assert(
  Boolean(route04Result && route04Result.hasBusChanged && route04Result.yesterdayBus === '4050' && route04Result.todayBus === 'MP 0504'),
  'Bus Change Detection for Route 04',
  `Yesterday: ${route04Result?.yesterdayBus} -> Today: ${route04Result?.todayBus}`
);

// 6. Non-changed route check
const route01Result = nizamuddinResults[0];
assert(!route01Result?.hasBusChanged, 'Unchanged Route Notice Suppression', 'No false positive change notice');

// -------------------------------------------------------------
// SECTION 2: COLLEGE DISPLAY-NAME MAPPING & BHOPAL LOCALITY
// -------------------------------------------------------------
console.log('\n--- SECTION 2: Oriental College Display Mapping & City Sanitation ---');

// 7. Check COLLEGE -> Oriental College mapping
assert(isCollegeStop('COLLEGE'), 'isCollegeStop recognizes canonical "COLLEGE"');
assert(isCollegeStop('Oriental College'), 'isCollegeStop recognizes "Oriental College"');
assert(formatStopName('COLLEGE', false) === COLLEGE_DISPLAY_EN, 'formatStopName maps "COLLEGE" -> "Oriental College" in English');
assert(formatStopName('COLLEGE', true) === COLLEGE_DISPLAY_HI, 'formatStopName maps "COLLEGE" -> "ओरिएंटल कॉलेज" in Hindi');
assert(formatStopName('Bairagarh Bus Stand', false) === 'Bairagarh Bus Stand', 'formatStopName preserves canonical Bhopal stop names');

// 8. Canonical data preservation check
const canonicalStopsHaveCollege = INITIAL_ROUTES.every(r => r.stops.includes('COLLEGE'));
assert(canonicalStopsHaveCollege, 'Canonical Data Integrity', 'All 20 routes preserve "COLLEGE" in canonical stop lists');

// 9. Absence of Indore and Ujjain from recents and suggestions
const recentSearches = StorageService.getRecentSearches();
const hasIndore = recentSearches.some(s => s.toLowerCase().includes('indore'));
const hasUjjain = recentSearches.some(s => s.toLowerCase().includes('ujjain'));
assert(!hasIndore && !hasUjjain, 'Absence of Indore & Ujjain in Default Recents', `Recents: ${recentSearches.join(', ')}`);

// 10. Sanitizer prevents adding Indore or Ujjain
StorageService.addRecentSearch('Indore');
StorageService.addRecentSearch('Ujjain');
const recentsAfterBadAdd = StorageService.getRecentSearches();
assert(
  !recentsAfterBadAdd.includes('Indore') && !recentsAfterBadAdd.includes('Ujjain'),
  'Recent Searches Sanitizer',
  'Successfully rejected Indore and Ujjain'
);

// -------------------------------------------------------------
// SECTION 3: THEME SYSTEM & PERSISTENCE
// -------------------------------------------------------------
console.log('\n--- SECTION 3: Theme Switching & Persistence ---');

// 11. Theme preferences persistence
const initialPrefs = StorageService.getPreferences();
assert(Boolean(initialPrefs), 'Initial Preferences Loaded', `Default theme: ${initialPrefs.theme}`);

// Switch to Light
StorageService.setPreferences({ ...initialPrefs, theme: 'light' });
const lightPrefs = StorageService.getPreferences();
assert(lightPrefs.theme === 'light', 'Theme Persistence: Light Mode Saved & Restored');

// Switch to Dark
StorageService.setPreferences({ ...lightPrefs, theme: 'dark' });
const darkPrefs = StorageService.getPreferences();
assert(darkPrefs.theme === 'dark', 'Theme Persistence: Dark Mode Saved & Restored');

// Switch to System
StorageService.setPreferences({ ...darkPrefs, theme: 'system' });
const systemPrefs = StorageService.getPreferences();
assert(systemPrefs.theme === 'system', 'Theme Persistence: System Mode Saved & Restored');

// -------------------------------------------------------------
// SECTION 4: LANGUAGE SWITCHING & TRANSLATION COVERAGE
// -------------------------------------------------------------
console.log('\n--- SECTION 4: Language Switching & Translation Coverage ---');

// 12. Language persistence
StorageService.setPreferences({ ...systemPrefs, language: 'hi' });
const hiPrefs = StorageService.getPreferences();
assert(hiPrefs.language === 'hi', 'Language Persistence: Hindi Saved & Restored');

StorageService.setPreferences({ ...hiPrefs, language: 'en' });
const enPrefs = StorageService.getPreferences();
assert(enPrefs.language === 'en', 'Language Persistence: English Saved & Restored');

// 13. Dictionary parity check between English and Hindi
const enKeys = Object.keys(TRANSLATIONS.en);
const hiKeys = Object.keys(TRANSLATIONS.hi);
const missingInHi = enKeys.filter(k => !(k in TRANSLATIONS.hi));
const missingInEn = hiKeys.filter(k => !(k in TRANSLATIONS.en));

assert(
  missingInHi.length === 0,
  'Hindi Translation Completeness',
  missingInHi.length === 0 ? `All ${enKeys.length} keys translated` : `Missing in Hindi: ${missingInHi.join(', ')}`
);

assert(
  missingInEn.length === 0,
  'English Translation Completeness',
  missingInEn.length === 0 ? `All ${hiKeys.length} keys defined` : `Missing in English: ${missingInEn.join(', ')}`
);

// 14. Essential key translations verification
const navCheckEn = translate('en', 'navHome');
const navCheckHi = translate('hi', 'navHome');
assert(navCheckEn === 'Home' && navCheckHi === 'होम', 'Translation: Bottom Nav Home', `EN="${navCheckEn}", HI="${navCheckHi}"`);

const statusCheckEn = translate('en', 'statusBoarding');
const statusCheckHi = translate('hi', 'statusBoarding');
assert(statusCheckEn === 'BOARDING' && statusCheckHi === 'बोर्डिंग चालू', 'Translation: Bus Status Boarding', `EN="${statusCheckEn}", HI="${statusCheckHi}"`);

const collegeCheckEn = translate('en', 'orientalCollege');
const collegeCheckHi = translate('hi', 'orientalCollege');
assert(collegeCheckEn === 'Oriental College' && collegeCheckHi === 'ओरिएंटल कॉलेज', 'Translation: Oriental College Name', `EN="${collegeCheckEn}", HI="${collegeCheckHi}"`);

// 15. Parameter interpolation check
const paramInterpolation = translate('en', 'stopsCount', { count: 18, index: 3 });
assert(
  paramInterpolation === '18 stops, stop #3',
  'Translation Parameter Interpolation',
  `Interpolated result: "${paramInterpolation}"`
);

// -------------------------------------------------------------
// SECTION 5: STOP PICKER FILTERING & SEARCH CARD STABILITY
// -------------------------------------------------------------
console.log('\n--- SECTION 5: Stop Picker Filtering & Search Card Stability ---');

import { getAllUniqueStops } from '../src/data/routesData';
import { normalizeString } from '../src/utils/searchHelper';

const allUniqueStops = getAllUniqueStops();
assert(allUniqueStops.length > 20, 'Unique Stops Collection', `Total unique stops across 20 routes: ${allUniqueStops.length}`);

// 16. Test Many Results (empty query or single common character)
const filterStops = (query: string) => {
  if (!query.trim()) return allUniqueStops;
  const norm = normalizeString(query);
  return allUniqueStops.filter(stop => {
    const formatted = formatStopName(stop, false);
    return normalizeString(stop).includes(norm) || normalizeString(formatted).includes(norm);
  });
};

const fullList = filterStops('');
assert(fullList.length === allUniqueStops.length, 'Filter: Empty Query returns all stops', `Count: ${fullList.length}`);

const manyResults = filterStops('a');
assert(manyResults.length > 10, 'Filter: Many Results for "a"', `Count: ${manyResults.length}`);

// 17. Test One / Specific Result
const singleResult = filterStops('Nizamuddin Tea Point');
assert(singleResult.length === 1 && singleResult[0].toUpperCase() === 'NIZAMUDDIN TEA POINT', 'Filter: Specific Stop "Nizamuddin Tea Point"', `Matched: ${singleResult[0]}`);

const stateBankResult = filterStops('State Bank');
assert(stateBankResult.length === 1 && stateBankResult[0].toUpperCase() === 'STATE BANK', 'Filter: Specific Stop "State Bank"', `Matched: ${stateBankResult[0]}`);

// 18. Test Zero Results
const zeroResults = filterStops('NonExistentStation9999');
assert(zeroResults.length === 0, 'Filter: Zero Results for unknown query', 'Correctly empty');

// 19. Test Clearing Query and Typing Again
const clearedList = filterStops('');
assert(clearedList.length === allUniqueStops.length, 'Filter: Cleared query instantly returns full stop list', `Count: ${clearedList.length}`);

// 20. Test Oriental College option matching
const matchesOrientalOption = (query: string) => {
  if (!query.trim()) return true;
  const norm = normalizeString(query);
  return (
    'oriental college'.includes(norm) ||
    'college'.includes(norm) ||
    'ओरिएंटल कॉलेज'.toLowerCase().includes(norm)
  );
};

assert(matchesOrientalOption('') === true, 'Oriental College Option: Shown on empty query');
assert(matchesOrientalOption('oriental') === true, 'Oriental College Option: Shown on "oriental"');
assert(matchesOrientalOption('college') === true, 'Oriental College Option: Shown on "college"');
assert(matchesOrientalOption('nizamuddin') === false, 'Oriental College Option: Hidden when searching unrelated stop');

// 21. From and To search functionality intact
const fromCollegeToBairagarh = findBusesForJourney('Oriental College', 'Bairagarh Bus Stand');
assert(fromCollegeToBairagarh.length > 0, 'From Picker: Oriental College -> Bairagarh Bus Stand', `Found ${fromCollegeToBairagarh.length} buses`);

const fromBairagarhToCollege = findBusesForJourney('Bairagarh Bus Stand', 'Oriental College');
assert(fromBairagarhToCollege.length > 0 && fromBairagarhToCollege[0].direction === 'to_college', 'To Picker: Bairagarh Bus Stand -> Oriental College', `Found ${fromBairagarhToCollege.length} buses (direction: to_college)`);

// -------------------------------------------------------------
// SECTION 6: FIXED 4:45 PM DEPARTURE TIME & BHARAT NAGAR SELECTION
// -------------------------------------------------------------
console.log('\n--- SECTION 6: Fixed 4:45 PM Departure Time & BHARAT NAGAR Selection ---');

// 22. All 20 routes must have departureTime === '4:45 PM'
const allDepartureTimesAre445 = INITIAL_ROUTES.every(r => r.departureTime === '4:45 PM');
assert(
  allDepartureTimesAre445,
  'Fixed Departure Time: All 20 Routes set to 4:45 PM',
  `Checked ${INITIAL_ROUTES.length} routes: ${INITIAL_ROUTES.map(r => r.departureTime).slice(0, 5).join(', ')}...`
);

// 23. Test selecting "BHARAT NAGAR" in picker
const bharatNagarMatches = filterStops('Bharat');
const hasBharatNagar = bharatNagarMatches.some(s => s.toUpperCase() === 'BHARAT NAGAR');
assert(hasBharatNagar, 'Stop Picker: "Bharat" matches "BHARAT NAGAR"', `Matches: ${bharatNagarMatches.join(', ')}`);

// 24. Test journey with "BHARAT NAGAR" from Oriental College
const bharatNagarJourney = findBusesForJourney('Oriental College', 'BHARAT NAGAR');
assert(bharatNagarJourney.length >= 2, 'Route Matching: "BHARAT NAGAR" served by college fleet', `Matches ${bharatNagarJourney.length} routes`);

const bharatNagarRoute10 = bharatNagarJourney.find(r => r.route.routeNumber === 'Route 10');
const bharatNagarRoute18 = bharatNagarJourney.find(r => r.route.routeNumber === 'Route 18');
assert(
  Boolean(bharatNagarRoute10 && bharatNagarRoute18),
  'Route 10 and Route 18 serve BHARAT NAGAR',
  `Buses: ${bharatNagarJourney.map(r => `${r.route.routeNumber} (${r.route.busNumber})`).join(', ')}`
);

// 25. Verify bus cards display departureTime === '4:45 PM'
const route10Departure = bharatNagarRoute10?.route.departureTime;
const route18Departure = bharatNagarRoute18?.route.departureTime;
assert(
  route10Departure === '4:45 PM' && route18Departure === '4:45 PM',
  'Bus Cards for BHARAT NAGAR show 4:45 PM departure time',
  `Route 10: ${route10Departure}, Route 18: ${route18Departure}`
);

// 26. Reverse direction: BHARAT NAGAR -> Oriental College
const reverseBharatJourney = findBusesForJourney('BHARAT NAGAR', 'Oriental College');
assert(
  reverseBharatJourney.length >= 2 && reverseBharatJourney.every(r => r.direction === 'to_college' && r.route.departureTime === '4:45 PM'),
  'Reverse Journey: BHARAT NAGAR -> Oriental College (direction: to_college, time: 4:45 PM)',
  `Buses: ${reverseBharatJourney.map(r => r.route.busNumber).join(', ')}`
);

console.log('\n==============================================');
console.log(`TOTAL TESTS: ${passCount + failCount}`);
console.log(`SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log('==============================================');

if (failCount > 0) process.exit(1);
