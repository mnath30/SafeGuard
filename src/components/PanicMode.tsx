
import React, { useState, useEffect } from 'react';
import { Phone, Bell, ShieldAlert, PhoneCall, VolumeX, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

interface PanicModeProps {
  panicModeGesture: 'shake' | 'volume-buttons' | 'tap-pattern';
  onChangePanicModeGesture: (gesture: 'shake' | 'volume-buttons' | 'tap-pattern') => void;
}

const PanicMode: React.FC<PanicModeProps> = ({ 
  panicModeGesture,
  onChangePanicModeGesture
}) => {
  const [shakeDetectionEnabled, setShakeDetectionEnabled] = useState(panicModeGesture === 'shake');
  const [fakeCallDialogOpen, setFakeCallDialogOpen] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);

  useEffect(() => {
    // Detect shake is selected as panic mode gesture
    setShakeDetectionEnabled(panicModeGesture === 'shake');
  }, [panicModeGesture]);

  useEffect(() => {
    let interval: number | null = null;
    
    if (isCallActive) {
      interval = window.setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive]);

  const activateFakeCall = () => {
    // Show toast before "call" comes in
    toast.info('Fake call will ring in 5 seconds...', {
      duration: 3000,
    });
    
    // After a delay, show the fake call dialog
    setTimeout(() => {
      setFakeCallDialogOpen(true);
      // Vibrate if available
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    }, 5000);
  };

  const answerCall = () => {
    setIsCallActive(true);
    toast.success('Fake call activated');
  };

  const endCall = () => {
    setIsCallActive(false);
    setFakeCallDialogOpen(false);
    toast.success('Call ended');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Panic Mode Settings</CardTitle>
          <CardDescription>Configure how to discreetly activate emergency alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Activation Method</h3>
            <RadioGroup 
              value={panicModeGesture} 
              onValueChange={(v) => onChangePanicModeGesture(v as 'shake' | 'volume-buttons' | 'tap-pattern')}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="shake" id="shake" />
                <Label htmlFor="shake" className="flex-1 flex items-center cursor-pointer">
                  <Smartphone className="h-4 w-4 mr-3 text-safety" />
                  <div>
                    <p className="font-medium">Shake phone</p>
                    <p className="text-xs text-muted-foreground">Rapidly shake your phone to trigger an alert</p>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="volume-buttons" id="volume-buttons" />
                <Label htmlFor="volume-buttons" className="flex-1 flex items-center cursor-pointer">
                  <Bell className="h-4 w-4 mr-3 text-safety" />
                  <div>
                    <p className="font-medium">Volume button pattern</p>
                    <p className="text-xs text-muted-foreground">Press volume up-down-up-down in rapid succession</p>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="tap-pattern" id="tap-pattern" />
                <Label htmlFor="tap-pattern" className="flex-1 flex items-center cursor-pointer">
                  <ShieldAlert className="h-4 w-4 mr-3 text-safety" />
                  <div>
                    <p className="font-medium">Tap pattern</p>
                    <p className="text-xs text-muted-foreground">Triple tap anywhere on screen with two fingers</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="font-medium text-sm mb-3">Quick Actions</h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start bg-card hover:bg-accent/50"
                onClick={activateFakeCall}
              >
                <Phone className="h-4 w-4 mr-3 text-safety" />
                <div className="flex-1 text-left">
                  <p className="font-medium">Fake Incoming Call</p>
                  <p className="text-xs text-muted-foreground">Simulate a call to excuse yourself from situations</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start bg-card hover:bg-accent/50"
              >
                <VolumeX className="h-4 w-4 mr-3 text-safety" />
                <div className="flex-1 text-left">
                  <p className="font-medium">Silent Mode</p>
                  <p className="text-xs text-muted-foreground">Mute all app sounds while keeping alerts active</p>
                </div>
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4 bg-card">
          <p className="text-xs text-muted-foreground">
            Practice using your panic mode gesture in a safe environment to ensure you can use it quickly when needed.
          </p>
        </CardFooter>
      </Card>

      {/* Fake Call Dialog */}
      {fakeCallDialogOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="w-full max-w-xs bg-white rounded-xl overflow-hidden">
            <div className="p-6 text-center bg-safety text-white">
              <h3 className="text-xl font-bold mb-1">
                {isCallActive ? 'Call in progress' : 'Incoming Call'}
              </h3>
              <p className="opacity-90">
                {isCallActive ? 'She Shield Support' : 'She Shield Support is calling...'}
              </p>
              {isCallActive && (
                <p className="text-sm mt-2 font-mono">{formatTime(callTimer)}</p>
              )}
            </div>
            
            <div className="p-6 flex justify-center gap-4">
              {!isCallActive ? (
                <>
                  <Button 
                    variant="destructive" 
                    size="lg" 
                    className="rounded-full w-14 h-14 p-0"
                    onClick={() => setFakeCallDialogOpen(false)}
                  >
                    <Phone className="h-6 w-6 rotate-135" />
                  </Button>
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="rounded-full w-14 h-14 p-0 bg-safety-safe hover:bg-safety-safe/90"
                    onClick={answerCall}
                  >
                    <Phone className="h-6 w-6" />
                  </Button>
                </>
              ) : (
                <Button 
                  variant="destructive" 
                  size="lg" 
                  className="rounded-full w-14 h-14 p-0"
                  onClick={endCall}
                >
                  <Phone className="h-6 w-6 rotate-135" />
                </Button>
              )}
            </div>
            
            {isCallActive && (
              <div className="pb-6 flex justify-center gap-4">
                <Button variant="ghost" size="sm" className="text-xs" onClick={endCall}>
                  End and return to app
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PanicMode;
