'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ForumPostCard, staggerContainer, fadeIn } from './CardComponents';

// Sample forum posts data
const forumPosts = [
  {
    title: "Strategies for Balancing Teaching and Research Work",
    author: "User 1",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    preview: "I'm finding it challenging to manage my teaching responsibilities while maintaining research productivity. What strategies have worked for you?",
    likes: 24,
    comments: 18,
    date: "2 days ago"
  },
  {
    title: "Call for Collaborators: AI in Education Research",
    author: "User 2",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    preview: "Looking for PhD candidates interested in exploring applications of artificial intelligence in educational settings for an upcoming grant proposal.",
    likes: 42,
    comments: 31,
    date: "1 week ago"
  },
  {
    title: "Upcoming NSF Grant Deadlines and Tips",
    author: "User 3",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    preview: "A comprehensive list of approaching NSF grant deadlines relevant to our departments, along with application strategies that have proven successful.",
    likes: 87,
    comments: 42,
    date: "3 days ago"
  }
];

export default function ForumPostsSection() {
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
              <h2 className="text-2xl md:text-3xl font-bold">Popular Forum Discussions</h2>
              <p className="text-gray-600">Join the conversation with fellow PhD students</p>
            </motion.div>
            <motion.div variants={fadeIn}>
              <Link href="/forum" className="text-primary font-medium flex items-center hover:underline">
                View all discussions <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {forumPosts.map((post, index) => (
              <ForumPostCard key={index} {...post} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}