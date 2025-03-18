
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import PanicMode from '@/components/PanicMode';
import { defaultUserSettings, UserSettings } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Mic, Camera, Lock, Save, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const [settings, setSettings] = useState<UserSettings>(defaultUserSettings);
  const [sosMessage, setSosMessage] = useState(defaultUserSettings.sosMessage);

  // Load settings from localStorage on initial load
  useEffect(() => {
    const storedSettings = localStorage.getItem('safeGuardSettings');
    
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings);
      setSettings(parsedSettings);
      setSosMessage(parsedSettings.sosMessage);
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('safeGuardSettings', JSON.stringify(settings));
  }, [settings]);

  const handleChangePanicModeGesture = (gesture: 'shake' | 'volume-buttons' | 'tap-pattern') => {
    setSettings(prev => ({
      ...prev,
      panicModeGesture: gesture
    }));
  };

  const handleSaveSOSMessage = () => {
    setSettings(prev => ({
      ...prev,
      sosMessage: sosMessage.trim()
    }));
    toast.success('Emergency message saved');
  };

  const handleToggleAutoRecord = () => {
    setSettings(prev => ({
      ...prev,
      autoRecordEnabled: !prev.autoRecordEnabled
    }));
  };

  const handleToggleStealthMode = () => {
    setSettings(prev => ({
      ...prev,
      stealthModeEnabled: !prev.stealthModeEnabled
    }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6 px-4 sm:px-6 space-y-8 max-w-4xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Customize your She Shield experience
          </p>
        </div>
        
        <div className="space-y-8 animate-fade-in">
          {/* Emergency Message Section */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Message</CardTitle>
              <CardDescription>
                Customize the message that will be sent to your trusted contacts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="sosMessage">SOS Message</Label>
                <Textarea
                  id="sosMessage"
                  placeholder="Enter your emergency message"
                  value={sosMessage}
                  onChange={(e) => setSosMessage(e.target.value)}
                  className="min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground">
                  Your current location will be automatically included when an alert is sent.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSOSMessage} className="ml-auto">
                <Save className="h-4 w-4 mr-2" />
                Save Message
              </Button>
            </CardFooter>
          </Card>
          
          {/* Panic Mode Settings */}
          <PanicMode 
            panicModeGesture={settings.panicModeGesture}
            onChangePanicModeGesture={handleChangePanicModeGesture}
          />
          
          {/* Recording & Privacy Section */}
          <Card>
            <CardHeader>
              <CardTitle>Recording & Privacy</CardTitle>
              <CardDescription>
                Configure automatic recording and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Mic className="h-5 w-5 text-safety mt-0.5" />
                  <div>
                    <Label htmlFor="autoRecord" className="font-medium">Auto-record during emergencies</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically record audio when an emergency alert is triggered
                    </p>
                  </div>
                </div>
                <Switch 
                  id="autoRecord" 
                  checked={settings.autoRecordEnabled}
                  onCheckedChange={handleToggleAutoRecord}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Camera className="h-5 w-5 text-safety mt-0.5" />
                  <div>
                    <Label htmlFor="imageCapture" className="font-medium">Capture photos during alert</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically take photos when an emergency alert is triggered
                    </p>
                  </div>
                </div>
                <Switch id="imageCapture" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-safety mt-0.5" />
                  <div>
                    <Label htmlFor="stealthMode" className="font-medium">Stealth Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Hide the app from recent apps list and disguise app icon
                    </p>
                  </div>
                </div>
                <Switch 
                  id="stealthMode"
                  checked={settings.stealthModeEnabled}
                  onCheckedChange={handleToggleStealthMode}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle>About She Shield</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center py-6">
                <div className="flex flex-col items-center">
                  <ShieldAlert className="h-12 w-12 text-safety mb-4" />
                  <h3 className="text-xl font-semibold">She Shield</h3>
                  <p className="text-sm text-muted-foreground">Version 1.0.0</p>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-sm">
                  She Shield is committed to helping you stay safe in any situation.
                </p>
                <p className="text-sm text-muted-foreground">
                  For emergencies, always call your local emergency services when possible.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button variant="outline" size="sm">Privacy Policy</Button>
              <Button variant="outline" size="sm">Terms of Service</Button>
            </CardFooter>
          </Card>
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

export default Settings;
