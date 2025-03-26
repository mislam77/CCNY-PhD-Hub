'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { EventCard, staggerContainer, fadeIn } from './CardComponents';
import placeholderImage from '../../../../public/images/placeholder-image.jpg';

export default function EventsSection() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="flex justify-between items-center mb-10">
            <motion.div variants={fadeIn}>
              <h2 className="text-2xl md:text-3xl font-bold">Upcoming Events</h2>
              <p className="text-gray-600">Workshops, seminars, and networking opportunities</p>
            </motion.div>
            <motion.div variants={fadeIn}>
              <Link href="/events" className="text-primary font-medium flex items-center hover:underline">
                View all events <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <EventCard 
              title="Grant Writing Workshop" 
              date="Apr 15" 
              time="2:00 PM - 4:00 PM" 
              location="Science Building, Room 310" 
              image={placeholderImage.src}
            />
            <EventCard 
              title="Research Methodology Seminar" 
              date="Apr 22" 
              time="3:30 PM - 5:30 PM" 
              location="Engineering Building, Room 205" 
              image={placeholderImage.src} 
            />
            <EventCard 
              title="PhD Student Mixer" 
              date="May 5" 
              time="6:00 PM - 8:00 PM" 
              location="Faculty Lounge" 
              image={placeholderImage.src}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}