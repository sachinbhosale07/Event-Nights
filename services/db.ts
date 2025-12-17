
import { supabase } from '../supabaseClient';
import { CONFERENCES, EVENTS } from '../constants';
import { Conference, EventItem } from '../types';

// Storage Keys
const LS_KEYS = {
  CONFERENCES: 'cn_conferences_data',
  EVENTS: 'cn_events_data'
};

// Helper to initialize LocalStorage with demo data if empty
const initLocalStorage = () => {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem(LS_KEYS.CONFERENCES)) {
    localStorage.setItem(LS_KEYS.CONFERENCES, JSON.stringify(CONFERENCES));
  }
  if (!localStorage.getItem(LS_KEYS.EVENTS)) {
    localStorage.setItem(LS_KEYS.EVENTS, JSON.stringify(EVENTS));
  }
};

// Initialize immediately
initLocalStorage();

const getLocal = <T>(key: string): T[] => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
};

const setLocal = (key: string, data: any[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Check if configured
export const isDatabaseConfigured = () => {
  const client = supabase as any;
  const url = client.supabaseUrl;
  const key = client.supabaseKey;
  return (
    url && 
    url.includes('supabase.co') &&
    key && 
    key.length > 20
  );
};

// Helper to check for missing table errors
const isTableMissingError = (error: any) => {
  return (
    error.code === '42P01' || // Postgres: undefined_table
    (error.message && error.message.includes('Could not find the table')) // Client: schema cache miss
  );
};

// --- STATUS CHECK ---
export const getConnectionStatus = async () => {
  if (!isDatabaseConfigured()) return { status: 'demo', message: 'Local Mode' };
  
  try {
    const { error } = await supabase.from('conferences').select('id').limit(1);
    
    if (error) {
      if (isTableMissingError(error)) {
          return { status: 'missing_tables', message: 'Tables Missing' };
      }
      // If authenticaton fails, we also fall back to demo/local
      return { status: 'error', message: 'DB Error (Using Local)' };
    }
    
    return { status: 'connected', message: 'Database Connected' };
  } catch (e) {
    return { status: 'demo', message: 'Offline Mode' };
  }
};

// --- READ ---

export const fetchConferences = async (): Promise<Conference[]> => {
  // Try DB first
  if (isDatabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('conferences')
        .select('*')
        .order('startDate', { ascending: true });

      if (!error && data) return data as Conference[];
    } catch (e) {
      console.warn("DB fetch failed, using local");
    }
  }
  // Fallback to LocalStorage
  return getLocal<Conference>(LS_KEYS.CONFERENCES);
};

export const fetchConferenceById = async (id: string): Promise<Conference | undefined> => {
  if (isDatabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('conferences')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) return data as Conference;
    } catch (e) {
       console.warn("DB fetch failed, using local");
    }
  }
  return getLocal<Conference>(LS_KEYS.CONFERENCES).find(c => c.id === id);
};

export const fetchAllEvents = async (): Promise<EventItem[]> => {
  if (isDatabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (!error && data) return data as EventItem[];
    } catch (e) {
      console.warn("DB fetch failed, using local");
    }
  }
  return getLocal<EventItem>(LS_KEYS.EVENTS);
};

export const fetchEventsByConference = async (conferenceId: string): Promise<EventItem[]> => {
  if (isDatabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('conferenceId', conferenceId)
        .order('date', { ascending: true })
        .order('startTime', { ascending: true });

      if (!error && data) return data as EventItem[];
    } catch (e) {
       console.warn("DB fetch failed, using local");
    }
  }
  return getLocal<EventItem>(LS_KEYS.EVENTS).filter(e => e.conferenceId === conferenceId);
};

export const fetchIndependentEvents = async (): Promise<EventItem[]> => {
   if (isDatabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .is('conferenceId', null)
        .order('date', { ascending: true });

      if (!error && data) return data as EventItem[];
    } catch (e) {
       console.warn("DB fetch failed, using local");
    }
  }
  return getLocal<EventItem>(LS_KEYS.EVENTS).filter(e => !e.conferenceId);
};

// --- CRUD Operations ---

// Events
export const createEvent = async (event: Omit<EventItem, 'id'>) => {
  const newEvent = { id: 'evt_' + Date.now(), ...event } as EventItem;
  
  if (isDatabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...event,
          conferenceId: event.conferenceId || null
        }])
        .select()
        .single();

      if (!error && data) return data;
    } catch (e) {
      console.warn("DB create failed, using local");
    }
  }

  // Local Fallback
  const events = getLocal<EventItem>(LS_KEYS.EVENTS);
  events.push(newEvent);
  setLocal(LS_KEYS.EVENTS, events);
  return newEvent;
};

export const updateEvent = async (id: string, event: Partial<EventItem>) => {
  if (isDatabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('events')
        .update(event)
        .eq('id', id);

      if (error) console.warn("DB update failed:", error);
      // Fall through to update local as well, in case we are looking at local data
    } catch (e) {
      console.warn("DB update exception, trying local");
    }
  }

  // Local Update
  const events = getLocal<EventItem>(LS_KEYS.EVENTS);
  const index = events.findIndex(e => e.id === id);
  if (index !== -1) {
    events[index] = { ...events[index], ...event };
    setLocal(LS_KEYS.EVENTS, events);
  }
};

export const deleteEvent = async (id: string) => {
  if (isDatabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
        
      if (error) console.warn("DB delete failed:", error);
      // Fall through to delete local as well
    } catch (e) {
      console.warn("DB delete exception, trying local");
    }
  }

  // Local Delete (Always attempt to remove from local storage to prevent zombie items)
  const events = getLocal<EventItem>(LS_KEYS.EVENTS);
  const filtered = events.filter(e => e.id !== id);
  setLocal(LS_KEYS.EVENTS, filtered);
};

// Conferences
export const createConference = async (conference: Omit<Conference, 'id'>) => {
  const newConf = { id: 'conf_' + Date.now(), ...conference } as Conference;

  if (isDatabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('conferences')
        .insert([conference])
        .select()
        .single();

      if (!error && data) return data;
    } catch (e) {
       console.warn("DB create failed, using local");
    }
  }

  // Local Fallback
  const confs = getLocal<Conference>(LS_KEYS.CONFERENCES);
  confs.push(newConf);
  setLocal(LS_KEYS.CONFERENCES, confs);
  return newConf;
};

export const updateConference = async (id: string, conference: Partial<Conference>) => {
  if (isDatabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('conferences')
        .update(conference)
        .eq('id', id);

      if (error) console.warn("DB update failed:", error);
      // Fall through to update local
    } catch (e) {
       console.warn("DB update exception, trying local");
    }
  }

  // Local Update
  const confs = getLocal<Conference>(LS_KEYS.CONFERENCES);
  const index = confs.findIndex(c => c.id === id);
  if (index !== -1) {
    confs[index] = { ...confs[index], ...conference };
    setLocal(LS_KEYS.CONFERENCES, confs);
  }
};

export const deleteConference = async (id: string, deleteEvents: boolean = false) => {
  if (isDatabaseConfigured()) {
    try {
      if (deleteEvents) {
        await supabase.from('events').delete().eq('conferenceId', id);
      } else {
        await supabase.from('events').update({ conferenceId: null }).eq('conferenceId', id);
      }

      const { error } = await supabase
        .from('conferences')
        .delete()
        .eq('id', id);

      if (error) console.warn("DB delete failed:", error);
      // Fall through to delete local
    } catch (e) {
       console.warn("DB delete exception, trying local");
    }
  }

  // Local Delete
  let confs = getLocal<Conference>(LS_KEYS.CONFERENCES);
  confs = confs.filter(c => c.id !== id);
  setLocal(LS_KEYS.CONFERENCES, confs);
  
  // Handle events linked to this conference locally
  let events = getLocal<EventItem>(LS_KEYS.EVENTS);
  if (deleteEvents) {
      events = events.filter(e => e.conferenceId !== id);
  } else {
      events = events.map(e => e.conferenceId === id ? { ...e, conferenceId: undefined } : e);
  }
  setLocal(LS_KEYS.EVENTS, events);
};

export const seedDatabase = async () => {
    // Reset to constants
    localStorage.setItem(LS_KEYS.CONFERENCES, JSON.stringify(CONFERENCES));
    localStorage.setItem(LS_KEYS.EVENTS, JSON.stringify(EVENTS));
    window.location.reload();
};
