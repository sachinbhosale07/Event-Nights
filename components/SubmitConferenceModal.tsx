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
    // Reset form after close
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
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#0f0f16] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="relative pt-6 pb-4 px-6 text-center border-b border-white/5 bg-[#0f0f16] z-10">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Submit a Conference
          </h2>
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/5">
            <div 
                className="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                style={{ width: progressWidth }}
            />
        </div>

        {/* Step Indicator */}
        <div className="text-center py-4">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">Step {step} of 3</span>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
            
            {/* Step 1: Conference Information */}
            {step === 1 && (
                <div className="space-y-5 animate-fade-in">
                    <h3 className="text-lg font-bold text-white mb-2">Conference Information</h3>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Conference Name *</label>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-[#1a1a24] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-600"
                            placeholder="e.g. Affiliate World Dubai"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                        <textarea 
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full bg-[#1a1a24] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-600 resize-none"
                            placeholder="Brief description of the conference..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">City *</label>
                            <input 
                                type="text" 
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full bg-[#1a1a24] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-600"
                                placeholder="Las Vegas"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Country *</label>
                            <input 
                                type="text" 
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full bg-[#1a1a24] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-600"
                                placeholder="USA"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Full Location *</label>
                        <div className="relative">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input 
                                type="text" 
                                name="fullLocation"
                                value={formData.fullLocation}
                                onChange={handleChange}
                                className="w-full bg-[#1a1a24] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-600"
                                placeholder="e.g. Caesars Forum"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Step 2: Conference Dates */}
            {step === 2 && (
                <div className="space-y-5 animate-fade-in">
                    <h3 className="text-lg font-bold text-white mb-2">Conference Dates</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Start Date *</label>
                            <div className="relative">
                                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                                <input 
                                    type="date" 
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="w-full bg-[#1a1a24] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-600 appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">End Date *</label>
                            <div className="relative">
                                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                                <input 
                                    type="date" 
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className="w-full bg-[#1a1a24] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-600 appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Website URL</label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input 
                                type="url" 
                                name="websiteUrl"
                                value={formData.websiteUrl}
                                onChange={handleChange}
                                className="w-full bg-[#1a1a24] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-600"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Image URL</label>
                        <div className="relative">
                            <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input 
                                type="url" 
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                className="w-full bg-[#1a1a24] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-600"
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: Your Information */}
            {step === 3 && (
                <div className="space-y-5 animate-fade-in">
                    <h3 className="text-lg font-bold text-white mb-2">Your Information</h3>
                    
                    <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 mb-4 flex gap-3">
                         <CheckCircle2 className="text-purple-400 shrink-0" size={20} />
                         <p className="text-sm text-purple-200">
                            Almost done! Please provide your details so we can contact you if we need to verify the conference.
                         </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Your Name *</label>
                        <input 
                            type="text" 
                            name="submitterName"
                            value={formData.submitterName}
                            onChange={handleChange}
                            className="w-full bg-[#1a1a24] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-600"
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Your Email *</label>
                        <input 
                            type="email" 
                            name="submitterEmail"
                            value={formData.submitterEmail}
                            onChange={handleChange}
                            className="w-full bg-[#1a1a24] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-600"
                            placeholder="john@example.com"
                        />
                    </div>
                </div>
            )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/5 bg-[#0f0f16] flex justify-between items-center z-10">
            {step > 1 ? (
                <button 
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium px-2 py-1"
                >
                    <ChevronLeft size={16} /> Back
                </button>
            ) : (
                <div></div> /* Spacer */
            )}

            {step < 3 ? (
                <button 
                    onClick={handleNext}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-purple-900/20 transition-all flex items-center gap-2 group"
                >
                    Next <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            ) : (
                <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-purple-900/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Conference'}
                    {!isSubmitting && <ChevronRight size={16} />}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default SubmitConferenceModal;