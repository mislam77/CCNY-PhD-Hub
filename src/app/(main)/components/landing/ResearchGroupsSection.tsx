'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ResearchGroupCard, staggerContainer, fadeIn } from './CardComponents';
import placeholderImage from '../../../../public/images/placeholder-image.jpg';

export default function ResearchGroupsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="flex justify-between items-center mb-10">
            <motion.div variants={fadeIn}>
              <h2 className="text-2xl md:text-3xl font-bold">Active Research Groups</h2>
              <p className="text-gray-600">Find collaborative opportunities in your field</p>
            </motion.div>
            <motion.div variants={fadeIn}>
              <Link href="/research-groups" className="text-primary font-medium flex items-center hover:underline">
                Explore all groups <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          <motion.div 
            variants={staggerContainer}
            className="space-y-6"
          >
            <ResearchGroupCard 
              name="Sustainable Urban Technologies" 
              field="Environmental Engineering & Urban Planning" 
              members={12} 
              image={placeholderImage.src} 
            />
            <ResearchGroupCard 
              name="Quantum Computing Innovation Lab" 
              field="Computer Science & Physics" 
              members={8} 
              image={placeholderImage.src}
            />
            <ResearchGroupCard 
              name="Cognitive Neuroscience Collaborative" 
              field="Psychology & Neuroscience" 
              members={15} 
              image={placeholderImage.src}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}