import { EventItem } from './types';

export const generateGoogleCalendarUrl = (event: EventItem): string => {
  try {
    // Helper to format date to YYYYMMDDTHHmmssZ
    const formatDate = (date: Date): string => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };

    // Parse Date (YYYY-MM-DD)
    const startDateStr = event.date;
    
    // Parse Time (e.g., "8:50 AM")
    const parseTime = (timeStr: string, baseDate: string): Date => {
      const d = new Date(baseDate);
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      
      d.setHours(hours, minutes, 0, 0);
      return d;
    };

    const startDateTime = parseTime(event.startTime, startDateStr);
    
    // Calculate End Time (Default to 1 hour if not specified)
    let endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
    if (event.endTime) {
      endDateTime = parseTime(event.endTime, startDateStr);
      // Handle case where end time is past midnight (next day)
      if (endDateTime < startDateTime) {
        endDateTime.setDate(endDateTime.getDate() + 1);
      }
    }

    const start = formatDate(startDateTime);
    const end = formatDate(endDateTime);

    const details = `${event.description}\n\nHost: ${event.host}\nLink: ${event.registrationUrl || event.link || ''}`;
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
    console.error("Error generating calendar URL", e);
    return '#';
  }
};