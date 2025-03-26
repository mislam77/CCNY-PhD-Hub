'use client';

import HeroSection from './components/landing/HeroSection';
import FeaturesSection from './components/landing/FeaturesSection';
import ForumPostsSection from './components/landing/ForumPostsSection';
import EventsSection from './components/landing/EventsSection';
import ResearchGroupsSection from './components/landing/ResearchGroupsSection';
import ActiveUsersSection from './components/landing/ActiveUsersSection';
import CallToAction from './components/landing/CallToAction';
import TestimonialsSection from './components/landing/TestimonialsSection';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <ForumPostsSection />
      <EventsSection />
      <ResearchGroupsSection />
      <ActiveUsersSection />
      <CallToAction />
      <TestimonialsSection />
    </div>
  );
}