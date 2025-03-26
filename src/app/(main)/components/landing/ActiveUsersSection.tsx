'use client';

import { motion } from 'framer-motion';
import { ActiveUserAvatar, staggerContainer, fadeIn } from './CardComponents';

export default function ActiveUsersSection() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="text-center mb-10">
            <motion.h2 variants={fadeIn} className="text-2xl md:text-3xl font-bold mb-2">Community Members Online</motion.h2>
            <motion.p variants={fadeIn} className="text-gray-600">Connect with fellow PhD students across departments</motion.p>
          </div>

          <motion.div 
            variants={staggerContainer}
            className="flex flex-wrap justify-center gap-6"
          >
            <ActiveUserAvatar 
              image="https://randomuser.me/api/portraits/women/65.jpg" 
              name="User 1" 
              status="online" 
            />
            <ActiveUserAvatar 
              image="https://randomuser.me/api/portraits/men/54.jpg" 
              name="User 2" 
              status="online" 
            />
            <ActiveUserAvatar 
              image="https://randomuser.me/api/portraits/women/22.jpg" 
              name="User 3" 
              status="online" 
            />
            <ActiveUserAvatar 
              image="https://randomuser.me/api/portraits/men/42.jpg" 
              name="User 4" 
              status="online" 
            />
            <ActiveUserAvatar 
              image="https://randomuser.me/api/portraits/women/89.jpg" 
              name="User 5" 
              status="online" 
            />
            <ActiveUserAvatar 
              image="https://randomuser.me/api/portraits/men/76.jpg" 
              name="User 6" 
              status="online" 
            />
            <ActiveUserAvatar 
              image="https://randomuser.me/api/portraits/women/33.jpg" 
              name="User 7" 
              status="offline" 
            />
            <ActiveUserAvatar 
              image="https://randomuser.me/api/portraits/men/29.jpg" 
              name="User 8" 
              status="offline" 
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}