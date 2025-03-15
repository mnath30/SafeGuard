
import React, { useState } from 'react';
import { Mic, MicOff, Volume2, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface VoiceActivationProps {
  enabled: boolean;
  triggerPhrase: string;
  onToggleVoiceActivation: (enabled: boolean) => void;
  onChangeTriggerPhrase: (phrase: string) => void;
}

const VoiceActivation: React.FC<VoiceActivationProps> = ({
  enabled,
  triggerPhrase,
  onToggleVoiceActivation,
  onChangeTriggerPhrase,
}) => {
  const [isTesting, setIsTesting] = useState(false);
  const [isEditingPhrase, setIsEditingPhrase] = useState(false);
  const [newPhrase, setNewPhrase] = useState(triggerPhrase);

  const handleToggleVoiceActivation = () => {
    if (!enabled) {
      // Request microphone permission when enabling
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          onToggleVoiceActivation(true);
          toast.success('Voice activation enabled');
        })
        .catch((error) => {
          console.error('Error accessing microphone:', error);
          toast.error('Microphone access denied. Voice activation requires microphone permission.');
        });
    } else {
      onToggleVoiceActivation(false);
      toast.success('Voice activation disabled');
    }
  };

  const handleTestVoiceActivation = () => {
    setIsTesting(true);
    
    // Simulate voice recognition (in a real app, this would use actual voice recognition)
    setTimeout(() => {
      toast.success(`Test successful! Voice command "${triggerPhrase}" recognized.`);
      setIsTesting(false);
    }, 3000);
  };

  const handleSaveTriggerPhrase = () => {
    if (newPhrase.trim().length < 3) {
      toast.error('Trigger phrase must be at least 3 characters long');
      return;
    }
    
    onChangeTriggerPhrase(newPhrase.trim());
    setIsEditingPhrase(false);
    toast.success('Trigger phrase updated');
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Voice Activation</CardTitle>
            <CardDescription>Trigger emergency alerts using voice commands</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="voice-mode" checked={enabled} onCheckedChange={handleToggleVoiceActivation} />
            <Label htmlFor="voice-mode">{enabled ? 'On' : 'Off'}</Label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {enabled ? (
          <>
            <div className="flex items-center justify-between bg-accent p-4 rounded-lg">
              <div className="flex items-center">
                <Mic className="h-5 w-5 text-safety mr-2" />
                <div>
                  <p className="font-medium">Voice activation enabled</p>
                  <p className="text-xs text-muted-foreground">
                    Say your trigger phrase to activate emergency alerts
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/50"
                onClick={handleTestVoiceActivation}
                disabled={isTesting}
              >
                {isTesting ? (
                  <>
                    <Volume2 className="h-4 w-4 mr-2 animate-pulse" />
                    Listening...
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4 mr-2" />
                    Test
                  </>
                )}
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="p-4">
                <h3 className="font-medium mb-1">Trigger Phrase</h3>
                {isEditingPhrase ? (
                  <div className="space-y-2 mt-2">
                    <Input
                      value={newPhrase}
                      onChange={(e) => setNewPhrase(e.target.value)}
                      placeholder="Enter trigger phrase"
                      className="bg-white"
                    />
                    <div className="flex space-x-2">
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={handleSaveTriggerPhrase}
                        className="w-full"
                      >
                        Save
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setIsEditingPhrase(false);
                          setNewPhrase(triggerPhrase);
                        }}
                        className="w-full"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mt-2">
                    <div className="bg-secondary px-3 py-1.5 rounded-md">
                      <span className="font-medium">"{triggerPhrase}"</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsEditingPhrase(true)}
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-muted/30 rounded-lg text-sm">
              <Info className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
              <p className="text-muted-foreground">
                Voice activation works even when the phone is locked or the app is in the background.
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="bg-muted/50 p-3 rounded-full mb-4">
              <MicOff className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">Voice activation is disabled</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enable voice commands to trigger emergency alerts using your voice
            </p>
            <Button onClick={handleToggleVoiceActivation}>
              Enable Voice Activation
            </Button>
          </div>
        )}
      </CardContent>
      {enabled && (
        <CardFooter className="border-t px-6 py-4 bg-card">
          <p className="text-xs text-muted-foreground">
            Choose a trigger phrase that's unique enough to avoid false activations but easy to remember in stressful situations.
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default VoiceActivation;
