import { supabase } from '../supabaseClient';
import { CONFERENCES, EVENTS } from '../constants';
import { Conference, EventItem } from '../types';

// Check if configured
export const isDatabaseConfigured = () => {
  // Access protected properties to check configuration by casting to any
  const client = supabase as any;
  const url = client.supabaseUrl;
  const key = client.supabaseKey;
  
  return (
    url && 
    url !== 'https://your-project.supabase.co' && 
    key && 
    key !== 'your-anon-key'
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
  if (!isDatabaseConfigured()) return { status: 'demo', message: 'Supabase not configured' };
  
  try {
    // Try to select 1 record to check connection and table existence
    const { error } = await supabase.from('conferences').select('id').limit(1);
    
    if (error) {
      if (isTableMissingError(error)) {
          return { status: 'missing_tables', message: 'Tables not found in DB' };
      }
      return { status: 'error', message: error.message };
    }
    
    return { status: 'connected', message: 'Database Connected' };
  } catch (e) {
    console.warn("Connection check failed:", e);
    return { status: 'demo', message: 'Demo Mode (Offline)' };
  }
};

// --- READ ---

export const fetchConferences = async (): Promise<Conference[]> => {
  if (!isDatabaseConfigured()) {
    return [...CONFERENCES];
  }

  try {
    const { data, error } = await supabase
      .from('conferences')
      .select('*')
      .order('startDate', { ascending: true });

    if (error) {
      if (isTableMissingError(error)) {
        console.warn("Table 'conferences' not found. Falling back to demo data.");
        return [...CONFERENCES];
      }
      console.error('Error fetching conferences:', error.message);
      return [...CONFERENCES];
    }

    return data as Conference[];
  } catch (e) {
    console.warn("Network error fetching conferences, using demo data.");
    return [...CONFERENCES];
  }
};

export const fetchConferenceById = async (id: string): Promise<Conference | undefined> => {
  if (!isDatabaseConfigured()) {
     return CONFERENCES.find(c => c.id === id);
  }

  try {
    const { data, error } = await supabase
      .from('conferences')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (isTableMissingError(error)) {
          return CONFERENCES.find(c => c.id === id);
      }
      console.error('Error fetching conference:', error.message);
      return CONFERENCES.find(c => c.id === id);
    }

    return data as Conference;
  } catch (e) {
    return CONFERENCES.find(c => c.id === id);
  }
};

export const fetchAllEvents = async (): Promise<EventItem[]> => {
  if (!isDatabaseConfigured()) {
    return [...EVENTS];
  }

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      if (isTableMissingError(error)) {
        console.warn("Table 'events' not found. Falling back to demo data.");
        return [...EVENTS];
      }
      console.error('Error fetching events:', error.message);
      return [...EVENTS];
    }

    return data as EventItem[];
  } catch (e) {
    console.warn("Network error fetching events, using demo data.");
    return [...EVENTS];
  }
};

export const fetchEventsByConference = async (conferenceId: string): Promise<EventItem[]> => {
  if (!isDatabaseConfigured()) {
    return EVENTS.filter(e => e.conferenceId === conferenceId);
  }

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('conferenceId', conferenceId)
      .order('date', { ascending: true })
      .order('startTime', { ascending: true });

    if (error) {
      if (isTableMissingError(error)) {
          return EVENTS.filter(e => e.conferenceId === conferenceId);
      }
      console.error('Error fetching conference events:', error.message);
      return EVENTS.filter(e => e.conferenceId === conferenceId);
    }

    return data as EventItem[];
  } catch (e) {
    return EVENTS.filter(e => e.conferenceId === conferenceId);
  }
};

export const fetchIndependentEvents = async (): Promise<EventItem[]> => {
  if (!isDatabaseConfigured()) {
    return EVENTS.filter(e => !e.conferenceId);
  }

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .is('conferenceId', null)
      .order('date', { ascending: true });

    if (error) {
      if (isTableMissingError(error)) {
          return EVENTS.filter(e => !e.conferenceId);
      }
      console.error('Error fetching independent events:', error.message);
      return EVENTS.filter(e => !e.conferenceId);
    }

    return data as EventItem[];
  } catch (e) {
    return EVENTS.filter(e => !e.conferenceId);
  }
};

// --- CRUD Operations ---

// Events
export const createEvent = async (event: Omit<EventItem, 'id'>) => {
  const fallback = { id: 'temp_' + Date.now(), ...event };
  
  if (!isDatabaseConfigured()) {
     alert("Database not configured. Using mock storage.");
     return fallback;
  }

  try {
    // Handle compatibility fields for the DB if needed
    const payload = {
      ...event,
      // Ensure we have values for these if the DB expects them
      locationName: event.venueName, 
      link: event.registrationUrl
    };

    const { data, error } = await supabase
      .from('events')
      .insert([payload])
      .select()
      .single();

    if (error) {
      if (isTableMissingError(error)) { 
          console.warn("Table 'events' missing. Mocking creation success.");
          return fallback;
      }
      console.error('Error creating event:', error.message);
      throw error;
    }

    return data;
  } catch (e) {
    console.warn("Network error creating event, using mock.");
    alert("Network error. Event created locally.");
    return fallback;
  }
};

export const updateEvent = async (id: string, event: Partial<EventItem>) => {
  if (!isDatabaseConfigured()) return;

  try {
    const payload = { ...event };
    if (event.venueName) payload.locationName = event.venueName;
    if (event.registrationUrl) payload.link = event.registrationUrl;

    const { error } = await supabase
      .from('events')
      .update(payload)
      .eq('id', id);

    if (error) {
      if (isTableMissingError(error)) return;
      console.error('Error updating event:', error.message);
      throw error;
    }
  } catch (e) {
    console.error("Network error updating event");
    throw e;
  }
};

export const deleteEvent = async (id: string) => {
  if (!isDatabaseConfigured()) return;

  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      if (isTableMissingError(error)) return;
      console.error('Error deleting event:', error.message);
      throw error;
    }
  } catch (e) {
    console.error("Network error deleting event");
    throw e;
  }
};

// Conferences
export const createConference = async (conference: Omit<Conference, 'id'>) => {
  const fallback = { id: 'temp_' + Date.now(), ...conference };

  if (!isDatabaseConfigured()) {
    alert("Database not configured.");
    return fallback;
  }

  try {
    const { data, error } = await supabase
      .from('conferences')
      .insert([conference])
      .select()
      .single();

    if (error) {
      if (isTableMissingError(error)) {
          console.warn("Table 'conferences' missing. Mocking creation success.");
          return fallback;
      }
      console.error('Error creating conference:', error.message);
      throw error;
    }

    return data;
  } catch (e) {
     console.warn("Network error creating conference, using mock.");
     alert("Network error. Conference created locally.");
     return fallback;
  }
};

export const updateConference = async (id: string, conference: Partial<Conference>) => {
  if (!isDatabaseConfigured()) return;

  try {
    const { error } = await supabase
      .from('conferences')
      .update(conference)
      .eq('id', id);

    if (error) {
      if (isTableMissingError(error)) return;
      console.error('Error updating conference:', error.message);
      throw error;
    }
  } catch (e) {
    console.error("Network error updating conference");
    throw e;
  }
};

export const deleteConference = async (id: string, deleteEvents: boolean = false) => {
  if (!isDatabaseConfigured()) return;

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

    if (error) {
      if (isTableMissingError(error)) return;
      console.error('Error deleting conference:', error.message);
      throw error;
    }
  } catch (e) {
    console.error("Network error deleting conference");
    throw e;
  }
};

// Seed function to populate empty Supabase DB with constants
export const seedDatabase = async () => {
  if (!isDatabaseConfigured()) {
    console.log("Supabase not configured, skipping seed.");
    return;
  }

  console.log("Seeding database...");
  
  try {
      await supabase.from('conferences').delete().neq('name', '___'); 
      await supabase.from('events').delete().neq('title', '___');
  } catch (e) {
      console.warn("Could not clear tables, maybe they don't exist or network failed.");
      return;
  }

  // Insert Conferences
  const oldIdToNewIdMap: Record<string, string> = {};

  try {
    for (const conf of CONFERENCES) {
      const { id, ...confData } = conf; // Remove string ID
      const { data, error } = await supabase
          .from('conferences')
          .insert([confData])
          .select()
          .single();
      
      if (error) {
          console.error("Failed to insert conf", conf.name, error.message);
      } else if (data) {
          oldIdToNewIdMap[id] = data.id;
      }
    }

    // Insert Events
    const eventsToInsert = EVENTS.map(evt => {
      const { id, conferenceId, ...evtData } = evt;
      const newConfId = conferenceId ? oldIdToNewIdMap[conferenceId] : null;
      return {
          ...evtData,
          conferenceId: newConfId,
          locationName: evt.venueName,
          link: evt.registrationUrl
      };
    });

    const { error: eventError } = await supabase
      .from('events')
      .insert(eventsToInsert);

    if (eventError) {
      console.error("Error seeding events:", eventError.message);
      return;
    }

    console.log("Database seeded successfully with demo data.");
    window.location.reload();
  } catch (e) {
    console.error("Seed failed due to network error", e);
    alert("Failed to seed database: Network Error");
  }
};