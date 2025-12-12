import React, { useState, useEffect } from 'react';
import Hero from './Hero';
import MonthNav from './MonthNav';
import ConferenceSidebar from './ConferenceSidebar';
import EventList from './EventList';
import Footer from './Footer';
import SubmitConferenceModal from './SubmitConferenceModal';
import SubmitEventModal from './SubmitEventModal';
import { MONTHS } from '../constants';
import { MonthOption, Conference, EventItem } from '../types';
import { fetchConferences, fetchAllEvents, seedDatabase, createConference, createEvent, getConnectionStatus } from '../services/db';
import { Loader2, Database, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const PublicHome: React.FC = () => {
  // State
  const [selectedMonth, setSelectedMonth] = useState<MonthOption>(MONTHS[0]);
  const [selectedConferenceId, setSelectedConferenceId] = useState<string>('');
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Data State
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [dbStatus, setDbStatus] = useState<{status: string, message: string} | null>(null);

  // Modal State
  const [isSubmitConferenceModalOpen, setIsSubmitConferenceModalOpen] = useState(false);
  const [isSubmitEventModalOpen, setIsSubmitEventModalOpen] = useState(false);

  // Initial Data Load
  useEffect(() => {
    const loadData = async () => {
      try {
        // Check DB Status
        const status = await getConnectionStatus();
        setDbStatus(status);

        const [confsData, eventsData] = await Promise.all([
          fetchConferences(),
          fetchAllEvents()
        ]);
        
        setConferences(confsData);
        setEvents(eventsData);

        // Check URL for selected conference
        const paramId = searchParams.get('c');
        
        if (paramId) {
            const foundConf = confsData.find(c => c.id === paramId);
            if (foundConf) {
                setSelectedConferenceId(foundConf.id);
                // Sync month
                const foundMonth = MONTHS.find(m => m.label.startsWith(foundConf.month) && m.year === foundConf.year);
                if (foundMonth) {
                    setSelectedMonth(foundMonth);
                }
                setIsLoading(false);
                return;
            }
        }

        // Default selection if no URL param or not found
        if (confsData.length > 0 && !selectedConferenceId) {
            const match = confsData.find(c => c.month === MONTHS[0].label.split(' ')[0] && c.year === MONTHS[0].year);
            setSelectedConferenceId(match ? match.id : confsData[0].id);
        }
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []); // Run once on mount

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedDatabase();
      // Reload data
      const [confsData, eventsData] = await Promise.all([
        fetchConferences(),
        fetchAllEvents()
      ]);
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
        // Format dates for display
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        const monthShort = start.toLocaleString('en-US', { month: 'short' });
        const startDay = start.getDate();
        const endDay = end.getDate();
        const year = start.getFullYear();
        
        // Construct new conference object
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
        
        // Refresh data
        const confsData = await fetchConferences();
        setConferences(confsData);
        
        // Optionally switch to the month of the new conference
        const newMonthOption = MONTHS.find(m => m.label.startsWith(monthShort) && m.year === year);
        if (newMonthOption) {
            setSelectedMonth(newMonthOption);
        }
        
        alert("Conference submitted successfully!");
    } catch (error) {
        console.error("Submission failed", error);
        alert("Failed to submit conference.");
    }
  };

  const handleSubmitEvent = async (data: any) => {
      try {
          // data is already formatted in SubmitEventModal
          await createEvent({
              ...data,
              status: 'Draft'
          });
          
          // Refresh events
          const eventsData = await fetchAllEvents();
          setEvents(eventsData);
          
          alert("Event submitted successfully for review!");
      } catch (error) {
          console.error("Event submission failed", error);
          alert("Failed to submit event.");
      }
  };

  // Handler for conference selection
  const handleSelectConference = (id: string) => {
    setSelectedConferenceId(id);
    setSearchParams({ c: id });
  };

  // Handler for month selection
  const handleSelectMonth = (month: MonthOption) => {
      setSelectedMonth(month);
      // When month changes, try to auto-select first conference in that month
      const confsInMonth = conferences.filter(c => c.month === month.label.split(' ')[0] && c.year === month.year);
      if (confsInMonth.length > 0) {
          setSelectedConferenceId(confsInMonth[0].id);
          setSearchParams({ c: confsInMonth[0].id });
      } else {
          // If no conferences, maybe clear the param or keep as is? 
          // Clearing is safer to avoid confusion
          setSearchParams({});
          setSelectedConferenceId('');
      }
  };

  // Filtering Logic
  const filteredConferences = conferences.filter(
    (c) => c.month === selectedMonth.label.split(' ')[0] && c.year === selectedMonth.year
  );

  const displayedConferences = filteredConferences.length > 0 ? filteredConferences : [];

  const filteredEvents = events.filter(e => e.conferenceId === selectedConferenceId);

  const selectedConference = conferences.find(c => c.id === selectedConferenceId) || conferences[0];

  // Loading View
  if (isLoading) {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
            <p className="text-gray-500 font-medium animate-pulse">Loading events...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-gray-200 font-sans selection:bg-purple-500/30 selection:text-white">
      
      <Hero onOpenSubmitEventModal={() => setIsSubmitEventModalOpen(true)} />
      
      <MonthNav 
        months={MONTHS} 
        selectedMonth={selectedMonth} 
        onSelect={handleSelectMonth} 
      />

      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12 relative">
        {conferences.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                <Database size={48} className="text-gray-600 mb-4" />
                <h2 className="text-xl font-bold mb-2">No Data Available</h2>
                <p className="text-gray-500 mb-6 max-w-md text-center">
                    The database appears to be empty.
                </p>
                <button 
                    onClick={handleSeed}
                    disabled={isSeeding}
                    className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg shadow-purple-900/20 flex items-center gap-2"
                >
                    {isSeeding ? <Loader2 className="animate-spin" size={18} /> : <Database size={18} />}
                    Reset Demo Data
                </button>
            </div>
        ) : (
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            <ConferenceSidebar 
                conferences={displayedConferences}
                selectedConferenceId={selectedConferenceId}
                onSelect={handleSelectConference}
                onOpenSubmitModal={() => setIsSubmitConferenceModalOpen(true)}
            />
            
            {displayedConferences.length > 0 && selectedConference ? (
                <div className="flex-1 min-w-0">
                    <EventList 
                        conference={selectedConference} 
                        events={filteredEvents}
                        onOpenSubmitEventModal={() => setIsSubmitEventModalOpen(true)}
                    />
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-20 text-gray-500 border border-white/5 rounded-2xl bg-white/[0.02]">
                    <p>No conferences listed for {selectedMonth.label}</p>
                </div>
            )}
            </div>
        )}
      </main>

      <Footer />
      
      {/* Database Status Indicator */}
      {dbStatus && (
        <div className="fixed bottom-4 right-4 z-50 animate-fade-in-up">
            <div className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold shadow-lg backdrop-blur-md
                ${dbStatus.status === 'connected' ? 'bg-green-500/10 border-green-500/30 text-green-400' : ''}
                ${dbStatus.status === 'missing_tables' ? 'bg-red-500/10 border-red-500/30 text-red-400' : ''}
                ${dbStatus.status === 'demo' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : ''}
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