
import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { TrustedContact } from '@/lib/mockData';

interface EmergencySOSProps {
  contacts: TrustedContact[];
  sosMessage: string;
}

const EmergencySOS: React.FC<EmergencySOSProps> = ({ contacts, sosMessage }) => {
  const [isActivated, setIsActivated] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [countdown, setCountdown] = useState(3);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const countdownTimerRef = useRef<number | null>(null);
  const alertTimerRef = useRef<number | null>(null);

  // Handle countdown for SOS activation
  useEffect(() => {
    if (isActivated && countdown > 0) {
      countdownTimerRef.current = window.setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (isActivated && countdown === 0) {
      // Get current location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          sendAlerts();
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Could not get your location. Sending alert without location.');
          sendAlerts();
        }
      );
    }

    return () => {
      if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current);
      }
    };
  }, [isActivated, countdown, sosMessage]);

  const sendAlerts = () => {
    // In a real app, this would send actual SMS/calls
    // For now, we'll just simulate with toast notifications
    
    const locationText = location 
      ? `Location: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` 
      : 'Location unavailable';
    
    const fullMessage = `${sosMessage} ${locationText}`;
    
    contacts.forEach(contact => {
      if (contact.verified) {
        if (contact.notificationPreference === 'sms' || contact.notificationPreference === 'both') {
          console.log(`Sending SMS to ${contact.name}: ${fullMessage}`);
          toast.info(`SMS alert sent to ${contact.name}`);
        }
        
        if (contact.notificationPreference === 'call' || contact.notificationPreference === 'both') {
          console.log(`Calling ${contact.name}`);
          toast.info(`Call alert initiated to ${contact.name}`);
        }
      }
    });

    // Simulate continuous location updates
    alertTimerRef.current = window.setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          console.log('Updated location:', position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error updating location:', error);
        }
      );
    }, 30000); // Update every 30 seconds
  };

  const handleButtonClick = () => {
    if (isActivated) {
      // Cancel the SOS
      setIsActivated(false);
      setCountdown(3);
      if (alertTimerRef.current) {
        clearInterval(alertTimerRef.current);
      }
      toast.success('Emergency alert canceled');
    } else {
      // Create ripple effect
      if (buttonRef.current && rippleRef.current) {
        const button = buttonRef.current;
        const ripple = rippleRef.current;
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${rect.width / 2}px`;
        ripple.style.top = `${rect.height / 2}px`;
        ripple.classList.add('animate-ripple');
        
        setTimeout(() => {
          ripple.classList.remove('animate-ripple');
        }, 800);
      }
      
      // Activate SOS
      setIsActivated(true);
      toast.warning(`Emergency alert will be sent in ${countdown} seconds. Tap again to cancel.`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="text-center mb-6">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          Tap the emergency button to alert your trusted contacts
        </p>
        {isActivated && (
          <div className="flex items-center justify-center mb-4 animate-pulse-subtle">
            <AlertTriangle className="text-safety-alert mr-2 h-5 w-5" />
            <p className="font-bold text-safety-alert">
              {countdown > 0 
                ? `Sending alert in ${countdown}...` 
                : 'Alert sent! Sharing location...'}
            </p>
          </div>
        )}
      </div>

      <div className="relative mb-8">
        <Button
          ref={buttonRef}
          variant={isActivated ? "destructive" : "default"}
          size="lg"
          className={`w-32 h-32 rounded-full relative overflow-hidden shadow-lg transition-all duration-300 ${
            isActivated ? 'bg-safety-alert scale-105' : 'bg-safety hover:bg-safety/90'
          }`}
          onClick={handleButtonClick}
        >
          <div ref={rippleRef} className="absolute ripple-effect"></div>
          <span className="font-bold text-xl">
            {isActivated ? "CANCEL" : "SOS"}
          </span>
        </Button>
      </div>

      <div className="w-full max-w-md space-y-4">
        {location && (
          <div className="flex items-center p-4 rounded-lg bg-accent text-accent-foreground animate-scale-up">
            <MapPin className="mr-2 h-5 w-5 text-safety" />
            <div className="text-sm">
              <p className="font-medium">Live location being shared</p>
              <p className="text-xs text-muted-foreground">
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
            </div>
          </div>
        )}

        {isActivated && countdown === 0 && (
          <div className="space-y-3 animate-slide-up">
            <p className="text-sm font-medium text-center">Emergency contacts notified:</p>
            {contacts.filter(c => c.verified).length > 0 ? (
              <div className="space-y-2">
                {contacts.filter(c => c.verified).map(contact => (
                  <div key={contact.id} className="flex items-center p-3 rounded-lg bg-card border border-border">
                    <Phone className="mr-2 h-4 w-4 text-safety" />
                    <div className="text-sm">
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-center text-muted-foreground">No verified contacts available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencySOS;
