'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeIn } from './CardComponents';

export default function CallToAction() {
  return (
    <section className="py-20 bg-primary text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl text-primary-foreground/90 mb-10 max-w-3xl mx-auto">
            Connect with fellow PhD students, access resources, and make the most of your doctoral journey at CUNY.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-primary hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors duration-300">
              Sign Up Today
            </Link>
            <Link href="/contact" className="bg-transparent hover:bg-primary-dark text-white border-2 border-white font-bold py-3 px-8 rounded-lg transition-colors duration-300">
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}