'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { fadeIn } from './CardComponents';

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-3">What Our Community Says</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from PhD students who have found value in our platform
          </p>
        </motion.div>

        <div className="bg-white rounded-xl shadow-lg p-8 relative">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-6 md:mb-0 md:mr-8">
              <div className="relative w-28 h-28 md:w-40 md:h-40 mx-auto">
                <Image 
                  src="https://randomuser.me/api/portraits/women/76.jpg" 
                  alt="Testimonial" 
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1">
              <svg className="h-12 w-12 text-primary/20 mb-4" fill="currentColor" viewBox="0 0 32 32">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <p className="text-lg text-gray-600 mb-6">
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
              </p>
              <div>
                <h4 className="text-xl font-bold">User 1</h4>
                <p className="text-primary">Computer Science, Class of 20XX</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}