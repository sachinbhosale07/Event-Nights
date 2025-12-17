
import { EventItem } from './types';

export const generateGoogleCalendarUrl = (event: EventItem): string => {
  try {
    if (!event.date || !event.startTime) return '';

    // Helper: Construct a date object from date string (YYYY-MM-DD) and time string (HH:MM AM/PM or HH:MM)
    const createDateTime = (dateStr: string, timeStr: string): Date => {
        // 1. Parse Date Components (YYYY-MM-DD)
        const dateParts = dateStr.split('-').map(Number);
        if (dateParts.length !== 3) throw new Error("Invalid date format");
        const [year, month, day] = dateParts;
        
        // 2. Parse Time Components
        // Normalize: remove all whitespace (including non-breaking spaces like \u202F which toLocaleTimeString often produces)
        // and convert to lowercase.
        const cleanTime = timeStr.toLowerCase().replace(/[\s\u202F\u00A0]+/g, ''); 
        
        // Match 12h or 24h format
        // Matches: "8:50am", "08:50pm", "20:00", "9:00"
        const timeMatch = cleanTime.match(/(\d{1,2}):(\d{2})([ap]m)?/);
        
        if (!timeMatch) throw new Error("Invalid time format");
        
        let hours = parseInt(timeMatch[1], 10);
        const minutes = parseInt(timeMatch[2], 10);
        const meridian = timeMatch[3]; // 'am' or 'pm' or undefined

        if (meridian === 'pm' && hours < 12) hours += 12;
        if (meridian === 'am' && hours === 12) hours = 0;

        // Create Date object (Local Time)
        return new Date(year, month - 1, day, hours, minutes, 0);
    };

    const startDateTime = createDateTime(event.date, event.startTime);
    if (isNaN(startDateTime.getTime())) throw new Error("Invalid start time value");

    // Calculate End Time
    let endDateTime: Date;
    if (event.endTime) {
        try {
            endDateTime = createDateTime(event.date, event.endTime);
            // Handle overnight events (if end time is earlier than start time, assume next day)
            if (endDateTime < startDateTime) {
                 endDateTime.setDate(endDateTime.getDate() + 1);
            }
        } catch (e) {
             // Fallback: 1 hour duration if end time parse fails
             endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
        }
    } else {
         // Default: 1 hour duration
         endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
    }
    
    // Safety check for invalid end date
    if (isNaN(endDateTime.getTime())) {
         endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
    }

    // Format for Google Calendar: YYYYMMDDTHHmmssZ (UTC)
    const formatDate = (date: Date): string => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };

    const start = formatDate(startDateTime);
    const end = formatDate(endDateTime);

    const details = `${event.description || ''}\n\nHost: ${event.host}\nLink: ${event.registrationUrl || event.link || ''}`;
    const location = event.venueName + (event.locationAddress ? `, ${event.locationAddress}` : '');

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${start}/${end}`,
      details: details,
      location: location,
      sf: 'true',
      output: 'xml',
    });

    return `https://www.google.com/calendar/render?${params.toString()}`;
  } catch (e) {
    console.warn("Error generating calendar URL:", e);
    return '';
  }
};
