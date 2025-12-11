import { CONFERENCES, EVENTS } from '../constants';
import { Conference, EventItem } from '../types';

const STORAGE_KEY_CONF = 'cn_conferences';
const STORAGE_KEY_EVENTS = 'cn_events';

// Helper to load initial state
const loadInitialConferences = (): Conference[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CONF);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to load conferences from storage", e);
  }
  return [...CONFERENCES];
};

const loadInitialEvents = (): EventItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_EVENTS);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to load events from storage", e);
  }
  return [...EVENTS];
};

// Mock in-memory DB initialized from storage or constants
let mockConferences: Conference[] = loadInitialConferences();
let mockEvents: EventItem[] = loadInitialEvents();

const saveToStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY_CONF, JSON.stringify(mockConferences));
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(mockEvents));
  } catch (e) {
    console.error("Failed to save to storage", e);
  }
};

export const isDatabaseConfigured = () => true;

// --- READ ---

export const fetchConferences = async (): Promise<Conference[]> => {
  return new Promise(resolve => setTimeout(() => resolve([...mockConferences]), 300));
};

export const fetchConferenceById = async (id: string): Promise<Conference | undefined> => {
  const conf = mockConferences.find(c => c.id === id);
  return new Promise(resolve => setTimeout(() => resolve(conf ? { ...conf } : undefined), 300));
};

export const fetchAllEvents = async (): Promise<EventItem[]> => {
  return new Promise(resolve => setTimeout(() => resolve([...mockEvents]), 300));
};

export const fetchEventsByConference = async (conferenceId: string): Promise<EventItem[]> => {
  const filtered = mockEvents.filter(e => e.conferenceId === conferenceId);
  return new Promise(resolve => setTimeout(() => resolve(filtered), 300));
};

export const fetchIndependentEvents = async (): Promise<EventItem[]> => {
    const filtered = mockEvents.filter(e => !e.conferenceId);
    return new Promise(resolve => setTimeout(() => resolve(filtered), 300));
};

// --- CRUD Operations ---

// Events
export const createEvent = async (event: Omit<EventItem, 'id'>) => {
  const newEvent: EventItem = { 
      ...event, 
      id: `e_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      locationName: event.venueName, // Compatibility
      link: event.registrationUrl // Compatibility
  };
  mockEvents.push(newEvent);
  saveToStorage();
  return { id: newEvent.id, ...newEvent };
};

export const updateEvent = async (id: string, event: Partial<EventItem>) => {
  mockEvents = mockEvents.map(e => {
      if (e.id === id) {
          const updated = { ...e, ...event };
          // Sync compatibility fields
          if (event.venueName) updated.locationName = event.venueName;
          if (event.registrationUrl) updated.link = event.registrationUrl;
          return updated;
      }
      return e;
  });
  saveToStorage();
  return;
};

export const deleteEvent = async (id: string) => {
  mockEvents = mockEvents.filter(e => e.id !== id);
  saveToStorage();
  return;
};

// Conferences
export const createConference = async (conference: Omit<Conference, 'id'>) => {
  const newConf: Conference = { 
      ...conference, 
      id: `c_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: conference.status || 'Draft'
  };
  mockConferences.push(newConf);
  saveToStorage();
  return { id: newConf.id, ...newConf };
};

export const updateConference = async (id: string, conference: Partial<Conference>) => {
  mockConferences = mockConferences.map(c => c.id === id ? { ...c, ...conference } : c);
  saveToStorage();
  return;
};

export const deleteConference = async (id: string, deleteEvents: boolean = false) => {
  mockConferences = mockConferences.filter(c => c.id !== id);
  if (deleteEvents) {
      mockEvents = mockEvents.filter(e => e.conferenceId !== id);
  } else {
      // Unlink events instead of deleting
      mockEvents = mockEvents.map(e => e.conferenceId === id ? { ...e, conferenceId: undefined } : e);
  }
  saveToStorage();
  return;
};

export const seedDatabase = async () => {
  console.log("Database seeded (mock) - Resetting to original constants");
  mockConferences = [...CONFERENCES];
  mockEvents = [...EVENTS];
  saveToStorage();
};