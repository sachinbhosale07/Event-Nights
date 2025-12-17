import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, MapPin, Link as LinkIcon, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { Conference } from '../types';

interface SubmitConferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Conference> & { websiteUrl?: string; imageUrl?: string; submitterName?: string; submitterEmail?: string; startDate?: string; endDate?: string }) => Promise<void>;
}

const SubmitConferenceModal: React.FC<SubmitConferenceModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    city: '',
    country: '',
    fullLocation: '',
    startDate: '',
    endDate: '',
    websiteUrl: '',
    imageUrl: '',
    submitterName: '',
    submitterEmail: ''
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
        return formData.name.trim() !== '' && 
               formData.city.trim() !== '' && 
               formData.country.trim() !== '' && 
               formData.fullLocation.trim() !== '';
    }
    if (currentStep === 2) {
        return formData.startDate.trim() !== '' && 
               formData.endDate.trim() !== '';
    }
    if (currentStep === 3) {
        return formData.submitterName.trim() !== '' && 
               formData.submitterEmail.trim() !== '';
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) {
        alert("Please fill in all required fields before proceeding.");
        return;
    }
    if (step < 3) setStep(step + 1);
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
    await onSubmit(formData);
    setIsSubmitting(false);
    onClose();
    setTimeout(() => {
        setStep(1);
        setFormData({
            name: '',
            description: '',
            city: '',
            country: '',
            fullLocation: '',
            startDate: '',
            endDate: '',
            websiteUrl: '',
            imageUrl: '',
            submitterName: '',
            submitterEmail: ''
        });
    }, 300);
  };

  const progressWidth = step === 1 ? '33%' : step === 2 ? '66%' : '100%';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="relative pt-6 pb-4 px-6 text-center border-b border-white/5 bg-surface z-10">
          <h2 className="text-xl font-bold text-white">
            Submit a Conference
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
            <span className="text-xs font-bold text-txt-dim uppercase tracking-widest">Step {step} of 3</span>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-8 pt-4">
            
            {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-white">Conference Info</h3>
                        <p className="text-sm text-txt-dim">Tell us the basics about the event.</p>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-txt-muted uppercase tracking-wide">Conference Name *</label>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-txt-dim"
                            placeholder="e.g. Affiliate World Dubai"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-txt-muted uppercase tracking-wide">Description</label>
                        <textarea 
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-txt-dim resize-none"
                            placeholder="Brief description of the conference..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-txt-muted uppercase tracking-wide">City *</label>
                            <input 
                                type="text" 
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-txt-dim"
                                placeholder="Las Vegas"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-txt-muted uppercase tracking-wide">Country *</label>
                            <input 
                                type="text" 
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-txt-dim"
                                placeholder="USA"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-txt-muted uppercase tracking-wide">Full Location *</label>
                        <div className="relative">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-dim" size={18} />
                            <input 
                                type="text" 
                                name="fullLocation"
                                value={formData.fullLocation}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-txt-dim"
                                placeholder="e.g. Caesars Forum"
                            />
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-white">Dates & Links</h3>
                        <p className="text-sm text-txt-dim">When is it happening?</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-txt-muted uppercase tracking-wide">Start Date *</label>
                            <div className="relative">
                                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-dim pointer-events-none" size={18} />
                                <input 
                                    type="date" 
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-txt-dim appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-txt-muted uppercase tracking-wide">End Date *</label>
                            <div className="relative">
                                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-dim pointer-events-none" size={18} />
                                <input 
                                    type="date" 
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-txt-dim appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-txt-muted uppercase tracking-wide">Website URL</label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-dim" size={18} />
                            <input 
                                type="url" 
                                name="websiteUrl"
                                value={formData.websiteUrl}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-txt-dim"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-txt-muted uppercase tracking-wide">Image URL</label>
                        <div className="relative">
                            <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-dim" size={18} />
                            <input 
                                type="url" 
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-txt-dim"
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-white">Your Info</h3>
                        <p className="text-sm text-txt-dim">Contact details for verification.</p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 mb-4 flex gap-3">
                         <CheckCircle2 className="text-primary shrink-0" size={20} />
                         <p className="text-xs text-txt-main leading-relaxed">
                            Almost done! Please provide your details so we can contact you if we need to verify the conference.
                         </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-txt-muted uppercase tracking-wide">Your Name *</label>
                        <input 
                            type="text" 
                            name="submitterName"
                            value={formData.submitterName}
                            onChange={handleChange}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-txt-dim"
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-txt-muted uppercase tracking-wide">Your Email *</label>
                        <input 
                            type="email" 
                            name="submitterEmail"
                            value={formData.submitterEmail}
                            onChange={handleChange}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-txt-dim"
                            placeholder="john@example.com"
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
                <div></div>
            )}

            {step < 3 ? (
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
                    {!isSubmitting && <ChevronRight size={16} />}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default SubmitConferenceModal;