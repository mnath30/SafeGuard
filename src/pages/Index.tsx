
import React, { useState, useEffect } from 'react';
import EmergencySOS from '@/components/EmergencySOS';
import LocationSharing from '@/components/LocationSharing';
import VoiceActivation from '@/components/VoiceActivation';
import Header from '@/components/Header';
import { Shield } from 'lucide-react';
import { mockContacts, defaultUserSettings } from '@/lib/mockData';
import { toast } from 'sonner';

const Index = () => {
  const [contacts, setContacts] = useState(mockContacts);
  const [settings, setSettings] = useState(defaultUserSettings);

  // Load settings from localStorage on initial load
  useEffect(() => {
    const storedSettings = localStorage.getItem('safeGuardSettings');
    const storedContacts = localStorage.getItem('safeGuardContacts');
    
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
    
    if (storedContacts) {
      setContacts(JSON.parse(storedContacts));
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('safeGuardSettings', JSON.stringify(settings));
  }, [settings]);

  // Save contacts to localStorage when they change
  useEffect(() => {
    localStorage.setItem('safeGuardContacts', JSON.stringify(contacts));
  }, [contacts]);

  const handleToggleLocationSharing = (enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      locationSharingEnabled: enabled
    }));
  };

  const handleToggleVoiceActivation = (enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      voiceActivationEnabled: enabled
    }));
  };

  const handleChangeTriggerPhrase = (phrase: string) => {
    setSettings(prev => ({
      ...prev,
      voiceTriggerPhrase: phrase
    }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6 px-4 sm:px-6 space-y-8 max-w-4xl animate-fade-in">
        {/* Welcome Header */}
        <div className="text-center mb-8 animate-slide-down">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent mb-4">
            <Shield className="h-8 w-8 text-safety" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">She Shield</h1>
          <p className="text-muted-foreground mt-2">Your personal safety companion</p>
        </div>
        
        {/* Emergency SOS Section */}
        <section className="space-y-6 animate-scale-up">
          <div className="text-center">
            <h2 className="text-xl font-semibold tracking-tight">Emergency SOS</h2>
            <p className="text-sm text-muted-foreground">
              Press the button below in case of an emergency
            </p>
          </div>
          
          <EmergencySOS 
            contacts={contacts} 
            sosMessage={settings.sosMessage} 
          />
        </section>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Location Sharing Section */}
          <LocationSharing 
            enabled={settings.locationSharingEnabled}
            onToggleLocationSharing={handleToggleLocationSharing}
          />
          
          {/* Voice Activation Section */}
          <VoiceActivation
            enabled={settings.voiceActivationEnabled}
            triggerPhrase={settings.voiceTriggerPhrase}
            onToggleVoiceActivation={handleToggleVoiceActivation}
            onChangeTriggerPhrase={handleChangeTriggerPhrase}
          />
        </div>
      </main>
      
      <footer className="border-t border-border/40 py-6 px-4 sm:px-6">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            She Shield &copy; {new Date().getFullYear()} · Your Safety is Our Priority
          </p>
          <div className="flex space-x-4">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </button>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Help & Support
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
