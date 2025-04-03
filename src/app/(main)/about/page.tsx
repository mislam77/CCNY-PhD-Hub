'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Check } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://i.imgur.com/nqgZREZ.jpeg" 
            alt="CCNY Campus" 
            fill 
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/90"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-primary to-purple-400"
          >
            Our Mission & Vision
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90"
          >
            Building a thriving community for doctoral students at CUNY
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left Column - Mission & Story */}
          <div className="space-y-12">
            {/* Mission */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-block">
                <h2 className="text-3xl font-bold mb-2">Our Mission</h2>
                <div className="h-1 w-1/2 bg-gradient-to-r from-primary to-purple-500 rounded-full"></div>
              </div>
              <p className="text-lg text-white/80 leading-relaxed">
                HIPE PhD Hub is a comprehensive digital ecosystem created to support PhD students at the City College of New York, addressing challenges like academic isolation and fragmented resource access. We are committed to empowering doctoral students through connection, collaboration, and community building.
              </p>
              <p className="text-lg text-white/80 leading-relaxed">
                We believe that by breaking down departmental silos and facilitating interdisciplinary collaboration, we can enhance the PhD experience and ultimately improve research outcomes and student wellbeing throughout the doctoral journey.
              </p>
            </motion.div>

            {/* Our Story */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="inline-block">
                <h2 className="text-3xl font-bold mb-2">Our Story</h2>
                <div className="h-1 w-1/2 bg-gradient-to-r from-primary to-purple-500 rounded-full"></div>
              </div>
              <p className="text-lg text-white/80 leading-relaxed">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae porro culpa facilis autem, libero ut harum ducimus obcaecati. Qui nemo incidunt quibusdam, nisi perferendis quas neque iusto sit ullam dignissimos?.
              </p>
              <p className="text-lg text-white/80 leading-relaxed">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi cupiditate non iure qui eligendi, fugiat accusamus soluta, ex nemo delectus dignissimos ad in consequuntur eos eius aperiam dolor vitae tenetur!.
              </p>
            </motion.div>
          </div>
          
          {/* Right Column - Values & What We Do */}
          <div className="space-y-12">
            {/* Core Values */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-block">
                <h2 className="text-3xl font-bold mb-2">Our Core Values</h2>
                <div className="h-1 w-1/2 bg-gradient-to-r from-primary to-purple-500 rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/5 p-5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="flex items-center mb-3">
                    <div className="bg-primary/20 p-2 rounded-full mr-3">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Community</h3>
                  </div>
                  <p className="text-white/70">We foster meaningful connections among doctoral students across all disciplines and backgrounds.</p>
                </div>
                
                <div className="bg-white/5 p-5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="flex items-center mb-3">
                    <div className="bg-primary/20 p-2 rounded-full mr-3">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Collaboration</h3>
                  </div>
                  <p className="text-white/70">We believe in the power of interdisciplinary research and knowledge sharing to drive innovation.</p>
                </div>
                
                <div className="bg-white/5 p-5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="flex items-center mb-3">
                    <div className="bg-primary/20 p-2 rounded-full mr-3">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Accessibility</h3>
                  </div>
                  <p className="text-white/70">We strive to make resources, opportunities, and support equally available to all doctoral students.</p>
                </div>
                
                <div className="bg-white/5 p-5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="flex items-center mb-3">
                    <div className="bg-primary/20 p-2 rounded-full mr-3">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Well-being</h3>
                  </div>
                  <p className="text-white/70">We prioritize mental health and personal growth alongside academic excellence.</p>
                </div>
              </div>
            </motion.div>
            
            {/* What We Do */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="inline-block">
                <h2 className="text-3xl font-bold mb-2">What We Do</h2>
                <div className="h-1 w-1/2 bg-gradient-to-r from-primary to-purple-500 rounded-full"></div>
              </div>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-primary/20 p-1 rounded-full mr-3 mt-1.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-white/80 flex-1">Provide a centralized platform where doctoral candidates can form research groups and collaborate across disciplines</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/20 p-1 rounded-full mr-3 mt-1.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-white/80 flex-1">Facilitate discussions and knowledge sharing through forums and interactive events</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/20 p-1 rounded-full mr-3 mt-1.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-white/80 flex-1">Connect students with resources, funding opportunities, and professional development workshops</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/20 p-1 rounded-full mr-3 mt-1.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-white/80 flex-1">Build a supportive community that addresses the unique challenges of doctoral studies</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/20 p-1 rounded-full mr-3 mt-1.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-white/80 flex-1">Promote diversity, equity, and inclusion within the research community</p>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-2">What Our Community Says</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-primary to-purple-500 rounded-full mx-auto"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10"
            >
              <div className="mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                  <path d="M9.52 4H4.97C4.26 4 3.64 4.52 3.51 5.22L3 8H8.5C9.05 8 9.5 8.45 9.5 9V13.5C9.5 14.05 9.05 14.5 8.5 14.5H5.5C4.95 14.5 4.5 14.05 4.5 13.5V11.84C4.5 11.65 4.32 11.5 4.13 11.55L3.34 11.75C3.14 11.8 3 11.99 3 12.2V16.8C3 17.75 3.34 18.59 3.88 19.22C4.48 19.93 5.33 20.25 6.17 20.25H6.18C7.04 20.25 7.86 19.94 8.46 19.33C9.5 18.27 10.36 16.67 10.36 15.17V6.34C10.36 5.04 9.52 4 8.21 4" fill="currentColor"/>
                  <path d="M21.0016 11.84V13.5C21.0016 14.05 20.5516 14.5 20.0016 14.5H17.0016C16.4516 14.5 16.0016 14.05 16.0016 13.5V9C16.0016 8.45 16.4516 8 17.0016 8H21.0016C20.4916 5.22 19.8716 4.52 19.1616 4H15.9716C14.6716 4 13.8916 5.05 13.8916 6.34V15.17C13.8916 16.67 14.7516 18.27 15.7916 19.33C16.3916 19.94 17.2116 20.25 18.0716 20.25H18.0816C18.9216 20.25 19.7716 19.93 20.3716 19.22C20.9116 18.59 21.2516 17.75 21.2516 16.8V12.2C21.2516 11.99 21.1116 11.8 20.9116 11.75L20.1216 11.55C19.9316 11.5 19.7516 11.65 19.7516 11.84" fill="currentColor"/>
                </svg>
              </div>
              <p className="text-white/80 mb-6 italic">
                "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam sequi nemo tenetur incidunt illo nam molestiae pariatur accusantium consequatur repudiandae sunt fugit fuga cumque exercitationem, repellendus possimus, corrupti facilis minus!."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center text-sm font-medium">JS</div>
                <div className="ml-3">
                  <p className="font-semibold">User 1</p>
                  <p className="text-sm text-white/60">Physics Department</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10"
            >
              <div className="mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                  <path d="M9.52 4H4.97C4.26 4 3.64 4.52 3.51 5.22L3 8H8.5C9.05 8 9.5 8.45 9.5 9V13.5C9.5 14.05 9.05 14.5 8.5 14.5H5.5C4.95 14.5 4.5 14.05 4.5 13.5V11.84C4.5 11.65 4.32 11.5 4.13 11.55L3.34 11.75C3.14 11.8 3 11.99 3 12.2V16.8C3 17.75 3.34 18.59 3.88 19.22C4.48 19.93 5.33 20.25 6.17 20.25H6.18C7.04 20.25 7.86 19.94 8.46 19.33C9.5 18.27 10.36 16.67 10.36 15.17V6.34C10.36 5.04 9.52 4 8.21 4" fill="currentColor"/>
                  <path d="M21.0016 11.84V13.5C21.0016 14.05 20.5516 14.5 20.0016 14.5H17.0016C16.4516 14.5 16.0016 14.05 16.0016 13.5V9C16.0016 8.45 16.4516 8 17.0016 8H21.0016C20.4916 5.22 19.8716 4.52 19.1616 4H15.9716C14.6716 4 13.8916 5.05 13.8916 6.34V15.17C13.8916 16.67 14.7516 18.27 15.7916 19.33C16.3916 19.94 17.2116 20.25 18.0716 20.25H18.0816C18.9216 20.25 19.7716 19.93 20.3716 19.22C20.9116 18.59 21.2516 17.75 21.2516 16.8V12.2C21.2516 11.99 21.1116 11.8 20.9116 11.75L20.1216 11.55C19.9316 11.5 19.7516 11.65 19.7516 11.84" fill="currentColor"/>
                </svg>
              </div>
              <p className="text-white/80 mb-6 italic">
                "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum iure ad maxime nostrum itaque aliquam minus facere dolorum ut voluptatem, cumque odit modi porro reiciendis numquam blanditiis, sint est temporibus.."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center text-sm font-medium">ML</div>
                <div className="ml-3">
                  <p className="font-semibold">User 2</p>
                  <p className="text-sm text-white/60">Engineering Department</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10"
            >
              <div className="mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                  <path d="M9.52 4H4.97C4.26 4 3.64 4.52 3.51 5.22L3 8H8.5C9.05 8 9.5 8.45 9.5 9V13.5C9.5 14.05 9.05 14.5 8.5 14.5H5.5C4.95 14.5 4.5 14.05 4.5 13.5V11.84C4.5 11.65 4.32 11.5 4.13 11.55L3.34 11.75C3.14 11.8 3 11.99 3 12.2V16.8C3 17.75 3.34 18.59 3.88 19.22C4.48 19.93 5.33 20.25 6.17 20.25H6.18C7.04 20.25 7.86 19.94 8.46 19.33C9.5 18.27 10.36 16.67 10.36 15.17V6.34C10.36 5.04 9.52 4 8.21 4" fill="currentColor"/>
                  <path d="M21.0016 11.84V13.5C21.0016 14.05 20.5516 14.5 20.0016 14.5H17.0016C16.4516 14.5 16.0016 14.05 16.0016 13.5V9C16.0016 8.45 16.4516 8 17.0016 8H21.0016C20.4916 5.22 19.8716 4.52 19.1616 4H15.9716C14.6716 4 13.8916 5.05 13.8916 6.34V15.17C13.8916 16.67 14.7516 18.27 15.7916 19.33C16.3916 19.94 17.2116 20.25 18.0716 20.25H18.0816C18.9216 20.25 19.7716 19.93 20.3716 19.22C20.9116 18.59 21.2516 17.75 21.2516 16.8V12.2C21.2516 11.99 21.1116 11.8 20.9116 11.75L20.1216 11.55C19.9316 11.5 19.7516 11.65 19.7516 11.84" fill="currentColor"/>
                </svg>
              </div>
              <p className="text-white/80 mb-6 italic">
                "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Hic totam, officiis in vitae est eveniet iste accusantium suscipit consequuntur voluptates dolores illo enim mollitia blanditiis quae, quo corporis fugit id!."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center text-sm font-medium">DW</div>
                <div className="ml-3">
                  <p className="font-semibold">User 3</p>
                  <p className="text-sm text-white/60">Humanities Department</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Culture */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-2">Our Culture</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-primary to-purple-500 rounded-full mx-auto mb-6"></div>
            <p className="text-lg text-white/80">
              We foster an environment of mutual respect, intellectual curiosity, and collaborative growth. Our community celebrates diversity and encourages open dialogue, creative thinking, and supportive relationships.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center"
            >
              <h3 className="text-2xl font-bold mb-4">Supporting Your Journey</h3>
              <p className="text-white/80 mb-6">
                We understand that the PhD journey has unique challenges, from research roadblocks to work-life balance struggles. Our culture prioritizes holistic support through:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-primary/20 p-1 rounded-full mr-3 mt-1">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-white/80">Peer mentorship programs that connect new students with experienced doctoral candidates</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/20 p-1 rounded-full mr-3 mt-1">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-white/80">Mental health and wellness resources tailored to academic pressures</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/20 p-1 rounded-full mr-3 mt-1">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-white/80">Work-life balance workshops and community events that foster connections beyond academic interests</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/20 p-1 rounded-full mr-3 mt-1">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-white/80">Recognition of diverse perspectives and experiences as valuable contributions to our collective knowledge</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-xl overflow-hidden h-[400px] relative"
            >
              <Image 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070" 
                alt="PhD Students Collaborating" 
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold mb-2">Join Our Community</h3>
                <p className="text-white/90 mb-4">Connect with fellow doctoral students who understand your journey.</p>
                <a 
                  href="/signup" 
                  className="inline-block bg-primary hover:bg-primary/90 text-white font-medium px-6 py-2 rounded-lg transition-colors"
                >
                  Get Started
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary/20 to-purple-900/20 border-t border-b border-white/10">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6">Join Us in Building a Thriving PhD Community</h2>
            <p className="text-lg text-white/80 mb-8">
              Together, we can transform the doctoral experience at CUNY into one that is collaborative, supportive, and enriching for every student.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/signup" 
                className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Sign Up Today
              </a>
              <a 
                href="/contact" 
                className="bg-transparent hover:bg-white/10 text-white border border-white/30 font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;