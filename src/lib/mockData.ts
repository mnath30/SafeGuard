
export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  priority: 'primary' | 'secondary';
  relationship: string;
  notificationPreference: 'sms' | 'call' | 'both';
  verified: boolean;
}

export interface UserSettings {
  sosMessage: string;
  voiceActivationEnabled: boolean;
  voiceTriggerPhrase: string;
  panicModeGesture: 'shake' | 'volume-buttons' | 'tap-pattern';
  locationSharingEnabled: boolean;
  autoRecordEnabled: boolean;
  stealthModeEnabled: boolean;
}

export const mockContacts: TrustedContact[] = [
  {
    id: '1',
    name: 'Emma Johnson',
    phone: '+1 (555) 123-4567',
    email: 'emma.j@example.com',
    priority: 'primary',
    relationship: 'Sister',
    notificationPreference: 'both',
    verified: true,
  },
  {
    id: '2',
    name: 'Michael Chen',
    phone: '+1 (555) 987-6543',
    priority: 'primary',
    relationship: 'Friend',
    notificationPreference: 'call',
    verified: true,
  },
  {
    id: '3',
    name: 'Sarah Williams',
    phone: '+1 (555) 456-7890',
    email: 'sarah.w@example.com',
    priority: 'secondary',
    relationship: 'Roommate',
    notificationPreference: 'sms',
    verified: true,
  },
];

export const defaultUserSettings: UserSettings = {
  sosMessage: 'I need help. This is an emergency. My current location is being shared with you.',
  voiceActivationEnabled: true,
  voiceTriggerPhrase: 'help me now',
  panicModeGesture: 'shake',
  locationSharingEnabled: true,
  autoRecordEnabled: true,
  stealthModeEnabled: false,
};
