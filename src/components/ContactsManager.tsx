
import React, { useState } from 'react';
import { User, UserCheck, UserX, Phone, Mail, Heart, Trash2, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { TrustedContact } from '@/lib/mockData';
import { toast } from 'sonner';

interface ContactsManagerProps {
  contacts: TrustedContact[];
  onAddContact: (contact: Omit<TrustedContact, 'id'>) => void;
  onDeleteContact: (id: string) => void;
  onVerifyContact: (id: string) => void;
}

const ContactsManager: React.FC<ContactsManagerProps> = ({
  contacts,
  onAddContact,
  onDeleteContact,
  onVerifyContact
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState<Partial<TrustedContact>>({
    name: '',
    phone: '',
    email: '',
    priority: 'secondary',
    relationship: '',
    notificationPreference: 'both',
    verified: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewContact((prev) => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast.error('Name and phone number are required');
      return;
    }

    onAddContact(newContact as Omit<TrustedContact, 'id'>);
    toast.success(`${newContact.name} added to contacts`);
    
    // Reset form
    setNewContact({
      name: '',
      phone: '',
      email: '',
      priority: 'secondary',
      relationship: '',
      notificationPreference: 'both',
      verified: false
    });
    
    setIsDialogOpen(false);
  };

  const handleDeleteContact = (id: string, name: string) => {
    onDeleteContact(id);
    toast.success(`${name} removed from contacts`);
  };

  const handleVerifyContact = (id: string, name: string) => {
    onVerifyContact(id);
    toast.success(`${name} verified successfully`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Trusted Contacts</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Contact</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Trusted Contact</DialogTitle>
              <DialogDescription>
                Add someone you trust to be notified in case of emergency.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newContact.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={newContact.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newContact.email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="relationship">Relationship</Label>
                <Input
                  id="relationship"
                  name="relationship"
                  value={newContact.relationship}
                  onChange={handleInputChange}
                  placeholder="Family, Friend, etc."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority Level</Label>
                <Select 
                  value={newContact.priority as string} 
                  onValueChange={(value) => handleSelectChange('priority', value)}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary (First to be contacted)</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notificationPreference">Notification Preference</Label>
                <Select 
                  value={newContact.notificationPreference as string} 
                  onValueChange={(value) => handleSelectChange('notificationPreference', value)}
                >
                  <SelectTrigger id="notificationPreference">
                    <SelectValue placeholder="Select notification type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sms">SMS Only</SelectItem>
                    <SelectItem value="call">Call Only</SelectItem>
                    <SelectItem value="both">Both SMS and Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddContact}>
                Add Contact
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center p-8 border rounded-lg border-dashed">
          <User className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No contacts yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add trusted contacts who will be notified in case of emergency.
          </p>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Contact
            </Button>
          </DialogTrigger>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {contacts.map((contact) => (
            <Card key={contact.id} className="overflow-hidden transition-all duration-300 animate-scale-up">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">{contact.name}</CardTitle>
                  {contact.verified ? (
                    <div className="flex items-center text-safety-safe">
                      <UserCheck className="h-4 w-4 mr-1" />
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-safety-alert">
                      <UserX className="h-4 w-4 mr-1" />
                      <span className="text-xs font-medium">Unverified</span>
                    </div>
                  )}
                </div>
                <CardDescription>
                  {contact.relationship} · {contact.priority === 'primary' ? 'Primary' : 'Secondary'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{contact.phone}</span>
                  </div>
                  {contact.email && (
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{contact.email}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    <Heart className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {contact.notificationPreference === 'both'
                        ? 'SMS and Call'
                        : contact.notificationPreference === 'sms'
                        ? 'SMS Only'
                        : 'Call Only'}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between">
                {!contact.verified ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleVerifyContact(contact.id, contact.name)}
                    className="w-full mr-2"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Verify Contact
                  </Button>
                ) : (
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="w-full mr-2"
                    disabled
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Verified
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDeleteContact(contact.id, contact.name)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactsManager;
