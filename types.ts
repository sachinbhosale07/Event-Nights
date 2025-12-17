
export type Status = 'Draft' | 'Published';

export interface Conference {
  id: string;
  name: string;
  // Location
  city: string;
  country: string;
  location: string; // Combined string for display (e.g. "Las Vegas, NV")
  
  // Dates
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  dateRange: string; // Display string e.g. "Dec 4 - Dec 5"
  month: string; // Derived for grouping e.g. "Dec"
  year: number; // Derived for grouping e.g. 2025
  
  // Details
  description: string;
  fullDescription?: string; // Rich text placeholder
  websiteUrl?: string;
  bannerImage?: string;
  logo?: string;
  organizer?: string;
  tags?: string[];
  status: Status;
}

export interface EventItem {
  id: string;
  conferenceId?: string; // Nullable for Independent Events
  
  // Details
  title: string;
  description: string;
  category?: string;
  status: Status;
  
  // Timing
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime?: string;
  
  // Location
  venueName: string;
  locationAddress?: string; // Specific address
  locationName: string; // For backward compatibility/display
  
  // Host/Organizer
  host: string;
  capacity?: number;
  
  // Links/Media
  registrationUrl?: string; // Ticket link
  link?: string; // Backward compatibility alias for registrationUrl
  image?: string;
  tags?: string[];
}

export interface MonthOption {
  label: string;
  year: number;
  monthIndex: number; // 0-11
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  lastActive: string;
  status: 'Active' | 'Inactive' | 'Invited';
}
