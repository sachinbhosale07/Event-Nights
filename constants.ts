import { Conference, EventItem, MonthOption } from './types';

export const MONTHS: MonthOption[] = [
  { label: 'Dec 2025', year: 2025, monthIndex: 11 },
  { label: 'Jan 2026', year: 2026, monthIndex: 0 },
  { label: 'Feb 2026', year: 2026, monthIndex: 1 },
  { label: 'Mar 2026', year: 2026, monthIndex: 2 },
  { label: 'Apr 2026', year: 2026, monthIndex: 3 },
  { label: 'May 2026', year: 2026, monthIndex: 4 },
  { label: 'Jun 2026', year: 2026, monthIndex: 5 },
  { label: 'Jul 2026', year: 2026, monthIndex: 6 },
  { label: 'Aug 2026', year: 2026, monthIndex: 7 },
  { label: 'Sep 2026', year: 2026, monthIndex: 8 },
  { label: 'Oct 2026', year: 2026, monthIndex: 9 },
  { label: 'Nov 2026', year: 2026, monthIndex: 10 },
];

export const CONFERENCES: Conference[] = [
  // --- DECEMBER 2025 ---
  {
    id: 'c_awa_25',
    name: 'Affiliate World Asia',
    city: 'Bangkok',
    country: 'Thailand',
    location: 'Bangkok, Thailand',
    startDate: '2025-12-04',
    endDate: '2025-12-05',
    dateRange: 'Dec 4 - Dec 5',
    description: 'The world\'s premier gathering of influential affiliate marketers and ecommerce entrepreneurs.',
    month: 'Dec',
    year: 2025,
    status: 'Published',
    organizer: 'Affiliate World'
  },
  {
    id: 'c_igaming_africa',
    name: 'iGaming Expo Africa',
    city: 'Nairobi',
    country: 'Kenya',
    location: 'Nairobi, Kenya',
    startDate: '2025-12-01',
    endDate: '2025-12-03',
    dateRange: 'Dec 1 - Dec 3',
    description: 'Connecting the DACH iGaming community with the African market.',
    month: 'Dec',
    year: 2025,
    status: 'Published'
  },
  {
    id: 'c_sigma_eur',
    name: 'SiGMA Europe',
    city: 'Valletta',
    country: 'Malta',
    location: 'Valletta, Malta',
    startDate: '2025-12-10',
    endDate: '2025-12-14',
    dateRange: 'Dec 10 - Dec 14',
    description: 'The mother of all iGaming conferences closing out the year.',
    month: 'Dec',
    year: 2025,
    status: 'Published'
  },

  // --- JANUARY 2026 ---
  {
    id: 'c_asw_26',
    name: 'Affiliate Summit West',
    city: 'Las Vegas',
    country: 'USA',
    location: 'Las Vegas, NV',
    startDate: '2026-01-15',
    endDate: '2026-01-17',
    dateRange: 'Jan 15 - Jan 17',
    description: 'The industry\'s largest performance marketing event, taking over Caesars Forum.',
    month: 'Jan',
    year: 2026,
    status: 'Published'
  },
  {
    id: 'c_internext_26',
    name: 'InterNext Expo',
    city: 'Las Vegas',
    country: 'USA',
    location: 'Las Vegas, NV',
    startDate: '2026-01-18',
    endDate: '2026-01-20',
    dateRange: 'Jan 18 - Jan 20',
    description: 'The leading tech conference for the entertainment and dating industry.',
    month: 'Jan',
    year: 2026,
    status: 'Published'
  },

  // --- FEBRUARY 2026 ---
  {
    id: 'c_igb_26',
    name: 'iGB Affiliate',
    city: 'London',
    country: 'UK',
    location: 'London, UK',
    startDate: '2026-02-04',
    endDate: '2026-02-07',
    dateRange: 'Feb 4 - Feb 7',
    description: 'The most international gathering of iGaming Affiliates.',
    month: 'Feb',
    year: 2026,
    status: 'Published'
  },
  {
    id: 'c_tes_26',
    name: 'TES Affiliate Conference',
    city: 'Cascais',
    country: 'Portugal',
    location: 'Cascais, Portugal',
    startDate: '2026-02-23',
    endDate: '2026-02-26',
    dateRange: 'Feb 23 - Feb 26',
    description: 'Bringing together the brightest minds in the affiliate marketing industry.',
    month: 'Feb',
    year: 2026,
    status: 'Published'
  },

  // --- MARCH 2026 ---
  {
    id: 'c_leads_26',
    name: 'LeadsCon 2026',
    city: 'Las Vegas',
    country: 'USA',
    location: 'Las Vegas, NV',
    startDate: '2026-03-08',
    endDate: '2026-03-10',
    dateRange: 'Mar 8 - Mar 10',
    description: 'The world\'s largest conference for lead generation and performance marketing.',
    month: 'Mar',
    year: 2026,
    status: 'Published'
  },
  {
    id: 'c_shoptalk_26',
    name: 'Shoptalk 2026',
    city: 'Las Vegas',
    country: 'USA',
    location: 'Las Vegas, NV',
    startDate: '2026-03-17',
    endDate: '2026-03-20',
    dateRange: 'Mar 17 - Mar 20',
    description: 'Where retail changemakers come together to create the future of retail.',
    month: 'Mar',
    year: 2026,
    status: 'Published'
  }
];

export const EVENTS: EventItem[] = [
  // --- Affiliate World Asia (Dec 2025) ---
  {
    id: 'e_awa_1',
    conferenceId: 'c_awa_25',
    date: '2025-12-03',
    startTime: '8:50 AM',
    title: 'AFF+FIT 5km Run',
    description: 'RUN. CONNECT. RECHARGE Bangkok. Move with purpose. Connect with people who play at your level.',
    host: 'Conor Graham, VerdeAds',
    venueName: 'Lumphini Park',
    locationName: 'Lumphini Park',
    capacity: 100,
    tags: ['Health', 'Networking'],
    link: 'https://example.com/run',
    registrationUrl: 'https://example.com/run',
    status: 'Published'
  },
  {
    id: 'e_awa_2',
    conferenceId: 'c_awa_25',
    date: '2025-12-03',
    startTime: '9:00 AM',
    title: 'Ecom Black Code',
    description: 'Strategy. Style. Connections. An exclusive evening for e-commerce leaders leveraging AI.',
    host: 'Ecom Cipher',
    venueName: 'Secret Venue',
    locationName: 'Secret Venue',
    capacity: 100,
    tags: ['VIP', 'Ecom'],
    link: 'https://example.com/ecom',
    registrationUrl: 'https://example.com/ecom',
    status: 'Published'
  },
  {
    id: 'e_awa_3',
    conferenceId: 'c_awa_25',
    date: '2025-12-03',
    startTime: '10:00 AM',
    title: 'COFFEE & NETWORKING by VerdeAds',
    description: '☕ Kickstart your conference week with good energy and premium coffee.',
    host: 'VerdeAds',
    venueName: 'Vivente Life & Coffee',
    locationName: 'Vivente Life & Coffee',
    capacity: 100,
    status: 'Published'
  },
  {
    id: 'e_awa_4',
    conferenceId: 'c_awa_25',
    date: '2025-12-03',
    startTime: '11:30 AM',
    title: 'AW x STM Forum Alumni Meetup',
    description: 'Private networking event for past and current members of the Affiliate World Forum (STM Forum).',
    host: 'Affiliate World Conferences',
    venueName: 'Erawan Tea Room',
    locationName: 'Erawan Tea Room',
    capacity: 100,
    tags: ['Private'],
    link: 'https://example.com/stm',
    registrationUrl: 'https://example.com/stm',
    status: 'Published'
  },
  {
    id: 'e_awa_5',
    conferenceId: 'c_awa_25',
    date: '2025-12-03',
    startTime: '1:00 PM',
    title: 'Farmer Jack MasterMind',
    description: 'High-level roundtable event for elite affiliates hosted since 2016.',
    host: 'Farmer Jack',
    venueName: 'TBA',
    locationName: 'TBA',
    capacity: 20,
    tags: ['Mastermind'],
    status: 'Published'
  },
  // --- Affiliate Summit West (Jan 2026) ---
  {
    id: 'e_asw_1',
    conferenceId: 'c_asw_26',
    date: '2026-01-14',
    startTime: '5:00 PM',
    title: 'Pre-Summit Ice Breaker',
    description: 'Early arrival drinks for early birds hitting Vegas before the crowds.',
    host: 'Performance Club',
    venueName: 'Vanderpump Garden',
    locationName: 'Vanderpump Garden',
    capacity: 50,
    status: 'Published'
  },
  {
    id: 'e_asw_3',
    conferenceId: 'c_asw_26',
    date: '2026-01-15',
    startTime: '9:00 PM',
    title: 'The Affiliate Ball',
    description: 'The biggest party of the summit. Special guest performer TBA.',
    host: 'Affiliate Ball',
    venueName: 'Hakkasan Nightclub',
    locationName: 'Hakkasan Nightclub',
    capacity: 2000,
    tags: ['Party', 'Highlight'],
    status: 'Published'
  },
];
