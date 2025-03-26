'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Hero image slideshow data
const heroImages = [
  {
    src: "https://i.imgur.com/nqgZREZ.jpeg",
    alt: "CCNY Campus",
  },
  {
    src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070",
    alt: "Research Lab",
  },
  {
    src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070",
    alt: "PhD Students Collaborating",
  },
];

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image 
            src={heroImages[currentImageIndex].src} 
            alt={heroImages[currentImageIndex].alt} 
            fill
            quality={90}
            priority
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 flex flex-col items-center justify-center text-center px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl text-white font-bold mb-4 leading-tight">
            Connect. Collaborate. <br className="hidden md:block" />
            <span className="text-primary-light">Thrive Together.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-8">
            Join the CCNY PhD Hub — where doctoral students connect, share resources, and build a thriving academic community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 flex items-center justify-center">
              Join the Community <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/about" className="bg-white hover:bg-gray-100 text-primary font-bold py-3 px-8 rounded-lg transition-colors duration-300">
              Learn More
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Image navigation dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2 z-20">
        {heroImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentImageIndex(idx)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              currentImageIndex === idx ? 'bg-white w-6' : 'bg-white/50'
            }`}
            aria-label={`View slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}