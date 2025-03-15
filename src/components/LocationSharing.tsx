
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface LocationSharingProps {
  enabled: boolean;
  onToggleLocationSharing: (enabled: boolean) => void;
}

const LocationSharing: React.FC<LocationSharingProps> = ({ 
  enabled, 
  onToggleLocationSharing 
}) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  useEffect(() => {
    if (enabled) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }

    return () => {
      stopLocationTracking();
    };
  }, [enabled]);

  const startLocationTracking = () => {
    setIsLoading(true);

    if ('geolocation' in navigator) {
      // Get initial position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Could not get your location. Please check your location permissions.');
          setIsLoading(false);
          onToggleLocationSharing(false);
        }
      );

      // Set up continuous tracking
      const id = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error watching location:', error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000, // 10 seconds
          timeout: 5000, // 5 seconds
        }
      );

      setWatchId(id);
    } else {
      toast.error('Geolocation is not supported by your browser');
      setIsLoading(false);
      onToggleLocationSharing(false);
    }
  };

  const stopLocationTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  const handleToggleLocationSharing = () => {
    onToggleLocationSharing(!enabled);
  };

  const refreshLocation = () => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        toast.success('Location updated');
        setIsLoading(false);
      },
      (error) => {
        console.error('Error refreshing location:', error);
        toast.error('Could not update your location');
        setIsLoading(false);
      }
    );
  };

  // Function to generate Google Maps link
  const getGoogleMapsLink = () => {
    if (!location) return '';
    return `https://www.google.com/maps?q=${location.lat},${location.lng}`;
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Location Sharing</CardTitle>
            <CardDescription>Control how your location is shared</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="location-mode" checked={enabled} onCheckedChange={handleToggleLocationSharing} />
            <Label htmlFor="location-mode">{enabled ? 'On' : 'Off'}</Label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {enabled ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-accent p-4 rounded-lg">
              <div className="flex items-center">
                <Navigation className="h-5 w-5 text-safety mr-2" />
                <div>
                  <p className="font-medium">Live tracking active</p>
                  <p className="text-xs text-muted-foreground">
                    Your trusted contacts can see your location during emergencies
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                disabled={isLoading}
                onClick={refreshLocation}
                aria-label="Refresh location"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>

            {location && (
              <div className="border rounded-lg overflow-hidden transition-all">
                <div className="p-4 bg-card">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Current Location</h3>
                    <span className="text-xs text-safety-safe px-2 py-0.5 rounded-full bg-safety-safe/10">
                      Active
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-safety" />
                      <span>Lat: {location.lat.toFixed(6)}</span>
                    </p>
                    <p className="text-sm flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-safety" />
                      <span>Lng: {location.lng.toFixed(6)}</span>
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-muted/50 border-t">
                  <a 
                    href={getGoogleMapsLink()} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-safety hover:underline flex items-center"
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    View on Google Maps
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="bg-muted/50 p-3 rounded-full mb-4">
              <MapPin className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">Location sharing is disabled</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enable location sharing so your trusted contacts can find you in emergencies
            </p>
            <Button onClick={handleToggleLocationSharing}>
              Enable Location Sharing
            </Button>
          </div>
        )}
      </CardContent>
      {enabled && (
        <CardFooter className="border-t px-6 py-4 bg-card">
          <p className="text-xs text-muted-foreground">
            Location is only shared with your trusted contacts during an emergency or when you explicitly decide to share it.
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default LocationSharing;
