'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Calendar, BookOpen, Users } from 'lucide-react';
import { AnimatedCard, staggerContainer, fadeIn } from './CardComponents';

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-3">Explore the CCNY PhD Community</motion.h2>
          <motion.p variants={fadeIn} className="text-gray-600 max-w-2xl mx-auto">
            Discover resources, connect with peers, and enhance your doctoral journey through our collaborative platform.
          </motion.p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatedCard 
            icon={MessageSquare} 
            title="Active Forums" 
            description="Engage in discussions, ask questions, and share insights with fellow PhD students."
            link="/forum"
          />
          <AnimatedCard 
            icon={Calendar} 
            title="Upcoming Events" 
            description="Stay updated on workshops, seminars, and networking opportunities."
            link="/events"
          />
          <AnimatedCard 
            icon={BookOpen} 
            title="Research Groups" 
            description="Find and join collaborative research initiatives across disciplines."
            link="/research"
          />
          <AnimatedCard 
            icon={Users}
            title="Resources" 
            description="Access guides, tools, and mentorship opportunities to support your academic journey."
            link="/resources"
          />
        </motion.div>
      </div>
    </section>
  );
}