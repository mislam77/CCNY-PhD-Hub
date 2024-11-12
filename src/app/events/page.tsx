'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface Event {
  id: string;
  title: string;
  start_time: Date;
  end_time: Date;
  description: string;
  link: string;
}

const CreateEventForm: React.FC<{ onCreateEvent: (event: Event) => void }> = ({ onCreateEvent }) => {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: Event = {
      id: Math.random().toString(36).substring(2, 11),
      title,
      start_time: new Date(start),
      end_time: new Date(end),
      description,
      link,
    };
    onCreateEvent(newEvent);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block text-gray-700">Start Date and Time</label>
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block text-gray-700">End Date and Time</label>
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block text-gray-700">Zoom/Google Meet Link</label>
        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Create Event
      </Button>
    </form>
  );
};

const EventsPage: React.FC = () => {
  const { isSignedIn, user } = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const data: Event[] = await response.json();
        // Ensure dates are correctly formatted as Date objects
        const formattedData = data.map(event => ({
          ...event,
          start_time: new Date(event.start_time),
          end_time: new Date(event.end_time),
        }));
        setEvents(formattedData);
      } else {
        console.error('Error fetching events:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (newEvent: Event) => {
    if (!isSignedIn || !user) return;

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        const createdEvent: Event = await response.json();
        setEvents([...events, createdEvent]);
        setIsDialogOpen(false); // Close the dialog after creating the event
      } else {
        console.error('Error creating event:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto">
      <div className="relative h-64 bg-cover bg-center mb-8" style={{ backgroundImage: 'url(https://i.imgur.com/nqgZREZ.jpeg)' }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
          <h1 className="text-4xl font-bold">Events Calendar</h1>
          <p className="text-lg mt-2">Stay updated with upcoming events and meetings.</p>
        </div>
      </div>
      <div className="flex justify-center space-x-4 mb-8">
        <Button className="bg-green-500 text-white px-4 py-2 rounded">Create Community</Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 text-white px-4 py-2 rounded">Create Event</Button>
          </DialogTrigger>
          <DialogContent>
            {selectedEvent ? (
              <>
                <DialogTitle>{selectedEvent.title}</DialogTitle>
                <DialogDescription>
                  <p><strong>Description:</strong> {selectedEvent.description}</p>
                  <p><strong>Start:</strong> {selectedEvent.start_time.toLocaleString()}</p>
                  <p><strong>End:</strong> {selectedEvent.end_time.toLocaleString()}</p>
                  <p><strong>Link:</strong> <a href={selectedEvent.link} target="_blank" rel="noopener noreferrer">{selectedEvent.link}</a></p>
                </DialogDescription>
                <DialogClose asChild>
                  <Button className="mt-4">Close</Button>
                </DialogClose>
              </>
            ) : (
              <>
                <DialogTitle>Create a New Event</DialogTitle>
                <DialogDescription>Schedule your events and meetings with the community.</DialogDescription>
                <CreateEventForm onCreateEvent={handleCreateEvent} />
                <DialogClose asChild>
                  <Button className="mt-4">Close</Button>
                </DialogClose>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start_time"
        endAccessor="end_time"
        style={{ height: 500 }}
        onSelectEvent={handleSelectEvent}
      />
    </div>
  );
};

export default EventsPage;