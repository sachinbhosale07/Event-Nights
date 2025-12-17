import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, MapPin, Link as LinkIcon, Building2, User, Mail, Users, CheckCircle2 } from 'lucide-react';
import { Conference } from '../types';

interface SubmitEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  conferences: Conference[];
  preSelectedConferenceId?: string;
}

const SubmitEventModal: React.FC<SubmitEventModalProps> = ({ isOpen, onClose, onSubmit, conferences, preSelectedConferenceId }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const initialFormData = {
    submitterName: '',
    company: '',
    submitterEmail: '',
    title: '',
    host: '',
    conferenceId: preSelectedConferenceId || '',
    startDateTime: '',
    endDateTime: '',
    venueName: '',
    capacity: '',
    description: '',
    registrationUrl: '',
    tags: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (isOpen && preSelectedConferenceId) {
        setFormData(prev => ({ ...prev, conferenceId: preSelectedConferenceId }));
    }
  }, [isOpen, preSelectedConferenceId]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
        return formData.submitterName.trim() !== '' && 
               formData.submitterEmail.trim() !== '';
    }
    if (currentStep === 2) {
        return formData.title.trim() !== '' && 
               formData.host.trim() !== '' && 
               formData.conferenceId !== '' &&
               formData.startDateTime !== '' &&
               formData.endDateTime !== '';
    }
    if (currentStep === 3) {
        return formData.venueName.trim() !== '' && 
               formData.capacity.trim() !== '';
    }
    if (currentStep === 4) {
        return formData.description.trim() !== ''; 
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) {
        alert("Please fill in all required fields before proceeding.");
        return;
    }
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) {
        alert("Please fill in all required fields.");
        return;
    }

    setIsSubmitting(true);
    
    const eventData = {
        title: formData.title,
        host: formData.host,
        conferenceId: formData.conferenceId,
        date: formData.startDateTime.split('T')[0],
        startTime: new Date(formData.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: new Date(formData.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        venueName: formData.venueName,
        capacity: parseInt(formData.capacity) || 0,
        description: formData.description,
        registrationUrl: formData.registrationUrl,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        submitterName: formData.submitterName,
        company: formData.company,
        submitterEmail: formData.submitterEmail
    };

    await onSubmit(eventData);
    setIsSubmitting(false);
    onClose();
    setTimeout(() => {
        setStep(1);
        setFormData(initialFormData);
    }, 300);
  };

  const progressWidth = `${(step / 4) * 100}%`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="relative pt-6 pb-4 px-6 text-center border-b border-white/5 bg-surface z-10">
          <h2 className="text-xl font-bold text-white">
            Submit an Event
          </h2>
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full text-txt-dim hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="w-full h-1 bg-white/5">
            <div 
                className="h-full bg-primary transition-all duration-500 ease-out shadow-[0_0_10px_rgba(45,212,191,0.5)]"
                style={{ width: progressWidth }}
            />
        </div>

        <div className="text-center py-4 bg-surfaceHighlight/30">
            <span className="text-xs font-bold text-txt-dim uppercase tracking-widest">Step {step} of 4</span>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-8 pt-4">
            
            {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-white">The Basics</h3>
                        <p className="text-sm text-txt-dim">Who are you?</p>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-txt-muted uppercase tracking-wide">Name *</label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-dim" size={18} />
                            <input 
                                type="text" 
                                name="submitterName"
                                value={formData.submitterName}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-txt-dim"
                                placeholder="Your Name"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-txt-muted uppercase tracking-wide">Company</label>
                        <div className="relative">
                            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-dim" size={18} />
                            <input 
                                type="text" 
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-txt-dim"
                                placeholder="Your Company"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-txt-muted uppercase tracking-wide">Email *</label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-dim" size={18} />
                            <input 
                                type="email" 
                                name="submitterEmail"
                                value={formData.submitterEmail}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-txt-dim"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-white">Event Details</h3>
                        <p className="text-sm text-txt-dim">What is happening?</p>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-txt-muted uppercase tracking-wide">Event Name *</label>
                        <input 
                            type="text" 
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-txt-dim"
                            placeholder="e.g. VIP Networking Dinner"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-txt-muted uppercase tracking-wide">Host *</label>
                        <input 
                            type="text" 
                            name="host"
                            value={formData.host}
                            onChange={handleChange}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-txt-dim"
                            placeholder="e.g. Your Company Name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-txt-muted uppercase tracking-wide">Conference *</label>
                        <select 
                            name="conferenceId"
                            value={formData.conferenceId}
                            onChange={handleChange}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-txt-dim appearance-none"
                        >
                            <option value="">Select conference...</option>
                            {conferences.map(conf => (
                                <option key={conf.id} value={conf.id}>{conf.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-txt-muted uppercase tracking-wide">Start Time *</label>
                            <div className="relative">
                                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-dim pointer-events-none" size={18} />
                                <input 
                                    type="datetime-local" 
                                    name="startDateTime"
                                    value={formData.startDateTime}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-txt-dim appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-txt-muted uppercase tracking-wide">End Time *</label>
                            <div className="relative">
                                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-dim pointer-events-none" size={18} />
                                <input 
                                    type="datetime-local" 
                                    name="endDateTime"
                                    value={formData.endDateTime}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-txt-dim appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-white">Location</h3>
                        <p className="text-sm text-txt-dim">Where to go?</p>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-txt-muted uppercase tracking-wide">Location *</label>
                        <div className="relative">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-dim" size={18} />
                            <input 
                                type="text" 
                                name="venueName"
                                value={formData.venueName}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-txt-dim"
                                placeholder="Venue Name / Address"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-txt-muted uppercase tracking-wide">Capacity *</label>
                        <div className="relative">
                            <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-dim" size={18} />
                            <input 
                                type="number" 
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-txt-dim"
                                placeholder="100"
                            />
                        </div>
                    </div>
                </div>
            )}

             {step === 4 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-white">Extra Info</h3>
                        <p className="text-sm text-txt-dim">Almost there.</p>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-txt-muted uppercase tracking-wide">Description *</label>
                        <textarea 
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-txt-dim resize-none"
                            placeholder="Tell us more about the event..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-txt-muted uppercase tracking-wide">Registration Link</label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-dim" size={18} />
                            <input 
                                type="url" 
                                name="registrationUrl"
                                value={formData.registrationUrl}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-txt-dim"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                         <label className="text-xs font-bold text-txt-muted uppercase tracking-wide">Tags (Optional)</label>
                         <input 
                            type="text" 
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-txt-dim"
                            placeholder="VIP, Party, Networking (comma separated)"
                        />
                    </div>
                </div>
            )}

        </div>

        <div className="p-6 border-t border-white/5 bg-surface flex justify-between items-center z-10">
            {step > 1 ? (
                <button 
                    onClick={handleBack}
                    className="flex items-center gap-2 text-txt-muted hover:text-white transition-colors text-sm font-medium px-2 py-1"
                >
                    <ChevronLeft size={16} /> Back
                </button>
            ) : (
                <button 
                    onClick={onClose} 
                    className="text-txt-dim hover:text-txt-muted text-sm font-medium"
                >
                    Cancel
                </button>
            )}

            {step < 4 ? (
                <button 
                    onClick={handleNext}
                    className="bg-primary hover:bg-primaryHover text-background px-8 py-3 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 transition-all flex items-center gap-2 group"
                >
                    Next <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            ) : (
                <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primaryHover text-background px-8 py-3 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                    {!isSubmitting && <CheckCircle2 size={16} />}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default SubmitEventModal;