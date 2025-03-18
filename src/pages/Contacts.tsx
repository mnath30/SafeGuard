
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ContactsManager from '@/components/ContactsManager';
import { TrustedContact, mockContacts } from '@/lib/mockData';
import { v4 as uuidv4 } from '@/lib/utils';

const Contacts = () => {
  const [contacts, setContacts] = useState<TrustedContact[]>(mockContacts);

  // Load contacts from localStorage on initial load
  useEffect(() => {
    const storedContacts = localStorage.getItem('safeGuardContacts');
    
    if (storedContacts) {
      setContacts(JSON.parse(storedContacts));
    }
  }, []);

  // Save contacts to localStorage when they change
  useEffect(() => {
    localStorage.setItem('safeGuardContacts', JSON.stringify(contacts));
  }, [contacts]);

  const handleAddContact = (contact: Omit<TrustedContact, 'id'>) => {
    const newContact: TrustedContact = {
      ...contact,
      id: uuidv4(),
    };
    
    setContacts(prev => [...prev, newContact]);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
  };

  const handleVerifyContact = (id: string) => {
    setContacts(prev => 
      prev.map(contact => 
        contact.id === id ? { ...contact, verified: true } : contact
      )
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6 px-4 sm:px-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Trusted Contacts</h1>
          <p className="text-muted-foreground mt-2">
            Manage the people who will be notified during emergencies
          </p>
        </div>
        
        <ContactsManager
          contacts={contacts}
          onAddContact={handleAddContact}
          onDeleteContact={handleDeleteContact}
          onVerifyContact={handleVerifyContact}
        />
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

export default Contacts;
