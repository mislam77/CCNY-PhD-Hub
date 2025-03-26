'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// Animation variants
export const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Feature card component
interface AnimatedCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  link: string;
  className?: string;
}

export const AnimatedCard = ({ icon: Icon, title, description, link, className = "" }: AnimatedCardProps) => (
  <motion.div 
    variants={fadeIn}
    whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${className}`}
  >
    <div className="p-6">
      <div className="flex items-center mb-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold ml-3">{title}</h3>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link 
        href={link} 
        className="text-primary font-medium flex items-center hover:underline"
      >
        Learn more <ChevronRight className="h-4 w-4 ml-1" />
      </Link>
    </div>
  </motion.div>
);

// Forum post component
interface ForumPostCardProps {
  title: string;
  author: string;
  avatar: string;
  preview: string;
  likes: number;
  comments: number;
  date: string;
}

export const ForumPostCard = ({ title, author, avatar, preview, likes, comments, date }: ForumPostCardProps) => (
  <motion.div 
    variants={fadeIn}
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
  >
    <div className="p-5">
      <Link href="/forum/post" className="block">
        <h3 className="text-lg font-bold mb-2 hover:text-primary transition-colors">{title}</h3>
      </Link>
      <div className="flex items-center mb-3">
        <Image 
          src={avatar} 
          alt={author} 
          width={30} 
          height={30} 
          className="rounded-full mr-2"
        />
        <span className="text-sm text-gray-600">{author} • {date}</span>
      </div>
      <p className="text-gray-700 text-sm mb-3 line-clamp-2">{preview}</p>
      <div className="flex text-gray-500 text-sm">
        <span className="mr-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {likes}
        </span>
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {comments}
        </span>
      </div>
    </div>
  </motion.div>
);

// Event card component
interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
}

export const EventCard = ({ title, date, time, location, image }: EventCardProps) => (
  <motion.div 
    variants={fadeIn}
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
  >
    <div className="relative h-40">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
      />
      <div className="absolute bottom-0 left-0 bg-primary text-white px-3 py-1 rounded-tr-md">
        {date}
      </div>
    </div>
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <div className="flex items-center text-sm text-gray-600 mb-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {time}
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {location}
      </div>
    </div>
  </motion.div>
);

// Research group card
interface ResearchGroupCardProps {
  name: string;
  field: string;
  members: number;
  image: string;
}

export const ResearchGroupCard = ({ name, field, members, image }: ResearchGroupCardProps) => (
  <motion.div 
    variants={fadeIn}
    whileHover={{ y: -5 }}
    className="flex flex-col sm:flex-row bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
  >
    <div className="relative w-full sm:w-1/3 h-40 sm:h-auto">
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover"
      />
    </div>
    <div className="p-4 flex-1">
      <h3 className="text-lg font-bold mb-1">{name}</h3>
      <p className="text-primary text-sm mb-2">{field}</p>
      <p className="text-gray-600 text-sm mb-2">Active members: {members}</p>
      <Link 
        href="/research-groups" 
        className="text-primary text-sm font-medium flex items-center hover:underline"
      >
        View group <ChevronRight className="h-4 w-4 ml-1" />
      </Link>
    </div>
  </motion.div>
);

// Active user avatar
interface ActiveUserAvatarProps {
  image: string;
  name: string;
  status: 'online' | 'offline';
}

export const ActiveUserAvatar = ({ image, name, status }: ActiveUserAvatarProps) => (
  <motion.div 
    variants={fadeIn}
    whileHover={{ y: -5 }}
    className="text-center"
  >
    <div className="relative inline-block">
      <Image 
        src={image} 
        alt={name} 
        width={64} 
        height={64} 
        className="rounded-full border-2 border-white"
      />
      <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-gray-300'} border-2 border-white`}></span>
    </div>
    <p className="mt-1 text-sm font-medium">{name}</p>
  </motion.div>
);