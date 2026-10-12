import { RouteData } from '../types';

export const INITIAL_ROUTES: RouteData[] = [
  {
    id: 'route-01',
    routeNumber: 'Route 01',
    busNumber: 'MP 0501',
    stops: [
      'SHAJANABAD THANA',
      'SHAJANABAD GATE',
      'LBS',
      'ROYAL MARKET',
      'STATE BANK',
      'KO-HE-FIZA HOSPITAL',
      'BAIRAGARH BUS STAND',
      'TATA MOTORS',
      'LAL GHATI',
      'AIR PORT SQUARE',
      'NEW JAIL',
      'COLLEGE'
    ],
    assignedStand: 'Stand 1',
    departureTime: '4:45 PM',
    boardingStatus: 'Boarding',
    isOperatingToday: true,
    busesScheduledCount: 2
  },
  {
    id: 'route-02',
    routeNumber: 'Route 02',
    busNumber: 'MP 0502',
    stops: [
      'KAROND CHOURAHA',
      'HOUSING BOARD COLONY',
      'NISHADPURA',
      'ARIF NAGAR',
      'DIG BANGLOW',
      'SINDHI COLONY',
      'BHOPAL TALKIES',
      'BUS STAND',
      'ALPANA TALKIES',
      'SANGAM TALKIES',
      'COLLEGE'
    ],
    assignedStand: 'Stand 3',
    departureTime: '4:45 PM',
    boardingStatus: 'Preparing',
    isOperatingToday: true,
    busesScheduledCount: 2
  },
  {
    id: 'route-03',
    routeNumber: 'Route 03',
    busNumber: 'MP 0503',
    stops: [
      'BERKHERI GATE',
      'PATRA',
      'CENTRAL LIBRARY',
      'LADY HOSPITAL',
      'LILY TALKIES',
      'JINSI',
      'FIRE BRIGADE',
      'KALI MANDIR',
      'CAPITAL PUMP',
      'PRABAT PUMP',
      'COLLEGE'
    ],
    assignedStand: 'Stand 4',
    departureTime: '4:45 PM',
    boardingStatus: 'Preparing',
    isOperatingToday: true,
    busesScheduledCount: 1
  },
  {
    id: 'route-04',
    routeNumber: 'Route 04',
    busNumber: 'MP 0504',
    stops: [
      'DUSHERA MAIDAN',
      'ASHOKA GARDEN MANDI',
      'APSRA TALKIES',
      'BIJLI GATE',
      'GOVINDPURA BUS STOP',
      'ITI GATE',
      'COLLEGE'
    ],
    assignedStand: 'Stand 2',
    departureTime: '4:45 PM',
    boardingStatus: 'Boarding',
    isOperatingToday: true,
    busesScheduledCount: 2,
    yesterdayBusNumber: '4050' // Changed bus today demonstration
  },
  {
    id: 'route-05',
    routeNumber: 'Route 05',
    busNumber: 'MP 0505',
    stops: [
      'COACH FACTORY',
      'DWARKA NAGAR',
      'RAILWAY COLONY',
      'DRM OFFICE',
      'KISHORE TALKIES',
      'HABIBA SCHOOL',
      'PUSPHA NAGAR',
      'SANGAM TENT HOUSE',
      'ASHOKA GARDEN THANA',
      'COLLEGE'
    ],
    assignedStand: 'Stand 5',
    departureTime: '4:45 PM',
    boardingStatus: 'Preparing',
    isOperatingToday: true,
    busesScheduledCount: 1
  },
  {
    id: 'route-06',
    routeNumber: 'Route 06',
    busNumber: 'MP 0506',
    stops: [
      'KAMLA PARK',
      'POLYTECHNIC CIRCLE',
      'RANG MAHAL TALKIES',
      'JAWAHAR CHOWK',
      'SHASTRI NAGAR BUS DEPOT',
      'P.N.T SQUARE',
      'MATA MANDIR',
      'TIN SHED',
      'COLLEGE'
    ],
    assignedStand: 'Stand 6',
    departureTime: '4:45 PM',
    boardingStatus: 'Boarding',
    isOperatingToday: true,
    busesScheduledCount: 3
  },
  {
    id: 'route-07',
    routeNumber: 'Route 07',
    busNumber: 'MP 0507',
    stops: [
      'NAYA BASERA',
      'NEHRU NAGAR (HARISH CHOWK)',
      'NEHRU NAGAR',
      'KAMLA NAGAR',
      'VAISHALI NAGAR',
      'MACT SQUARE',
      'COLLEGE'
    ],
    assignedStand: 'Stand 7',
    departureTime: '4:45 PM',
    boardingStatus: 'Preparing',
    isOperatingToday: true,
    busesScheduledCount: 2
  },
  {
    id: 'route-08',
    routeNumber: 'Route 08',
    busNumber: 'MP 0508',
    stops: [
      '2ND STOP',
      '1250 HOSPITAL',
      '5 NO. STOP',
      '6 NO. STOP',
      '6 ½ NO. STOP',
      'HAKIM HOTEL',
      'JYOTI TALKIES',
      'CHETAK BRIDGE RAILWAY LINE',
      'COLLEGE'
    ],
    assignedStand: 'Stand 8',
    departureTime: '4:45 PM',
    boardingStatus: 'Preparing',
    isOperatingToday: true,
    busesScheduledCount: 2
  },
  {
    id: 'route-09',
    routeNumber: 'Route 09',
    busNumber: 'MP 0509',
    stops: [
      'FINE AVENUE',
      'NAYA PURA STOP',
      'AKBARPUR',
      'DANISH NAGAR',
      'BANJARI',
      'BEMA KUNJ',
      'MAHABALI',
      'AMARNATH',
      'SHALIMAR',
      'SARVDHARM',
      'KALI MANDIR',
      'RAM MANDIR',
      'CHUNA BHATTI',
      'CHAR IMLI',
      'ARERA PETROL PUMP',
      'COLLEGE'
    ],
    assignedStand: 'Stand 9',
    departureTime: '4:45 PM',
    boardingStatus: 'Boarding',
    isOperatingToday: true,
    busesScheduledCount: 3
  },
  {
    id: 'route-10',
    routeNumber: 'Route 10',
    busNumber: 'MP 0510',
    stops: [
      'BANSAL HOSPITAL',
      'TRILANGA',
      'GULMOHAR COLONY',
      'BHARAT NAGAR',
      'SHAHPURA CENTRAL BANK',
      'HANUMAN MANDIR',
      '1100 QUARTER',
      'COLLEGE'
    ],
    assignedStand: 'Stand 10',
    departureTime: '4:45 PM',
    boardingStatus: 'Preparing',
    isOperatingToday: true,
    busesScheduledCount: 2
  },
  {
    id: 'route-11',
    routeNumber: 'Route 11',
    busNumber: 'MP 0511',
    stops: [
      '12 NO. STOP',
      'SAI BOARD',
      'ST. JOSEPH CO-ED SCHOOL',
      '10. ½ STOP',
      'FACTURE HOSPITAL',
      'SHALIMAR',
      'NAKA',
      'COLLEGE'
    ],
    assignedStand: 'Stand 11',
    departureTime: '4:45 PM',
    boardingStatus: 'Preparing',
    isOperatingToday: true,
    busesScheduledCount: 1
  },
  {
    id: 'route-12',
    routeNumber: 'Route 12',
    busNumber: 'MP 0512',
    stops: [
      'HOTEL MANAGEMENT',
      'BITTAN MARKET',
      'BAGHIRA APPARTMENTS',
      '10 No. STOP',
      'OLD CAMPION SCHOOL',
      '7 No. STOP',
      'MANSAROVAR COMPLEX',
      'SARGAM TALKIES',
      'PRAGATI PUMP',
      'COLLEGE'
    ],
    assignedStand: 'Stand 12',
    departureTime: '4:45 PM',
    boardingStatus: 'Boarding',
    isOperatingToday: true,
    busesScheduledCount: 2
  },
  {
    id: 'route-13',
    routeNumber: 'Route 13',
    busNumber: 'MP 0513',
    stops: [
      'MANDIDEEP MANA DABHA',
      'BUS STAND',
      'SAMARDHA',
      'FUN CITY',
      '11 MILE',
      'MISROD',
      'VRINDAVAN DABHA',
      'HANUMAN NAGAR',
      'DANISH NAGAR',
      'AHEMADPUR',
      'UNIVERSITY',
      'NARAYAN NAGAR',
      'RRL',
      'NAKA',
      'SANCHI DAIRY',
      'COLLEGE'
    ],
    assignedStand: 'Stand 13',
    departureTime: '4:45 PM',
    boardingStatus: 'Preparing',
    isOperatingToday: true,
    busesScheduledCount: 4
  },
  {
    id: 'route-14',
    routeNumber: 'Route 14',
    busNumber: 'MP 0514',
    stops: [
      'KATARA PULLIYA',
      'STATE BANK',
      'MOUNT CARMEL SCHOOL',
      'RAJA BHOJ',
      'HOUSING BOARD COLONY',
      'AIMS ROAD CHOURAHA',
      'SAGAR PUBLIC SCHOOL TURNING',
      'ALKAPURI GATE (GURU DWARA)',
      'COLLEGE'
    ],
    assignedStand: 'Stand 14',
    departureTime: '4:45 PM',
    boardingStatus: 'Preparing',
    isOperatingToday: true,
    busesScheduledCount: 2
  },
  {
    id: 'route-15',
    routeNumber: 'Route 15',
    busNumber: 'MP 0515',
    stops: [
      'RAILWAY COLONY',
      'STATE BANK',
      'ALKAPURI GATE No. 9',
      'ALKAPURI GATE No. 7',
      'ALKAPURI GATE No. 5',
      'SAKET NAGAR DAIRY',
      'PANCHWATI COMPLEX',
      'SAKET NAGAR PULIYA',
      'ROSE GARDEN',
      'BERKHERA CHURCH',
      'GANDHI SQUARE',
      'SHIV MANDIR',
      'JAIN MANDIR',
      'VIKRAM SCHOOL',
      'COLLEGE'
    ],
    assignedStand: 'Stand 15',
    departureTime: '4:45 PM',
    boardingStatus: 'Preparing',
    isOperatingToday: true,
    busesScheduledCount: 2
  },
  {
    id: 'route-16',
    routeNumber: 'Route 16',
    busNumber: 'MP 0516',
    stops: [
      'RISHIPURAM',
      'VIDYA SAGAR COLLEGE',
      'AWADHPURI',
      'SOS',
      'PIPLANI B-SECTOR',
      'ANAND NAGAR',
      'SIDDHARTH LAKE CITY',
      'COLLEGE'
    ],
    assignedStand: 'Stand 16',
    departureTime: '4:45 PM',
    boardingStatus: 'Boarding',
    isOperatingToday: true,
    busesScheduledCount: 1
  },
  {
    id: 'route-17',
    routeNumber: 'Route 17',
    busNumber: 'MP 0517',
    stops: [
      'CHETAK BRIDGE',
      'RACHANA NAGAR MAIN ROAD',
      'SHANTI NIKATAN',
      'GUTAM NAGAR MAIN ROAD',
      'SAWANTIKA PETROL PUMP',
      'GAS GODOWN',
      'SECURITY LINE',
      'COLLEGE'
    ],
    assignedStand: 'Stand 17',
    departureTime: '4:45 PM',
    boardingStatus: 'Preparing',
    isOperatingToday: true,
    busesScheduledCount: 2
  },
  {
    id: 'route-18',
    routeNumber: 'Route 18',
    busNumber: 'MP 0518',
    stops: [
      'MINAL RESIDENCY',
      'CHATRASAL NAGAR',
      'BHARAT NAGAR',
      'NIZAMUDDIN TEA POINT',
      'BHEL GATE No. 01',
      'BAJRANG DAIRY',
      'BIMA HOSPITAL',
      'COLLEGE'
    ],
    assignedStand: 'Stand 18',
    departureTime: '4:45 PM',
    boardingStatus: 'Boarding',
    isOperatingToday: true,
    busesScheduledCount: 2
  },
  {
    id: 'route-19',
    routeNumber: 'Route 19',
    busNumber: 'MP 0519',
    stops: [
      'PIPLANI PETROL PUMP',
      'KALPANA NAGAR',
      'RATNAGIRI SQUARE',
      'COLLEGE'
    ],
    assignedStand: 'Stand 19',
    departureTime: '4:45 PM',
    boardingStatus: 'Preparing',
    isOperatingToday: true,
    busesScheduledCount: 1
  },
  {
    id: 'route-20',
    routeNumber: 'Route 20',
    busNumber: 'MP 0520',
    stops: [
      'AYODHYA NAGAR',
      'SAGAR AVENUE',
      'NARELA SQUARE',
      'TANA TAN DHABA',
      'QUEEN MERRY SCHOOL',
      'RAJIV NAGAR',
      'PRAKASH NAGAR',
      'BHEL NAGAR',
      'ANAND NAGAR MANDI',
      'RATNA GIRI TIRAHA',
      'COLLEGE'
    ],
    assignedStand: 'Stand 20',
    departureTime: '4:45 PM',
    boardingStatus: 'Preparing',
    isOperatingToday: true,
    busesScheduledCount: 2
  }
];

// Extract all unique stops across all routes for search and picker
export const getAllUniqueStops = (): string[] => {
  const set = new Set<string>();
  INITIAL_ROUTES.forEach(route => {
    route.stops.forEach(stop => set.add(stop));
  });
  return Array.from(set).sort();
};
