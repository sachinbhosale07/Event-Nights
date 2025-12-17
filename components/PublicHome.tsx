import React, { useState, useEffect } from 'react';
import Hero from './Hero';
import FeaturedIn from './FeaturedIn';
import ConferenceSidebar from './ConferenceSidebar';
import EventList from './EventList';
import Footer from './Footer';
import Newsletter from './Newsletter';
import SubmitConferenceModal from './SubmitConferenceModal';
import SubmitEventModal from './SubmitEventModal';
import { MONTHS } from '../constants';
import { MonthOption, Conference, EventItem } from '../types';
import { fetchConferences, fetchAllEvents, seedDatabase, createConference, createEvent, getConnectionStatus } from '../services/db';
import { Loader2, Database, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

// Helper to generate dynamic months based on actual conference data
const getCombinedMonths = (baseMonths: MonthOption[], conferences: Conference[]): MonthOption[] => {
  const existingMap = new Map<string, MonthOption>();
  // Initialize with base months
  baseMonths.forEach(m => existingMap.set(`${m.year}-${m.monthIndex}`, m));

  conferences.forEach(conf => {
     if (!conf.month || !conf.year) return;
     // Parse month name to index (e.g. "Dec" -> 11)
     const date = new Date(`${conf.month} 1, ${conf.year}`);
     if (isNaN(date.getTime())) return;
     
     const monthIndex = date.getMonth();
     const key = `${conf.year}-${monthIndex}`;
     
     if (!existingMap.has(key)) {
         existingMap.set(key, {
             label: `${conf.month} ${conf.year}`,
             year: conf.year,
             monthIndex: monthIndex
         });
     }
  });

  // Sort chronologically
  return Array.from(existingMap.values()).sort((a, b) => {
     if (a.year !== b.year) return a.year - b.year;
     return a.monthIndex - b.monthIndex;
  });
};

const PublicHome: React.FC = () => {
  const [monthsList, setMonthsList] = useState<MonthOption[]>(MONTHS);
  const [selectedMonth, setSelectedMonth] = useState<MonthOption>(MONTHS[0]);
  const [selectedConferenceId, setSelectedConferenceId] = useState<string>('');
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [dbStatus, setDbStatus] = useState<{status: string, message: string} | null>(null);

  const [isSubmitConferenceModalOpen, setIsSubmitConferenceModalOpen] = useState(false);
  const [isSubmitEventModalOpen, setIsSubmitEventModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const status = await getConnectionStatus();
        setDbStatus(status);

        const [confsData, eventsData] = await Promise.all([
          fetchConferences(),
          fetchAllEvents()
        ]);
        
        // 1. Calculate dynamic months from data
        const dynamicMonths = getCombinedMonths(MONTHS, confsData);
        setMonthsList(dynamicMonths);
        setConferences(confsData);
        setEvents(eventsData);

        // 2. Handle URL parameters
        const paramId = searchParams.get('c');
        if (paramId) {
            const foundConf = confsData.find(c => c.id === paramId);
            if (foundConf) {
                setSelectedConferenceId(foundConf.id);
                // Use dynamicMonths to find the correct month object
                const foundMonth = dynamicMonths.find(m => m.label.startsWith(foundConf.month) && m.year === foundConf.year);
                if (foundMonth) {
                    setSelectedMonth(foundMonth);
                }
                setIsLoading(false);
                return;
            }
        }

        // 3. Default selection logic
        if (confsData.length > 0 && !selectedConferenceId) {
            // Find the first published conference to default to
            const firstPublished = confsData.find(c => c.status === 'Published');
            
            if (firstPublished) {
                 setSelectedConferenceId(firstPublished.id);
                 const publishedMonth = dynamicMonths.find(m => m.label.startsWith(firstPublished.month) && m.year === firstPublished.year);
                 if (publishedMonth) setSelectedMonth(publishedMonth);
            } else {
                 // Fallback to first available conference even if draft
                 setSelectedConferenceId(confsData[0].id);
                 const fallbackMonth = dynamicMonths.find(m => m.label.startsWith(confsData[0].month) && m.year === confsData[0].year);
                 if (fallbackMonth) setSelectedMonth(fallbackMonth);
            }
        }
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedDatabase();
      const [confsData, eventsData] = await Promise.all([
        fetchConferences(),
        fetchAllEvents()
      ]);
      // Update months after seeding
      const dynamicMonths = getCombinedMonths(MONTHS, confsData);
      setMonthsList(dynamicMonths);
      setConferences(confsData);
      setEvents(eventsData);
    } catch (e) {
      alert("Error seeding database. Check console.");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleSubmitConference = async (data: any) => {
    try {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        const monthShort = start.toLocaleString('en-US', { month: 'short' });
        const startDay = start.getDate();
        const endDay = end.getDate();
        const year = start.getFullYear();
        
        const newConfData: Omit<Conference, 'id'> = {
            name: data.name,
            location: data.fullLocation,
            city: data.city,
            country: data.country,
            startDate: data.startDate,
            endDate: data.endDate,
            description: data.description,
            month: monthShort,
            year: year,
            dateRange: `${monthShort} ${startDay} - ${monthShort} ${endDay}`,
            status: 'Draft',
            websiteUrl: data.websiteUrl,
            bannerImage: data.imageUrl
        };

        await createConference(newConfData);
        
        // Reload data to reflect new months/conferences
        const confsData = await fetchConferences();
        const dynamicMonths = getCombinedMonths(MONTHS, confsData);
        setMonthsList(dynamicMonths);
        setConferences(confsData);
        
        alert("Conference submitted successfully! It is now pending review.");
    } catch (error) {
        console.error("Submission failed", error);
        alert("Failed to submit conference.");
    }
  };

  const handleSubmitEvent = async (data: any) => {
      try {
          await createEvent({
              ...data,
              status: 'Draft'
          });
          
          const eventsData = await fetchAllEvents();
          setEvents(eventsData);
          
          alert("Event submitted successfully for review!");
      } catch (error) {
          console.error("Event submission failed", error);
          alert("Failed to submit event.");
      }
  };

  const handleSelectConference = (id: string) => {
    setSelectedConferenceId(id);
    setSearchParams({ c: id });
  };

  const handleSelectMonth = (month: MonthOption) => {
      setSelectedMonth(month);
      const confsInMonth = conferences.filter(c => c.month === month.label.split(' ')[0] && c.year === month.year && c.status === 'Published');
      
      if (confsInMonth.length > 0) {
          setSelectedConferenceId(confsInMonth[0].id);
          setSearchParams({ c: confsInMonth[0].id });
      } else {
          setSearchParams({});
          setSelectedConferenceId('');
      }
  };

  const filteredConferences = conferences.filter(
    (c) => c.month === selectedMonth.label.split(' ')[0] && c.year === selectedMonth.year && c.status === 'Published'
  );

  const displayedConferences = filteredConferences.length > 0 ? filteredConferences : [];
  const filteredEvents = events.filter(e => e.conferenceId === selectedConferenceId && e.status === 'Published');
  const activeConference = displayedConferences.find(c => c.id === selectedConferenceId) || displayedConferences[0];

  if (isLoading) {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-txt-dim font-medium animate-pulse">Loading events...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-txt-main font-sans selection:bg-primary/30 selection:text-white">
      
      <Hero onOpenSubmitEventModal={() => setIsSubmitEventModalOpen(true)} />
      
      <FeaturedIn />
      
      <main className="container mx-auto px-4 md:px-6 py-12">
            
            {conferences.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-xl bg-surface/30">
                    <Database size={48} className="text-txt-dim mb-4" />
                    <h2 className="text-xl font-bold mb-2 text-white">No Data Available</h2>
                    <p className="text-txt-muted mb-6 max-w-md text-center">
                        The database appears to be empty.
                    </p>
                    <button 
                        onClick={handleSeed}
                        disabled={isSeeding}
                        className="bg-primary hover:bg-primaryHover disabled:opacity-50 text-background px-6 py-3 rounded-lg font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                        {isSeeding ? <Loader2 className="animate-spin" size={18} /> : <Database size={18} />}
                        Reset Demo Data
                    </button>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Left: Conferences List with Integrated Timeline */}
                    <ConferenceSidebar 
                        months={monthsList}
                        selectedMonth={selectedMonth}
                        onSelectMonth={handleSelectMonth}
                        conferences={displayedConferences}
                        selectedConferenceId={activeConference?.id || ''}
                        onSelect={handleSelectConference}
                        onOpenSubmitModal={() => setIsSubmitConferenceModalOpen(true)}
                    />
                    
                    {/* Right: Event Schedule Table */}
                    <EventList 
                        conference={activeConference} 
                        events={filteredEvents}
                        onOpenSubmitEventModal={() => setIsSubmitEventModalOpen(true)}
                        months={monthsList}
                        selectedMonth={selectedMonth}
                        onSelectMonth={handleSelectMonth}
                    />
                </div>
            )}
      </main>

      <Newsletter />

      <Footer />

      {/* Database Status Indicator */}
      {dbStatus && (
        <div className="fixed bottom-4 right-4 z-[60] animate-fade-in-up">
            <div className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold shadow-lg backdrop-blur-md
                ${dbStatus.status === 'connected' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : ''}
                ${dbStatus.status === 'missing_tables' ? 'bg-red-500/10 border-red-500/30 text-red-400' : ''}
                ${dbStatus.status === 'demo' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : ''}
                ${dbStatus.status === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : ''}
            `}>
                {dbStatus.status === 'connected' && <Wifi size={12} />}
                {dbStatus.status === 'missing_tables' && <AlertTriangle size={12} />}
                {dbStatus.status === 'demo' && <WifiOff size={12} />}
                {dbStatus.status === 'error' && <AlertTriangle size={12} />}
                <span>{dbStatus.message}</span>
            </div>
        </div>
      )}

      <SubmitConferenceModal 
        isOpen={isSubmitConferenceModalOpen} 
        onClose={() => setIsSubmitConferenceModalOpen(false)} 
        onSubmit={handleSubmitConference}
      />

      <SubmitEventModal
        isOpen={isSubmitEventModalOpen}
        onClose={() => setIsSubmitEventModalOpen(false)}
        onSubmit={handleSubmitEvent}
        conferences={conferences}
        preSelectedConferenceId={selectedConferenceId}
      />
    </div>
  );
};

export default PublicHome;