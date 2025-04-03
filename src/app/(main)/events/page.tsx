'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addDays } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Link as LinkIcon, 
  MessageSquare, 
  Users, 
  PlusCircle,
  Info
} from 'lucide-react';

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

// Custom event component for the calendar
const EventComponent = ({ event }: { event: Event }) => (
  <div className="flex items-center h-full w-full overflow-hidden">
    <div className="w-1 h-full bg-primary mr-2"></div>
    <div className="truncate">
      <span className="font-medium">{event.title}</span>
    </div>
  </div>
);

const CreateEventForm: React.FC<{ onCreateEvent: (event: Event) => void, onCancel: () => void }> = ({ onCreateEvent, onCancel }) => {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    // Set default times for today
    const today = new Date();
    const startDate = format(today, "yyyy-MM-dd'T'HH:mm");
    const endDate = format(addDays(today, 1), "yyyy-MM-dd'T'HH:mm");
    
    setStart(startDate);
    setEnd(endDate);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newEvent: Event = {
      id: Math.random().toString(36).substring(2, 11),
      title,
      start_time: new Date(start),
      end_time: new Date(end),
      description,
      link,
    };
    
    onCreateEvent(newEvent);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Event Title</label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a title for your event"
          required
          className="w-full"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date & Time</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <CalendarIcon className="h-4 w-4" />
            </div>
            <Input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">End Date & Time</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Clock className="h-4 w-4" />
            </div>
            <Input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide details about your event"
          className="min-h-[100px]"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Virtual Meeting Link</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <LinkIcon className="h-4 w-4" />
          </div>
          <Input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Add a Zoom, Google Meet, or other virtual meeting link"
            className="pl-10"
          />
        </div>
      </div>
      
      <DialogFooter className="gap-2 mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Event'}
        </Button>
      </DialogFooter>
    </form>
  );
};

const EventsPage: React.FC = () => {
  const { isSignedIn, user } = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState(Views.MONTH);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    setIsLoading(true);
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
        
        // Set featured events (upcoming 3 events)
        const now = new Date();
        const upcoming = formattedData
          .filter(event => event.start_time > now)
          .sort((a, b) => a.start_time.getTime() - b.start_time.getTime())
          .slice(0, 3);
        setFeaturedEvents(upcoming);
      } else {
        console.error('Error fetching events:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
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
        // Make sure the dates are Date objects
        createdEvent.start_time = new Date(createdEvent.start_time);
        createdEvent.end_time = new Date(createdEvent.end_time);
        
        setEvents(prevEvents => [...prevEvents, createdEvent]);
        closeDialog();
        
        // Update featured events
        const now = new Date();
        const upcoming = [...events, createdEvent]
          .filter(event => event.start_time > now)
          .sort((a, b) => a.start_time.getTime() - b.start_time.getTime())
          .slice(0, 3);
        setFeaturedEvents(upcoming);
      } else {
        console.error('Error creating event:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsCreateMode(false);
    setIsDialogOpen(true);
  };
  
  const openCreateDialog = () => {
    setSelectedEvent(null);
    setIsCreateMode(true);
    setIsDialogOpen(true);
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
    setIsCreateMode(false);
  };
  
  const formatDateRange = (start: Date, end: Date) => {
    const sameDay = start.toDateString() === end.toDateString();
    
    if (sameDay) {
      return `${format(start, 'MMMM d, yyyy')} • ${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
    } else {
      return `${format(start, 'MMM d, h:mm a')} - ${format(end, 'MMM d, h:mm a, yyyy')}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary/90 to-purple-700/90 py-16 px-4">
        <div className="absolute inset-0 bg-black/50">
          <div 
            className="absolute inset-0 opacity-30"
            style={{ 
              backgroundImage: 'url(https://i.imgur.com/nqgZREZ.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              mixBlendMode: 'overlay'
            }}
          ></div>
        </div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Events Calendar</h1>
            <p className="text-xl text-white/90 mb-8">
              Discover academic seminars, workshops, networking events and more. Never miss an opportunity to learn and connect.
            </p>
            {user && (
              <Button 
                onClick={openCreateDialog}
                className="bg-white text-primary hover:bg-white/90 transition-colors"
                size="lg"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create New Event
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map(event => (
                <div 
                  key={event.id} 
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleSelectEvent(event)}
                >
                  <div className="h-3 bg-primary"></div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold line-clamp-1">{event.title}</h3>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <span className="text-sm">{formatDateRange(event.start_time, event.end_time)}</span>
                    </div>
                    
                    {event.description && (
                      <p className="text-gray-600 line-clamp-2 mb-4 text-sm">{event.description}</p>
                    )}
                    
                    <div className="flex justify-end">
                      <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10 text-primary">
                        View Details
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Calendar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold">Events Calendar</h2>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Tabs defaultValue={view} onValueChange={(v) => setView(v as any)} className="w-full sm:w-auto">
                <TabsList>
                  <TabsTrigger value={Views.MONTH}>Month</TabsTrigger>
                  <TabsTrigger value={Views.WEEK}>Week</TabsTrigger>
                  <TabsTrigger value={Views.DAY}>Day</TabsTrigger>
                  <TabsTrigger value={Views.AGENDA}>List</TabsTrigger>
                </TabsList>
              </Tabs>
              
              {user && (
                <Button onClick={openCreateDialog} size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Event
                </Button>
              )}
            </div>
          </div>
          
          {isLoading ? (
            <div className="h-[500px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start_time"
              endAccessor="end_time"
              style={{ height: 650 }}
              view={view as any}
              onView={(newView) => setView(newView)}
              onSelectEvent={handleSelectEvent}
              components={{
                event: EventComponent as any,
              }}
              className="mt-6"
            />
          )}
        </div>
      </div>
      
      {/* Event Details/Creation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          {isCreateMode ? (
            <>
              <DialogTitle className="text-xl font-bold">Create New Event</DialogTitle>
              <DialogDescription>
                Fill out the details to add a new event to the calendar.
              </DialogDescription>
              <CreateEventForm onCreateEvent={handleCreateEvent} onCancel={closeDialog} />
            </>
          ) : selectedEvent ? (
            <>
              <DialogTitle className="text-xl font-bold">{selectedEvent.title}</DialogTitle>
              
              <div className="space-y-4 mt-2">
                <div className="flex items-start">
                  <CalendarIcon className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-gray-600">
                      {formatDateRange(selectedEvent.start_time, selectedEvent.end_time)}
                    </p>
                  </div>
                </div>
                
                {selectedEvent.description && (
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Description</p>
                      <p className="text-gray-600 whitespace-pre-line">{selectedEvent.description}</p>
                    </div>
                  </div>
                )}
                
                {selectedEvent.link && (
                  <div className="flex items-start">
                    <LinkIcon className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Meeting Link</p>
                      <a 
                        href={selectedEvent.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:underline truncate block"
                      >
                        {selectedEvent.link}
                      </a>
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter className="mt-6">
                <Button onClick={closeDialog}>Close</Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsPage;